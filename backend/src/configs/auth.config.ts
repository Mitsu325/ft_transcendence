import * as dotenv from 'dotenv';
dotenv.config();

export default {
    clientId: process.env.AUTH_CLIENT_ID,
    clientSecret: process.env.AUTH_CLIENT_SECRET,
    redirectUri: process.env.REDIRECT_URI,
    tokenUrl: process.env.AUTH_TOKEN_URL,
    getResourceOwnerUrl: process.env.RESOURCE_OWNER_URL,
};
