import React from 'react';
import { UserOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';
import { AvatarSize } from 'antd/es/avatar/AvatarContext';

type AvatarProps = {
  src?: string;
  size: AvatarSize;
};

const AvatarCustom = ({ src, size }: AvatarProps) => {
  return src ? (
    <Avatar src={src} alt="" size={size} />
  ) : (
    <Avatar icon={<UserOutlined />} alt="" size={size} />
  );
};

export default AvatarCustom;
