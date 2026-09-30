import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from 'react';

import { cn } from '@/shared/lib/utils';

type ProfileSettingsSectionProps = ComponentPropsWithoutRef<'section'> & {
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
  children: ReactNode;
};

export const ProfileSettingsSection = forwardRef<
  HTMLElement,
  ProfileSettingsSectionProps
>(function ProfileSettingsSection(
  { title, description, variant = 'default', className, children, ...props },
  ref,
) {
  const isDestructive = variant === 'destructive';

  return (
    <section
      ref={ref}
      className={cn(
        'grid gap-6 py-8 md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]',
        isDestructive &&
          'bg-card border-destructive/40 rounded-xl border p-6 shadow-sm',
        className,
      )}
      {...props}
    >
      <div className="space-y-1.5">
        <h2
          className={cn(
            'text-lg leading-none font-semibold',
            isDestructive && 'text-destructive',
          )}
        >
          {title}
        </h2>
        {description ? (
          <p className="text-muted-foreground text-sm">{description}</p>
        ) : null}
      </div>
      <div className="min-w-0">{children}</div>
    </section>
  );
});
