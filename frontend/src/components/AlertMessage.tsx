import React from "react";
import { Alert, Button, Space } from "antd";

interface AlertMessageProps {
    message: string;
    description: string;
}

const AlertMessage: React.FC<AlertMessageProps> = ({ message, description }) => {
    return (
        <Space direction="vertical" style={{ width: '100%' }}>
            <Alert
                message={message}
                description={description}
                type="warning"
                showIcon
                action={
                    <Button size="small" type="text">
                        OK
                    </Button>
                }
            />
        </Space>
    );
}

export default AlertMessage;
