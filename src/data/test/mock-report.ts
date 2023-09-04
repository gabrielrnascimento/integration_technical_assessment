import { type Reporter } from '../interfaces';
import { type ReportEntry } from '../types';

export class ReporterSpy implements Reporter {
  public data: ReportEntry;

  append (data: ReportEntry): void {
    this.data = data;
  }

  async generate (): Promise<void> {
    return null;
  }
}
