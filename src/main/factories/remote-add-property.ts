import { type HttpClient } from '../../data/interfaces';
import { RemoteAddProperty } from '../../data/usecases';
import { type LogReportHelper } from '../../util';

export const makeRemoteAddProperty = (httpClient: HttpClient, logReportHelper: LogReportHelper): RemoteAddProperty => {
  const url = process.env.OZMAP_PROPERTY_API_URL;
  return new RemoteAddProperty(url, httpClient, logReportHelper);
};
