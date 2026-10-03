import { getUserMeById } from '@/entities/user/model/get-user-me';
import { ProfileView } from '@/features/profile';
import type { Session } from '@/shared/auth/auth';

type ProfilePageProps = {
  session: Session;
};

export async function ProfilePage({ session }: ProfilePageProps) {
  const initialUser = await getUserMeById(session.user.id);

  return <ProfileView initialUser={initialUser} />;
}
