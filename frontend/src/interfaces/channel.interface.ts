interface ChannelInterface {
  name_channel: string;
  type: string;
  password?: string;
  owner: string;
  users?: string[];
}

export default ChannelInterface;
