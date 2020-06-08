import { Decrypter } from '../../protocols/criptography/decrypter'
import { DBLoadAccountByToken } from './db-load-account-by-token'
interface SutTypes {
  sut: DBLoadAccountByToken
  decrypterStub: Decrypter
}
const makeDecrypterStub = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    async decrypt (value: string): Promise<string> {
      return await new Promise(resolve => resolve('any_value'))
    }
  }
  return new DecrypterStub()
}
const makeSut = (): SutTypes => {
  const decrypterStub = makeDecrypterStub()
  const sut = new DBLoadAccountByToken(decrypterStub)
  return {
    sut,
    decrypterStub
  }
}
describe('DBLoadAccountByToken UseCase', () => {
  test('Should call Decrypter with correct value', async () => {
    const { sut, decrypterStub } = makeSut()
    const decryptSpy = jest.spyOn(decrypterStub, 'decrypt')
    await sut.load('any_token')
    expect(decryptSpy).toHaveBeenCalledWith('any_token')
  })
})
