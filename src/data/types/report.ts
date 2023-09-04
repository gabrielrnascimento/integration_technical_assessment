export enum ReportStatus {
  sucess = 'success',
  error = 'error',
  pending = 'pending'
}

export type ReportEntry = {
  action: string
  status: ReportStatus
  message?: string
  data?: any
};
