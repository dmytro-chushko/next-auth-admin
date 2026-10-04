'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

import {
  type ModalName,
  type ModalPayloads,
} from '@/features/modals/model/modal.types';

type ModalState = {
  [K in ModalName]?: { isOpen: boolean; payload?: ModalPayloads[K] };
};

type ModalContextValue = {
  modals: ModalState;
  openModal: <K extends ModalName>(name: K, payload?: ModalPayloads[K]) => void;
  closeModal: (name: ModalName) => void;
};

const ModalContext = createContext<ModalContextValue | null>(null);

export function useModalContext() {
  const ctx = useContext(ModalContext);

  if (!ctx) {
    throw new Error('useModal must be used within ModalProvider');
  }

  return ctx;
}

export function ModalContextProvider({ children }: { children: ReactNode }) {
  const [modals, setModals] = useState<ModalState>({});

  const openModal = <K extends ModalName>(
    name: K,
    payload?: ModalPayloads[K],
  ) => {
    setModals((prev) => ({ ...prev, [name]: { isOpen: true, payload } }));
  };

  const closeModal = (name: ModalName) => {
    setModals((prev) => ({
      ...prev,
      [name]: { ...prev[name], isOpen: false },
    }));
  };

  return (
    <ModalContext.Provider value={{ modals, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
}
