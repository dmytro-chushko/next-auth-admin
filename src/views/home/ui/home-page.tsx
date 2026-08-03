import { useTranslations } from 'next-intl';

export function HomePage() {
  const t = useTranslations('home');

  return (
    <section className="mx-auto flex w-full max-w-3xl flex-col gap-3 px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight text-balance">
        {t('title')}
      </h1>
      <p className="text-muted-foreground text-base text-pretty">
        {t('subtitle')}
      </p>
    </section>
  );
}
