'use client';

import { AuthNavActions } from '@/features/auth';
import type { UserMe } from '@/shared/api';

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
  return (
    <div className="bg-background/80 border-border flex h-14 items-center justify-between gap-4 border-b px-4 backdrop-blur-md sm:px-6">
      <p className="text-foreground truncate text-sm font-semibold tracking-tight sm:text-base">
        {title}
      </p>
      <div className="flex shrink-0 items-center gap-2">
        <AuthNavActions initialUser={initialUser} />
        <HeaderActionsPanel
          layout="row"
          themeLabels={themeLabels}
          className="hidden md:flex"
        />
        <MobileHeaderSheet
          themeLabels={themeLabels}
          mobileMenuLabels={mobileMenuLabels}
          sectionLabels={sectionLabels}
        />
      </div>
    </div>
  );
}
