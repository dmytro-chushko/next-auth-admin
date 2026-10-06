'use client';

import type { UserMe } from '@/shared/api';
import { SidebarTrigger, useSidebar } from '@/shared/ui/sidebar';

import { HeaderActionsPanel } from './header-actions-panel';
import { MobileHeaderSheet } from './mobile-header-sheet';

type ThemeLabels = {
  darkLabel: string;
  lightLabel: string;
  systemLabel: string;
  ariaLabel: string;
};

type MobileMenuLabels = {
  closeLabel: string;
  openAriaLabel: string;
  title: string;
};

type SectionLabels = {
  theme: string;
  locale: string;
  account: string;
};

type AppHeaderBarProps = {
  title: string;
  initialUser: UserMe | null;
  themeLabels: ThemeLabels;
  mobileMenuLabels: MobileMenuLabels;
  sectionLabels: SectionLabels;
};

export function AppHeaderBar({
  title,
  initialUser,
  themeLabels,
  mobileMenuLabels,
  sectionLabels,
}: AppHeaderBarProps) {
  const { isSidebarDisabled, isMobile } = useSidebar();

  return (
    <div className="bg-background/80 border-border flex h-(--header-height) items-center justify-between gap-4 border-b px-4 backdrop-blur-md sm:px-6">
      <div className="flex min-w-0 flex-1 items-center gap-2">
        {!isSidebarDisabled && isMobile ? (
          <SidebarTrigger className="-ml-1" />
        ) : null}
        <span className="text-foreground min-w-0 flex-1 truncate text-sm font-medium">
          {title}
        </span>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <HeaderActionsPanel
          layout="row"
          themeLabels={themeLabels}
          initialUser={initialUser}
          className="hidden md:flex"
        />
        <MobileHeaderSheet
          themeLabels={themeLabels}
          mobileMenuLabels={mobileMenuLabels}
          sectionLabels={sectionLabels}
          initialUser={initialUser}
        />
      </div>
    </div>
  );
}
