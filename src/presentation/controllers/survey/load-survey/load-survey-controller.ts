import { Controller, HttpRequest, HttpResponse, LoadSurveys, ok } from './load-survey-controller-protocols'
import { serverError } from '../../../helpers/http/http-helper'

export default class LoadSurveyController implements Controller {
  constructor (private readonly loadSurveys: LoadSurveys) {}
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const surveys = await this.loadSurveys.load()
      return ok(surveys)
    } catch (error) {
      return serverError(error)
    }
  }
}
