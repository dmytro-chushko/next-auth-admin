'use client';

import { useTranslations } from 'next-intl';
import { useRef, useState, type ChangeEvent, type RefObject } from 'react';
import { toast } from 'sonner';

import {
  useCurrentUserQuery,
  useDeleteAvatarMutation,
  useUploadAvatarMutation,
} from '@/entities/user';
import type { UserMe } from '@/shared/api';
import { ApiRequestError } from '@/shared/api';
import {
  AVATAR_ALLOWED_CONTENT_TYPES,
  AVATAR_MAX_BYTES,
  type AvatarContentType,
} from '@/shared/storage/storage.constants';

function isAvatarContentType(value: string): value is AvatarContentType {
  return (AVATAR_ALLOWED_CONTENT_TYPES as readonly string[]).includes(value);
}

type UseAvatarSettingsResult = {
  user: UserMe | null | undefined;
  fileInputRef: RefObject<HTMLInputElement | null>;
  accept: string;
  isPending: boolean;
  isUploading: boolean;
  isRemoving: boolean;
  openFilePicker: () => void;
  handleFileChange: (event: ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleDelete: () => Promise<void>;
};

export function useAvatarSettings(): UseAvatarSettingsResult {
  const t = useTranslations('dashboard.avatar');
  const tCommon = useTranslations('auth.common');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const { data: user } = useCurrentUserQuery();
  const uploadMutation = useUploadAvatarMutation();
  const deleteMutation = useDeleteAvatarMutation();

  const isPending =
    isUploading || uploadMutation.isPending || deleteMutation.isPending;

  function openFilePicker() {
    fileInputRef.current?.click();
  }

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) {
      return;
    }

    if (!isAvatarContentType(file.type)) {
      toast.error(t('invalidType'));

      return;
    }

    if (file.size > AVATAR_MAX_BYTES) {
      toast.error(t('tooLarge'));

      return;
    }

    setIsUploading(true);

    try {
      await uploadMutation.mutateAsync({
        file,
        contentType: file.type,
      });
      toast.success(t('uploadSuccess'));
    } catch (error: unknown) {
      const message =
        error instanceof ApiRequestError
          ? error.message
          : tCommon('unknownError');
      toast.error(message);
    } finally {
      setIsUploading(false);
    }
  }

  async function handleDelete() {
    try {
      await deleteMutation.mutateAsync();
      toast.success(t('deleteSuccess'));
    } catch (error: unknown) {
      const message =
        error instanceof ApiRequestError
          ? error.message
          : tCommon('unknownError');
      toast.error(message);
    }
  }

  return {
    user,
    fileInputRef,
    accept: AVATAR_ALLOWED_CONTENT_TYPES.join(','),
    isPending,
    isUploading,
    isRemoving: deleteMutation.isPending,
    openFilePicker,
    handleFileChange,
    handleDelete,
  };
}
