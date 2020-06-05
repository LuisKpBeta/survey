import { Controller } from '../../../../presentation/protocols'
import { makeLogControllerDecorator } from '../../decoratos/log-controller-factory'
import { AddSurveyController } from '../../../../presentation/controllers/survey/add-sruvey/add-survey-controller'
import { makeAddSurveyValidation } from './add-survey-validation-factory'
import { makeDbAddSurvey } from '../../usecases/add-survey/db-add-survey-factory'

export const makeAddSurveyController = (): Controller => {
  const addSurveyController = new AddSurveyController(makeAddSurveyValidation(), makeDbAddSurvey())
  return makeLogControllerDecorator(addSurveyController)
}
