import { type ReportEntry } from '../types/report';

export interface Reporter {
  append: (data: ReportEntry) => void
  generate: () => Promise<void>
}
