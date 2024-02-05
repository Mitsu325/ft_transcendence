import { userNonSensitiveInfo } from './userModel';

export interface ChannelInterface {
  name_channel: string;
  type: string;
  password?: string;
  owner: string;
}

export interface ChannelProps {
  id: string;
  name_channel: string;
  type: string;
  owner: string;
}

export interface typeAdmin {
  admin_id: string;
}

export interface Channel {
  channel: ChannelProps;
  owner: boolean;
  hasAdmin: boolean;
}

export interface Admin {
  id: string;
  channel_id: string;
  active: boolean;
  admin: userNonSensitiveInfo;
}

export interface AdminRes {
  data: Admin[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}
