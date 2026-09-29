import { User } from 'lucide-react';

import { cn } from '@/shared/lib/utils';

type UserAvatarProps = {
  name?: string | null;
  email: string;
  avatarUrl?: string | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

const sizeClassName: Record<NonNullable<UserAvatarProps['size']>, string> = {
  sm: 'size-8 text-xs',
  md: 'size-10 text-sm',
  lg: 'size-20 text-xl',
};

function getInitials(name: string | null | undefined, email: string): string {
  const source = name?.trim() || email.split('@')[0] || email;

  return source
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

export function UserAvatar({
  name,
  email,
  avatarUrl,
  size = 'md',
  className,
}: UserAvatarProps) {
  const initials = getInitials(name, email);

  return (
    <div
      className={cn(
        'bg-muted relative flex shrink-0 items-center justify-center overflow-hidden rounded-full',
        sizeClassName[size],
        className,
      )}
    >
      {avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element -- remote OAuth/Supabase URLs
        <img
          src={avatarUrl}
          alt=""
          referrerPolicy="no-referrer"
          className="size-full object-cover"
        />
      ) : (
        <span
          className="text-muted-foreground flex size-full items-center justify-center font-medium"
          aria-hidden="true"
        >
          {initials.length > 0 ? initials : <User className="size-4" />}
        </span>
      )}
    </div>
  );
}

export { getInitials };
