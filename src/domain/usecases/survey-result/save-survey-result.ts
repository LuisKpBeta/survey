import { SurveyResultModel } from '@/domain/models/survey-result'
export interface SaveSurveyResultModel {
  surveyId: string
  accountId: string
  answers: string
  date: Date
}

export interface SaveSurveyResult {
  save (data: SaveSurveyResultModel): Promise<SurveyResultModel>
}
