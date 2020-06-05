import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'
let surveyCollection: Collection
describe('Login Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })
  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('accounts')
    await surveyCollection.deleteMany({})
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  describe('POST /surveys', () => {
    test('Should return 200 on signup', async () => {
      await request(app)
        .post('/surveys')
        .send({
          question: 'any_question',
          answers: [
            { image: 'http://image-name.com', answer: 'any_answer' },
            { answer: 'other_answer' }
          ]
        })
        .expect(204)
    })
  })
})
