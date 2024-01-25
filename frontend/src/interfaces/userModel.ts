export interface userNonSensitiveInfo {
  id: string;
  name: string;
  username: string;
  avatar: string;
}

interface UserModel {
  id: string;
  name: string;
  email?: string;
  username?: string | null;
  avatar: string | null;
  twoFactorAuth?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export default UserModel;
