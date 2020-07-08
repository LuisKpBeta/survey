import { makeDbAuthentication } from '@/main/factories/usecases/account/db-authentication-factory'
import { makeLogControllerDecorator } from '@/main/factories/decoratos/log-controller-factory'
import { makeLoginValidation } from './login-validation-factory'
import { Controller } from '@/presentation/protocols'
import { LoginController } from '@/presentation/controllers/login/login/login-controller'

export const makeLoginController = (): Controller => {
  return makeLogControllerDecorator(new LoginController(makeDbAuthentication(), makeLoginValidation()))
}
