'use client';

import { LocaleSwitcher } from '@/features/locale-switcher';
import { ThemeModeToggle } from '@/features/theme-toggle';
import { cn } from '@/shared/lib/utils';

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
};

type HeaderActionsPanelProps = {
  layout: 'row' | 'stack';
  themeLabels: ThemeLabels;
  sectionLabels?: SectionLabels;
  onNavigate?: () => void;
  className?: string;
};

export function HeaderActionsPanel({
  layout,
  themeLabels,
  sectionLabels,
  onNavigate,
  className,
}: HeaderActionsPanelProps) {
  if (layout === 'row') {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <ThemeModeToggle {...themeLabels} />
        <LocaleSwitcher size="sm" onLocaleChange={onNavigate} />
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
          <LocaleSwitcher fullWidth size="sm" onLocaleChange={onNavigate} />
        </div>
      </div>
    </div>
  );
}
