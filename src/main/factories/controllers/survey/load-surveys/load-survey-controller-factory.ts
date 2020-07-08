import { makeLogControllerDecorator } from '@/main/factories/decoratos/log-controller-factory'
import { makeDbLoadSurveys } from '@/main/factories/usecases/survey/add-survey/db-load-surveys-factory'
import { Controller } from '@/presentation/protocols'
import LoadSurveyController from '@/presentation/controllers/survey/load-survey/load-survey-controller'

export const makeLoadSurveysController = (): Controller => {
  const addSurveyController = new LoadSurveyController(makeDbLoadSurveys())
  return makeLogControllerDecorator(addSurveyController)
}
