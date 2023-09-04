import { UnexpectedError } from '../../../domain/errors/unexpected-error';
import { type PropertyModel } from '../../../domain/models';
import { type AddProperty } from '../../../domain/usecases/add-property';
import { addNewClientPropertyLogStart, addPreviousClientPropertyLogStart, addPropertyLogError, addPropertyLogSuccess, type LogReportHelper } from '../../../util';
import { type AddPropertyDTO } from '../../dtos/add-property';
import { type HttpClient } from '../../interfaces';
import { type HttpRequest, HttpStatusCode } from '../../types';

export class RemoteAddProperty implements AddProperty {
  constructor (
    private readonly url: string,
    private readonly httpClient: HttpClient,
    private readonly logReportHelper: LogReportHelper
  ) {
    this.url = url;
    this.httpClient = httpClient;
    this.logReportHelper = logReportHelper;
  }

  async add (data: AddPropertyDTO): Promise<PropertyModel> {
    let text = '';
    switch (data.previous) {
      case true: text = addPreviousClientPropertyLogStart(); break;
      default: text = addNewClientPropertyLogStart();
    }
    await this.logReportHelper.logStart(text);

    const request: HttpRequest = {
      method: 'post',
      url: this.url,
      data,
      headers: {
        Authorization: process.env.API_KEY
      }
    };
    const httpResponse = await this.httpClient.request(request);

    switch (httpResponse.statusCode) {
      case HttpStatusCode.created: {
        const { id, box, address, client } = httpResponse.body;
        const response: PropertyModel = { id, box, address, client };
        await this.logReportHelper.logSuccess(addPropertyLogSuccess(), response);
        return response;
      }
      default: {
        const error = new UnexpectedError();
        await this.logReportHelper.logError(addPropertyLogError(), {
          name: error.name,
          message: error.message,
          stack: error.stack,
          data: httpResponse.body
        });
        throw error;
      }
    }
  }
}
