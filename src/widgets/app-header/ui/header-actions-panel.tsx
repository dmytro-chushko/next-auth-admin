'use client';

import { useId } from 'react';

import { AuthHeaderAction } from '@/features/auth';
import { LocaleSwitcher } from '@/features/locale-switcher';
import { ThemeModeToggle } from '@/features/theme-toggle';
import { usePathname } from '@/i18n/navigation';
import type { UserMe } from '@/shared/api';
import { isPublicAuthPath } from '@/shared/auth/auth-routes';
import { cn } from '@/shared/lib/utils';
import { Separator } from '@/shared/ui/separator';

const sectionLabelClassName = 'text-muted-foreground text-sm font-medium';

type ThemeLabels = {
  darkLabel: string;
  lightLabel: string;
  systemLabel: string;
  ariaLabel: string;
};

type SectionLabels = {
  theme: string;
  locale: string;
  account: string;
};

type HeaderActionsPanelProps = {
  layout: 'row' | 'stack';
  themeLabels: ThemeLabels;
  sectionLabels?: SectionLabels;
  initialUser?: UserMe | null;
  onNavigate?: () => void;
  className?: string;
};

export function HeaderActionsPanel({
  layout,
  themeLabels,
  sectionLabels,
  initialUser = null,
  onNavigate,
  className,
}: HeaderActionsPanelProps) {
  const accountLabelId = useId();
  const pathname = usePathname();
  const showAccountSection = !isPublicAuthPath(pathname);
  const authPresentation = layout === 'stack' ? 'flat-list' : 'dropdown';

  if (layout === 'row') {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <ThemeModeToggle {...themeLabels} />
        <LocaleSwitcher size="lg" onLocaleChange={onNavigate} />
        {showAccountSection ? (
          <AuthHeaderAction
            initialUser={initialUser}
            presentation={authPresentation}
            onNavigate={onNavigate}
          />
        ) : null}
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="flex flex-col gap-4 px-4 pb-4">
        <div className="flex flex-col gap-2">
          {sectionLabels ? (
            <p className={sectionLabelClassName} aria-hidden="true">
              {sectionLabels.theme}
            </p>
          ) : null}
          <ThemeModeToggle {...themeLabels} />
        </div>

        <div className="flex w-full flex-col gap-2">
          {sectionLabels ? (
            <p className={sectionLabelClassName} aria-hidden="true">
              {sectionLabels.locale}
            </p>
          ) : null}
          <LocaleSwitcher fullWidth size="lg" onLocaleChange={onNavigate} />
        </div>

        {showAccountSection ? (
          <>
            <Separator decorative />
            <div
              role="group"
              {...(sectionLabels?.account
                ? { 'aria-labelledby': accountLabelId }
                : {})}
              className="flex flex-col gap-2"
            >
              {sectionLabels ? (
                <p id={accountLabelId} className={sectionLabelClassName}>
                  {sectionLabels.account}
                </p>
              ) : null}
              <AuthHeaderAction
                initialUser={initialUser}
                presentation={authPresentation}
                onNavigate={onNavigate}
              />
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
