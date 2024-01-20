import React from 'react';
import { UserOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';
import { AvatarSize } from 'antd/es/avatar/AvatarContext';

type AvatarProps = {
  src?: string;
  size: AvatarSize;
  className?: string;
};

const AvatarCustom = ({ src, size, className }: AvatarProps) => {
  return src ? (
    <Avatar src={src} alt="" size={size} className={className} />
  ) : (
    <Avatar icon={<UserOutlined />} alt="" size={size} className={className} />
  );
};

export default AvatarCustom;
