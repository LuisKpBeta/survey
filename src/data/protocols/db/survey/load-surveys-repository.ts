import { } from '../../../../domain/usecases/add-survey'
import { SurveyModel } from '../../../../domain/models/survey'
export interface LoadSurveysRepository {
  loadAll (): Promise<SurveyModel[]>
}
