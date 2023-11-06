import React from 'react';
import { SmileTwoTone } from '@ant-design/icons';
import { notification } from 'antd';

interface NotificationProps {
  message: string;
  description: string;
}

const SuccessNotification = ({ message, description }: NotificationProps) => {
  notification.open({
    message,
    description,
    icon: <SmileTwoTone twoToneColor="#096dd9" />,
  });

  return null;
};

export default SuccessNotification;
