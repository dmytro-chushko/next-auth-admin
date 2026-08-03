import type { ReactNode } from 'react';

type RootLayoutProps = {
  children: ReactNode;
};

/**
 * Pass-through root layout. html/body live in `app/[locale]/layout.tsx`.
 */
export default function RootLayout({ children }: RootLayoutProps) {
  return children;
}
