import { serverError } from '../../survey/load-survey/load-survey-controller-protocols'
import { Controller, HttpRequest, HttpResponse, LoadSurveyById, forbidden, InvalidParamError, SaveSurveyResult, ok } from './save-survey-result-controller-protocols'
export class SaveSurveyResultController implements Controller {
  constructor (
    private readonly loadSurveyById: LoadSurveyById,
    private readonly saveSurveyResult: SaveSurveyResult
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { surveyId } = httpRequest.params
      const { answer } = httpRequest.body
      const accountId = httpRequest.accountId
      const survey = await this.loadSurveyById.loadById(surveyId)
      if (survey) {
        const index = survey.answers.findIndex(el => el.answer === answer)
        if (index === -1) {
          return forbidden(new InvalidParamError('survey answer'))
        }
        const surveyResult = await this.saveSurveyResult.save({ surveyId, accountId, date: new Date(), answers: answer })
        return ok(surveyResult)
      } else {
        return forbidden(new InvalidParamError('surveyId'))
      }
    } catch (error) {
      return serverError(error)
    }
  }
}
