import { type HttpClient } from '../../data/interfaces';
import { RemoteAddClient } from '../../data/usecases';
import { type LogReportHelper } from '../../util';

export const makeRemoteAddClient = (httpClient: HttpClient, logReportHelper: LogReportHelper): RemoteAddClient => {
  const url = process.env.OZMAP_CLIENT_API_URL;
  return new RemoteAddClient(url, httpClient, logReportHelper);
};
