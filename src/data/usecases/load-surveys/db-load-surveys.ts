import { LoadSurveys } from '../../../domain/usecases/load-surveys'
import { SurveyModel } from '../../../domain/models/survey'
import { LoadSurveysRepository } from '../../protocols/db/survey/load-surveys-repository'

export default class DbLoadSurveys implements LoadSurveys {
  constructor (private readonly loadSurveyRepository: LoadSurveysRepository) {}
  async load (): Promise<SurveyModel[]> {
    const surveys = await this.loadSurveyRepository.loadAll()
    return surveys
  }
}
