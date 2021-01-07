import env from '@/main/config/env'
import { AccountMongoRepository } from '@/infra/db/mongodb/account/account-mongo-repository'
import { JwtAdapter } from '@/infra/cryiptography/jwt-adapter/jwt-adapter'
import { DBLoadAccountByToken } from '@/data/usecases/account/load-account-by-token/db-load-account-by-token'
import { LoadAccountByToken } from '@/domain/usecases/account/load-account-by-token'
export const makeDbLoadAccountByToken = (): LoadAccountByToken => {
  const accountMongoRepository = new AccountMongoRepository()
  const jwtAdapter = new JwtAdapter(env.jwtSecret)
  return new DBLoadAccountByToken(jwtAdapter, accountMongoRepository)
}
