const express = require('express');
const path = require('path');
const { prepareAccessTokens, authenticateAndIssueKycUserAccessToken } = require('./generateTokens')

const app = express();
const PORT = 3007;

// Serve static files from public folder
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

const { X_ISSUER_VERMETHOD_ID, X_ISSUER_DID } = require('./config')

app.get('/get-required-tokens', async (req, res) => {

    try {
        const { KYC_ACCESS_TOKEN, SSI_ACCESS_TOKEN } = await prepareAccessTokens();

        // Prepare User Data
        let USER_DID = "did:hid:888fc73f-0d4d-40fc-9ae2-432a426befe6"; // await createDID()
        const USER_NAME = "varsha kumari2";
        const USER_EMAIL = "9061varsha2@gmail.com";
        const userData = {
            name: USER_NAME,
            email: USER_EMAIL, //
            userDid: USER_DID,
        }

        console.log({
            KYC_ACCESS_TOKEN, SSI_ACCESS_TOKEN
        })
        const USER_BEARER_AUTH_TOKEN = await authenticateAndIssueKycUserAccessToken(userData, KYC_ACCESS_TOKEN, SSI_ACCESS_TOKEN);

        res.json({
            KYC_ACCESS_TOKEN,
            SSI_ACCESS_TOKEN,
            USER_BEARER_AUTH_TOKEN,
            X_ISSUER_DID,
            X_ISSUER_VERMETHOD_ID

        })
    } catch (e) {
        res.status(400).json(e.message)
    }


})

// Explicit route for index.html (optional but clear)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
