import { LogReportHelper } from '../../util';
import { makeLocalMarkdownReporter } from './local-markdown-reporter';
import { makeWinstonLogger } from './winston-logger';

export const makeLogReportHelper = (): LogReportHelper => {
  return new LogReportHelper(makeWinstonLogger(), makeLocalMarkdownReporter());
};
