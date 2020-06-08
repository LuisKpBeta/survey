import { Decrypter } from '../../protocols/criptography/decrypter'
import { DBLoadAccountByToken } from './db-load-account-by-token'
describe('DBLoadAccountByToken UseCase', () => {
  test('Should call Decrypter with correct value', async () => {
    class DecrypterStub implements Decrypter {
      async decrypt (value: string): Promise<string> {
        return await new Promise(resolve => resolve('any_value'))
      }
    }
    const decrypterStub = new DecrypterStub()
    const decryptSpy = jest.spyOn(decrypterStub, 'decrypt')
    const sut = new DBLoadAccountByToken(decrypterStub)
    await sut.load('any_token')
    expect(decryptSpy).toHaveBeenCalledWith('any_token')
  })
})
