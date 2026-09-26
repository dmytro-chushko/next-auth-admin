import { prismaAdapter } from '@better-auth/prisma-adapter';
import { betterAuth } from 'better-auth';
import { nextCookies } from 'better-auth/next-js';
import { admin } from 'better-auth/plugins';

import { prisma } from '@/shared/db/prisma';
import { sendEmail } from '@/shared/email';
import {
  deleteManagedAvatarIfPresent,
  isManagedUserAvatar,
} from '@/shared/storage';

import {
  CREDENTIAL_PROVIDER_ID,
  type OAuthProviderId,
} from './oauth-providers';

function buildSocialProviders(): Partial<
  Record<
    OAuthProviderId,
    {
      clientId: string;
      clientSecret: string;
      scope?: string[];
    }
  >
> {
  const providers: Partial<
    Record<
      OAuthProviderId,
      {
        clientId: string;
        clientSecret: string;
        scope?: string[];
      }
    >
  > = {};

  const googleClientId = process.env.GOOGLE_CLIENT_ID?.trim();
  const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();

  if (googleClientId && googleClientSecret) {
    providers.google = {
      clientId: googleClientId,
      clientSecret: googleClientSecret,
    };
  }

  const githubClientId = process.env.GITHUB_CLIENT_ID?.trim();
  const githubClientSecret = process.env.GITHUB_CLIENT_SECRET?.trim();

  if (githubClientId && githubClientSecret) {
    providers.github = {
      clientId: githubClientId,
      clientSecret: githubClientSecret,
    };
  }

  return providers;
}

/**
 * Better Auth server instance.
 * `nextCookies` must stay last so Set-Cookie works from server actions if used.
 */
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  user: {
    additionalFields: {
      oauthImage: {
        type: 'string',
        required: false,
        // Server-owned: synced from OAuth `image` in databaseHooks.
        input: false,
        returned: true,
      },
    },
  },
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ['google', 'github', CREDENTIAL_PROVIDER_ID],
      allowDifferentEmails: false,
      updateUserInfoOnLink: true,
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    // Admin plugin fields must match real sign-up shape for enumeration protection.
    customSyntheticUser: ({ coreFields, additionalFields, id }) => ({
      ...coreFields,
      role: 'user',
      banned: false,
      banReason: null,
      banExpires: null,
      oauthImage: null,
      ...additionalFields,
      id,
    }),
  },
  emailVerification: {
    sendOnSignUp: true,
    sendOnSignIn: true,
    autoSignInAfterVerification: true,
    expiresIn: 60 * 60,
    sendVerificationEmail: async ({ user, url }) => {
      void sendEmail({
        to: user.email,
        subject: 'Verify your email address',
        text: `Click the link to verify your email: ${url}\n\nIf the link doesn’t work, request a new one from the app.`,
        html: `<p>Click the link to verify your email:</p><p><a href="${url}">${url}</a></p><p>If the link doesn’t work, request a new one from the app.</p>`,
      }).catch((error: unknown) => {
        console.error('[auth] failed to send verification email', error);
      });
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },
  socialProviders: buildSocialProviders(),
  trustedOrigins: [process.env.BETTER_AUTH_URL ?? 'http://localhost:3000'],
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const image =
            typeof user.image === 'string' && user.image.length > 0
              ? user.image
              : null;

          return {
            data: {
              ...user,
              oauthImage: image,
            },
          };
        },
      },
      update: {
        before: async (data, ctx) => {
          const next: Record<string, unknown> = { ...data };
          const userId = ctx?.context?.session?.user?.id;
          const incomingImage =
            typeof next.image === 'string' && next.image.length > 0
              ? next.image
              : null;

          if (incomingImage) {
            next.oauthImage = incomingImage;

            if (userId) {
              const current = await prisma.user.findUnique({
                where: { id: userId },
                select: { image: true },
              });

              if (current && isManagedUserAvatar(current.image)) {
                // Keep custom Supabase avatar; still refresh durable OAuth photo.
                delete next.image;
              }
            }
          }

          return { data: next };
        },
      },
      delete: {
        before: async (user) => {
          try {
            await deleteManagedAvatarIfPresent(user.image);
          } catch (error: unknown) {
            console.error(
              '[auth] failed to cleanup avatar on user delete',
              error,
            );
          }

          return true;
        },
      },
    },
  },
  plugins: [
    admin({
      defaultRole: 'user',
      adminRoles: ['admin'],
    }),
    nextCookies(),
  ],
});

export type Session = typeof auth.$Infer.Session;
export type AuthUser = Session['user'];
