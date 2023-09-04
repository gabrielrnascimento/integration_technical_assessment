import { LoggerSpy, ReporterSpy } from '../../data/test';
import { LogReportHelper } from './log-report-helper';

type SutTypes = {
  sut: LogReportHelper
  loggerSpy: LoggerSpy
  reporterSpy: ReporterSpy
};

const makeSut = (): SutTypes => {
  const loggerSpy = new LoggerSpy();
  const reporterSpy = new ReporterSpy();
  const sut = new LogReportHelper(loggerSpy, reporterSpy);
  return {
    sut,
    loggerSpy,
    reporterSpy
  };
};

describe('LogReportHelper', () => {
  test('should call Reporter.generate()', async () => {
    const { sut, reporterSpy } = makeSut();
    const generateSpy = jest.spyOn(reporterSpy, 'generate');
    await sut.generateReport();

    expect(generateSpy).toHaveBeenCalled();
  });
});
