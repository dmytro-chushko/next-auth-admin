import 'dotenv/config';

import { PrismaPg } from '@prisma/adapter-pg';
import { hashPassword } from 'better-auth/crypto';

import { PrismaClient } from '../src/generated/prisma/client';

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error('DATABASE_URL is not set');
  }

  return new PrismaClient({
    adapter: new PrismaPg({ connectionString }),
  });
}

function requireEnv(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`${name} is not set`);
  }

  return value;
}

async function upsertCredentialUser(options: {
  prisma: PrismaClient;
  email: string;
  name: string;
  password: string;
  role: 'admin' | 'user';
}): Promise<void> {
  const { prisma, email, name, password, role } = options;
  const now = new Date();
  const passwordHash = await hashPassword(password);

  const user = await prisma.user.upsert({
    where: { email },
    create: {
      id: crypto.randomUUID(),
      email,
      name,
      emailVerified: true,
      role,
      banned: false,
      createdAt: now,
      updatedAt: now,
    },
    update: {
      name,
      role,
      emailVerified: true,
      banned: false,
      updatedAt: now,
    },
  });

  const existingCredential = await prisma.account.findFirst({
    where: {
      userId: user.id,
      providerId: 'credential',
    },
  });

  if (existingCredential) {
    await prisma.account.update({
      where: { id: existingCredential.id },
      data: {
        password: passwordHash,
        updatedAt: now,
      },
    });
  } else {
    await prisma.account.create({
      data: {
        id: crypto.randomUUID(),
        accountId: user.id,
        providerId: 'credential',
        userId: user.id,
        password: passwordHash,
        createdAt: now,
        updatedAt: now,
      },
    });
  }

  console.warn(`Seeded ${role}: ${email}`);
}

async function main(): Promise<void> {
  const prisma = createPrismaClient();

  try {
    await upsertCredentialUser({
      prisma,
      email: requireEnv('SEED_ADMIN_EMAIL').toLowerCase(),
      name: 'Admin',
      password: requireEnv('SEED_ADMIN_PASSWORD'),
      role: 'admin',
    });

    await upsertCredentialUser({
      prisma,
      email: requireEnv('SEED_USER_EMAIL').toLowerCase(),
      name: 'User',
      password: requireEnv('SEED_USER_PASSWORD'),
      role: 'user',
    });
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
