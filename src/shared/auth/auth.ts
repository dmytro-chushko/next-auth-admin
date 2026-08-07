import { prismaAdapter } from '@better-auth/prisma-adapter';
import { betterAuth } from 'better-auth';
import { admin } from 'better-auth/plugins';

import { prisma } from '@/shared/db/prisma';

/**
 * Minimal Better Auth server config for stage A schema generation.
 * Full email/OAuth/UI wiring lands in stages B–D.
 */
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    admin({
      defaultRole: 'user',
      adminRoles: ['admin'],
    }),
  ],
});
