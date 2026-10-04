'use client';

import { useTranslations } from 'next-intl';

import { PROFILE_DELETION_FORM_ID } from '@/features/modals/constants/profile-deletion-form-id';
import { useProfileDeleteAccountForm } from '@/features/profile/hooks/use-profile-delete-account-form';
import { ProfileDeleteAccountFormFields } from '@/features/profile/ui/profile-delete-account-form-fields';
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

function ProfileDeletionModalContent({
  email,
  hasPassword,
  onClose,
}: {
  email: string;
  hasPassword: boolean;
  onClose: () => void;
}) {
  const t = useTranslations('profile.dangerZone');
  const tProfile = useTranslations('profile');
  const { form, handleSubmit, isPending } = useProfileDeleteAccountForm({
    email,
    hasPassword,
    onSuccess: onClose,
  });

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{t('dialogTitle')}</AlertDialogTitle>
        <AlertDialogDescription asChild>
          <div className="text-muted-foreground space-y-4 text-sm">
            <p>{t('dialogDescription')}</p>
            <p className="text-foreground font-medium">{email}</p>
          </div>
        </AlertDialogDescription>
      </AlertDialogHeader>
      <Form {...form}>
        <form
          id={PROFILE_DELETION_FORM_ID}
          className="space-y-4"
          onSubmit={handleSubmit}
          noValidate
        >
          <ProfileDeleteAccountFormFields
            form={form}
            email={email}
            hasPassword={hasPassword}
          />
        </form>
      </Form>
      <AlertDialogFooter>
        <AlertDialogCancel disabled={isPending}>
          {tProfile('cancel')}
        </AlertDialogCancel>
        <Button
          form={PROFILE_DELETION_FORM_ID}
          type="submit"
          variant="destructive"
          disabled={isPending}
          aria-busy={isPending}
        >
          {isPending ? t('deleting') : t('confirmDelete')}
        </Button>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
}

export function ProfileDeletionModal() {
  const { isOpen, payload, close } = useModal('profile-deletion');

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
        <ProfileDeletionModalContent
          email={payload.email}
          hasPassword={payload.hasPassword}
          onClose={close}
        />
      ) : null}
    </AlertDialog>
  );
}
