import 'dotenv/config';

import { type RemoteAddClient, type RemoteAddProperty, type RemoteGetUser } from '../../data/usecases';
import { type LogReportHelper } from '../../util';
import { makeAxiosHttpClient } from './axios-http-client';
import { makeLogReportHelper } from './log-report-helper';
import { makeRemoteAddClient } from './remote-add-client';
import { makeRemoteAddProperty } from './remote-add-property';
import { makeRemoteGetUser } from './remote-get-user';

export type AppTypes = {
  remoteGetUser: RemoteGetUser
  remoteAddClient: RemoteAddClient
  remoteAddProperty: RemoteAddProperty
  logReportHelper: LogReportHelper
};

export const makeApp = (): AppTypes => {
  const axiosHttpClient = makeAxiosHttpClient();
  const logReportHelper = makeLogReportHelper();
  const remoteGetUser = makeRemoteGetUser(axiosHttpClient, logReportHelper);
  const remoteAddClient = makeRemoteAddClient(axiosHttpClient, logReportHelper);
  const remoteAddProperty = makeRemoteAddProperty(axiosHttpClient, logReportHelper);
  return {
    remoteGetUser,
    remoteAddClient,
    remoteAddProperty,
    logReportHelper
  };
};
