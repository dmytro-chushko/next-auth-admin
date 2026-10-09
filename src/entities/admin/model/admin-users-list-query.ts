import {
  ADMIN_USERS_PAGE_SIZE_DEFAULT,
  type AdminUsersListQuery,
} from '@/shared/api';

export const DEFAULT_ADMIN_USERS_LIST_QUERY: AdminUsersListQuery = {
  page: 1,
  pageSize: ADMIN_USERS_PAGE_SIZE_DEFAULT,
  sortBy: 'createdAt',
  sortOrder: 'desc',
};
