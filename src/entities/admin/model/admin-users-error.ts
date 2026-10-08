export type AdminUsersErrorStatus = 400 | 404;

/** Domain failure of an admin user operation, mapped 1:1 to an HTTP status. */
export class AdminUsersError extends Error {
  readonly status: AdminUsersErrorStatus;

  constructor(status: AdminUsersErrorStatus, message: string) {
    super(message);
    this.name = 'AdminUsersError';
    this.status = status;
  }
}
