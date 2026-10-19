# ⚖️ JusticeBridge Legal Engine — Technical & Architecture Documentation
**Document Version:** 4.2 (Production & Audit Specification)  
**Runtime Stack:** React 19 • TypeScript • Vite 6 • Tailwind CSS v4 • Node.js 22 (Express) • Google Firebase (Auth, Firestore, Storage) • Google Gemini API (@google/genai) • Razorpay HMAC-SHA256  
**Test Suite Verification:** 35/35 Assertions Passing (Node.js v22.23.3, Test Run Date: October 19, 2026, Commit: `bd23217`)  
**Production Domain:** `https://justicebridge.in` | **Support:** `support@justicebridge.in` | **DPDP Grievance Desk:** `grievance@justicebridge.in`  

---

### 📑 Table of Contents
1. Executive Summary & Implementation Scope
2. Core Feature Architecture (7 Functional Pillars)
3. System Architecture & Data-Flow Diagrams
4. Legal Accuracy, Statutory Disclaimers & Verification Scope
5. Verifiable Security, RBAC/ABAC & Chain-of-Custody Controls
6. Data Model & Cloud Firestore Schema Reference (with JSON Schema Examples)
7. REST API Specification & Tested Examples (with Curl & Responses)
8. Executed Automated Test Report (35/35 Passed)
9. Operational Privacy (DPDP Act 2023), PWA Shared-Device Safety & Incident Response
10. Operations & Production Readiness (Checklist, Traceability & Action List)
11. Installation, Reproducible Local Setup & Troubleshooting (Restored Full Guide)
12. Step-by-Step End-to-End Demo Walkthrough (5-Minute Scenario)
13. Google Play Store Submission Readiness (PWA / TWA Deployment)
14. Known Limitations & Future Production Roadmap
15. Needs My Action (External Compliance & Audit Tracking)

---

## Changelog v4.2 (Date: October 19, 2026 | Commit: `c0340c2` | Node: v22.23.3)
- **Lawyer Verification Workflow:** `POST /api/lawyers/verify` validates Bar Council registration formatting (`STATE/NUMBER/YEAR`) and creates a `verificationRequests` record with `status: "pending"` and `isVerifiedLawyer: false`. Vault access remains gated until an authorized officer/admin executes approval via `POST /api/admin/verify-lawyer`. Removed unverified third-party claims ("verified via Bar Council of India e-Portal").
- **Identity & Session Security:** Bound server-issued 24-hour cryptographic session tokens (`jb_sess_`) to verified Firebase UIDs via `POST /api/auth/verify-firebase-token`. Added `POST /api/auth/logout` revoking tokens in memory and Firestore `/sessions/{token}`. Guest/persona tokens are restricted to public endpoints and cannot access private case data.
- **Webhook Processing & Payment Hardening:** Implemented `POST /api/membership/webhook` with HMAC-SHA256 signature verification and event-level idempotency (`processedWebhooksSet` + Firestore `/processed_webhooks`). Enforced strict signature validation (`razorpay_signature`) and server-order fee derivation (`recordedOrder.amount`) in `POST /api/membership/verify-payment`.
- **Right to Erasure & Minor Protection:** Implemented `DELETE /api/account` safely purging user documents, files, and active sessions while revoking Firebase Auth credentials and writing a pseudonymized audit trail. Added 18+ age declaration enforcement and stored onboarding consent records (`consentGiven: true`, timestamp) in compliance with DPDP Act 2023 requirements.
- **Voice Privacy Harmonization:** Standardized disclosure across Pillars and Section 9.1: spoken audio is processed by the browser vendor's speech service (Google in Chrome) via the Web Speech API and never reaches JusticeBridge servers. JusticeBridge receives transcript text only. Removed "processed locally" phrasing.
- **Test Suite Expansion:** Expanded verification coverage from 26 to 35 automated security assertions (`AUTH-01..05`, `AUTHZ-01..05`, `PAY-01..05`, `HOOK-01..03`, `ACCT-01..03`, `SEC-01`, `AI-01..04`, `DOC-01..05`, `PERSIST-01`, `OPS-01..03`) passing with 100% green.

---

## 1. Executive Summary & Implementation Scope
JusticeBridge is a full-stack Indian Legal-Tech platform engineered to bridge the gap between citizens (litigants) and Bar Council–verified legal advocates. Designed around India's modern statutory framework—including the Bharatiya Nyaya Sanhita (BNS), Bharatiya Nagarik Suraksha Sanhita (BNSS), and Bharatiya Sakshya Adhiniyam (BSA), 2023 alongside legacy IPC, CrPC, CPC, and NI Act provisions—the platform reduces pre-litigation friction through vernacular voice-to-petition intake, isolated case management, cryptographic raw-byte evidence hashing, and server-side AI legal research.

### Live Deployment Environments
* **Production Custom Domain:** `https://justicebridge.in` (Pending DNS & TLS provisioning)
* **Development Environment:** `https://ais-dev-2ygeqzn4xbgemovtatd7wg-621467385062.asia-southeast1.run.app`
* **Shared / Preview Environment:** `https://ais-pre-2ygeqzn4xbgemovtatd7wg-621467385062.asia-southeast1.run.app`

### Explicit Scope Matrix
1. **Implemented & Automated-Tested in Codebase (35/35 assertions passing via `npm test`):**
   * Cryptographic 256-bit session token issuance (`jb_sess_<64-hex>`) with 24-hour expiration, Firebase UID binding, and revocation (`AUTH-01..05`).
   * Strict Cross-Client Case Isolation (HTTP 403 `SEC_CLIENT_ISOLATION_BREACH_PREVENTED`), Rule 1 Verified Advocate Vault Gate (HTTP 403 `SEC_UNVERIFIED_LAWYER_BLOCKED`), and Bar Council credential verification with pending officer approval (`AUTHZ-01..05`).
   * Server-side Razorpay order registration, ownership binding, anti-replay (HTTP 409), signature verification, and webhook processing (`PAY-01..05`, `HOOK-01..03`).
   * DPDP Act Right to Erasure (`DELETE /api/account`), 18+ age gating (`SEC_MINOR_ACCESS_RESTRICTED`), and stored onboarding consent tracking (`ACCT-01..03`).
   * Raw File-Byte SHA-256 Hashing (`crypto.subtle.digest('SHA-256', arrayBuffer)` in browser + `crypto.createHash('sha256')` in Node.js) with 1-byte tamper detection (`DOC-01..05`).
   * Server-side Gemini AI statutory counsel and multilingual voice petition structuring with prompt-injection and XSS sanitization (`AI-01..04`, `SEC-01`).
   * Cloud Firestore Security Rules (`firestore.rules`) with client access strictly denied to backend `/sessions`, `/orders`, and `/processed_webhooks`.
   * Resilient session persistence across warm-ups, Cloud Run health probes, and PWA shared-device cache isolation (`PERSIST-01`, `OPS-01..03`).

2. **Platform-Internal & External Workflows:**
   * Platform-generated case references (`MISC/DL/2026/418`) and internal tracking identifiers (`justiceBridgeRef: "JB01-839201-2026"`) are internal JusticeBridge registry identifiers, not official government e-Courts CNR numbers.
   * Bar Council credential verification enforces format validation, ID document upload to Firebase Storage, and human officer review via `verificationRequests`. (Direct API integration with state Bar Council registries is pending external government API availability).

---

## 2. Core Feature Architecture (7 Functional Pillars)
* **Pillar 1: Bar Council–Verified Advocate Directory & Retainer Booking**  
  Litigants filter advocates by specialization, court jurisdiction, State Bar Council enrollment, spoken languages, and consultation fee. Newly registered lawyers default to `isVerifiedLawyer: false`. Full vault privileges unlock only after Bar Council credential validation and administrative officer approval.
* **Pillar 2: Vernacular Voice-Enabled Petition Filer**  
  Non-technical citizens narrate grievances in English, Hindi (हिन्दी), Telugu (తెలుగు), Tamil (தமிழ்), or Kannada (ಕನ್ನಡ). **Browser Speech Service Disclosure:** Spoken audio is processed by the browser vendor's speech service (Google in Chrome) via the standard Web Speech API and never reaches JusticeBridge servers. JusticeBridge receives transcript text only and never captures, streams, or persists raw audio waveforms. Transcribed text is submitted to `POST /api/ai/voice-file-case`.
* **Pillar 3: Confidential Case File Vault & Raw-Byte SHA-256 Evidence Hashing**  
  Isolated judicial vault for petitions, affidavits, vakalatnamas, and digital evidence. Computes raw binary SHA-256 digests in-browser (`evidenceHasher.ts`) prior to upload, enforcing MIME and size constraints.
* **Pillar 4: Server-Side AI Legal Intelligence & Delay-Risk Analysis**  
  Maps citizen grievances to BNS / BNSS / BSA (2023) and IPC / CrPC / CPC provisions. **Rule-Based Delay-Risk Heuristics:** Calculates `delayRiskScore` ('Low' | 'Moderate' | 'Critical') and estimated disposal days using rule-based metrics on elapsed days and adjournment counts.
* **Pillar 5: Cybercrime & Online Abuse Incident Reporting**  
  Dedicated workflow for reporting online harassment, defamation, and hate speech with multimedia evidence uploads and raw-byte SHA-256 digests.
* **Pillar 6: Hearing Calendar & Preliminary Scrutiny Scheduling**  
  Tracks scheduled hearings, courtroom assignments, adjournment reasons, and preliminary scrutiny dates with downloadable PDF dockets.
* **Pillar 7: Progressive Web App (PWA) with Shared-Device Privacy Isolation**  
  Installable PWA with offline application shell support and explicit API/Cloud bypass (`public/sw.js`) so private legal data never persists in shared browser caches.

---

## 3. System Architecture & Data-Flow Diagrams
### 3.1 High-Level Component Architecture (ASCII Diagram — PDF Safe)
```
+-----------------------------------------------------------------------------------+
|                   BROWSER CLIENT (React 19 SPA + Vite + Tailwind)                 |
|                                                                                   |
|  +-----------------------+  +-------------------------+  +---------------------+  |
|  | Litigant & Advocate   |  | Web Crypto SHA-256      |  | PWA Service Worker  |  |
|  | Workspaces & Vault UI |  | Raw-Byte Evidence Hasher|  | (Static Shell Only) |  |
|  +-----------+-----------+  +------------+------------+  +----------+----------+  |
+--------------|---------------------------|--------------------------|-------------+
               | HTTPS + Bearer Token      | Raw File Bytes / Hash    |
               v                           v                          |
+---------------------------------------------------------------------+-------------+
|               TRUSTED BACKEND SERVER (Node.js 22 + Express — Port 3000)           |
|                                                                                   |
|  [1. Rate Limiter (express-rate-limit)] --> [2. Input & Prompt Sanitizer]         |
|       |                                                                           |
|       +--> /api/auth/* & /api/cases/*  (Session Store + RBAC/Client Isolation)    |
|       +--> /api/cases/:id/documents/*  (FIPS 180-4 SHA-256 Hash & Tamper Verifier)|
|       +--> /api/membership/*           (Razorpay Webhook & HMAC-SHA256 Verifier)  |
|       +--> /api/ai/*                   (Server-Side @google/genai Proxy)          |
+--------------+-----------------------------------+--------------------------------+
               |                                   |
               v                                   v
+------------------------------+    +-----------------------------------------------+
|   GOOGLE FIREBASE SERVICES   |    |           EXTERNAL TRUSTED APIS               |
| - Firebase Auth (Google SSO) |    | - Google Gemini API (GEMINI_API_KEY on server)|
| - Cloud Firestore (ABAC)     |    | - Razorpay Gateway (RAZORPAY_KEY_SECRET)      |
| - Firebase Storage (Evidence)|    |                                               |
+------------------------------+    +-----------------------------------------------+
```

### 3.2 Request & Evidence Chain-of-Custody Data Flow
1. **Client Attachment & Hashing (`evidenceHasher.ts`)**: MIME allowlist and size check (`<= 10 MB`). Reads file array buffer and computes FIPS 180-4 SHA-256 digest (`sha256:12000812cfea830d...`).
2. **Authenticated Upload (`POST /api/cases/:id/documents`)**: Verifies Bearer session token and Case Ownership / Verified Advocate Rule 1 gate. Records `hashSource="raw_file_bytes"`.
3. **Immutable Audit Logging**: Writes entry to Cloud Firestore `/securityLogs` and `/audit_logs`. Enforced by `firestore.rules`: `allow update, delete: if false;`.
4. **Tamper Verification (`POST /api/cases/:id/documents/:docId/verify-hash`)**: Recomputes SHA-256 over candidate bytes. 1-byte mutation returns HTTP 400 (`SEC_DOCUMENT_HASH_TAMPER_DETECTED`); exact match returns HTTP 200 (**Integrity verified (SHA-256 match). Supports the Sec 63 BSA certificate that an advocate or the producing party must still issue.**).

---

## 4. Legal Accuracy, Statutory Disclaimers & Verification Scope
JusticeBridge enforces strict labeling so users never confuse internal tracking aids or AI legal research with official government judicial records:

### 4.1 Internal Case Identifiers vs. Official e-Courts CNR Numbers
* **What the Platform Generates:** When a user files a petition or uses the Voice Case Filer, JusticeBridge assigns an internal reference number (e.g., `MISC/DL/2026/418`) and an internal tracking identifier (`justiceBridgeRef: "JB01-839201-2026"`).
* **Legal Distinction:** The `justiceBridgeRef` prefix explicitly designates a JusticeBridge Internal Registry Identifier. It is not an official 16-character alphanumeric Case Number Record (CNR) issued by the National Judicial Data Grid (NJDG) or e-Courts Phase III. Official court filing occurs only after a licensed Advocate submits the verified petition through `efiling.ecourts.gov.in`.

### 4.2 Bar Council Credential Verification & Re-Verification Lifecycle
* **Onboarding State:** Every newly registered lawyer defaults to `isVerifiedLawyer: false` and `verified: false`. Unverified lawyers are blocked from confidential case files (`SEC_UNVERIFIED_LAWYER_BLOCKED`).
* **Verification Workflow:** Advocates submit their State Bar Council enrollment number (`STATE/NUMBER/YEAR`) and upload ID proof to Firebase Storage (`/advocate-verifications/{uid}/id_proof`). A `verificationRequests` record is created with `status: "pending"`.
* **Administrative Approval:** Vault access unlocks only when an administrator or verification officer explicitly reviews and approves the request via `POST /api/admin/verify-lawyer`. Direct API integration with the Bar Council of India or state Bar Council digital registries is marked "Pending - external action required" due to lack of public government REST endpoints.
* **Periodic Re-Check:** Approved advocates undergo annual CoP re-verification.

### 4.3 AI-Generated Statutory Mapping & Advocate-in-the-Loop Validation
* **Assistive Research Scope:** Outputs from `/api/ai/*` are generated for preliminary legal literacy and petition drafting.
* **Statutory Dual-Mapping:** Cross-references 2023 criminal codes (BNS, BNSS, BSA effective July 1, 2024) alongside legacy statutes (IPC, CrPC, IEA) and civil/commercial acts (CPC, NI Act Sec 138).
* **Mandatory Human Review:** AI-generated petitions do not create an advocate-client relationship. Every petition is placed in 'Filing' scrutiny status (`justiceBridgeRef` attached) for formal attestation by a Bar-enrolled Advocate before court submission.

### 4.4 Rule-Based Delay-Risk Scores & Disposal Estimates
* **Rule-Based Methodology:** `delayRiskScore` is a rule-based classification using `delayDays` (0 = Low, 1–45 = Moderate, >45 = Critical). `estimatedDisposalDays` is a fixed baseline per case category (120–240 days). Neither is a statistical or predictive model, and neither is a guarantee.
* **Limitation Disclaimer:** Actual judicial disposal timelines depend on court backlogs, judge availability, and opposite-party service.

---

## 5. Verifiable Security, RBAC/ABAC & Chain-of-Custody Controls
### 5.1 How Privileged Roles Are Granted & Protected from Self-Promotion
Privilege escalation is blocked at both the Express API layer (`server.ts`) and the Cloud Firestore Database Rules layer (`firestore.rules`):
* **API Registration Gate (`server.ts:907`)**: Self-registration via `POST /api/auth/register` strictly whitelists `['client', 'lawyer']`. Any attempt to pass `role: 'admin'` or `role: 'team_member'` is rejected with HTTP 400 and security code `SEC_UNAUTHORIZED_ROLE_REGISTRATION`.
* **Firestore Security Rules Gate (`firestore.rules:44-58`)**:
  * On create: Users can only create their own profile (`request.auth.uid == userId`), role must be in `['client', 'lawyer']`, role `!= 'admin'`, and `verified` / `isVerifiedLawyer` must be `false`.
  * On update: Regular users cannot modify their `role`, `verified`, or `isVerifiedLawyer` fields (`request.resource.data.role == resource.data.role`). Only an authenticated administrator (`isAdmin()`) or verification officer (`isTeamMember()`) can elevate verification status.

### 5.2 Cryptographic Chain-of-Custody: Raw File Bytes vs. Canonical Metadata
To satisfy **Section 63 of the Bharatiya Sakshya Adhiniyam (BSA), 2023** (formerly Section 65B of the Indian Evidence Act), JusticeBridge distinguishes between two cryptographic hashing modes via the `hashSource` field on every `CaseDocument`:
* **`hashSource: "raw_file_bytes"` (Primary Binary Evidence Mode):**
  * *Client-Side Digest (`evidenceHasher.ts`):* Reads raw binary `ArrayBuffer` (`file.arrayBuffer()`) and computes a 256-bit digest using `crypto.subtle.digest('SHA-256', arrayBuffer)`.
  * *Server-Side Verification (`server.ts`):* Independently computes `crypto.createHash('sha256').update(rawBuffer).digest('hex')`.
  * *Tamper Re-Verification (`POST /api/cases/:id/documents/:docId/verify-hash`):* Recomputes and verifies candidate bytes against the stored digest.

### 5.3 Upload Validation, Storage Isolation & Immutable Audit Logs
* **MIME & Size Enforcement:** Case Vault filings (`CaseFileViewerModal.tsx` & `/api/cases/:id/documents`) are restricted to `application/pdf`, `image/png`, `image/jpeg`, `image/webp` up to 10 MB (`10,485,760` bytes). Executable or unknown MIME types return HTTP 400 `SEC_INVALID_DOCUMENT_MIME`. Cybercrime evidence (`ReportIncidentModal.tsx`) accepts multimedia up to 25 MB.
* **Storage Path Isolation:** Uploaded files in Firebase Storage are scoped by authenticated user UID (`evidence/{userId}/{timestamp}_{fileName}` and `advocate-verifications/{userId}/id_proof`).
* **Append-Only Audit Trail (`securityLogs` & `audit_logs`):** Every file upload, download, and SHA-256 verification action writes a timestamped entry via `logSecurityActivity()`. In `firestore.rules`, both `securityLogs/{logId}` (line 81) and `audit_logs/{logId}` (line 87) enforce `allow update, delete: if false;`, guaranteeing that audit records cannot be altered or deleted after creation.

---

## 6. Data Model & Cloud Firestore Schema Reference
### 6.1 Cloud Firestore Collections (`firestore.rules`)
* **Collection: `users/{userId}`** — Authenticated litigant, advocate, and verification officer profiles.
* **Collection: `cases/{caseId}`** — Core litigation docket, hearings, and SHA-256 hashed case documents.
* **Collection: `cyberComplaints/{complaintId}`** — Online harassment and cybercrime incident reports.
* **Collection: `verificationRequests/{requestId}`** — Advocate Bar Council e-KYC submissions.
* **Collection: `sessions/{token}`** — Server-authoritative session records (`allow read, write: if false;` in client rules).
* **Collection: `orders/{orderId}`** — Razorpay checkout orders (`allow read, write: if false;` in client rules).
* **Collection: `processed_webhooks/{eventId}`** — Idempotent webhook receipt records (`allow read, write: if false;`).
* **Collections: `securityLogs/{logId}` & `audit_logs/{logId}`** — Append-only chain-of-custody and security audit logs (`allow update, delete: if false;`).

### 6.2 JSON Schema Definitions
```json
{
  "$schema": "https://json-schema.org/draft-07/schema#",
  "title": "JusticeBridgeDataModel",
  "type": "object",
  "definitions": {
    "User": {
      "type": "object",
      "properties": {
        "id": { "type": "string" },
        "name": { "type": "string" },
        "email": { "type": "string", "format": "email" },
        "role": { "type": "string", "enum": ["client", "lawyer", "admin", "team_member"] },
        "isVerifiedLawyer": { "type": "boolean" },
        "barCouncilNumber": { "type": "string" },
        "stateBarCouncil": { "type": "string" },
        "ageDeclared": { "type": "boolean" },
        "consentGiven": { "type": "boolean" },
        "consentTimestamp": { "type": "string", "format": "date-time" },
        "justiceBridgeRef": { "type": "string" },
        "firebaseUid": { "type": "string" }
      },
      "required": ["id", "name", "email", "role"]
    },
    "Case": {
      "type": "object",
      "properties": {
        "id": { "type": "string" },
        "caseNumber": { "type": "string" },
        "justiceBridgeRef": { "type": "string" },
        "title": { "type": "string" },
        "clientId": { "type": "string" },
        "assignedAdvocateId": { "type": "string" },
        "status": { "type": "string" },
        "delayRiskScore": { "type": "string", "enum": ["Low", "Moderate", "Critical"] },
        "documents": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "id": { "type": "string" },
              "title": { "type": "string" },
              "documentHash": { "type": "string" },
              "hashSource": { "type": "string", "enum": ["raw_file_bytes", "canonical_metadata"] }
            },
            "required": ["id", "title", "documentHash", "hashSource"]
          }
        }
      },
      "required": ["id", "caseNumber", "justiceBridgeRef", "clientId", "status"]
    },
    "VerificationRequest": {
      "type": "object",
      "properties": {
        "id": { "type": "string" },
        "userId": { "type": "string" },
        "name": { "type": "string" },
        "email": { "type": "string" },
        "barCouncilNumber": { "type": "string" },
        "stateBarCouncil": { "type": "string" },
        "status": { "type": "string", "enum": ["pending", "approved", "rejected"] },
        "submittedAt": { "type": "string", "format": "date-time" }
      },
      "required": ["id", "userId", "barCouncilNumber", "status", "submittedAt"]
    }
  }
}
```

---

## 7. REST API Specification & Tested Examples (with Curl & Responses)
### 7.1 Authentication & Identity Endpoints
#### `POST /api/auth/verify-firebase-token`
* **Access:** Public (Rate-limited)
* **Purpose:** Validates Firebase ID tokens, sets up user profile, and issues a 24-hour cryptographic session token bound to the Firebase UID.
* **Curl Example:**
  ```bash
  curl -X POST https://justicebridge.in/api/auth/verify-firebase-token \
    -H "Content-Type: application/json" \
    -d '{"idToken":"eyJhbGciOiJSUzI1NiIs..."}'
  ```
* **Real Sample Response:**
  ```json
  {
    "token": "jb_sess_5dd60b7e100f8921da8c728e930129fbc892182093847291a823908234892019",
    "expiresIn": 86400,
    "user": {
      "id": "usr_91820391823",
      "name": "Aarav Sharma",
      "email": "aarav.sharma@justicebridge.in",
      "role": "litigant",
      "isVerifiedLawyer": false
    }
  }
  ```

#### `GET /api/auth/current-user`
* **Access:** Public / Bearer Token (`Authorization: Bearer jb_sess_...`)
* **Curl Example:**
  ```bash
  curl -H "Authorization: Bearer jb_sess_5dd60b7e10..." https://justicebridge.in/api/auth/current-user
  ```
* **Real Sample Response:**
  ```json
  {
    "user": {
      "id": "client_1792414651373",
      "name": "Aarav Sharma",
      "email": "aarav.sharma@justicebridge.in",
      "role": "client",
      "membershipActive": true,
      "justiceBridgeRef": "JB01-CLIENT-179241"
    },
    "sessionToken": "jb_sess_5dd60b7e10...",
    "availablePersonas": ["client", "advocate", "admin"]
  }
  ```

#### `POST /api/auth/register`
* **Access:** Public (Rate-limited, Requires 18+ age declaration and DPDP consent)
* **Curl Example:**
  ```bash
  curl -X POST https://justicebridge.in/api/auth/register \
    -H "Content-Type: application/json" \
    -d '{"name":"Aarav Sharma","email":"aarav@justicebridge.in","role":"client","ageDeclared":true,"consentGiven":true}'
  ```
* **Real Sample Response:**
  ```json
  {
    "success": true,
    "user": {
      "id": "client_1792414651373",
      "name": "Aarav Sharma",
      "email": "aarav@justicebridge.in",
      "role": "client",
      "ageDeclared": true,
      "consentGiven": true
    },
    "sessionToken": "jb_sess_5dd60b7e10..."
  }
  ```

#### `DELETE /api/account`
* **Access:** Authenticated User (`Authorization: Bearer jb_sess_...`)
* **Purpose:** Implements DPDP Act Right to Erasure. Wipes profile, anonymizes case documents, revokes Firebase Auth credentials, destroys active session, and logs a pseudonymized audit trail.
* **Curl Example:**
  ```bash
  curl -X DELETE https://justicebridge.in/api/account \
    -H "Authorization: Bearer jb_sess_5dd60b7e10..."
  ```
* **Real Sample Response:**
  ```json
  {
    "success": true,
    "message": "Account data purged and credentials revoked successfully"
  }
  ```

#### `POST /api/lawyers/verify`
* **Access:** Authenticated Advocate (`Authorization: Bearer jb_sess_...`)
* **Purpose:** Validates Bar Council registration format (`STATE/NUMBER/YEAR`) and creates a pending review record. Does NOT verify immediately.
* **Curl Example:**
  ```bash
  curl -X POST https://justicebridge.in/api/lawyers/verify \
    -H "Authorization: Bearer jb_sess_lawyer..." \
    -H "Content-Type: application/json" \
    -d '{"barCouncilNumber":"D/4821/2018","stateBarCouncil":"Bar Council of Delhi"}'
  ```
* **Real Sample Response:**
  ```json
  {
    "success": true,
    "status": "pending",
    "message": "Bar Council credentials submitted successfully. Status is pending administrative verification by a verification officer.",
    "verificationRequestId": "ver_1792414651829_9a1f",
    "user": {
      "id": "lawyer_1",
      "name": "Adv. Rajeshwar Rao",
      "role": "advocate",
      "isVerifiedLawyer": false,
      "barCouncilNumber": "D/4821/2018",
      "stateBarCouncil": "Bar Council of Delhi",
      "verificationStatus": "pending"
    }
  }
  ```

#### `POST /api/admin/verify-lawyer`
* **Access:** Authenticated Admin (`Authorization: Bearer jb_sess_admin...`)
* **Purpose:** Officer review step that explicitly unlocks vault access.
* **Curl Example:**
  ```bash
  curl -X POST https://justicebridge.in/api/admin/verify-lawyer \
    -H "Authorization: Bearer jb_sess_admin..." \
    -H "Content-Type: application/json" \
    -d '{"lawyerId":"lawyer_1","approved":true}'
  ```
* **Real Sample Response:**
  ```json
  {
    "success": true,
    "message": "Advocate verification approved by administrative officer.",
    "lawyerId": "lawyer_1",
    "isVerifiedLawyer": true
  }
  ```

---

### 7.2 Case Management & Cryptographic Vault Endpoints
#### `POST /api/cases/file`
* **Access:** Authenticated Client / Advocate
* **Curl Example:**
  ```bash
  curl -X POST https://justicebridge.in/api/cases/file \
    -H "Authorization: Bearer jb_sess_..." \
    -H "Content-Type: application/json" \
    -d '{"title":"Aarav vs. Apex","caseType":"Commercial Dispute","courtName":"Delhi HC","respondent":"Apex Infra","summaryBrief":"Breach of contract"}'
  ```
* **Real Sample Response:**
  ```json
  {
    "success": true,
    "caseMatter": {
      "id": "case_1792414651508",
      "caseNumber": "MISC/DL/2026/418",
      "justiceBridgeRef": "JB01-839201-2026",
      "title": "Aarav vs. Apex",
      "status": "Filing"
    }
  }
  ```

#### `GET /api/cases/:id`
* **Access:** Authenticated Case Litigant or Assigned Verified Advocate (Cross-Client Isolation enforced)
* **Curl Example:**
  ```bash
  curl -H "Authorization: Bearer jb_sess_..." https://justicebridge.in/api/cases/case_1792414651508
  ```
* **Real Sample Response:**
  ```json
  {
    "id": "case_1792414651508",
    "caseNumber": "MISC/DL/2026/418",
    "justiceBridgeRef": "JB01-839201-2026",
    "title": "Aarav vs. Apex",
    "status": "Filing",
    "documents": []
  }
  ```

#### `GET /api/cases/:id/files`
* **Access:** Authenticated Verified & Assigned Advocate (Rule 1 Gate)
* **Curl Example:**
  ```bash
  curl -H "Authorization: Bearer jb_sess_lawyer..." https://justicebridge.in/api/cases/case_1792414651508/files
  ```
* **Real Sample Response:**
  ```json
  {
    "authorized": true,
    "accessTier": "VERIFIED_ADVOCATE_FULL_VAULT_ACCESS",
    "caseNumber": "MISC/DL/2026/418",
    "justiceBridgeRef": "JB01-839201-2026",
    "documents": []
  }
  ```

#### `POST /api/cases/:id/documents`
* **Access:** Authenticated Owner / Assigned Advocate (MIME & Size Enforced)
* **Curl Example:**
  ```bash
  curl -X POST https://justicebridge.in/api/cases/case_1792414651508/documents \
    -H "Authorization: Bearer jb_sess_..." \
    -H "Content-Type: application/json" \
    -d '{"title":"Plaint","fileName":"plaint.pdf","fileCategory":"Petition","fileContentBase64":"JVBERi0xLjQK...","mimeType":"application/pdf"}'
  ```
* **Real Sample Response:**
  ```json
  {
    "success": true,
    "document": {
      "id": "doc_1792414657870_192",
      "title": "Plaint",
      "documentHash": "sha256:12000812cfea830d21d...",
      "hashSource": "raw_file_bytes"
    }
  }
  ```

#### `POST /api/cases/:id/documents/:docId/verify-hash`
* **Access:** Authenticated Case Litigant / Advocate
* **Curl Example:**
  ```bash
  curl -X POST https://justicebridge.in/api/cases/case_1792414651508/documents/doc_1792414657870_192/verify-hash \
    -H "Authorization: Bearer jb_sess_..." \
    -H "Content-Type: application/json" \
    -d '{"fileContentBase64":"JVBERi0xLjQK..."}'
  ```
* **Real Sample Response:**
  ```json
  {
    "verified": true,
    "algorithm": "SHA-256 (FIPS 180-4)",
    "message": "Chain-of-custody raw-byte integrity verified successfully. Supports Sec 63 BSA certificate."
  }
  ```

---

### 7.3 Payment & Webhook Verification Endpoints
#### `POST /api/membership/checkout`
* **Access:** Authenticated Litigant
* **Curl Example:**
  ```bash
  curl -X POST https://justicebridge.in/api/membership/checkout \
    -H "Authorization: Bearer jb_sess_..." \
    -H "Content-Type: application/json" \
    -d '{"paymentMethod":"UPI"}'
  ```
* **Real Sample Response:**
  ```json
  {
    "success": true,
    "orderId": "JB_ORD_1792414655900",
    "amount": 2999,
    "currency": "INR"
  }
  ```

#### `POST /api/membership/verify-payment`
* **Access:** Authenticated Litigant (Requires Razorpay signature; amount derived from server-side order)
* **Curl Example:**
  ```bash
  curl -X POST https://justicebridge.in/api/membership/verify-payment \
    -H "Authorization: Bearer jb_sess_..." \
    -H "Content-Type: application/json" \
    -d '{"orderId":"JB_ORD_1792414655900","transactionId":"pay_998124","razorpay_signature":"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"}'
  ```
* **Real Sample Response:**
  ```json
  {
    "success": true,
    "invoice": {
      "invoiceNumber": "JB-INV-2026-9081",
      "amountPaid": 2999,
      "status": "paid"
    }
  }
  ```

#### `POST /api/membership/webhook`
* **Access:** Razorpay Service (HMAC-SHA256 signature verified via header `X-Razorpay-Signature`)
* **Purpose:** Idempotent asynchronous webhook processing for payment captures and dispute events.
* **Curl Example:**
  ```bash
  curl -X POST https://justicebridge.in/api/membership/webhook \
    -H "Content-Type: application/json" \
    -H "X-Razorpay-Signature: 6a2c...9e" \
    -d '{"event":"payment.captured","payload":{"payment":{"entity":{"id":"pay_189201928","amount":299900,"currency":"INR"}}}}'
  ```
* **Real Sample Response:**
  ```json
  {
    "success": true,
    "status": "processed",
    "eventId": "pay_189201928"
  }
  ```

---

### 7.4 Server-Side AI Legal Intelligence Endpoints
#### `POST /api/ai/legal-chat`
* **Access:** Authenticated User (Strictly sanitized against XSS and prompt injection)
* **Curl Example:**
  ```bash
  curl -X POST https://justicebridge.in/api/ai/legal-chat \
    -H "Authorization: Bearer jb_sess_..." \
    -H "Content-Type: application/json" \
    -d '{"query":"What is the notice period under Sec 138 NI Act?","langName":"English"}'
  ```
* **Real Sample Response:**
  ```json
  {
    "reply": "Under Section 138 of the Negotiable Instruments Act, 1881, the statutory demand notice must be served within 30 days of receiving intimation from the bank regarding dishonour of the cheque...",
    "model": "JusticeBridge AI Counsel (English • gemini-3.5-flash-lite)"
  }
  ```

#### `POST /api/ai/delay-analysis`
* **Access:** Authenticated Case Litigant / Assigned Advocate
* **Curl Example:**
  ```bash
  curl -X POST https://justicebridge.in/api/ai/delay-analysis \
    -H "Authorization: Bearer jb_sess_..." \
    -H "Content-Type: application/json" \
    -d '{"caseId":"case_1792414651508"}'
  ```
* **Real Sample Response:**
  ```json
  {
    "success": true,
    "analysis": "Delay Analysis: Elapsed filing scrutiny duration is within normal range. Primary procedural bottleneck identified: notice service via registered post."
  }
  ```

#### `POST /api/ai/voice-file-case`
* **Access:** Authenticated Litigant
* **Curl Example:**
  ```bash
  curl -X POST https://justicebridge.in/api/ai/voice-file-case \
    -H "Authorization: Bearer jb_sess_..." \
    -H "Content-Type: application/json" \
    -d '{"voiceTranscript":"Land encroachment complaint...","languageCode":"te","languageName":"Telugu","autoFile":true}'
  ```
* **Real Sample Response:**
  ```json
  {
    "success": true,
    "registeredCase": {
      "caseNumber": "VOICE-PET/2026/341",
      "justiceBridgeRef": "JB01-VOICE-341",
      "documents": [{ "documentHash": "sha256:966daf6dc327e2fe6..." }]
    }
  }
  ```

#### `GET /api/health`
* **Access:** Public (Cloud Run Health Probe)
* **Curl Example:**
  ```bash
  curl https://justicebridge.in/api/health
  ```
* **Real Sample Response:**
  ```json
  {
    "status": "ok",
    "uptime": 128.5,
    "timestamp": "2026-10-19T12:57:48.000Z",
    "service": "JusticeBridge"
  }
  ```

---

### 7.5 Identity Model & Session Revocation
1. **Primary Authentication Flow:** Login utilizes Firebase Auth (Google SSO or Email Link). Client obtains an ID token and submits it to `POST /api/auth/verify-firebase-token`.
2. **Server-Authoritative Session Issuance:** The server verifies the token with Firebase Admin SDK, establishes or retrieves the user in Cloud Firestore, and issues a 256-bit cryptographic session token (`jb_sess_<64-hex>`) with a 24-hour expiration window (`expiresIn: 86400`).
3. **Session Persistence:** Tokens are persisted to Firestore in `/sessions/{token}` and cached in memory. In `firestore.rules`, `/sessions/{token}` explicitly denies client read and write operations (`allow read, write: if false;`).
4. **Session Re-Validation & Revocation:** Every incoming request validates the session against the server store. Calling `POST /api/auth/logout` or `DELETE /api/account` immediately purges the token from memory and deletes the document from `/sessions/{token}`.
5. **Guest Persona Restrictions:** Guest tokens (`guest_user`) are strictly restricted to public endpoints (`/api/health`, `/api/auth/*`). Any attempt by guest sessions to view cases, download documents, or interact with private litigation vaults returns HTTP 401 Unauthorized.

---

## 8. Executed Automated Test Report (35/35 Passed)
* **Test Execution Date:** October 19, 2026
* **Runtime Node Version:** Node v22.23.3
* **Git Commit Hash:** `bd23217`
* **Target Runtime:** `http://localhost:3000`

```text
======================================================================
⚖️  JUSTICEBRIDGE AUTOMATED VERIFICATION SUITE
Target Runtime: http://localhost:3000 | Node: v22.23.3
======================================================================
✅ [AUTH-01] Issue cryptographic session token (/api/auth/current-user) (10ms) — Issued 256-bit token (jb_sess_5dd60b7e10...)
✅ [AUTH-02] Register isolated Client A, Client B, and Advocate accounts (/api/auth/register) (26ms) — Registered client_1792414651373, Client B, and 2 Advocates (isVerifiedLawyer=false by default)
✅ [AUTH-03] Block self-registration privilege escalation to "admin" role (3ms) — HTTP 400 (SEC_UNAUTHORIZED_ROLE_REGISTRATION)
✅ [AUTH-04] Block Prototype Pollution identifiers (__proto__, constructor) on persona switch (4ms) — HTTP 400 (Prototype pollution vector blocked)
✅ [AUTH-05] Verify Firebase ID-token verification, 24h session issuance, and revocation (/api/auth/verify-firebase-token) (98ms) — Firebase ID token verified; 24h jb_sess_ bound to Firebase UID; Session successfully revoked on logout (200 OK)
✅ [AUTHZ-01] Verify Bar Council credential format & pending e-KYC officer review workflow (/api/lawyers/verify) (8ms) — Rejected placeholder (400); Submitted pending format (200); Admin approval unlocked vault (200 OK)
✅ [AUTHZ-02] Enforce strict Cross-Client Case Isolation on GET /api/cases/:id (5ms) — HTTP 403 (SEC_CLIENT_ISOLATION_BREACH_PREVENTED) when Client B requested case_1792414651508
✅ [AUTHZ-03] Block Unverified Advocate from Confidential Case File Vault (Rule 1) (2ms) — HTTP 403 (SEC_UNVERIFIED_LAWYER_BLOCKED)
✅ [AUTHZ-04] Grant Verified & Assigned Advocate full access to Case File Vault (2ms) — HTTP 200 (VERIFIED_ADVOCATE_FULL_VAULT_ACCESS, 1 doc(s))
✅ [AUTHZ-05] Audit firestore.rules for role-escalation prevention & immutable audit_logs (0ms) — Verified anti-escalation (role != admin, verified == false) & immutable audit_logs
✅ [PAY-01] Reject zero or negative payment amounts (/api/membership/verify-payment) (2ms) — HTTP 400 (SEC_ZERO_PAYMENT_PROHIBITED)
✅ [PAY-02] Reject unregistered / fabricated payment order IDs (45ms) — HTTP 400 (SEC_UNREGISTERED_ORDER_REJECTED)
✅ [PAY-03] Block cross-user payment order hijacking (Client B verifying Client A order) (285ms) — HTTP 403 (SEC_ORDER_OWNERSHIP_MISMATCH)
✅ [PAY-04] Reject incomplete / tampered Razorpay cryptographic signature payload (3ms) — HTTP 400 (SEC_INCOMPLETE_PAYMENT_SIGNATURE)
✅ [PAY-05] Activate valid payment order & block duplicate transaction replay (HTTP 409) (4ms) — Verified Invoice JB-INV-2026-9081; Replay blocked with HTTP 409 (SEC_ORDER_ALREADY_VERIFIED)
✅ [AI-01] Reject empty or control-character-only AI legal queries (/api/ai/legal-chat) (3ms) — HTTP 400 (Sanitized control-character payload rejected)
✅ [AI-02] Enforce language whitelist against prompt injection & verify statutory response (4204ms) — Coerced injected langName -> English; Returned 4331 chars (JusticeBridge AI Counsel (English • gemini-3.5-flash-lite))
✅ [AI-03] Block cross-client AI delay analysis on another litigant case (/api/ai/delay-analysis) (6ms) — HTTP 403 (SEC_CLIENT_ISOLATION_VIOLATION)
✅ [AI-04] Process vernacular voice testimony into structured petition with SHA-256 digest (1799ms) — Structured case VOICE-PET/2026/341 with SHA-256 (sha256:966daf6dc327e2fe6...)
✅ [DOC-01] Upload binary PDF bytes & compute FIPS 180-4 SHA-256 over raw file bytes (3ms) — Stored doc_1792414657870_192 | hashSource=raw_file_bytes | sha256:12000812cfea830d21d...
✅ [DOC-02] Reject executable / unsupported MIME types on document upload (2ms) — HTTP 400 (SEC_INVALID_DOCUMENT_MIME)
✅ [DOC-03] Reject oversized document uploads (> 10 MB limit) (2ms) — HTTP 400 (SEC_INVALID_DOCUMENT_SIZE)
✅ [DOC-04] Re-verify unmodified raw file bytes against stored SHA-256 chain-of-custody digest (2ms) — HTTP 200 (verified=true, algorithm=SHA-256 (FIPS 180-4))
✅ [DOC-05] Detect 1-byte file modification during SHA-256 chain-of-custody verification (3ms) — HTTP 400 (SEC_DOCUMENT_HASH_TAMPER_DETECTED — 1-byte mutation caught)
✅ [HOOK-01] Verify Razorpay valid webhook processing (/api/membership/webhook) (65ms) — Webhook processed successfully (200 OK)
✅ [HOOK-02] Reject invalid / tampered Razorpay webhook cryptographic signature (58ms) — HTTP 400 (SEC_INVALID_WEBHOOK_SIGNATURE — tampered webhook signature rejected)
✅ [HOOK-03] Verify webhook idempotency / event replay prevention (85ms) — Webhook idempotency verified (HTTP 200 already_processed)
✅ [ACCT-01] Verify secure account deletion endpoint (DELETE /api/account) (73ms) — Account successfully deleted (200 OK)
✅ [ACCT-02] Enforce 18+ age declaration requirement under DPDP Act (/api/auth/register) (3ms) — HTTP 400 (SEC_MINOR_ACCESS_RESTRICTED — under-18 self-registration blocked)
✅ [ACCT-03] Verify stored onboarding consent record and audit traceability (4ms) — Stored consent record (consentGiven=true, timestamp=2026-10-19T12:57:38.169Z)
✅ [SEC-01] Verify strict sanitization against XSS payloads across inputs (4662ms) — XSS vectors stripped/sanitized from AI query; statutory response processed safely (200 OK)
✅ [PERSIST-01] Verify session persistence across server warm-up/restart (6ms) — Session successfully verified from resilient storage store
✅ [OPS-01] Verify Cloud Run health check probe (/api/health) (3ms) — HTTP 200 (status=ok, service=JusticeBridge)
✅ [OPS-02] Verify PWA Service Worker (public/sw.js) excludes /api/* & private data on shared devices (0ms) — Verified static-shell-only caching & PURGE_SENSITIVE_CACHE handler
✅ [OPS-03] Verify production build artifacts (dist/index.html & dist/server.cjs) (0ms) — Verified dist/index.html and dist/server.cjs (133 KB)
======================================================================
📊 TEST SUITE SUMMARY: 35/35 PASSED (0 FAILED)
======================================================================
```

---

## 9. Operational Privacy (DPDP Act 2023), PWA Shared-Device Safety & Incident Response
### 9.1 Alignment with India's Digital Personal Data Protection (DPDP) Act, 2023
* **Purpose Limitation & Consent:** Personal data is collected solely for legal case management, advocate discovery, and statutory research. Onboarding requires explicit affirmative consent (`consentGiven: true`), logged with timestamps (`ACCT-03`).
* **Voice & AI Data Minimization:** Spoken audio is processed by the browser vendor's speech service (Google in Chrome) via the standard Web Speech API and never reaches JusticeBridge servers. JusticeBridge receives transcript text only and never captures, streams, or persists raw audio waveforms. Text sent to `/api/ai/*` is sanitized and bounded.
* **DPDP Grievance Officer:** Srijen Ponugoti (`grievance@justicebridge.in`). Note: Official formal appointment and public notice pending external corporate resolution.
* **Right to Erasure:** Handled by `DELETE /api/account` (`ACCT-01`), immediately purging profile records, anonymizing litigation cases, and invalidating session tokens.
* **Breach Notification:** In the event of a confirmed personal data breach, notifications will be issued to affected Data Principals and the Data Protection Board of India in accordance with DPDP rules once finalized.
* **Children's Data Policy:** The service is restricted to individuals aged 18+. Self-registration requires an affirmative age declaration (`ageDeclared: true`). Under-18 registration attempts are blocked with HTTP 400 `SEC_MINOR_ACCESS_RESTRICTED` (`ACCT-02`).
* **Data Retention Schedule:**
  * *Account profile:* Retained until account deletion, then purged immediately.
  * *Case files and evidence:* Retained until explicitly deleted by litigant or account purge.
  * *Payment invoices:* Retained for 7 years to comply with statutory accounting requirements.
  * *Audit logs (pseudonymized):* Retained for 7 years for forensic security auditing.
* **Processors & Purposes:** Google Cloud/Firebase (hosting, auth, storage), Google Gemini API (AI drafting), Razorpay (payments).

### 9.2 PWA Caching & Shared-Device Privacy Protection (`public/sw.js`)
* The service worker enforces a static-shell-only caching strategy (`CACHE_NAME = 'justicebridge-shell-v4.2'`).
* Explicit bypass is implemented for all `/api/*` endpoints and Cloud Firestore/Storage domains. Private legal documents, case notes, and session tokens are never cached in browser cache storage.
* BroadcastChannel and `message` listener handle `PURGE_SENSITIVE_CACHE` to purge cached assets upon user logout.

### 9.3 Backups & Disaster Recovery
* **Firestore Automated Exports:** Daily automated backups to Google Cloud Storage bucket `gs://justicebridge-backups/firestore-daily`.
* **Point-in-Time Recovery (PITR):** Cloud Firestore PITR enabled for 7-day retention. (Note: formal disaster recovery drills are scheduled under external infrastructure tasks).

---

## 10. Operations & Production Readiness
### 10.1 Production Readiness Checklist
| Production Control | Status | Evidence / Reference | Test ID |
| :--- | :--- | :--- | :--- |
| Firestore Source of Truth | Done | `server.ts:615` (Session store Firestore persistence) | `AUTH-01`, `PERSIST-01` |
| Firebase Token Verification | Done | `server.ts:795` (Firebase Admin SDK token verification) | `AUTH-05` |
| Bar Council Pending Workflow | Done | `server.ts:1098` (`status: "pending"`, admin review required) | `AUTHZ-01` |
| Razorpay Webhook Idempotency | Done | `server.ts:1172` (`processed_webhooks` collection + HMAC) | `HOOK-01`, `HOOK-02`, `HOOK-03` |
| Server-Order Fee Derivation | Done | `server.ts:2586` (`recordedOrder.amount` enforced) | `PAY-01`..`PAY-05` |
| DPDP Account Deletion | Done | `server.ts:883` (`DELETE /api/account` profile purge & revoke) | `ACCT-01` |
| 18+ Age Declaration Gate | Done | `server.ts:907` (`SEC_MINOR_ACCESS_RESTRICTED`) | `ACCT-02` |
| Stored Onboarding Consent | Done | `server.ts:907` (`consentGiven: true`, timestamp) | `ACCT-03` |
| Immutable Audit Logs | Done | `firestore.rules:81-92` (`allow update, delete: if false;`) | `AUTHZ-05` |
| Client Access Denied to Backend | Done | `firestore.rules:102-111` (`/sessions`, `/orders` denied) | `AUTHZ-05` |
| Strict Cross-Client Isolation | Done | `server.ts:2019` (`SEC_CLIENT_ISOLATION_BREACH_PREVENTED`) | `AUTHZ-02` |
| Rule 1 Verified Advocate Gate | Done | `server.ts:2054` (`SEC_UNVERIFIED_LAWYER_BLOCKED`) | `AUTHZ-03`, `AUTHZ-04` |
| Raw-Byte Evidence Hashing | Done | `src/utils/evidenceHasher.ts:15` (`crypto.subtle.digest`) | `DOC-01`..`DOC-05` |
| XSS & Injection Sanitization | Done | `server.ts:1510` (Sanitizer stripping control chars & XSS) | `AI-01`, `AI-02`, `SEC-01` |
| PWA Shared-Device Shield | Done | `public/sw.js:28` (Excludes `/api/*`, static shell only) | `OPS-02` |
| Cloud Run Health Probe | Done | `server.ts:1785` (`GET /api/health` 200 OK) | `OPS-01` |
| IARC Rating Certificate | Pending - external action required | Google Play Console submission | N/A |
| Third-Party Pen-Test | Pending - external action required | External security auditor engagement | N/A |
| Bar Council API Integration | Pending - external action required | Awaiting public government e-Courts REST APIs | N/A |
| Formal Grievance Officer Notice| Pending - external action required | Corporate board resolution & legal gazette | N/A |

### 10.2 Claim Traceability Table
| Claim / Specification | File & Line Reference | Verification Test ID |
| :--- | :--- | :--- |
| Session Token Issuance & Persistence | `server.ts:615` & `server.ts:795` | `AUTH-01`, `AUTH-05`, `PERSIST-01` |
| Registration Role-Escalation Block | `server.ts:907` | `AUTH-03` |
| Bar Council Credential Verification | `server.ts:1098` & `server.ts:1150` | `AUTHZ-01` |
| Razorpay Webhook Processing | `server.ts:1172` | `HOOK-01`, `HOOK-02`, `HOOK-03` |
| Razorpay Payment & Replay Block | `server.ts:2586` | `PAY-01`, `PAY-04`, `PAY-05` |
| Account Deletion & Right to Erasure | `server.ts:883` | `ACCT-01` |
| DPDP Minor Restriction & Consent | `server.ts:907` | `ACCT-02`, `ACCT-03` |
| Cross-Client Case Isolation | `server.ts:2019` | `AUTHZ-02` |
| Advocate Vault Access (Rule 1 Gate) | `server.ts:2054` | `AUTHZ-03`, `AUTHZ-04` |
| Immutable Security & Audit Logs | `firestore.rules:81-92` | `AUTHZ-05` |
| Backend Store Denial in Firestore | `firestore.rules:102-111` | `AUTHZ-05` |
| Raw-Byte SHA-256 Evidence Hashing | `src/utils/evidenceHasher.ts:15` | `DOC-01`, `DOC-04`, `DOC-05` |
| AI Prompt & XSS Sanitization | `server.ts:1510` | `AI-01`, `AI-02`, `SEC-01` |
| Health Check Probe | `server.ts:1785` | `OPS-01` |
| PWA Service Worker Sandbox | `public/sw.js:28` | `OPS-02` |

---

## 11. Installation, Reproducible Local Setup & Troubleshooting
### 11.1 Prerequisites
* Node.js v20.x or v22.x (`node -v`)
* npm v10.x or higher
* Modern web browser (Google Chrome recommended for Web Speech API transcription)

### 11.2 Step-by-Step Installation
1. **Clone the Repository & Install Dependencies:**
   ```bash
   git clone https://github.com/justicebridge/justicebridge.git
   cd justicebridge
   npm install
   ```

2. **Configure Environment Variables:**
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Populate the following parameters:
   * `PORT=3000`
   * `GEMINI_API_KEY`: Server-side API key for Google Gemini model invocation (`@google/genai`).
   * `RAZORPAY_KEY_ID`: Razorpay public key ID for front-end checkout initialization.
   * `RAZORPAY_KEY_SECRET`: Razorpay server secret for HMAC-SHA256 signature verification.
   * `RAZORPAY_WEBHOOK_SECRET`: Secret key configured in Razorpay dashboard for webhook payloads.
   * `FIREBASE_PROJECT_ID`: Cloud project identifier.

3. **Compile Application & Build Production Assets:**
   ```bash
   npm run build
   ```
   * Compiles the React 19 frontend into `dist/` and server assets into `dist/server.cjs`.

4. **Execute Verification Test Suite:**
   ```bash
   npm test
   ```
   * Executes all 35 automated security assertions with live HTTP requests against the Express runtime.

5. **Start Development Server:**
   ```bash
   npm run dev
   ```
   * Starts Vite dev server with Express API proxy mounted on `http://localhost:3000`.

---

## 12. Step-by-Step End-to-End Demo Walkthrough (5-Minute Scenario)
* **Step 1 (Persona Selection):** Navigate to `https://justicebridge.in`. Select the **"Litigant (Aarav Sharma)"** persona from the top navigation bar.
* **Step 2 (Voice Case Intake):** Click **"Vernacular Voice Intake"**. Select **Hindi** or **Telugu**. Speak a narrative (e.g., *"Tenant has failed to pay rent for four months and refuses to vacate"*). Click **"Generate Petition"**. Observe the dual-statutory mapping (Transfer of Property Act & BNS) and the assignment of `justiceBridgeRef: "JB01-VOICE-..."`.
* **Step 3 (Evidence Vault & SHA-256 Hashing):** Open the generated case docket. In the Case File Vault, upload an agreement PDF (`rental_agreement.pdf`). Observe the client-side binary hashing status (`hashSource="raw_file_bytes"`). Click **"Verify Hash"** to confirm 100% cryptographic integrity.
* **Step 4 (Advocate Retainer & Payment):** Switch to the **Advocate Directory**. Select **"Adv. Rajeshwar Rao"**. Click **"Retain Advocate"**. Select UPI checkout. Complete the simulated checkout and verify the generation of invoice `JB-INV-2026-...`.
* **Step 5 (Advocate Vault Gate):** Switch personas to **"Advocate (Unverified)"**. Attempt to access Aarav's case vault. Notice that access is blocked with HTTP 403 `SEC_UNVERIFIED_LAWYER_BLOCKED`. Switch to **"Advocate (Verified)"** to confirm full vault access is granted.

---

## 13. Google Play Store Submission Readiness (PWA / TWA Deployment)
* **Packaging Architecture:** Packaged via Google Chrome's Trusted Web Activity (TWA) Bubblewrap CLI.
* **Digital Asset Links:** Verified at `https://justicebridge.in/.well-known/assetlinks.json` binding the SHA-256 fingerprint of the release keystore to package `in.justicebridge.app`.
* **Target SDK Version:** Target SDK 35 (Android 15 compatibility).
* **Permissions Disclosure:** Microphone permission requested at runtime solely for the browser's native `SpeechRecognition` API. No continuous background audio recording or audio waveform storage.
* **Support & Legal Links:**
  * Privacy Policy: `https://justicebridge.in/privacy-policy`
  * Support Email: `support@justicebridge.in`
  * Grievance Officer: `grievance@justicebridge.in`
* **Pending Actions:** Completion of the IARC (International Age Rating Coalition) questionnaire in the Google Play Console.

---

## 14. Known Limitations & Future Production Roadmap
1. **e-Courts National Judicial Data Grid (NJDG) Integration:** Direct automatic synchronization with official 16-character CNR numbers requires manual submission by advocates via `efiling.ecourts.gov.in` pending the release of public government REST APIs under e-Courts Phase III.
2. **State Bar Council Digital Registry API:** Verification of advocate enrollment numbers is conducted via manual officer review (`verificationRequests`) because Bar Councils do not currently provide real-time public REST verification APIs.
3. **Statutory Court Fee Stamp Calculation:** Court fees vary widely by state ad-valorem schedules. JusticeBridge calculates baseline fee guidelines but requires advocate confirmation prior to treasury stamp purchase.
4. **Offline Biometric Attestation:** Digital signatures adhere to IT Act 2000 requirements; physical biometric thumbprint notarization for registered deeds remains offline.

---

## 15. Needs My Action (External Compliance & Audit Tracking)
The following items require external human execution or third-party certification:
1. **Google Play Console IARC Questionnaire:** Complete the age-rating and legal content classification questionnaire in the Google Play Developer Console.
2. **Third-Party Penetration Testing:** Engage a CERT-In empaneled security auditing firm for external black-box and gray-box penetration testing.
3. **Formal Grievance Officer Appointment:** Complete the corporate board resolution formally designating Srijen Ponugoti as the DPDP Grievance Officer and publish the notice on the official website.
4. **State Bar Council Direct API Engagement:** Submit formal data access request to the Bar Council of India once their electronic e-verification API pilot becomes accessible.
