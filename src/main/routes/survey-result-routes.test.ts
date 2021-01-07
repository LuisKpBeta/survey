import app from '@/main/config/app'
import env from '@/main/config/env'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import request from 'supertest'
import { Collection } from 'mongodb'
import { sign } from 'jsonwebtoken'

let surveyCollection: Collection
let accountCollection: Collection
const makeAccessToken = async (): Promise<string> => {
  const res = await accountCollection.insertOne({
    name: 'luis carlos',
    email: 'email@gmail.com',
    password: '123'
  })
  const id = res.ops[0]._id
  const accessToken = sign({ id }, env.jwtSecret)
  await accountCollection.updateOne({ _id: id }, { $set: { accessToken } })
  return accessToken
}
describe('Survey Routes', () => {
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
  describe('PUT /surveys/:surveyId/resuls', () => {
    test('Should return 403 on save survey result without access token', async () => {
      await request(app)
        .put('/surveys/any_id/results')
        .send({ answer: 'any_id' })
        .expect(403)
    })
    test('Should return 200 on save survey result success with valid access token', async () => {
      const accessToken = await makeAccessToken()
      const { ops } = await surveyCollection.insertOne({
        question: 'any_question',
        answers: [{ image: 'any_image', answer: 'any_answer' }],
        date: new Date()
      })
      const id: string = ops[0]._id
      await request(app)
        .put(`/surveys/${id}/results`)
        .set('x-access-token', accessToken)
        .send({ answer: 'any_answer' })
        .expect(200)
    })
  })
})
