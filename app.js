const express = require('express');
const path = require('path');
const { prepareAccessTokens, authenticateAndIssueKycUserAccessToken, startSession } = require('./generateTokens')
const { createDID } = require('./ssi')
const app = express();
const PORT = 3007;

// Serve static files from public folder
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

const { X_ISSUER_VERMETHOD_ID, X_ISSUER_DID } = require('./config')

app.get('/get-required-tokens-and-session-for-a-user', async (req, res) => {

    try {
        // 3. Prepare Access Tokens for SSI and KYC
        const { KYC_ACCESS_TOKEN, SSI_ACCESS_TOKEN } = await prepareAccessTokens();

        const sessionId = await startSession(KYC_ACCESS_TOKEN)

        // 3. Generate User access Token 
        // 3.1 Prepare User Data

        // 3.1.1 Prepare User DID
        let USER_DID = await createDID('', SSI_ACCESS_TOKEN);

        // 3.1.2 Prepare User claims
        const USER_NAME = "varsha kumari2";
        const USER_EMAIL = "9061varsha2@gmail.com";
        const userData = {
            name: USER_NAME,
            email: USER_EMAIL, // manadatory
            userDid: USER_DID, // mandatory
        }

        console.log({
            KYC_ACCESS_TOKEN, SSI_ACCESS_TOKEN
        })
        const USER_BEARER_AUTH_TOKEN = await authenticateAndIssueKycUserAccessToken(userData, KYC_ACCESS_TOKEN, SSI_ACCESS_TOKEN, sessionId);

        res.json({
            KYC_ACCESS_TOKEN,
            SSI_ACCESS_TOKEN,
            USER_BEARER_AUTH_TOKEN,
            X_ISSUER_DID,
            X_ISSUER_VERMETHOD_ID,
            sessionId,
            USER_DID,
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
