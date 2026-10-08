'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'sonner';

import { useAdminUpdateRoleMutation } from '@/entities/admin';
import { mapAdminUsersApiError } from '@/features/admin/lib/map-admin-users-api-error';
import type { AdminUserDetail, Role } from '@/shared/api';
import { Button } from '@/shared/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';

type AdminUserRoleFormProps = {
  user: AdminUserDetail;
  isSelf: boolean;
};

const ROLE_SELECT_ID = 'admin-user-role';

export function AdminUserRoleForm({ user, isSelf }: AdminUserRoleFormProps) {
  const t = useTranslations('admin.actions');
  const tUsers = useTranslations('admin.users');
  const tErrors = useTranslations('admin.errors');
  const updateRoleMutation = useAdminUpdateRoleMutation();
  // `null` means "follow the saved role", so refetches never fight local edits.
  const [draftRole, setDraftRole] = useState<Role | null>(null);
  const selectedRole = draftRole ?? user.role;
  const hasChanges = selectedRole !== user.role;
  const isPending = updateRoleMutation.isPending;

  if (isSelf) {
    return (
      <p className="text-muted-foreground text-sm">
        {tErrors('cannotChangeOwnRole')}
      </p>
    );
  }

  const handleSave = async () => {
    if (!hasChanges) {
      return;
    }

    try {
      await updateRoleMutation.mutateAsync({
        userId: user.id,
        role: selectedRole,
      });
      setDraftRole(null);
      toast.success(t('roleUpdateSuccess'));
    } catch (error: unknown) {
      toast.error(mapAdminUsersApiError(error, tErrors));
    }
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
      <div className="space-y-2">
        <label htmlFor={ROLE_SELECT_ID} className="text-sm font-medium">
          {t('changeRole')}
        </label>
        <Select
          value={selectedRole}
          onValueChange={(value) => {
            setDraftRole(value as Role);
          }}
          disabled={isPending}
        >
          <SelectTrigger
            id={ROLE_SELECT_ID}
            aria-label={t('changeRole')}
            className="w-full sm:w-[11rem]"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="user">{tUsers('roleUser')}</SelectItem>
            <SelectItem value="admin">{tUsers('roleAdmin')}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button
        type="button"
        className="w-full sm:w-auto"
        disabled={!hasChanges || isPending}
        aria-busy={isPending}
        onClick={() => {
          void handleSave();
        }}
      >
        {isPending ? t('savingRole') : t('saveRole')}
      </Button>
    </div>
  );
}
