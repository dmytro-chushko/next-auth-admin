import {
  rowPaginationFeature,
  rowSortingFeature,
  tableFeatures,
} from '@tanstack/react-table';

/**
 * Sorting and pagination are server-driven, so no row-model factories are
 * registered — the table only mirrors the current query state.
 */
export const adminUsersTableFeatures = tableFeatures({
  rowSortingFeature,
  rowPaginationFeature,
});

export type AdminUsersTableFeatures = typeof adminUsersTableFeatures;
