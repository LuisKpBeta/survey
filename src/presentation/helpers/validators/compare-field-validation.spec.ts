import { InvalidParamError } from '../../errors'
import { CompareFieldValidation } from './compare-field-validation'
const makeSut = (): CompareFieldValidation => {
  return new CompareFieldValidation('field', 'fieldToCompare')
}

describe('RequiredField Validaton', () => {
  test('Should return MissingParamError if validation fails', () => {
    const sut = makeSut()
    const error = sut.validate({ field: 'any_name', fieldToCompare: 'any_other_value' })
    expect(error).toEqual(new InvalidParamError('fieldToCompare'))
  })
  test('Shouldn\'t return if validation succeeds', () => {
    const sut = makeSut()
    const error = sut.validate({ field: 'any_name', fieldToCompare: 'any_name' })
    expect(error).toBeFalsy()
  })
})
