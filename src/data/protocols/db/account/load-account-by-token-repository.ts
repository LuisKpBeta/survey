import { AccountModel } from '../../../../domain/models/account'

export interface LoadAccountByTokenRepository {
  loadByToken (email: string, role?: string): Promise<AccountModel>
}
