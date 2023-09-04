import { type HttpClient } from '../../data/interfaces';
import { RemoteGetUser } from '../../data/usecases';
import { type LogReportHelper } from '../../util';

export const makeRemoteGetUser = (httpClient: HttpClient, logReportHelper: LogReportHelper): RemoteGetUser => {
  const url = process.env.RANDOM_USER_API_URL;
  return new RemoteGetUser(url, httpClient, logReportHelper);
};
