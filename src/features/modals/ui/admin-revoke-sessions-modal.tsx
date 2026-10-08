'use client';

import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { useAdminRevokeSessionsMutation } from '@/entities/admin';
import { mapAdminUsersApiError } from '@/features/admin/lib/map-admin-users-api-error';
import { useModal } from '@/shared/modal/use-modal';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/ui/alert-dialog';
import { Button } from '@/shared/ui/button';

function AdminRevokeSessionsModalContent({
  userId,
  email,
  onClose,
}: {
  userId: string;
  email: string;
  onClose: () => void;
}) {
  const t = useTranslations('admin.actions');
  const tErrors = useTranslations('admin.errors');
  const revokeSessionsMutation = useAdminRevokeSessionsMutation();
  const isPending = revokeSessionsMutation.isPending;

  const handleConfirm = async () => {
    try {
      await revokeSessionsMutation.mutateAsync({ userId });
      toast.success(t('revokeSessionsSuccess'));
      onClose();
    } catch (error: unknown) {
      toast.error(mapAdminUsersApiError(error, tErrors));
    }
  };

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{t('revokeSessionsDialogTitle')}</AlertDialogTitle>
        <AlertDialogDescription asChild>
          <div className="text-muted-foreground space-y-4 text-sm">
            <p>{t('revokeSessionsDialogDescription')}</p>
            <p className="text-foreground font-medium">{email}</p>
          </div>
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel disabled={isPending}>
          {t('cancel')}
        </AlertDialogCancel>
        <Button
          type="button"
          variant="destructive"
          disabled={isPending}
          aria-busy={isPending}
          onClick={() => {
            void handleConfirm();
          }}
        >
          {isPending ? t('revokeSessionsPending') : t('revokeSessionsConfirm')}
        </Button>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
}

export function AdminRevokeSessionsModal() {
  const { isOpen, payload, close } = useModal('admin-revoke-sessions');

  return (
    <AlertDialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          close();
        }
      }}
    >
      {isOpen && payload ? (
        <AdminRevokeSessionsModalContent
          userId={payload.userId}
          email={payload.email}
          onClose={close}
        />
      ) : null}
    </AlertDialog>
  );
}
