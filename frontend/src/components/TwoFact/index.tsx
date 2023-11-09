import React, { useState, useEffect } from 'react';
import axios from 'axios';
import QRCode from 'react-qr-code';
import Modal from 'react-modal';

Modal.setAppElement('/login');

export default function TwoFact() {
  const [secret, setSecret] = useState('');
  const [otp, setOtp] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    const generateSecret = async () => {
      try {
        const response = await axios.get(
          'http://localhost:3003/two-factor-auth/generateSecret',
        );
        setSecret(response.data.secret);
        setModalIsOpen(true);
      } catch (err) {
        console.error(err);
      }
    };

    generateSecret();
  }, []); // Chamada automática ao montar o componente

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        'http://localhost:3003/two-factor-auth/verifyOTP',
        { secret, otp },
      );

      if (response.data.verified) {
        alert('Login success');
      } else {
        alert('Login failed');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)}>
        <QRCode value={secret} />
        <input
          type="text"
          value={otp}
          onChange={e => setOtp(e.target.value)}
          placeholder="Enter OTP"
        />
        <button onClick={handleLogin}>Login</button>
      </Modal>
    </div>
  );
}
