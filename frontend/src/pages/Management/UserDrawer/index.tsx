import React from 'react';
import { Drawer, Button } from 'antd';

interface UserDrawerProps {
  open: boolean;
  onClose: () => void;
  addAdmin: () => void;
  removeAdmin: () => void;
}

const UserDrawer: React.FC<UserDrawerProps> = ({
  open,
  onClose,
  addAdmin,
  removeAdmin,
}) => {
  return (
    <Drawer
      title="Gerenciar"
      placement="right"
      onClose={onClose}
      open={open}
      getContainer={false}
    >
      <Button
        key="addAdmin"
        type="primary"
        onClick={addAdmin}
        style={{ marginBottom: '10px' }}
      >
        Adicionar como administrador
      </Button>
      <Button
        key="removeAdmin"
        type="primary"
        onClick={removeAdmin}
        style={{ marginBottom: '10px' }}
      >
        Remover administrador
      </Button>
    </Drawer>
  );
};

export default UserDrawer;
