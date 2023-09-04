import LokiTransport from 'winston-loki';
import { type Logger } from '../../data/interfaces';
import winston from 'winston';

export class WinstonLogger implements Logger {
  private readonly logger: winston.Logger;

  constructor () {
    this.logger = this.createLogger();
  }

  private createLogger (): winston.Logger {
    return winston.createLogger({
      transports: [
        new LokiTransport({
          host: process.env.LOGGER_URL,
          json: true,
          labels: { job: process.env.LOGGER_JOB }
        }),
        new winston.transports.Console({
          format: winston.format.json()
        })
      ]
    });
  }

  async info (log: any): Promise<void> {
    this.logger.info(JSON.stringify(log));
  }

  async error (log: any): Promise<void> {
    this.logger.error(JSON.stringify(log));
  }
}
