import { ProfileView } from '@/features/profile';
import { mapSessionUserToMe } from '@/shared/api/helpers/map-session-user';
import type { Session } from '@/shared/auth/auth';

type ProfilePageProps = {
  session: Session;
};

export function ProfilePage({ session }: ProfilePageProps) {
  const initialUser = mapSessionUserToMe(session.user);

  return <ProfileView initialUser={initialUser} />;
}
