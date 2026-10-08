export type ModalName = 'profile-deletion' | 'admin-revoke-sessions';

export type ModalPayloads = {
  'profile-deletion': {
    email: string;
    hasPassword: boolean;
  };
  'admin-revoke-sessions': {
    userId: string;
    email: string;
  };
};
