import { userNonSensitiveInfo } from 'src/utils/formatNonSensitive.util';

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
