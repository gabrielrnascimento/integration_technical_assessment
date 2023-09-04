import { UnexpectedError } from '../../../domain/errors/unexpected-error';
import { LogReportHelper, getUserLogError, getUserLogStart, getUserLogSuccess } from '../../../util';
import { HttpClientSpy, LoggerSpy, ReporterSpy, mockRandomUserApiResponse, mockUserModel } from '../../test';
import { HttpStatusCode, ReportStatus, type ReportEntry } from '../../types';
import { RemoteGetUser } from './remote-get-user';

type SutTypes = {
  sut: RemoteGetUser
  httpClientSpy: HttpClientSpy
  loggerSpy: LoggerSpy
  reporterSpy: ReporterSpy
};

const makeSut = (url: string = 'any_url'): SutTypes => {
  const httpClientSpy = new HttpClientSpy();
  httpClientSpy.response.body = mockRandomUserApiResponse;
  const loggerSpy = new LoggerSpy();
  const reporterSpy = new ReporterSpy();
  const logReportHelper = new LogReportHelper(loggerSpy, reporterSpy);
  const sut = new RemoteGetUser(url, httpClientSpy, logReportHelper);
  return {
    sut,
    httpClientSpy,
    loggerSpy,
    reporterSpy
  };
};

describe('RemoteGetUser', () => {
  test('should call HttpClient with correct values', async () => {
    const url = 'another_url';
    const { sut, httpClientSpy } = makeSut(url);

    await sut.get();

    expect(httpClientSpy.url).toBe(url);
    expect(httpClientSpy.method).toBe('get');
  });

  test('should throw UnexpectedError if HttpClient returns an http error response', async () => {
    const { sut, httpClientSpy } = makeSut();
    const errorBody = { message: 'Not Found', stack: 'any_string' };
    httpClientSpy.response = {
      statusCode: HttpStatusCode.serverError,
      body: errorBody
    };

    const response = sut.get();

    await expect(response).rejects.toThrow(new UnexpectedError());
  });

  test('should call Logger.info() with correct value', async () => {
    const { sut, loggerSpy } = makeSut();
    const infoSpy = jest.spyOn(loggerSpy, 'info');

    await sut.get();

    expect(infoSpy).toHaveBeenCalledWith({ message: getUserLogStart() });
  });

  test('should call Reporter.append() with correct values if HttpClient returns 200', async () => {
    const { sut, reporterSpy } = makeSut();
    const appendSpy = jest.spyOn(reporterSpy, 'append');

    const reportEntry: ReportEntry = {
      action: getUserLogSuccess(),
      status: ReportStatus.sucess,
      data: mockUserModel
    };

    await sut.get();

    expect(appendSpy).toHaveBeenCalledWith(reportEntry);
  });

  test('should call Reporter.append() with correct values if HttpClient returns an http error response', async () => {
    const { sut, httpClientSpy, reporterSpy } = makeSut();
    const errorBody = { message: 'Not Found', stack: 'any_string' };
    httpClientSpy.response = {
      statusCode: HttpStatusCode.serverError,
      body: errorBody
    };
    const appendSpy = jest.spyOn(reporterSpy, 'append');

    let error: Error;

    try {
      await sut.get();
    } catch (err) {
      error = err;
    }

    const { name, message, stack } = error;

    const reportEntry: ReportEntry = {
      action: getUserLogError(),
      status: ReportStatus.error,
      message: error.message,
      data: {
        [name]: {
          data: errorBody,
          message,
          stack
        }
      }
    };

    expect(appendSpy).toHaveBeenCalledWith(reportEntry);
  });

  test('should call Logger.error() if HttpClient returns an http error response', async () => {
    const { sut, httpClientSpy, loggerSpy } = makeSut();
    const errorBody = { message: 'Not Found', stack: 'any_string' };
    httpClientSpy.response = {
      statusCode: HttpStatusCode.serverError,
      body: errorBody
    };

    let error: Error;

    try {
      await sut.get();
    } catch (err) {
      error = err;
    }

    const { name, message, stack } = error;

    expect(loggerSpy.method).toBe('error');
    expect(loggerSpy.log).toEqual({
      message: getUserLogError(),
      error: {
        [name]: {
          message,
          stack,
          data: errorBody
        }
      }
    });
  });

  test('should call Logger.info() with user data if HttpClient returns 200', async () => {
    const { sut, loggerSpy } = makeSut();
    const infoSpy = jest.spyOn(loggerSpy, 'info');

    await sut.get();

    expect(infoSpy).toHaveBeenCalledWith({
      message: getUserLogSuccess(),
      data: mockUserModel
    });
  });

  test('should return UserModel if HttpClient returns 200', async () => {
    const { sut } = makeSut();

    const response = await sut.get();

    expect(response).toEqual(mockUserModel);
  });
});
