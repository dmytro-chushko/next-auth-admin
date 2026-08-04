'use client';

import { useState } from 'react';

import { usePathname } from '@/i18n/navigation';

export function useMobileHeaderSheet() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [pathnameWhenOpen, setPathnameWhenOpen] = useState(pathname);

  if (pathname !== pathnameWhenOpen) {
    setPathnameWhenOpen(pathname);
    setOpen(false);
  }

  return { open, setOpen };
}
