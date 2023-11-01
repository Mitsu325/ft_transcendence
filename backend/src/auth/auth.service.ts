import { Injectable } from '@nestjs/common';
import axios from 'axios';
import authConfig from 'src/configs/auth.config';

@Injectable()
export class AuthService {
    async requestAccessToken(code: string): Promise<any> {
        try {
            const data = new URLSearchParams();
            data.append('grant_type', 'authorization_code');
            data.append('client_id', authConfig.clientId);
            data.append('client_secret', authConfig.clientSecret);
            data.append('code', code);
            data.append('redirect_uri', authConfig.redirectUri);

            const response = await axios.post(authConfig.tokenUrl, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async requestResourceOwner(token: string): Promise<any> {
        try {
            const response = await axios.get(authConfig.getResourceOwnerUrl, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}
