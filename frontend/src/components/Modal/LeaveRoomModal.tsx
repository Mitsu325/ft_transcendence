import React, { useState } from 'react';
import { Modal } from 'antd';

interface LeaveRoomModalProps {
  visible: boolean;
  message: string;
}

const LeaveRoomModal: React.FC<LeaveRoomModalProps> = ({
  visible,
  message,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(visible);

  // const showModal = () => {
  //   setIsModalOpen(visible);
  // };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Modal
        title="Basic Modal"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>{message}</p>
      </Modal>
    </>
  );
};

export default LeaveRoomModal;
