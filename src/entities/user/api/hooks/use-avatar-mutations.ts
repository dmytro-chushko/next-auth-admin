'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  apiClient,
  ApiRequestError,
  getApiErrorMessage,
  type UserMe,
} from '@/shared/api';
import type { AvatarContentType } from '@/shared/storage/storage.constants';

import { currentUserQueryKey } from '../keys/current-user-query-key';

type UploadAvatarInput = {
  file: File;
  contentType: AvatarContentType;
};

async function uploadAvatarFile({
  file,
  contentType,
}: UploadAvatarInput): Promise<UserMe> {
  const intent = await apiClient.users.avatarUploadIntent({
    body: {
      contentType,
      contentLength: file.size,
    },
  });

  if (intent.status !== 200) {
    throw new ApiRequestError(
      intent.status,
      getApiErrorMessage(intent.status, intent.body),
    );
  }

  const uploadResponse = await fetch(intent.body.uploadUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': contentType,
    },
    body: file,
  });

  if (!uploadResponse.ok) {
    throw new ApiRequestError(
      uploadResponse.status,
      'Failed to upload avatar file.',
    );
  }

  const confirmed = await apiClient.users.avatarConfirm({
    body: {
      path: intent.body.path,
      confirmToken: intent.body.confirmToken,
    },
  });

  if (confirmed.status !== 200) {
    throw new ApiRequestError(
      confirmed.status,
      getApiErrorMessage(confirmed.status, confirmed.body),
    );
  }

  return confirmed.body;
}

export function useUploadAvatarMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadAvatarFile,
    onSuccess: (user) => {
      queryClient.setQueryData(currentUserQueryKey, user);
    },
  });
}

export function useDeleteAvatarMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (): Promise<UserMe> => {
      const result = await apiClient.users.avatarDelete({
        body: {},
      });

      if (result.status !== 200) {
        throw new ApiRequestError(
          result.status,
          getApiErrorMessage(result.status, result.body),
        );
      }

      return result.body;
    },
    onSuccess: (user) => {
      queryClient.setQueryData(currentUserQueryKey, user);
    },
  });
}
