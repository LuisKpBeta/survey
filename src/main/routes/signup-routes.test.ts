import request from 'supertest'
import app from '../config/app'
describe('SignUp Routes', () => {
  test('Should return an account on success', async () => {
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
