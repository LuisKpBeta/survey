import { Controller } from '../../../../../presentation/protocols'
import { makeLogControllerDecorator } from '../../../decoratos/log-controller-factory'
import LoadSurveyController from '../../../../../presentation/controllers/survey/load-survey/load-survey-controller'
import { makeDbLoadSurveys } from '../../../usecases/survey/add-survey/db-load-surveys-factory'

export const makeLoadSurveysController = (): Controller => {
  const addSurveyController = new LoadSurveyController(makeDbLoadSurveys())
  return makeLogControllerDecorator(addSurveyController)
}
