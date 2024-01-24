import { userNonSensitiveInfo } from 'src/utils/formatNonSensitive.util';
import { FriendStatusType } from '../entities/friend.entity';

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
