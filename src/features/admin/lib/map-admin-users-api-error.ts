import { ADMIN_USERS_ERROR_MESSAGES, ApiRequestError } from '@/shared/api';

type AdminUsersErrorTranslator = (
  key: 'cannotChangeOwnRole' | 'cannotDemoteLastAdmin' | 'generic',
) => string;

const MESSAGE_KEYS: Record<
  string,
  'cannotChangeOwnRole' | 'cannotDemoteLastAdmin'
> = {
  [ADMIN_USERS_ERROR_MESSAGES.CANNOT_CHANGE_OWN_ROLE]: 'cannotChangeOwnRole',
  [ADMIN_USERS_ERROR_MESSAGES.CANNOT_DEMOTE_LAST_ADMIN]:
    'cannotDemoteLastAdmin',
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
