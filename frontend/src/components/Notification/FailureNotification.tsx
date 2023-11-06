import React from 'react';
import { AlertTwoTone } from '@ant-design/icons';
import { notification } from 'antd';

type NotificationProps = {
  message: string;
  description: string;
};

const FailureNotification = ({ message, description }: NotificationProps) => {
  notification.open({
    message,
    description,
    icon: <AlertTwoTone twoToneColor="#cf1322" />,
  });

  return null;
};

export default FailureNotification;
