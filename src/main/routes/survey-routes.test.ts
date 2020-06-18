import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'
import { sign } from 'jsonwebtoken'
import env from '../config/env'
let surveyCollection: Collection
let accountCollection: Collection
const makeAccessToken = async (role: string): Promise<string> => {
  const res = await accountCollection.insertOne({
    name: 'luis carlos',
    email: 'email@gmail.com',
    password: '123',
    role: role
  })
  const id = res.ops[0]._id
  const accessToken = sign({ id }, env.jwtSecret)
  await accountCollection.updateOne({ _id: id }, { $set: { accessToken } })
  return accessToken
}
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
      const accessToken = await makeAccessToken('admin')
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
      const accessToken = await makeAccessToken('')
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
  describe('GET /surveys', () => {
    test('Should return 403 on load survey without access token', async () => {
      await request(app)
        .get('/surveys')
        .expect(403)
    })
    test('Should return 200 on load surveys with valid access token', async () => {
      const accessToken = await makeAccessToken('admin')
      await surveyCollection.insertMany([
        {
          question: 'any_question',
          answers: [{ image: 'any_image', answer: 'any_answer' }],
          date: new Date()
        }
      ])
      await request(app)
        .get('/surveys')
        .set('x-access-token', accessToken)
        .expect(200)
    })
  })
})
