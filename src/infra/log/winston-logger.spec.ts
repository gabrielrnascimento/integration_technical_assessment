import winston from 'winston';
import LokiTransport from 'winston-loki';
import { WinstonLogger } from './winston-logger';

jest.mock('winston', () => ({
  createLogger: jest.fn(() => ({
    info: jest.fn()
  })),
  transports: {
    Console: jest.fn()
  },
  format: {
    json: jest.fn().mockImplementation(() => ({}))
  }
}));

jest.mock('winston-loki', () => {
  const LokiTransportMock = jest.fn().mockImplementation(() => ({
    log: jest.fn()
  }));
  return LokiTransportMock;
});

describe('WinstonLogger', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should create a Winston.Logger with LokiTransport and ConsoleTransport', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const sut = new WinstonLogger();

    expect(winston.createLogger).toHaveBeenCalled();
    expect(LokiTransport).toHaveBeenCalledWith({
      host: process.env.LOGGER_URL,
      json: true,
      labels: { job: process.env.LOGGER_JOB }
    });
    expect(winston.transports.Console).toHaveBeenCalledWith({
      format: expect.anything()
    });
  });

  describe('info()', () => {
    test('should call JSON.stringify with correct values', async () => {
      const sut = new WinstonLogger();
      const stringifySpy = jest.spyOn(JSON, 'stringify');

      const log = {
        message: 'this is a test message',
        data: { field: 'any_value' }
      };

      await sut.info(log);
      expect(stringifySpy).toHaveBeenCalledWith(log);
    });

    test('should call Winston.Logger.info() with correct values', async () => {
      const sut = new WinstonLogger();
      const mockedLogger = (winston.createLogger as jest.Mock).mock.results[0].value;

      const log = {
        message: 'this is a test message',
        data: { field: 'any_value' }
      };

      await sut.info(log);
      expect(mockedLogger.info).toHaveBeenCalledWith(JSON.stringify(log));
    });
  });
});