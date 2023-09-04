export class UnexpectedError extends Error {
  constructor (message?: string) {
    if (message) { super(message); } else {
      super('An unexpected error occurred.');
    }
    this.name = 'UnexpectedError';
  }
}
