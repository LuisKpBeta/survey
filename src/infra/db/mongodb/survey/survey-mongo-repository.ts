import { MongoHelper } from '../helpers/mongo-helper'
import { AddSurveyModel } from '@/domain/usecases/add-survey'
import { SurveyModel } from '@/domain/models/survey'
import { AddSurveyRepository } from '@/data/protocols/db/survey/add-survey-repository'
import { LoadSurveysRepository } from '@/data/protocols/db/survey/load-surveys-repository'
import { LoadSurveyByIdRepository } from '@/data/protocols/db/survey/load-survey-by-id-repository'
export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveysRepository, LoadSurveyByIdRepository {
  async add (surveyData: AddSurveyModel): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.insertOne(surveyData)
  }

  async loadAll (): Promise<SurveyModel[]> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    const surveys: SurveyModel[] = await surveyCollection.find().toArray()
    return MongoHelper.mapArray(surveys)
  }

  async loadById (id: string): Promise<SurveyModel> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    const survey: SurveyModel = await surveyCollection.findOne({ _id: id })
    return survey && MongoHelper.map(survey)
  }
}
