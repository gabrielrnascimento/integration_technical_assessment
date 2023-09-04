import { UnexpectedError } from '../../../domain/errors/unexpected-error';
import { LogReportHelper, addNewClientPropertyLogStart, addPreviousClientPropertyLogStart, addPropertyLogError, addPropertyLogSuccess } from '../../../util';
import { HttpClientSpy, LoggerSpy, ReporterSpy, mockAddPropertyApiResponse, mockAddPropertyDTO, mockPropertyModel } from '../../test';
import { HttpStatusCode, ReportStatus, type ReportEntry } from '../../types';
import { RemoteAddProperty } from './remote-add-property';

type SutTypes = {
  sut: RemoteAddProperty
  httpClientSpy: HttpClientSpy
  loggerSpy: LoggerSpy
  reporterSpy: ReporterSpy
};

const makeSut = (url: string = 'any_url'): SutTypes => {
  const httpClientSpy = new HttpClientSpy();
  httpClientSpy.response = {
    statusCode: HttpStatusCode.created,
    body: mockAddPropertyApiResponse
  };
  const loggerSpy = new LoggerSpy();
  const reporterSpy = new ReporterSpy();
  const logReportHelper = new LogReportHelper(loggerSpy, reporterSpy);
  const sut = new RemoteAddProperty(url, httpClientSpy, logReportHelper);
  return {
    sut,
    httpClientSpy,
    loggerSpy,
    reporterSpy
  };
};

describe('RemoteAddProperty', () => {
  test('should call HttpClient with correct values', async () => {
    const url = 'another_url';
    const { sut, httpClientSpy } = makeSut(url);

    await sut.add(mockAddPropertyDTO);

    expect(httpClientSpy.url).toBe(url);
    expect(httpClientSpy.method).toBe('post');
  });

  test('should throw UnexpectedError if HttpClient returns an http error response', async () => {
    const { sut, httpClientSpy } = makeSut();
    const errorBody = { message: 'Not Found', stack: 'any_string' };
    httpClientSpy.response = {
      statusCode: HttpStatusCode.serverError,
      body: errorBody
    };

    const response = sut.add(mockAddPropertyDTO);

    await expect(response).rejects.toThrow(new UnexpectedError());
  });

  test('should call Logger.info() with correct value if previous is false', async () => {
    const { sut, loggerSpy } = makeSut();
    const infoSpy = jest.spyOn(loggerSpy, 'info');

    await sut.add(mockAddPropertyDTO);

    expect(infoSpy).toHaveBeenCalledWith({ message: addNewClientPropertyLogStart() });
  });

  test('should call Logger.info() with correct value if previous is true', async () => {
    const { sut, loggerSpy } = makeSut();
    const infoSpy = jest.spyOn(loggerSpy, 'info');

    await sut.add({ ...mockAddPropertyDTO, previous: true });

    expect(infoSpy).toHaveBeenCalledWith({ message: addPreviousClientPropertyLogStart() });
  });

  test('should call Reporter.append() with correct values if HttpClient returns 201', async () => {
    const { sut, reporterSpy } = makeSut();
    const appendSpy = jest.spyOn(reporterSpy, 'append');

    const reportEntry: ReportEntry = {
      action: addPropertyLogSuccess(),
      status: ReportStatus.sucess,
      data: mockPropertyModel
    };

    await sut.add(mockAddPropertyDTO);

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
      await sut.add(mockAddPropertyDTO);
    } catch (err) {
      error = err;
    }

    const { name, message, stack } = error;

    const reportEntry: ReportEntry = {
      action: addPropertyLogError(),
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
      await sut.add(mockAddPropertyDTO);
    } catch (err) {
      error = err;
    }

    const { name, message, stack } = error;

    expect(loggerSpy.method).toBe('error');
    expect(loggerSpy.log).toEqual({
      message: addPropertyLogError(),
      error: {
        [name]: {
          message,
          stack,
          data: errorBody
        }
      }
    });
  });

  test('should call Logger.info() with user data if HttpClient returns 201', async () => {
    const { sut, loggerSpy } = makeSut();
    const infoSpy = jest.spyOn(loggerSpy, 'info');

    await sut.add(mockAddPropertyDTO);

    expect(infoSpy).toHaveBeenCalledWith({
      message: addPropertyLogSuccess(),
      data: mockPropertyModel
    });
  });

  test('should return PropertyModel if HttpClient returns 201', async () => {
    const { sut } = makeSut();

    const response = await sut.add(mockAddPropertyDTO);

    expect(response).toEqual(mockPropertyModel);
  });
});
