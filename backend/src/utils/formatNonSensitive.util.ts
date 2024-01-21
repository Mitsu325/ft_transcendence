import { User } from 'src/user/entities/user.entity';

export interface userNonSensitiveInfo {
    id: string;
    name: string;
    username: string;
    avatar: string;
}

export function getNonSensitiveUserInfo(user: User): userNonSensitiveInfo {
    const { id, name, username, avatar } = user;
    return { id, name, username, avatar };
}
