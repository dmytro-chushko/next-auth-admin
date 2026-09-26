import type { UserMe } from '@/shared/api/contracts';
import { mapUserToMe } from '@/shared/api/helpers/map-session-user';
import { prisma } from '@/shared/db/prisma';
import {
  assertUploadedAvatar,
  deleteManagedAvatarIfPresent,
  getAvatarPublicUrl,
  isManagedUserAvatar,
  verifyAvatarConfirmToken,
} from '@/shared/storage';

async function getUserMeById(userId: string): Promise<UserMe> {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
  });

  return mapUserToMe(user);
}

export async function confirmUserAvatarUpload(
  userId: string,
  path: string,
  confirmToken: string,
): Promise<UserMe> {
  verifyAvatarConfirmToken(confirmToken, userId, path);
  await assertUploadedAvatar(path, userId);

  const current = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    select: { image: true },
  });

  await deleteManagedAvatarIfPresent(current.image);

  const publicUrl = getAvatarPublicUrl(path);

  await prisma.user.update({
    where: { id: userId },
    data: { image: publicUrl },
  });

  return getUserMeById(userId);
}

/**
 * Deletes a managed Supabase avatar and restores `oauthImage` when present.
 */
export async function deleteUserAvatar(userId: string): Promise<UserMe> {
  const current = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    select: { image: true, oauthImage: true },
  });

  if (!isManagedUserAvatar(current.image)) {
    return getUserMeById(userId);
  }

  await deleteManagedAvatarIfPresent(current.image);

  await prisma.user.update({
    where: { id: userId },
    data: { image: current.oauthImage ?? null },
  });

  return getUserMeById(userId);
}
