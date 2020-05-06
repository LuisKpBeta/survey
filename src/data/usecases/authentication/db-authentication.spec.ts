import { DbAuthentication } from './db-authentication'
import {
  AccountModel,
  LoadAccountByEmailRepository,
  AuthenticationModel,
  HashComparer,
  TokenGenerator,
  UpdateAccessTokenRepository
} from './db-authentication-protocols'
const makeFakeAccount = (): AccountModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email@email.com',
  password: 'hash_password'
})
const makeFakeAuthentication = (): AuthenticationModel => ({
  email: 'any_email@email.com',
  password: 'any_password'
})
const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async load (email: string): Promise<AccountModel> {
      return await new Promise(resolve => resolve(makeFakeAccount()))
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}
const makeHashCompareStub = (): HashComparer => {
  class HashCompareStub implements HashComparer {
    async compare (value: string, hash: string): Promise<Boolean> {
      return await new Promise(resolve => resolve(true))
    }
  }
  return new HashCompareStub()
}
const makeTokenGenerator = (): TokenGenerator => {
  class TokenGeneratorStub implements TokenGenerator {
    async generate (id: string): Promise<string> {
      return await new Promise(resolve => resolve('any_token'))
    }
  }
  return new TokenGeneratorStub()
}
const makeUpdateAccessTokenRepository = (): UpdateAccessTokenRepository => {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    async update (id: string, token: string): Promise<void> {
      return await new Promise(resolve => resolve())
    }
  }
  return new UpdateAccessTokenRepositoryStub()
}

interface SutTypes {
  sut: DbAuthentication
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  hashCompareStub: HashComparer
  tokenGeneratorStub: TokenGenerator
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository
}
const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
  const hashCompareStub = makeHashCompareStub()
  const tokenGeneratorStub = makeTokenGenerator()
  const updateAccessTokenRepositoryStub = makeUpdateAccessTokenRepository()
  const sut = new DbAuthentication(
    loadAccountByEmailRepositoryStub,
    hashCompareStub,
    tokenGeneratorStub,
    updateAccessTokenRepositoryStub
  )
  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashCompareStub,
    tokenGeneratorStub,
    updateAccessTokenRepositoryStub
  }
}
describe('DbAuthentication UseCase', () => {
  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load')
    await sut.auth(makeFakeAuthentication())
    expect(loadSpy).toHaveBeenCalledWith('any_email@email.com')
  })
  test('Should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockRejectedValueOnce(new Error())
    const promise = sut.auth(makeFakeAuthentication())
    await expect(promise).rejects.toThrow()
  })
  test('Should return null if LoadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockReturnValueOnce(null)
    const result = await sut.auth(makeFakeAuthentication())
    expect(result).toBeNull()
  })
  test('Should call HashCompare with correct values', async () => {
    const { sut, hashCompareStub } = makeSut()
    const compareSpy = jest.spyOn(hashCompareStub, 'compare')
    await sut.auth(makeFakeAuthentication())
    expect(compareSpy).toHaveBeenCalledWith('any_password', 'hash_password')
  })
  test('Should throw if HashCompare throws', async () => {
    const { sut, hashCompareStub } = makeSut()
    jest.spyOn(hashCompareStub, 'compare').mockRejectedValueOnce(new Error())
    const promise = sut.auth(makeFakeAuthentication())
    await expect(promise).rejects.toThrow()
  })
  test('Should return null if HashCompare return false', async () => {
    const { sut, hashCompareStub } = makeSut()
    jest.spyOn(hashCompareStub, 'compare').mockResolvedValueOnce(false)
    const token = await sut.auth(makeFakeAuthentication())
    expect(token).toBeNull()
  })
  test('Should call TokenGenerator with correct id', async () => {
    const { sut, tokenGeneratorStub } = makeSut()
    const generateSpy = jest.spyOn(tokenGeneratorStub, 'generate')
    await sut.auth(makeFakeAuthentication())
    expect(generateSpy).toHaveBeenCalledWith('any_id')
  })
  test('Should throw if TokenGenerator throws', async () => {
    const { sut, tokenGeneratorStub } = makeSut()
    jest.spyOn(tokenGeneratorStub, 'generate').mockRejectedValueOnce(new Error())
    const promise = sut.auth(makeFakeAuthentication())
    await expect(promise).rejects.toThrow()
  })
  test('Should call TokenGenerator with correct id', async () => {
    const { sut } = makeSut()
    const accessToken = await sut.auth(makeFakeAuthentication())
    expect(accessToken).toBe('any_token')
  })
  test('Should call UpdateAccessToken with correct values', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()
    const updateSpy = jest.spyOn(updateAccessTokenRepositoryStub, 'update')
    await sut.auth(makeFakeAuthentication())
    expect(updateSpy).toHaveBeenCalledWith('any_id', 'any_token')
  })
  test('Should throw if UpdateAccessToken throws', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()
    jest.spyOn(updateAccessTokenRepositoryStub, 'update').mockRejectedValueOnce(new Error())
    const promise = sut.auth(makeFakeAuthentication())
    await expect(promise).rejects.toThrow()
  })
})
