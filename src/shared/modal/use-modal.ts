'use client';

import {
  type ModalName,
  type ModalPayloads,
} from '@/features/modals/model/modal.types';

import { useModalContext } from './modal-context';

export function useModal<K extends ModalName = ModalName>(name?: K) {
  const { modals, openModal, closeModal } = useModalContext();

  const isOpen = name ? (modals[name]?.isOpen ?? false) : false;
  const payload = name
    ? (modals[name]?.payload as ModalPayloads[K] | undefined)
    : undefined;

  return {
    open: <T extends ModalName>(n: T, payload?: ModalPayloads[T]) =>
      openModal(n, payload),
    close: (n?: ModalName) => {
      const modalName = n ?? name;

      if (modalName) {
        closeModal(modalName);
      }
    },
    isOpen,
    payload,
  };
}
