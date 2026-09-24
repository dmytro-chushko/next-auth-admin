import { initContract } from '@ts-rest/core';

import { registrationContract } from './registration.contract';
import { userContract } from './user.contract';

const c = initContract();

/** Domain API contract root. Stage G will nest `admin` here. */
export const contract = c.router({
  users: userContract,
  registration: registrationContract,
});

export type AppContract = typeof contract;

export { userContract } from './user.contract';
export type { UserContract } from './user.contract';
export { registrationContract } from './registration.contract';
export type { RegistrationContract } from './registration.contract';
export { userMeSchema, roleSchema } from './schemas/user';
export type { UserMe, Role } from './schemas/user';
export {
  badRequestResponse,
  unauthorizedResponse,
  internalServerErrorResponse,
} from './schemas/error';
