import { userNonSensitiveInfo } from './userModel';

export type FriendStatusType = 'active' | 'pending' | 'rejected' | 'unfriended';

export interface CreateInvite {
  status: 'success' | 'already_invited';
  invite: Invite;
}

export interface Invite {
  id: string;
  friend: userNonSensitiveInfo;
  status?: FriendStatusType;
  invitedAt: Date;
}

export interface InviteRes {
  data: Invite[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}
