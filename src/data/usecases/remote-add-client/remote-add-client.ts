import { UnexpectedError } from '../../../domain/errors/unexpected-error';
import { type ClientModel } from '../../../domain/models';
import { type AddClient } from '../../../domain/usecases';
import { addClientLogError, addClientLogStart, addClientLogSuccess, type LogReportHelper } from '../../../util';
import { type AddClientDTO } from '../../dtos';
import { type HttpClient } from '../../interfaces';
import { HttpStatusCode, type HttpRequest } from '../../types';

export class RemoteAddClient implements AddClient {
  constructor (
    private readonly url: string,
    private readonly httpClient: HttpClient,
    private readonly logReportHelper: LogReportHelper
  ) {
    this.url = url;
    this.httpClient = httpClient;
    this.logReportHelper = logReportHelper;
  }

  async add (data: AddClientDTO): Promise<ClientModel> {
    await this.logReportHelper.logStart(addClientLogStart());
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
        const { id } = httpResponse.body;
        await this.logReportHelper.logSuccess(addClientLogSuccess(), { id });
        return { id };
      }
      default: {
        const error = new UnexpectedError();
        await this.logReportHelper.logError(addClientLogError(), {
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
