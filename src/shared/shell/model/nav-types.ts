import type { LucideIcon } from 'lucide-react';

export type NavItemMatch = 'exact' | 'prefix';

export type NavItem<TId extends string = string> = {
  id: TId;
  href: string;
  match: NavItemMatch;
  icon: LucideIcon;
};

/** Sidebar scopes used by the app shell. Expand when profile/dashboard need sidebars. */
export type SidebarScope = 'admin';

export type SidebarNavConfig<TId extends string = string> = {
  labelNamespace: string;
  items: NavItem<TId>[];
};
