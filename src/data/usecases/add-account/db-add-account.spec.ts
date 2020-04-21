import { DbAddAccount } from './db-add-account'
import { Encrypter } from '../../protocols/encrypter'
interface SutTypes {
  sut: DbAddAccount
  ecrypterStub: Encrypter
}
const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return await new Promise(resolve => resolve('hashed_password'))
    }
  }
  return new EncrypterStub()
}
const makeSut = (): any => {
  const encrypterStub = makeEncrypter()
  const sut = new DbAddAccount(encrypterStub)
  return {
    sut,
    encrypterStub
  }
}
describe('DBAddAccount UseCase', () => {
  test('Should call Ecrypter with correct password', async () => {
    const { sut, encrypterStub } = makeSut()
    const encrypterSpy = jest.spyOn(encrypterStub, 'encrypt')
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    }
    await sut.add(accountData)
    expect(encrypterSpy).toHaveBeenCalledWith('valid_password')
  })
})
