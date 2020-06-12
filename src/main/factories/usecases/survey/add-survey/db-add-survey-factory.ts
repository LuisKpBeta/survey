import { SurveyMongoRepository } from '../../../../../infra/db/mongodb/survey/survey-mongo-repository'
import { DbAddSurvey } from '../../../../../data/usecases/add-survey/db-add-survey'

export const makeDbAddSurvey = (): DbAddSurvey => {
  const surveyMongoRepository = new SurveyMongoRepository()
  return new DbAddSurvey(surveyMongoRepository)
}
