import { initClient } from '@ts-rest/core';

import { contract } from './contracts';
import { getApiBaseUrl } from './get-api-base-url';

export const apiClient = initClient(contract, {
  baseUrl: getApiBaseUrl(),
  baseHeaders: {
    'Content-Type': 'application/json',
  },
  credentials: 'include',
  validateResponse: true,
});
