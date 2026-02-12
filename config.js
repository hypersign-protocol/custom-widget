const env = require('dotenv');
env.config();
// 1. Generate API Secrets
const SSI_API_SECRET = process.env.SSI_API_SECRET;
const KYC_API_SECRET = process.env.KYC_API_SECRET;

const KYC_BASE_URL = process.env.KYC_BASE_URL
const SSI_BASE_URL = process.env.SSI_BASE_URL;

const DEVELOPER_DASHBOARD_SERVICE_BASE_URL = process.env.DEVELOPER_DASHBOARD_SERVICE_BASE_URL;
// 2. Create Issuer Account
const X_ISSUER_DID = "did:hid:z6Mkih2GSH8hMhFXGXw387cK76v7V4PUhFUu8TNWUkXsEAGu";
const X_ISSUER_VERMETHOD_ID = "did:hid:z6Mkih2GSH8hMhFXGXw387cK76v7V4PUhFUu8TNWUkXsEAGu#key-1"


module.exports = {
    SSI_API_SECRET,
    KYC_API_SECRET,
    KYC_BASE_URL,
    SSI_BASE_URL,
    DEVELOPER_DASHBOARD_SERVICE_BASE_URL,
    X_ISSUER_DID,
    X_ISSUER_VERMETHOD_ID,
}
