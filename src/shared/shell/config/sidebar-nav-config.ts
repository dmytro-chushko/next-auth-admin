import { adminNavItems } from '@/features/admin/config/admin-nav-items';

import type { SidebarNavConfig, SidebarScope } from '../model/nav-types';

export const sidebarNavConfig = {
  admin: {
    labelNamespace: 'admin.nav',
    items: adminNavItems,
  },
} as const satisfies Record<SidebarScope, SidebarNavConfig>;
