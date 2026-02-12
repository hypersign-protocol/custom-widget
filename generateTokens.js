const { KYC_API_SECRET, SSI_API_SECRET, X_ISSUER_VERMETHOD_ID, X_ISSUER_DID, DEVELOPER_DASHBOARD_SERVICE_BASE_URL, DOMAIN, SSI_BASE_URL, KYC_BASE_URL } = require('./config')

const fs = require('fs').promises;
const path = require('path');

const TOKEN_FILE = path.join(__dirname, 'tokens.json');


async function generateAccessTokensForKYCandSSI(api_secret, type) {
    const path = "/api/v1/app/oauth"

    try {
        const res = await fetch(`${DEVELOPER_DASHBOARD_SERVICE_BASE_URL}${path}?grant_type=${type}`, {
            method: 'POST',
            headers: { 'X-Api-Secret-Key': api_secret }
        });
        const result = await res.json();
        return result.access_token

    } catch (e) {
        console.error(e.message)
    }
}


async function prepareAccessTokens() {
    try {
        let tokens = {};

        // 1. Try to read existing tokens from the file
        try {
            const data = await fs.readFile(TOKEN_FILE, 'utf8');
            tokens = JSON.parse(data);
            console.log('Existing tokens loaded from file.');
        } catch (err) {
            console.log('No existing token file found. Generating new ones...');
        }

        // 2. Check if tokens exist in the object; if not, generate them
        if (!tokens.KYC_ACCESS_TOKEN || !tokens.SSI_ACCESS_TOKEN) {

            console.log('Generating KYC Access Token');
            const KYC_ACCESS_TOKEN = await generateAccessTokensForKYCandSSI(KYC_API_SECRET, 'access_service_kyc');

            console.log('Generating SSI Access Token');
            const SSI_ACCESS_TOKEN = await generateAccessTokensForKYCandSSI(SSI_API_SECRET, 'access_service_ssi');

            tokens = {
                KYC_ACCESS_TOKEN,
                SSI_ACCESS_TOKEN
            };

            // 3. Store the newly generated tokens into the file
            await fs.writeFile(TOKEN_FILE, JSON.stringify(tokens, null, 2));
            console.log('New tokens saved to file.');
        }

        return tokens;

    } catch (e) {
        console.error('Error in prepareAccessTokens:', e.message);
    }
}


async function startSession(KYC_ACCESS_TOKEN) {

    const res = await fetch(`${KYC_BASE_URL}/e-kyc/verification/session`, {
        method: 'POST',
        headers: { 'x-kyc-access-token': KYC_ACCESS_TOKEN }
    });
    const result = await res.json();
    return result.data.sessionId;

}

// This API call can be skipp if did-jwt is used
async function authenticateAndIssueKycUserAccessToken(claims, KYC_ACCESS_TOKEN, SSI_ACCESS_TOKEN) {
    const data = await fetch(`${SSI_BASE_URL}/did/auth/issue-jwt`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${SSI_ACCESS_TOKEN}`,
        },
        body: JSON.stringify({
            "issuer": {
                "verificationmethodId": X_ISSUER_VERMETHOD_ID,
                "did": X_ISSUER_DID
            },
            "audience": DOMAIN,
            "claims": claims,
            "ttlSeconds": 3600

        })

    })
    if (!data.ok) {
        const err = await data.text();
        throw new Error(`Token API failed: ${err}`);
    }
    const json = await data.json();
    const token = await getBearerToken(json.accessToken, KYC_ACCESS_TOKEN, SSI_ACCESS_TOKEN, sessionId)
    return token
}

// 
async function getBearerToken(didJwtToken, KYC_ACCESS_TOKEN, SSI_ACCESS_TOKEN, sessionId) {
    const data = await fetch(`${KYC_BASE_URL}/e-kyc/verification/auth`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-ssi-access-token": SSI_ACCESS_TOKEN,
            "x-kyc-access-token": KYC_ACCESS_TOKEN,
            "Authorization": `Bearer ${didJwtToken}`,
        },
        body: JSON.stringify({
            provider: "third-party-auth",
            sessionId
        })
    })
    if (!data.ok) {
        const err = await data.text();
        throw new Error(`Token API failed to generate kycUserAccessToken: ${err}`);
    }
    const json = await data.json();
    return json.data.kycServiceUserAccessToken
}

module.exports = {
    prepareAccessTokens,
    authenticateAndIssueKycUserAccessToken,
    startSession
}