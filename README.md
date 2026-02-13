# Custom Widget Demo
This project demonstrates how to integrate and customize the Hypersign KYC and SSI APIs. It provides a streamlined implementation for identity verification and decentralized identifier (DID) management.

## 🚀 Getting Started
### Prerequisites
- Node.js: v16.x or higher
- npm: v8.x or higher
- Hypersign Credentials: You must have an account on the Hypersign Dashboard.

### Setup

Environment Variables Clone the sample environment file and populate it with your secrets from the Hypersign Dashboard.

```
mv .env-sample .env
```

Edit the `.env` file:

```
KYC_API_SECRET = your_kyc_secret_here
SSI_API_SECRET = your_ssi_secret_here
```

### Installation Install the necessary dependencies:

```
npm install
```

### Start the development server:

```
npm run start
```

## 🛠 Features & Usage
The Custom Widget provides a comprehensive identity verification suite, including:

- **ID Document OCR**: Automatically extracts text and data from government-issued IDs using Optical Character Recognition.
- **Selfie Capture**: A guided UI for users to take high-quality headshots for verification.
- **Face Authentication**: Comparison of the live selfie against the ID document photo to ensure the user is the rightful owner.
- **User Consent**: A built-in legal and privacy layer to capture and log explicit user permission for data processing.
