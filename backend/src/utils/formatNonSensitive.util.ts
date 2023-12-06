import { User } from 'src/user/entities/user.entity';

export function getNonSensitiveUserInfo(user: User): Partial<User> {
    const { id, name, username, avatar } = user;
    return { id, name, username, avatar };
}
