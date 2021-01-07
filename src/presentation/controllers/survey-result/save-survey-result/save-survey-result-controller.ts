import { serverError } from '../../survey/load-survey/load-survey-controller-protocols'
import { Controller, HttpRequest, HttpResponse, LoadSurveyById, forbidden, InvalidParamError } from './save-survey-result-controller-protocols'
export class SaveSurveyResultController implements Controller {
  constructor (private readonly loadSurveyById: LoadSurveyById) {}
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { surveyId } = httpRequest.params
      const { answer } = httpRequest.body
      const survey = await this.loadSurveyById.loadById(surveyId)
      if (survey) {
        const index = survey.answers.findIndex(el => el.answer === answer)
        if (index === -1) {
          return forbidden(new InvalidParamError('survey answer'))
        }
      } else {
        return forbidden(new InvalidParamError('surveyId'))
      }
      return null
    } catch (error) {
      return serverError(error)
    }
  }
}
