import { ReportStatus, type ReportEntry } from '../../data/types';
import { reportFileName, reportFolderName, reportTitle } from '../../util';
import { LocalMarkdownReporter } from './local-markdown-reporter';

import fs from 'fs/promises';

jest.mock('fs/promises', () => ({
  writeFile: jest.fn(),
  mkdir: jest.fn()
}));

jest.useFakeTimers({ now: new Date('2023-01-01T10:30') });
const mockDateTime = '2023-01-01_10-30';

type SutTypes = {
  sut: LocalMarkdownReporter
  privateEntries: ReportEntry[]
};

const makeSut = (): SutTypes => {
  const sut = new LocalMarkdownReporter();
  const privateEntries = ((sut as any).entries as ReportEntry[]);

  return {
    sut,
    privateEntries
  };
};

describe('LocalMarkdownReporter', () => {
  test('should instantiate with an empty array', () => {
    const { privateEntries } = makeSut();

    expect(privateEntries).toEqual([]);
  });

  describe('append()', () => {
    test('should add new ReportEntry object to entries', () => {
      const { sut, privateEntries } = makeSut();

      const data: ReportEntry = {
        action: 'Unit test',
        status: ReportStatus.sucess
      };

      sut.append(data);

      expect(privateEntries).toEqual([data]);
    });
  });
  describe('generate()', () => {
    test('should format the current date and time correctly', () => {
      const { sut } = makeSut();
      const formattedDate = ((sut as any).getCurrentDateTime() as string);

      expect(formattedDate).toMatch(mockDateTime);
    });

    test('should generate a valid file name', () => {
      const { sut } = makeSut();
      const fileName = ((sut as any).getFileName(mockDateTime) as string);

      expect(fileName).toBe(reportFileName(mockDateTime));
    });

    test('should add the title with the correct datetime', () => {
      const { sut } = makeSut();
      ((sut as any).addTitle(mockDateTime));
      const title = ((sut as any).content as string);
      const expectedReportTitle = `# ${reportTitle(mockDateTime)}\n`;

      expect(title).toBe(expectedReportTitle);
    });

    test('should add content correctly', () => {
      const { sut } = makeSut();

      const entries: ReportEntry[] = [
        {
          action: 'action1',
          status: ReportStatus.error,
          message: 'Message for action1',
          data: { key1: 'value1' }
        },
        {
          action: 'action2',
          status: ReportStatus.error,
          message: 'Message for action2'
        },
        {
          action: 'action3',
          status: ReportStatus.sucess
        }
      ];

      entries.forEach((entry) => { sut.append(entry); });
      ((sut as any).addContent(mockDateTime));
      const content = ((sut as any).content as string);

      const expectedContent =
      '\n1. Action: action1\n   ' +
        '- Status: error\n   ' +
        '- Error Message: Message for action1\n' +
          '   - Data:\n\n      ```json\n' +
          '      {\n        "key1": "value1"\n      }\n' +
          '      ```\n' +
      '\n2. Action: action2\n   ' +
        '- Status: error\n   ' +
        '- Error Message: Message for action2\n' +
      '\n3. Action: action3\n   ' +
      '- Status: success\n';

      expect(content).toBe(expectedContent);
    });

    test('should create folder if not exists', async () => {
      const { sut } = makeSut();
      const mkdirSpy = jest.spyOn(fs, 'mkdir');

      ((sut as any).getFolder());

      expect(mkdirSpy).toHaveBeenCalledWith('reports');
    });

    test('should save report as markdown with correct path', async () => {
      const { sut } = makeSut();
      const writeFileSpy = jest.spyOn(fs, 'writeFile');

      await sut.generate();
      const expectedReportContent = `# ${reportTitle(mockDateTime)}\n`;

      expect(writeFileSpy).toHaveBeenCalledWith(`${reportFolderName()}/${reportFileName(mockDateTime)}`, expectedReportContent);
    });

    test('should clear entries and content when report is saved', async () => {
      const { sut } = makeSut();

      await sut.generate();
      const reportContent = ((sut as any).content as string);
      const reportEntries = ((sut as any).entries as ReportEntry[]);

      expect(reportContent).toBe('');
      expect(reportEntries).toEqual([]);
    });
  });
});
