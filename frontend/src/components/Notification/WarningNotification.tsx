import React from 'react';
import { notification } from 'antd';
import { WarningTwoTone } from '@ant-design/icons';

type NotificationProps = {
  message: string;
  description: string;
};

const WarningNotification = ({ message, description }: NotificationProps) => {
  notification.open({
    message,
    description,
    icon: <WarningTwoTone twoToneColor="#faad14" />,
  });

  return null;
};

export default WarningNotification;
