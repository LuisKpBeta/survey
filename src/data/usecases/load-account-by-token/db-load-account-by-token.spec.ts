import { Decrypter } from '../../protocols/criptography/decrypter'
import { DBLoadAccountByToken } from './db-load-account-by-token'
import { AccountModel } from '../../../domain/models/account'
import { LoadAccountByTokenRepository } from '../../protocols/db/account/load-account-by-token-repository'
interface SutTypes {
  sut: DBLoadAccountByToken
  decrypterStub: Decrypter
  loadAccountByTokenRespositoryStub: LoadAccountByTokenRepository
}
const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@email.com',
  password: 'valid_password'
})
const makeDecrypterStub = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    async decrypt (value: string): Promise<string> {
      return await new Promise(resolve => resolve('any_token'))
    }
  }
  return new DecrypterStub()
}
const makeLoadAccountByTokenRespositoryStub = (): LoadAccountByTokenRepository => {
  class LoadAccountByTokenRespositoryStub implements LoadAccountByTokenRepository {
    async loadByToken (token: string, role?: string): Promise<AccountModel> {
      return await new Promise(resolve => resolve(makeFakeAccount()))
    }
  }
  return new LoadAccountByTokenRespositoryStub()
}
const makeSut = (): SutTypes => {
  const loadAccountByTokenRespositoryStub = makeLoadAccountByTokenRespositoryStub()
  const decrypterStub = makeDecrypterStub()
  const sut = new DBLoadAccountByToken(decrypterStub, loadAccountByTokenRespositoryStub)
  return {
    sut,
    decrypterStub,
    loadAccountByTokenRespositoryStub
  }
}
describe('DBLoadAccountByToken UseCase', () => {
  test('Should call Decrypter with correct value', async () => {
    const { sut, decrypterStub } = makeSut()
    const decryptSpy = jest.spyOn(decrypterStub, 'decrypt')
    await sut.load('any_token', 'any_role')
    expect(decryptSpy).toHaveBeenCalledWith('any_token')
  })
  test('Should return null if Decrypter returns null', async () => {
    const { sut, decrypterStub } = makeSut()
    jest.spyOn(decrypterStub, 'decrypt').mockResolvedValueOnce(null)
    const account = await sut.load('any_token', 'any_role')
    expect(account).toBe(null)
  })
  test('Should call LoadAccountByTokenRespository with correct values', async () => {
    const { sut, loadAccountByTokenRespositoryStub } = makeSut()
    const loadByTokenSpy = jest.spyOn(loadAccountByTokenRespositoryStub, 'loadByToken')
    await sut.load('any_token', 'any_role')
    expect(loadByTokenSpy).toHaveBeenCalledWith('any_token', 'any_role')
  })
  test('Should return null if LoadAccountByTokenRespository returns null', async () => {
    const { sut, loadAccountByTokenRespositoryStub } = makeSut()
    jest.spyOn(loadAccountByTokenRespositoryStub, 'loadByToken').mockResolvedValueOnce(null)
    const account = await sut.load('any_token', 'any_role')
    expect(account).toBe(null)
  })
  test('Should return an account on success', async () => {
    const { sut } = makeSut()
    const account = await sut.load('any_token', 'any_role')
    expect(account).toEqual(makeFakeAccount())
  })
  test('Should throw if Decrypter throws', async () => {
    const { sut, decrypterStub } = makeSut()
    jest.spyOn(decrypterStub, 'decrypt').mockRejectedValueOnce(new Error())
    const promisse = sut.load('any_token', 'any_role')
    await expect(promisse).rejects.toThrow()
  })
  test('Should throw if LoadAccountByTokenRespositoryStub throws', async () => {
    const { sut, loadAccountByTokenRespositoryStub } = makeSut()
    jest.spyOn(loadAccountByTokenRespositoryStub, 'loadByToken').mockRejectedValueOnce(new Error())
    const promisse = sut.load('any_token', 'any_role')
    await expect(promisse).rejects.toThrow()
  })
})
