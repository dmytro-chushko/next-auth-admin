'use client';

import { useTranslations } from 'next-intl';

import { Button } from '@/shared/ui/button';

import { useAvatarSettings } from '../hooks/use-avatar-settings';

export function AvatarSettingsCard() {
  const t = useTranslations('dashboard.avatar');
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
  } = useAvatarSettings();

  return (
    <section className="border-border flex flex-col gap-4 rounded-lg border p-4">
      <div className="space-y-1">
        <h2 className="text-lg font-medium tracking-tight">{t('title')}</h2>
        <p className="text-muted-foreground text-sm">{t('subtitle')}</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="bg-muted relative size-16 overflow-hidden rounded-full">
          {user?.image ? (
            // eslint-disable-next-line @next/next/no-img-element -- remote OAuth/Supabase URLs
            <img
              src={user.image}
              alt={t('imageAlt', { name: user.name })}
              className="size-full object-cover"
            />
          ) : (
            <div className="text-muted-foreground flex size-full items-center justify-center text-sm font-medium">
              {(user?.name?.charAt(0) ?? '?').toUpperCase()}
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            className="sr-only"
            onChange={handleFileChange}
          />
          <Button
            type="button"
            size="sm"
            disabled={isPending}
            onClick={openFilePicker}
          >
            {isUploading ? t('uploading') : t('upload')}
          </Button>
          {user?.hasManagedAvatar ? (
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={isPending}
              onClick={handleDelete}
            >
              {isRemoving ? t('removing') : t('remove')}
            </Button>
          ) : null}
        </div>
      </div>
    </section>
  );
}
