import { LocalMarkdownReporter } from '../../infra/report/local-markdown-reporter';

export const makeLocalMarkdownReporter = (): LocalMarkdownReporter => {
  return new LocalMarkdownReporter();
};
