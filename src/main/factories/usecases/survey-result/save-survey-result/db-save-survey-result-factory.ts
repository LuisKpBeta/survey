import { DbSaveSurveyResult } from '@/data/usecases/survey-result/save-survey-result/db-save-survey-result'
import { SurveyResultMongoRepository } from '@/infra/db/mongodb/surve-result/survey-result-mongo-repository'

export const makeDbSaveSurveyResult = (): DbSaveSurveyResult => {
  const surveyMongoRepository = new SurveyResultMongoRepository()
  return new DbSaveSurveyResult(surveyMongoRepository)
}
