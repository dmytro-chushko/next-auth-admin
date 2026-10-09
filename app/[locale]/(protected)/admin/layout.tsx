import type { ReactNode } from 'react';

import { requireAdmin } from '@/shared/auth/session';
import { AppSidebar } from '@/shared/shell/ui/app-sidebar';
import { SidebarInset } from '@/shared/ui/sidebar';

type AdminLayoutProps = {
  children: ReactNode;
};

/**
 * Uses the locale-level SidebarProvider only.
 * A nested SidebarProvider here would make the header trigger toggle a
 * different openMobile than AppSidebar's Sheet.
 *
 * Horizontal flex is required so the desktop sidebar gap pushes SidebarInset
 * instead of the fixed sidebar covering page content.
 */
export default async function AdminLayout({ children }: AdminLayoutProps) {
  await requireAdmin();

  return (
    <div className="flex min-h-0 w-full flex-1">
      <AppSidebar scope="admin" />
      <SidebarInset className="mx-auto w-full max-w-7xl px-6 py-8">
        {children}
      </SidebarInset>
    </div>
  );
}
