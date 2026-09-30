'use client';

import { useTranslations } from 'next-intl';

import type { UserMe } from '@/shared/api';
import { Button } from '@/shared/ui/button';
import { UserAvatar } from '@/shared/ui/user-avatar';

import { useAvatarSettings } from '../hooks/use-avatar-settings';

type AvatarEditorProps = {
  initialUser: UserMe;
};

export function AvatarEditor({ initialUser }: AvatarEditorProps) {
  const t = useTranslations('profile.avatar');
  const {
    user,
    fileInputRef,
    accept,
    isPending,
    isUploading,
    isRemoving,
    openFilePicker,
    handleFileChange,
    handleDelete,
  } = useAvatarSettings({ initialUser });

  const displayUser = user ?? initialUser;

  return (
    <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
      <UserAvatar
        name={displayUser.name}
        email={displayUser.email}
        avatarUrl={displayUser.image}
        size="lg"
      />
      <div className="flex flex-wrap gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          className="sr-only"
          onChange={(event) => {
            void handleFileChange(event);
          }}
        />
        <Button
          type="button"
          variant="outline"
          aria-busy={isUploading}
          disabled={isPending}
          onClick={openFilePicker}
        >
          {isUploading ? t('uploading') : t('changePhoto')}
        </Button>
        {displayUser.hasManagedAvatar ? (
          <Button
            type="button"
            variant="destructive"
            disabled={isPending}
            onClick={() => {
              void handleDelete();
            }}
          >
            {isRemoving ? t('removing') : t('removePhoto')}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
