'use client';

import { useTranslations } from 'next-intl';

import { useAdminUserDeleteForm } from '@/features/admin/hooks/use-admin-user-delete-form';
import { AdminUserDeleteFormFields } from '@/features/admin/ui/user-detail/admin-user-delete-form-fields';
import { ADMIN_USER_DELETION_FORM_ID } from '@/features/modals/constants/admin-user-deletion-form-id';
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
import { Form } from '@/shared/ui/form';

function AdminUserDeletionModalContent({
  userId,
  email,
  onClose,
}: {
  userId: string;
  email: string;
  onClose: () => void;
}) {
  const t = useTranslations('admin.actions');
  const { form, handleSubmit, isPending } = useAdminUserDeleteForm({
    userId,
    email,
    onSuccess: onClose,
  });

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{t('deleteConfirmTitle')}</AlertDialogTitle>
        <AlertDialogDescription asChild>
          <div className="text-muted-foreground space-y-4 text-sm">
            <p>{t('deleteConfirmDescription')}</p>
            <p className="text-foreground font-medium">{email}</p>
          </div>
        </AlertDialogDescription>
      </AlertDialogHeader>
      <Form {...form}>
        <form
          id={ADMIN_USER_DELETION_FORM_ID}
          className="space-y-4"
          onSubmit={handleSubmit}
          noValidate
        >
          <AdminUserDeleteFormFields form={form} email={email} />
        </form>
      </Form>
      <AlertDialogFooter>
        <AlertDialogCancel disabled={isPending}>
          {t('cancel')}
        </AlertDialogCancel>
        <Button
          form={ADMIN_USER_DELETION_FORM_ID}
          type="submit"
          variant="destructive"
          disabled={isPending}
          aria-busy={isPending}
        >
          {isPending ? t('deletingUser') : t('deleteUser')}
        </Button>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
}

export function AdminUserDeletionModal() {
  const { isOpen, payload, close } = useModal('admin-user-deletion');

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
        <AdminUserDeletionModalContent
          userId={payload.userId}
          email={payload.email}
          onClose={close}
        />
      ) : null}
    </AlertDialog>
  );
}
