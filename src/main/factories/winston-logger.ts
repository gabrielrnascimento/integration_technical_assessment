import { WinstonLogger } from '../../infra/log/winston-logger';

export const makeWinstonLogger = (): WinstonLogger => {
  return new WinstonLogger();
};
