import { userNonSensitiveInfo } from 'src/utils/formatNonSensitive.util';
import { ActionType } from '../entities/admin-action.entity';

interface Admin {
    id: string;
    channel_id: string;
    admin: userNonSensitiveInfo;
    active: boolean;
}

export interface AdminRes {
    data: Admin[];
    pagination: {
        page: number;
        limit: number;
        total: number;
    };
}

interface AdminAction {
    id: string;
    channel_id: string;
    member: userNonSensitiveInfo;
    action: ActionType;
    active: boolean;
    expirationDate: string;
}

export interface AdminActionRes {
    data: AdminAction[];
    pagination: {
        page: number;
        limit: number;
        total: number;
    };
}
