const { KYC_API_SECRET, SSI_API_SECRET, X_ISSUER_VERMETHOD_ID, X_ISSUER_DID, DEVELOPER_DASHBOARD_SERVICE_BASE_URL, DOMAIN, SSI_BASE_URL, KYC_BASE_URL } = require('./config')

let SSI_ACCESS_TOKEN = ""
let KYC_ACCESS_TOKEN = ""

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

        console.log('Generating KYC Access Token')
        // KYC Access Token
        const KYC_ACCESS_TOKEN = await generateAccessTokensForKYCandSSI(KYC_API_SECRET, 'access_service_kyc')

        console.log('Generating SSI Access Token')
        // SSI Access Token 
        const SSI_ACCESS_TOKEN = await generateAccessTokensForKYCandSSI(SSI_API_SECRET, 'access_service_ssi')

        return {
            KYC_ACCESS_TOKEN,
            SSI_ACCESS_TOKEN
        }

    } catch (e) {
        console.error(e.message)
    }

}

// async function prepareUserAccesstokens() {

//     // User Access Tokens

//     console.log('Generating User Access Token')
//     BEARER_AUTH_TOKEN = await authenticateAndIssueKycUserAccessToken(userData);
// }

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
    const token = await getBearerToken(json.accessToken, KYC_ACCESS_TOKEN, SSI_ACCESS_TOKEN)
    return token
}
async function getBearerToken(didJwtToken, KYC_ACCESS_TOKEN, SSI_ACCESS_TOKEN) {
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
    authenticateAndIssueKycUserAccessToken
}