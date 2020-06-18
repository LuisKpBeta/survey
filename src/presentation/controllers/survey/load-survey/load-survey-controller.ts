import { Controller, HttpRequest, HttpResponse, LoadSurveys, ok, serverError, noContent } from './load-survey-controller-protocols'

export default class LoadSurveyController implements Controller {
  constructor (private readonly loadSurveys: LoadSurveys) {}
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const surveys = await this.loadSurveys.load()
      if (surveys.length === 0) {
        return noContent()
      }
      return ok(surveys)
    } catch (error) {
      return serverError(error)
    }
  }
}
