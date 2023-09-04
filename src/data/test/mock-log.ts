import { type Logger } from '../interfaces';

export class LoggerSpy implements Logger {
  public method?: string;
  public log?: any;

  async info (log: any): Promise<void> {
    this.method = 'info';
    this.log = log;
  }

  async error (log: any): Promise<void> {
    this.method = 'error';
    this.log = log;
  }
}
