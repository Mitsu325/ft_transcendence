import api from 'services/api';

const handleVerify = async (userId: string, otp: string) => {
  try {
    const response = await api.post('/auth/two-factor-auth', { userId, otp });
    if (response.data.verified) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.error(err);
  }
};

export default handleVerify;
