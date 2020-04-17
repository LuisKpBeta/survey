import { HttpResponse, HttpRequest } from '../protocols/http'
export class SignUpController {
  handle (httpRequest: HttpRequest): HttpResponse {
    if (!httpRequest.body.name) {
      return {
        statusCode: 400,
        body: new Error('Missing param: name')
      }
    }
    if (!httpRequest.body.mail) {
      return {
        statusCode: 400,
        body: new Error('Missing param: email')
      }
    }
  }
}
