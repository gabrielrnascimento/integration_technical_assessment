import { UnexpectedError } from '../../../domain/errors/unexpected-error';
import { type UserModel } from '../../../domain/models';
import { type GetUser } from '../../../domain/usecases';
import { type HttpClient } from '../../interfaces';
import { HttpStatusCode, type HttpRequest } from '../../types';
import { type LogReportHelper } from '../../util';

export class RemoteGetUser implements GetUser {
  constructor (
    private readonly url: string,
    private readonly httpClient: HttpClient,
    private readonly logReportHelper: LogReportHelper

  ) {
    this.url = url;
    this.httpClient = httpClient;
    this.logReportHelper = logReportHelper;
  }

  private mapResponseToUserModel ({ location, name, email }: any): UserModel {
    const streetName: string = location.street.name;
    const streetNumber: string = location.street.number;
    const postcode: string = location.postcode;
    const city: string = location.city;
    const state: string = location.state;
    const country: string = location.country;

    const addressArray = [streetName, streetNumber, postcode, city, state, country];
    const address = addressArray.join(' ');

    const userFirstName = name.first;
    const userLastName = name.last;

    const userArray = [userFirstName, userLastName];
    const user = userArray.join(' ');

    const code = userArray.map((item: string) => item.toLowerCase()).join('.');

    const observation = email;

    return {
      address,
      name: user,
      code,
      observation
    };
  };

  async get (): Promise<UserModel> {
    await this.logReportHelper.logStart('Retrieving new user information');
    const request: HttpRequest = {
      method: 'get',
      url: this.url
    };
    const httpResponse = await this.httpClient.request(request);
    switch (httpResponse.statusCode) {
      case HttpStatusCode.ok: {
        const [userData] = httpResponse.body.results;
        const user = this.mapResponseToUserModel(userData);
        await this.logReportHelper.logSuccess('User information was successfully retrieved', user);
        return user;
      }
      default: {
        const error = new UnexpectedError(httpResponse.body.error);
        await this.logReportHelper.logError('An error occurred during user information retrieval', error);
        throw error;
      }
    }
  }
}
