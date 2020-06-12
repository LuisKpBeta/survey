import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'
import { sign } from 'jsonwebtoken'
import env from '../config/env'
let surveyCollection: Collection
let accountCollection: Collection
describe('Login Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })
  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  describe('POST /surveys', () => {
    test('Should return 403 on add survey success without access token', async () => {
      await request(app)
        .post('/surveys')
        .send({
          question: 'any_question',
          answers: [
            { image: 'http://image-name.com', answer: 'any_answer' },
            { answer: 'other_answer' }
          ]
        })
        .expect(403)
    })
    test('Should return 204 on add survey success with valid access token', async () => {
      const res = await accountCollection.insertOne({
        name: 'luis carlos',
        email: 'email@gmail.com',
        password: '123',
        role: 'admin'
      })
      const id = res.ops[0]._id
      const accessToken = sign({ id }, env.jwtSecret)
      await accountCollection.updateOne({ _id: id }, { $set: { accessToken } })
      await request(app)
        .post('/surveys')
        .set('x-access-token', accessToken)
        .send({
          question: 'any_question',
          answers: [
            { image: 'http://image-name.com', answer: 'any_answer' },
            { answer: 'other_answer' }
          ]
        })
        .expect(204)
    })
    test('Should return 403 on add survey success with invalid role', async () => {
      const res = await accountCollection.insertOne({
        name: 'luis carlos',
        email: 'email@gmail.com',
        password: '123'
      })
      const id = res.ops[0]._id
      const accessToken = sign({ id }, env.jwtSecret)
      await accountCollection.updateOne({ _id: id }, { $set: { accessToken } })
      await request(app)
        .post('/surveys')
        .set('x-access-token', accessToken)
        .send({
          question: 'any_question',
          answers: [
            { image: 'http://image-name.com', answer: 'any_answer' },
            { answer: 'other_answer' }
          ]
        })
        .expect(403)
    })
  })
})
