import React, { useState } from 'react';
import axios from 'axios';
import { Input, Button } from 'antd';
import { useLocation } from 'react-router-dom';

export default function TwoFactorAuthPage() {
  const [otp, setOtp] = useState('');

  const location = useLocation();
  const userId = new URLSearchParams(location.search).get('userId');

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        `${process.env.VERCEL_URL || ''}/two-factor-auth/verifyOTP`,
        { userId, otp },
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
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: '100px',
      }}
    >
      <Input
        type="text"
        style={{
          width: '60%',
          maxWidth: '200px',
          marginBottom: '10px',
          textAlign: 'center',
          fontSize: '18px',
          marginTop: '100px',
        }}
        value={otp}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setOtp(e.target.value)
        }
        placeholder="Enter OTP"
      />
      <Button
        type="primary"
        className="primary-button"
        onClick={handleLogin}
        style={{ marginBottom: '10px' }}
      >
        Verify
      </Button>
    </div>
  );
}
