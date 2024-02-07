import { ActionType } from 'interfaces/channel.interface';

export interface UpdateAdminAction {
  channelId: string;
  memberId: string;
  action: ActionType;
  active: boolean;
  expirationDate: Date | null;
}
