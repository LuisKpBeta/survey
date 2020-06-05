import { SignUpController } from '../../../../presentation/controllers/login/signup/signup-controller'
import { Controller } from '../../../../presentation/protocols'
import { makeSignUpValidation } from './signup-validation-factory'
import { makeDbAuthentication } from '../../usecases/db-authentication-factory'
import { makeDbAddAccount } from '../../usecases/add-account/db-add-account-factory'
import { makeLogControllerDecorator } from '../../decoratos/log-controller-factory'

export const makeSignUpController = (): Controller => {
  return makeLogControllerDecorator(new SignUpController(makeDbAddAccount(), makeSignUpValidation(), makeDbAuthentication()))
}
