export default {
    clientId: process.env.AUTH_CLIENT_ID,
    clientSecret: process.env.AUTH_CLIENT_SECRET,
    redirectUri: 'http://localhost:3000',
    tokenUrl: process.env.AUTH_TOKEN_URL,
    getResourceOwnerUrl: process.env.RESOURCE_OWNER_URL,
};
