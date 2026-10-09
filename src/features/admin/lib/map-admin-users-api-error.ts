import { ADMIN_USERS_ERROR_MESSAGES, ApiRequestError } from '@/shared/api';

type AdminUsersErrorKey =
  | 'cannotChangeOwnRole'
  | 'cannotDemoteLastAdmin'
  | 'cannotDeleteSelf'
  | 'cannotDeleteLastAdmin'
  | 'generic';

type AdminUsersErrorTranslator = (key: AdminUsersErrorKey) => string;

const MESSAGE_KEYS: Record<string, Exclude<AdminUsersErrorKey, 'generic'>> = {
  [ADMIN_USERS_ERROR_MESSAGES.CANNOT_CHANGE_OWN_ROLE]: 'cannotChangeOwnRole',
  [ADMIN_USERS_ERROR_MESSAGES.CANNOT_DEMOTE_LAST_ADMIN]:
    'cannotDemoteLastAdmin',
  [ADMIN_USERS_ERROR_MESSAGES.CANNOT_DELETE_SELF]: 'cannotDeleteSelf',
  [ADMIN_USERS_ERROR_MESSAGES.CANNOT_DELETE_LAST_ADMIN]:
    'cannotDeleteLastAdmin',
};

/** Turns an admin API failure into a localized message. */
export function mapAdminUsersApiError(
  error: unknown,
  t: AdminUsersErrorTranslator,
): string {
  if (error instanceof ApiRequestError) {
    const key = MESSAGE_KEYS[error.message];

    return key ? t(key) : t('generic');
  }

  return t('generic');
}
