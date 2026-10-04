'use client';

import type { ReactNode } from 'react';

import { ProfileDeletionModal } from '@/features/modals/ui/profile-deletion-modal';
import { ModalContextProvider } from '@/shared/modal/modal-context';

export function ModalProvider({ children }: { children: ReactNode }) {
  return (
    <ModalContextProvider>
      {children}
      <ProfileDeletionModal />
    </ModalContextProvider>
  );
}
