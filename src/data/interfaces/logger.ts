export interface Logger {
  info: (log: any) => Promise<void>
  error: (log: any) => Promise<void>
}
