import axios from 'axios';

const handleVerify = async (userId: string, otp: string) => {
  try {
    const response = await axios.post(
      'http://localhost:3003/auth/two-factor-auth',
      { userId, otp },
    );

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
