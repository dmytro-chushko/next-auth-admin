import { DEFAULT_ADMIN_USERS_LIST_QUERY } from '@/entities/admin';
import {
  ADMIN_USERS_PAGE_SIZE_MAX,
  ADMIN_USERS_SEARCH_MAX_LENGTH,
  type AdminUsersListQuery,
} from '@/shared/api';

type SearchParamsReader = {
  get(name: string): string | null;
};

/** Changing any of these resets pagination back to the first page. */
const FILTER_PATCH_KEYS = [
  'search',
  'role',
  'verified',
  'sortBy',
  'sortOrder',
] as const satisfies ReadonlyArray<keyof AdminUsersListQuery>;

function parsePositiveInt(
  value: string | null,
  fallback: number,
  max?: number,
): number {
  if (value === null || value === '') {
    return fallback;
  }

  const parsed = Number.parseInt(value, 10);

  if (!Number.isFinite(parsed) || parsed < 1) {
    return fallback;
  }

  if (max !== undefined && parsed > max) {
    return max;
  }

  return parsed;
}

function parseRole(
  value: string | null,
): AdminUsersListQuery['role'] | undefined {
  if (value === 'user' || value === 'admin') {
    return value;
  }

  return undefined;
}

function parseVerified(value: string | null): boolean | undefined {
  if (value === 'true') {
    return true;
  }

  if (value === 'false') {
    return false;
  }

  return undefined;
}

function parseSortBy(
  value: string | null,
): AdminUsersListQuery['sortBy'] | undefined {
  if (value === 'createdAt' || value === 'email') {
    return value;
  }

  return undefined;
}

function parseSortOrder(
  value: string | null,
): AdminUsersListQuery['sortOrder'] | undefined {
  if (value === 'asc' || value === 'desc') {
    return value;
  }

  return undefined;
}

function normalizeSearch(value: string | null): string | undefined {
  if (value === null) {
    return undefined;
  }

  const trimmed = value.trim().slice(0, ADMIN_USERS_SEARCH_MAX_LENGTH);

  return trimmed.length > 0 ? trimmed : undefined;
}

/**
 * Parses URL search params into an admin users list query.
 * Invalid values fall back to defaults instead of throwing.
 */
export function parseAdminUsersListParams(
  searchParams: SearchParamsReader,
): AdminUsersListQuery {
  return {
    page: parsePositiveInt(
      searchParams.get('page'),
      DEFAULT_ADMIN_USERS_LIST_QUERY.page,
    ),
    pageSize: parsePositiveInt(
      searchParams.get('pageSize'),
      DEFAULT_ADMIN_USERS_LIST_QUERY.pageSize,
      ADMIN_USERS_PAGE_SIZE_MAX,
    ),
    search: normalizeSearch(searchParams.get('search')),
    role: parseRole(searchParams.get('role')),
    verified: parseVerified(searchParams.get('verified')),
    sortBy:
      parseSortBy(searchParams.get('sortBy')) ??
      DEFAULT_ADMIN_USERS_LIST_QUERY.sortBy,
    sortOrder:
      parseSortOrder(searchParams.get('sortOrder')) ??
      DEFAULT_ADMIN_USERS_LIST_QUERY.sortOrder,
  };
}

/**
 * Serializes an admin users list query to URL search params.
 * Omits keys that match defaults to keep URLs short.
 */
export function serializeAdminUsersListParams(
  query: AdminUsersListQuery,
): URLSearchParams {
  const params = new URLSearchParams();

  if (query.page !== DEFAULT_ADMIN_USERS_LIST_QUERY.page) {
    params.set('page', String(query.page));
  }

  if (query.pageSize !== DEFAULT_ADMIN_USERS_LIST_QUERY.pageSize) {
    params.set('pageSize', String(query.pageSize));
  }

  if (query.search !== undefined) {
    params.set('search', query.search);
  }

  if (query.role !== undefined) {
    params.set('role', query.role);
  }

  if (query.verified !== undefined) {
    params.set('verified', query.verified ? 'true' : 'false');
  }

  if (query.sortBy !== DEFAULT_ADMIN_USERS_LIST_QUERY.sortBy) {
    params.set('sortBy', query.sortBy);
  }

  if (query.sortOrder !== DEFAULT_ADMIN_USERS_LIST_QUERY.sortOrder) {
    params.set('sortOrder', query.sortOrder);
  }

  return params;
}

/**
 * Applies a partial update to the current query.
 * Filter and sort changes reset page to 1.
 */
export function patchAdminUsersListParams(
  current: AdminUsersListQuery,
  patch: Partial<AdminUsersListQuery>,
): AdminUsersListQuery {
  const next: AdminUsersListQuery = { ...current, ...patch };

  if (
    patch.page === undefined &&
    FILTER_PATCH_KEYS.some((key) => key in patch)
  ) {
    next.page = DEFAULT_ADMIN_USERS_LIST_QUERY.page;
  }

  if (next.search !== undefined) {
    next.search = normalizeSearch(next.search);
  }

  return next;
}
