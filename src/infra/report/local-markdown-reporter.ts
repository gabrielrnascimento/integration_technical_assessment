import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import { type ReportEntry } from '../../data/types';
import { type Reporter } from '../../data/interfaces';
import { reportAction, reportData, reportErrorMessage, reportFileName, reportFolderName, reportStatus, reportTitle } from '../../util';

export class LocalMarkdownReporter implements Reporter {
  private entries: ReportEntry[];
  private content: string;

  constructor () {
    this.entries = [];
    this.content = '';
  }

  append (data: ReportEntry): void {
    this.entries.push(data);
  }

  private getCurrentDateTime (): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hour = String(now.getHours()).padStart(2, '0');
    const minute = String(now.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}_${hour}-${minute}`;
  }

  private getFileName (datetime: string): string {
    return reportFileName(datetime);
  }

  private addTitle (datetime: string): void {
    this.content += `# ${reportTitle(datetime)}\n`;
  }

  private addContent (): void {
    this.entries.forEach((entry, index) => {
      this.content += `\n${index + 1}. `;
      this.content += `${reportAction(entry.action)}\n   `;
      this.content += `- ${reportStatus(entry.status)}\n`;

      if (entry.message) {
        this.content += `   - ${reportErrorMessage(entry.message)}\n`;
      }

      if (entry.data) {
        const formattedJSON = `${JSON.stringify(entry.data, null, 8)}`;
        const data = `${formattedJSON.slice(0, formattedJSON.length - 1)}      }\n`;
        this.content += `   - ${reportData()}\n`;
        this.content += '\n      ```json\n';
        this.content += `      ${data}`;
        this.content += '      ```\n';
      }
    });
  }

  private async getFolder (): Promise<string> {
    try {
      await mkdir(reportFolderName());
    } catch {
    }

    return reportFolderName();
  }

  private async saveReport (datetime: string): Promise<void> {
    const fileName = this.getFileName(datetime);
    const folderName = await this.getFolder();
    const filePath = path.join(folderName, fileName);
    const fileContent = this.content;
    this.content = '';
    this.entries = [];
    await writeFile(filePath, fileContent);
  }

  async generate (): Promise<void> {
    const datetime = this.getCurrentDateTime();
    this.addTitle(datetime);
    this.addContent();
    await this.saveReport(datetime);
  }
}
