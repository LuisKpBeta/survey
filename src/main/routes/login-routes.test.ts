import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import bcrypt from 'bcrypt'
let accountCollection
describe('Login Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })
  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  describe('POST /signup', () => {
    test('Should return 200 on signup', async () => {
      await request(app)
        .post('/signup')
        .send({
          name: 'Luis Carlos',
          email: 'lu.ca.oliveira41@gmail.com',
          password: '123',
          passwordConfirmation: '123'
        })
        .expect(200)
    })
  })
  describe('POST /login', () => {
    test('Should return 200 on login', async () => {
      const password = await bcrypt.hash('123', 12)
      await accountCollection.insertOne({
        name: 'Luis Carlos',
        email: 'lu.ca.oliveira41@gmail.com',
        password
      })
      await request(app)
        .post('/login')
        .send({
          email: 'lu.ca.oliveira41@gmail.com',
          password: '123'
        })
        .expect(200)
    })
    test('Should return 200 on login', async () => {
      await request(app)
        .post('/login')
        .send({
          email: 'lu.ca.oliveira41@gmail.com',
          password: '123'
        })
        .expect(401)
    })
  })
})
