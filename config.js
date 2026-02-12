// 1. Generate API Secrets
const SSI_API_SECRET = "8a24231b3ff4257bdea0de4e7f37e.082b03cf87842a5076b0b2c40ee9b32883a9c2b7bb2e1eb68b2078dd992f1fda09b868e9ee27d3c8f270c7721113cf433"
const KYC_API_SECRET = "2940babfe5b14499a1fed50722209.7b17d2b8650a9ea6f82f8553f4080e5b93381ccb8c89ba746b61d4597715cde8a4f68d5d6367f531b73aa69e26fb95707"

const KYC_BASE_URL = "https://api.cavach.hypersign.id/api/v1";
const SSI_BASE_URL = "https://api.entity.hypersign.id/api/v1";
const DEVELOPER_DASHBOARD_SERVICE_BASE_URL = "https://api.entity.dashboard.hypersign.id";
const DOMAIN = "https://api.cavach.hypersign.id"

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
    DOMAIN

}
