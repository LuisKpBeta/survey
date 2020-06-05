import { makeLoginValidation } from './login-validation-factory'
import { Controller } from '../../../../presentation/protocols'
import { LoginController } from '../../../../presentation/controllers/login/login/login-controller'
import { makeDbAuthentication } from '../../usecases/db-authentication-factory'
import { makeLogControllerDecorator } from '../../decoratos/log-controller-factory'

export const makeLoginController = (): Controller => {
  return makeLogControllerDecorator(new LoginController(makeDbAuthentication(), makeLoginValidation()))
}
