'use client';

import { useLocale, useTranslations } from 'next-intl';

import { usePathname, useRouter } from '@/i18n/navigation';
import { type Locale, locales } from '@/shared/lib/get-messages';
import { cn } from '@/shared/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';

type LocaleSwitcherProps = {
  className?: string;
  size?: 'sm' | 'default';
};

function getLocaleLabel(
  locale: Locale,
  translate: (key: 'localeEn' | 'localeUk') => string,
): string {
  return locale === 'uk' ? translate('localeUk') : translate('localeEn');
}

export function LocaleSwitcher({
  className,
  size = 'default',
}: LocaleSwitcherProps) {
  const pathname = usePathname();
  const router = useRouter();
  const activeLocale = useLocale() as Locale;
  const t = useTranslations('header');

  const handleValueChange = (nextLocale: string) => {
    const targetLocale = nextLocale as Locale;

    if (targetLocale === activeLocale) {
      return;
    }

    router.replace(pathname, { locale: targetLocale, scroll: false });
  };

  return (
    <Select value={activeLocale} onValueChange={handleValueChange}>
      <SelectTrigger
        size={size}
        aria-label={t('localeSwitcherLabel')}
        className={cn('bg-muted/30 w-17 shrink-0 px-2', className)}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent position="popper" align="end" sideOffset={6}>
        {locales.map((target) => (
          <SelectItem key={target} value={target} lang={target}>
            {getLocaleLabel(target, t)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
