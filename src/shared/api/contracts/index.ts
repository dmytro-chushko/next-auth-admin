import { initContract } from '@ts-rest/core';

import { userContract } from './user.contract';

const c = initContract();

/** Domain API contract root. Stage G will nest `admin` here. */
export const contract = c.router({
  users: userContract,
});

export type AppContract = typeof contract;

export { userContract } from './user.contract';
export type { UserContract } from './user.contract';
export { userMeSchema, roleSchema } from './schemas/user';
export type { UserMe, Role } from './schemas/user';
export {
  unauthorizedResponse,
  internalServerErrorResponse,
} from './schemas/error';
