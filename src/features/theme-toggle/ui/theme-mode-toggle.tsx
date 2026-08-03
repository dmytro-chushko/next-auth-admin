'use client';

import { useTheme } from '@teispace/next-themes';
import { Monitor, Moon, Sun } from 'lucide-react';

import { Button } from '@/shared/ui/button';

type ThemeModeToggleProps = {
  darkLabel: string;
  lightLabel: string;
  systemLabel: string;
  ariaLabel: string;
};

export function ThemeModeToggle({
  darkLabel,
  lightLabel,
  systemLabel,
  ariaLabel,
}: ThemeModeToggleProps) {
  const { theme, setTheme } = useTheme();
  const modes = [
    { id: 'light' as const, icon: Sun, label: lightLabel },
    { id: 'dark' as const, icon: Moon, label: darkLabel },
    { id: 'system' as const, icon: Monitor, label: systemLabel },
  ];

  return (
    <div
      className="bg-muted/30 border-border flex items-center gap-1 rounded-md border p-1"
      role="group"
      aria-label={ariaLabel}
    >
      {modes.map(({ id, icon: Icon, label }) => (
        <Button
          key={id}
          type="button"
          variant={theme === id ? 'secondary' : 'ghost'}
          size="icon-sm"
          className="size-8"
          aria-label={label}
          aria-pressed={theme === id}
          onClick={() => setTheme(id)}
        >
          <Icon className="size-4" />
        </Button>
      ))}
    </div>
  );
}
