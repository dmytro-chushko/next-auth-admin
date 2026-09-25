export class AvatarStorageError extends Error {
  readonly status: 400 | 500;

  constructor(status: 400 | 500, message: string) {
    super(message);
    this.name = 'AvatarStorageError';
    this.status = status;
  }
}
