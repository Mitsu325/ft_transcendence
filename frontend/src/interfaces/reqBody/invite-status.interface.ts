import { FriendStatusType } from 'interfaces/friend.interface';

export interface InviteStatusBody {
  id: string;
  status: FriendStatusType;
}

export interface InviteBody {
  recipientId: string;
}
