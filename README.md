# ⚖️ JusticeBridge Legal Engine — Technical & Architecture Documentation

**Document Version:** 3.0 (Production & Audit Specification)  
**Runtime Stack:** React 19 • TypeScript • Vite 6 • Tailwind CSS v4 • Node.js 22 (Express) • Google Firebase (Auth, Firestore, Storage) • Google Gemini API (`@google/genai`) • Razorpay HMAC-SHA256

---

## 📑 Table of Contents

1. [Executive Summary & Implementation Scope](#1-executive-summary--implementation-scope)
2. [Core Feature Architecture (7 Functional Pillars)](#2-core-feature-architecture-7-functional-pillars)
3. [System Architecture & Data-Flow Diagrams](#3-system-architecture--data-flow-diagrams)
4. [Legal Accuracy, Statutory Disclaimers & Verification Scope](#4-legal-accuracy-statutory-disclaimers--verification-scope)
5. [Verifiable Security, RBAC/ABAC & Chain-of-Custody Controls](#5-verifiable-security-rbacabac--chain-of-custody-controls)
6. [Data Model & Cloud Firestore Schema Reference](#6-data-model--cloud-firestore-schema-reference)
7. [REST API Specification & Tested Examples](#7-rest-api-specification--tested-examples)
8. [Executed Automated Test Report (26/26 Passed)](#8-executed-automated-test-report-2626-passed)
9. [Operational Privacy (DPDP Act 2023), PWA Shared-Device Safety & Incident Response](#9-operational-privacy-dpdp-act-2023-pwa-shared-device-safety--incident-response)
10. [Installation, Reproducible Local Setup & Troubleshooting](#10-installation-reproducible-local-setup--troubleshooting)
11. [Step-by-Step End-to-End Demo Walkthrough](#11-step-by-step-end-to-end-demo-walkthrough)
12. [Google Play Store Submission Readiness](#12-google-play-store-submission-readiness)
13. [Known Limitations & Future Production Roadmap](#13-known-limitations--future-production-roadmap)

---

## 1. Executive Summary & Implementation Scope

**JusticeBridge** is a full-stack Indian Legal-Tech platform engineered to bridge the gap between citizens (litigants) and Bar Council–verified legal advocates. Designed around India's modern statutory framework—including the **Bharatiya Nyaya Sanhita (BNS), Bharatiya Nagarik Suraksha Sanhita (BNSS), and Bharatiya Sakshya Adhiniyam (BSA), 2023** alongside legacy **IPC, CrPC, CPC, and NI Act** provisions—the platform reduces pre-litigation friction through vernacular voice-to-petition intake, isolated case management, cryptographic raw-byte evidence hashing, and server-side AI legal research.

### Live Deployment Environments
* **Development Environment:** `https://ais-dev-2ygeqzn4xbgemovtatd7wg-621467385062.asia-southeast1.run.app`
* **Shared / Preview Environment:** `https://ais-pre-2ygeqzn4xbgemovtatd7wg-621467385062.asia-southeast1.run.app`
* **UI Screenshots (Included in Repository):** Desktop (`public/screenshot-desktop.png`) and Mobile PWA (`public/screenshot-mobile.png`).

### Explicit Scope Matrix: Designed vs. Implemented vs. Tested vs. Officially Verified

To maintain strict engineering and legal transparency, the platform's capabilities are classified across four verification tiers:

* **Implemented & Automated-Tested in Codebase (`26/26` assertions passing via `npm test`):**
  * Cryptographic 256-bit session token issuance (`jb_sess_<64-hex>`) and prototype-pollution guards.
  * Strict Cross-Client Case Isolation (`HTTP 403 SEC_CLIENT_ISOLATION_BREACH_PREVENTED`) and Rule 1 Verified Advocate Vault Gate (`HTTP 403 SEC_UNVERIFIED_LAWYER_BLOCKED`).
  * **Raw File-Byte SHA-256 Hashing** (`crypto.subtle.digest('SHA-256', arrayBuffer)` in browser + `crypto.createHash('sha256')` in Node.js) with 1-byte tamper detection (`POST /api/cases/:id/documents/:docId/verify-hash`).
  * Server-side Razorpay order tracking, ownership binding, anti-replay (`HTTP 409`), and `HMAC-SHA256` signature verification.
  * Server-side Gemini AI legal counsel and multilingual voice petition extraction with prompt-injection sanitization and deterministic statutory fallback.
  * Zero-Trust Cloud Firestore Security Rules (`firestore.rules`) preventing role self-escalation and enforcing append-only immutable audit logs (`securityLogs` / `audit_logs`).
* **Platform-Internal / Simulated Workflows (Requires External Government/Registry API for Official Legal Effect):**
  * Platform-generated case references (`MISC/DL/2026/...`) and tracking IDs (`JB01-...-2026`) are **internal JusticeBridge tracking identifiers**, not official government e-Courts CNR numbers.
  * Bar Council credential verification enforces format validation, ID document upload to Firebase Storage (`/advocate-verifications/{uid}/id_proof`), and human officer approval via `verificationRequests`, rather than real-time automated government API polling (as the Bar Council of India does not expose a public open REST API).

---

## 2. Core Feature Architecture (7 Functional Pillars)

### Pillar 1: Bar Council–Verified Advocate Directory & Retainer Booking
* **Capabilities:** Litigants filter advocates by specialization, court jurisdiction, State Bar Council enrollment, spoken languages, and consultation fee; supports video, phone, and chamber bookings.
* **Implementation:** Newly registered lawyers default to `isVerifiedLawyer: false` (`firestore.rules` & `server.ts`). Full vault privileges unlock only after Bar Council credential validation and ID proof submission.

### Pillar 2: Vernacular Voice-Enabled Petition Filer
* **Capabilities:** Non-technical or rural citizens narrate grievances in **English, Hindi (हिन्दी), Telugu (తెలుగు), Tamil (தமிழ்), or Kannada (ಕನ್ನಡ)** to generate a structured litigation petition draft.
* **Implementation:** Browser Web Speech API captures spoken testimony and sends the transcript to `POST /api/ai/voice-file-case`. Server-side Gemini AI extracts structured JSON (`title`, `caseType`, `courtName`, `respondent`, `legalSections`, `reliefSought`, `keyFacts`, and native-language spoken reassurance) and computes a 64-character SHA-256 petition digest.

### Pillar 3: Confidential Case File Vault & Raw-Byte SHA-256 Evidence Hashing
* **Capabilities:** Isolated judicial vault for petitions, affidavits, vakalatnamas, and digital evidence with interactive SHA-256 integrity verification (`Verify SHA-256` button).
* **Implementation:** `src/services/evidenceHasher.ts` reads the uploaded file's raw binary `ArrayBuffer` via Web Crypto API (`crypto.subtle.digest('SHA-256', buffer)`) prior to upload, enforcing MIME (`application/pdf`, `image/png`, `image/jpeg`, `image/webp`) and size (`<= 10 MB`) constraints. `POST /api/cases/:id/documents/:docId/verify-hash` recomputes and verifies raw bytes against the stored digest.

### Pillar 4: Server-Side AI Legal Intelligence & Delay-Reduction Engine
* **Capabilities:** Maps citizen grievances to **BNS / BNSS / BSA (2023)** and **IPC / CrPC / CPC / NI Act Sec 138** provisions, audits procedural bottlenecks, and generates 3-point expedited hearing strategies.
* **Implementation:** Executes exclusively on the backend (`server.ts`) via `@google/genai` with multi-model fallback (`gemini-3.5-flash-lite` → `gemini-3.8-flash` → `gemini-flash-latest` → localized statutory playbook in English, Hindi, Telugu, Tamil, Kannada, and Malayalam).

### Pillar 5: Cybercrime & Online Abuse Incident Reporting
* **Capabilities:** Dedicated workflow (`ReportIncidentModal.tsx`) for reporting online harassment, defamation, impersonation, and hate speech with multimedia evidence uploads.
* **Implementation:** Validates image/video/PDF evidence (`<= 25 MB`), computes the raw-byte SHA-256 digest in-browser, uploads binary evidence to Firebase Storage (`evidence/{userId}/{timestamp}_{fileName}`), and stores the hash and metadata in Cloud Firestore (`cyberComplaints`) and `securityLogs`.

### Pillar 6: Hearing Calendar & Preliminary Scrutiny Scheduling
* **Capabilities:** Tracks scheduled hearings, courtroom/bench assignments, adjournment reasons, and preliminary e-filing scrutiny dates.
* **Implementation:** Synchronizes case hearing arrays and generates downloadable court docket summaries via `jsPDF` and `jspdf-autotable`.

### Pillar 7: Progressive Web App (PWA) with Shared-Device Privacy Isolation
* **Capabilities:** Installable mobile/desktop experience with offline application shell support and Android Trusted Web Activity (`/.well-known/assetlinks.json`) verification.
* **Implementation:** `public/sw.js` caches only static UI shell assets and explicitly bypasses `/api/*`, `firestore.googleapis.com`, `identitytoolkit.googleapis.com`, and `firebasestorage.googleapis.com` so private legal data never persists in shared browser caches.

---

## 3. System Architecture & Data-Flow Diagrams

### 3.1 High-Level Component Architecture (ASCII Diagram — PDF Safe)

```text
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
|       +--> /api/membership/*           (Razorpay Order & HMAC-SHA256 Verifier)    |
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

```text
[Litigant / Advocate Selects PDF or Image File]
       |
       v
[1. Client Validation (src/services/evidenceHasher.ts)]
    - Checks MIME allowlist (PDF, PNG, JPEG, WebP) & size limit (<= 10 MB)
    - Reads file.arrayBuffer() -> crypto.subtle.digest('SHA-256', rawBytes)
    - Produces 64-hex digest: "sha256:12000812cfea830d..."
       |
       v
[2. Authenticated Upload (POST /api/cases/:id/documents)]
    - Verifies Bearer session token & Case Ownership / Verified Advocate Rule 1
    - Computes/validates FIPS 180-4 SHA-256 over raw file bytes
    - Stores document metadata with hashSource="raw_file_bytes" & timestamp
       |
       v
[3. Immutable Audit Logging (Cloud Firestore /securityLogs & /audit_logs)]
    - Records userId, actionType ("FILE_UPLOAD"), SHA-256 digest, ISO timestamp
    - Enforced by firestore.rules: allow update, delete: if false;
       |
       v
[4. Later Tamper Verification (POST /api/cases/:id/documents/:docId/verify-hash)]
    - Recomputes SHA-256 of candidate file bytes and compares with storedHash
    - 1-byte mutation -> HTTP 400 (SEC_DOCUMENT_HASH_TAMPER_DETECTED)
    - Exact match     -> HTTP 200 (Sec 63 BSA 2023 / Sec 65B IEA Verified)
```

---

## 4. Legal Accuracy, Statutory Disclaimers & Verification Scope

Because JusticeBridge operates in the legal domain, the platform enforces strict labelling so users never confuse internal tracking aids or AI legal research with official government judicial records:

### 4.1 Internal Case Identifiers vs. Official e-Courts CNR Numbers
* **What the Platform Generates:** When a user files a petition or uses the Voice Case Filer, JusticeBridge assigns an internal reference number (e.g., `MISC/DL/2026/412` or `VOICE-PET/2026/493`) and an internal tracking identifier prefixed with **`JB01-`** (e.g., `JB01-839201-2026`).
* **Legal Distinction:** The `JB01-` prefix explicitly designates a **JusticeBridge Internal Registry Identifier**. It is **not** an official 16-character alphanumeric Case Number Record (CNR) issued by the National Judicial Data Grid (NJDG) or the Government of India e-Courts Phase III system. Official court filing and hearing confirmation occur only after a licensed Advocate submits the verified petition through the respective High Court or District Court e-Filing portal (`efiling.ecourts.gov.in`).

### 4.2 Bar Council Credential Verification & Re-Verification Lifecycle
* **Onboarding State:** Every newly registered lawyer account is initialized with `isVerifiedLawyer: false` and `verified: false`. Unverified lawyers are blocked from viewing confidential case files (`SEC_UNVERIFIED_LAWYER_BLOCKED`).
* **Verification Workflow:**
  1. The advocate submits their State Bar Council Enrollment Number (validated against Indian Bar format patterns such as `D/4821/2018` or `KAR/1029/2016`) and uploads their Bar Council ID card / Certificate of Practice (`AdvocateUploadUI.tsx`) to Firebase Storage (`/advocate-verifications/{uid}/id_proof`).
  2. A verification record is created in `verificationRequests/{requestId}` with `status: "pending"`.
  3. Authorized verification officers (`isAdmin() || isTeamMember()` in `firestore.rules`) review the credential against State Bar Council rolls and transition the status to `approved` or `rejected`.
* **Periodic Re-Check Policy:** Approved advocate credentials carry an annual re-verification window (every 12 months) to confirm active Certificate of Practice (CoP) standing under Bar Council of India Rules.

### 4.3 AI-Generated Statutory Mapping & Advocate-in-the-Loop Validation
* **Assistive Research Scope:** All outputs from `/api/ai/legal-chat`, `/api/ai/delay-analysis`, and `/api/ai/voice-file-case` are generated for **preliminary legal literacy and petition drafting assistance**.
* **Statutory Dual-Mapping:** The AI engine cross-references the **2023 criminal law codes** (**BNS, BNSS, BSA** effective July 1, 2024) alongside legacy statutes (**IPC, CrPC, IEA**) and civil/commercial acts (**CPC, Specific Relief Act, Negotiable Instruments Act Sec 138**).
* **Mandatory Human Review:** AI-generated petitions and statutory citations do not constitute formal legal representation or create an advocate-client relationship. Every voice-filed or AI-drafted petition is placed in `'Filing'` scrutiny status (`assignedLawyerName: "Awaiting Advocate Verification & Retainer"`) for review and formal attestation by a Bar-enrolled Advocate before court submission.

### 4.4 Methodology & Limitations of Delay-Risk Scores & Disposal Estimates
* **Heuristic Methodology:**
  * `estimatedDisposalDays` (default baseline: `120–240` days depending on case category) and `delayRiskScore` (`'Low' | 'Moderate' | 'Critical'`) are **statistical heuristics** derived from historical category averages (e.g., Commercial Suits vs. Civil Property disputes), elapsed days since filing (`daysElapsed`), and recorded adjournment counts (`delayDays`).
  * **Classification Thresholds:** `delayDays == 0` → `Low`; `1 <= delayDays <= 45` → `Moderate`; `delayDays > 45` → `Critical`.
* **Limitation Disclaimer:** Actual judicial disposal timelines depend on court roster backlogs, judge availability, opposite-party service of summons, and interlocutory applications, and cannot be guaranteed by any software system.

---

## 5. Verifiable Security, RBAC/ABAC & Chain-of-Custody Controls

### 5.1 How Privileged Roles Are Granted & Protected from Self-Promotion
Privilege escalation is blocked at both the **Express API layer (`server.ts`)** and the **Cloud Firestore Database Rules layer (`firestore.rules`)**:

1. **API Registration Gate (`server.ts` lines 485–492):**
   Self-registration via `POST /api/auth/register` strictly whitelists `['client', 'lawyer']`. Any attempt to pass `role: 'admin'` or `role: 'team_member'` is rejected with `HTTP 400` and security code `SEC_UNAUTHORIZED_ROLE_REGISTRATION`.
2. **Firestore Security Rules Gate (`firestore.rules` lines 13–35):**
   * On `create`: Users can only create their own profile (`request.auth.uid == userId`), `role` must be in `['client', 'lawyer']`, `role != 'admin'`, and `verified` / `isVerifiedLawyer` must be `false`.
   * On `update`: Regular users cannot modify their `role`, `verified`, or `isVerifiedLawyer` fields (`request.resource.data.role == resource.data.role`). Only an authenticated administrator (`isAdmin()`) or verification officer (`isTeamMember()`) can elevate verification status.

### 5.2 Cryptographic Chain-of-Custody: Raw File Bytes vs. Canonical Metadata
To satisfy **Section 63 of the Bharatiya Sakshya Adhiniyam (BSA), 2023** (formerly **Section 65B of the Indian Evidence Act**), JusticeBridge distinguishes between two cryptographic hashing modes via the `hashSource` field on every `CaseDocument`:

1. **`hashSource: "raw_file_bytes"` (Primary Binary Evidence Mode):**
   * **Client-Side Digest (`src/services/evidenceHasher.ts`):** When a user attaches a PDF, image, or video in `CaseFileViewerModal.tsx` or `ReportIncidentModal.tsx`, the browser reads the raw binary `ArrayBuffer` (`file.arrayBuffer()`) and computes a 256-bit digest using `crypto.subtle.digest('SHA-256', arrayBuffer)`.
   * **Server-Side Verification (`server.ts`):** When binary content (`fileContentBase64`) is transmitted to `POST /api/cases/:id/documents`, the server independently computes `crypto.createHash('sha256').update(rawBuffer).digest('hex')`.
   * **Tamper Re-Verification (`POST /api/cases/:id/documents/:docId/verify-hash`):** At any point during discovery or trial preparation, an auditor or advocate can submit the file bytes or candidate digest to `/verify-hash`. Even a **single modified byte** alters the 64-character hex digest and triggers `HTTP 400 SEC_DOCUMENT_HASH_TAMPER_DETECTED`.
2. **`hashSource: "canonical_payload"` (Structured Text Petition Mode):**
   * When a petition is generated purely from text or spoken voice testimony without an external binary attachment, the system hashes the canonical UTF-8 string (`caseId|title|summary|userId`) using SHA-256.

### 5.3 Upload Validation, Storage Isolation & Immutable Audit Logs
* **MIME & Size Enforcement:**
  * Case Vault filings (`CaseFileViewerModal.tsx` & `/api/cases/:id/documents`): Restricted to `application/pdf`, `image/png`, `image/jpeg`, `image/webp` up to **10 MB** (`10,485,760` bytes). Executable or unknown MIME types return `HTTP 400 SEC_INVALID_DOCUMENT_MIME`.
  * Cybercrime Evidence (`ReportIncidentModal.tsx`): Restricted to images, PDFs, and `video/mp4` / `video/webm` up to **25 MB**.
* **Storage Path Isolation:** Uploaded files in Firebase Storage are scoped by authenticated user UID (`evidence/{userId}/{timestamp}_{fileName}` and `advocate-verifications/{userId}/id_proof`).
* **Append-Only Audit Trail (`securityLogs` & `audit_logs`):**
  Every file upload, download, and SHA-256 verification action writes a timestamped entry via `logSecurityActivity()` (`src/services/securityLogger.ts`). In `firestore.rules`, both `securityLogs/{logId}` and `audit_logs/{logId}` enforce `allow update, delete: if false;`, guaranteeing that audit records cannot be altered or deleted after creation.

---

## 6. Data Model & Cloud Firestore Schema Reference

### 6.1 Cloud Firestore Collections (`firestore.rules`)

#### Collection: `users/{userId}`
* **Purpose:** Authenticated litigant, advocate, and verification officer profiles.
* **Access Control:** Owner read/create; owner update (with `role` and `isVerifiedLawyer` locked against self-modification); public read for `role == 'lawyer'` directory profiles.
```json
{
  "id": "client_1791541636593",
  "name": "Aarav Sharma",
  "email": "aarav.sharma@example.in",
  "role": "client",
  "phone": "+91 98000 00000",
  "isVerifiedLawyer": false,
  "membershipActive": true,
  "membershipPlan": "client_annual",
  "trialDaysRemaining": 21,
  "isTrialActive": true
}
```

#### Collection: `cases/{caseId}`
* **Purpose:** Core litigation docket, hearings, and SHA-256 hashed case documents.
* **Access Control:** Strictly isolated to `resource.data.clientId == request.auth.uid`, `resource.data.assignedLawyerId == request.auth.uid`, or `isAdmin()`.
```json
{
  "id": "case_1791541636633",
  "caseNumber": "MISC/DL/2026/418",
  "cnrNumber": "JB01-649210-2026",
  "title": "Aarav Sharma vs. Apex Infra Pvt Ltd",
  "caseType": "Commercial Dispute",
  "filingDate": "2026-10-09",
  "courtName": "High Court of Delhi",
  "clientId": "client_1791541636593",
  "assignedLawyerId": "lawyer_1791541636610",
  "status": "Filing",
  "delayRiskScore": "Low",
  "estimatedDisposalDays": 120,
  "documents": [
    {
      "id": "doc_1791541643157_189",
      "title": "Certified Bank Return Memo & Sec 63 BSA Certificate",
      "fileName": "Bank_Return_Memo_Sec63.pdf",
      "fileType": "pdf",
      "fileSize": "0.1 KB",
      "byteLength": 93,
      "mimeType": "application/pdf",
      "uploadedAt": "2026-10-09",
      "uploadedBy": "Aarav Sharma",
      "uploadedById": "client_1791541636593",
      "uploadedTimestampIso": "2026-10-09T10:27:23.157Z",
      "fileCategory": "Evidence",
      "isRestricted": true,
      "documentHash": "sha256:12000812cfea830d21d8b6b6472060f47b272a022b7d705c2276a0267281e53f",
      "hashSource": "raw_file_bytes",
      "pageCount": 12
    }
  ]
}
```

#### Collection: `cyberComplaints/{complaintId}`
* **Purpose:** Online harassment, defamation, and cybercrime incident reports with raw-byte evidence digests.
* **Access Control:** Created and read only by the reporting `clientId` or authorized verification officers.
```json
{
  "id": "cyb_982341",
  "clientId": "client_1791541636593",
  "platformName": "Instagram",
  "targetUrl": "https://instagram.com/p/example123",
  "abuseType": "Impersonation",
  "impactDescription": "Fake account soliciting funds using petitioner identity.",
  "evidenceUrl": "https://firebasestorage.googleapis.com/.../evidence.png",
  "evidenceSha256": "sha256:4f8b42c22dd3729b519ba6f68d2da7cc5b2d606d05daed5ad5128cc03e6c6358",
  "evidenceByteSize": 245120,
  "status": "Pending",
  "createdAt": "2026-10-09T10:25:00.000Z"
}
```

#### Collection: `verificationRequests/{requestId}`
* **Purpose:** Advocate Bar Council e-KYC submissions pending officer review.
* **Access Control:** Authenticated create; read by submitting user or verification officers; status transitions (`pending` → `approved | rejected`) restricted to `isAuthorizedForVerification()`.

#### Collections: `securityLogs/{logId}` & `audit_logs/{logId}`
* **Purpose:** Append-only chain-of-custody and security event logs (`FILE_UPLOAD`, `FILE_ACCESS`, `HASH_VERIFIED`, `EVIDENCE_UPLOAD`).
* **Access Control:** Authenticated create (`userId == request.auth.uid`); admin read; **`allow update, delete: if false;`** (strictly immutable).

---

## 7. REST API Specification & Tested Examples

*(Formatted as structured endpoint blocks for clean PDF pagination without column wrapping.)*

### 7.1 Authentication & Identity Endpoints
* **`GET /api/auth/current-user`**
  * **Access:** Public / Bearer Token
  * **Behaviour:** Resolves the caller's 256-bit session token (`jb_sess_...`) or issues a fresh token for guest isolation.
* **`POST /api/auth/register`**
  * **Access:** Public (Rate-limited)
  * **Body:** `{ "name": "string", "email": "string", "role": "client" | "lawyer" }`
  * **Security Enforcement:** Rejects `role: "admin"` with `HTTP 400 SEC_UNAUTHORIZED_ROLE_REGISTRATION`. Initializes lawyers with `isVerifiedLawyer: false`.
* **`POST /api/lawyers/verify`**
  * **Access:** Authenticated Advocate or Admin
  * **Body:** `{ "barCouncilNumber": "D/4821/2018", "stateBarCouncil": "Bar Council of Delhi" }`
  * **Security Enforcement:** Rejects placeholder IDs (`PENDING/REG/2026`) with `HTTP 400 SEC_INVALID_BAR_COUNCIL_CREDENTIAL`.

### 7.2 Case Management & Cryptographic Vault Endpoints
* **`POST /api/cases/file`**
  * **Access:** Authenticated Client / Advocate
  * **Body:** `{ "title": "string", "caseType": "string", "courtName": "string", "respondent": "string", "summaryBrief": "string", "assignedLawyerId": "string" }`
  * **Behaviour:** Creates an isolated `CaseMatter` bound to `clientId: user.id` and generates an initial petition document with a 64-hex SHA-256 digest.
* **`GET /api/cases/:id` & `GET /api/cases/:id/files`**
  * **Access:** Case Owner (`clientId`) or Verified Assigned Advocate (`assignedLawyerId`)
  * **Security Enforcement:** Cross-client access returns `HTTP 403 SEC_CLIENT_ISOLATION_BREACH_PREVENTED`. Unverified advocates receive `HTTP 403 SEC_UNVERIFIED_LAWYER_BLOCKED`.
* **`POST /api/cases/:id/documents`**
  * **Access:** Case Owner or Verified Assigned Advocate
  * **Body:** `{ "title": "string", "fileName": "string", "fileCategory": "Evidence", "fileContentBase64": "string", "clientFileHash": "sha256:<64-hex>", "mimeType": "application/pdf", "byteLength": 93 }`
  * **Security Enforcement:** Validates MIME allowlist (`SEC_INVALID_DOCUMENT_MIME`), enforces `<= 10 MB` size (`SEC_INVALID_DOCUMENT_SIZE`), and computes/records the FIPS 180-4 SHA-256 digest over the raw file bytes (`hashSource: "raw_file_bytes"`).
* **`POST /api/cases/:id/documents/:docId/verify-hash`**
  * **Access:** Case Owner or Verified Assigned Advocate
  * **Body:** `{ "fileContentBase64": "string" }` or `{ "candidateHash": "sha256:<64-hex>" }`
  * **Behaviour:** Recomputes the SHA-256 digest of the supplied bytes and compares it against the stored chain-of-custody digest. Returns `HTTP 200` (`verified: true`) on match or `HTTP 400` (`SEC_DOCUMENT_HASH_TAMPER_DETECTED`) if even 1 byte was altered.

### 7.3 Payment & Anti-Replay Verification Endpoints
* **`POST /api/membership/checkout`**
  * **Access:** Authenticated User
  * **Behaviour:** Registers a server-side order in `createdOrdersMap` bound to `user.id` and creates a Razorpay order (with GST breakdown).
* **`POST /api/membership/verify-payment`**
  * **Access:** Authenticated Order Owner
  * **Security Enforcement:**
    1. Rejects `amount <= 0` (`HTTP 400 SEC_ZERO_PAYMENT_PROHIBITED`).
    2. Rejects unregistered order IDs (`HTTP 400 SEC_UNREGISTERED_ORDER_REJECTED`).
    3. Rejects cross-user order verification (`HTTP 403 SEC_ORDER_OWNERSHIP_MISMATCH`).
    4. Verifies `HMAC-SHA256(razorpay_order_id + "|" + razorpay_payment_id, RAZORPAY_KEY_SECRET)` (`HTTP 400 SEC_INVALID_PAYMENT_SIGNATURE`).
    5. Blocks duplicate transaction/order replay (`HTTP 409 SEC_ORDER_ALREADY_VERIFIED`).

### 7.4 Server-Side AI Legal Intelligence Endpoints
* **`POST /api/ai/legal-chat`**
  * **Body:** `{ "query": "string", "langName": "English" | "Hindi" | "Telugu" | "Tamil" | "Kannada" | "Malayalam" }`
  * **Security Enforcement:** Truncates and strips control/escape characters via `sanitizePromptInput()`, enforces a strict language whitelist against prompt injection, and executes `@google/genai` server-side.
* **`POST /api/ai/delay-analysis`**
  * **Body:** `{ "caseId": "string" }`
  * **Security Enforcement:** Enforces client ownership isolation (`HTTP 403 SEC_CLIENT_ISOLATION_VIOLATION`) before analyzing case bottlenecks.
* **`POST /api/ai/voice-file-case`**
  * **Body:** `{ "voiceTranscript": "string", "languageCode": "te", "languageName": "Telugu", "autoFile": true }`
  * **Behaviour:** Extracts structured petition fields from vernacular speech and computes a 64-hex SHA-256 digest.

---

## 8. Executed Automated Test Report (26/26 Passed)

All security, authorization, payment, AI sanitization, and raw-byte SHA-256 tamper-detection claims are verified by the automated test suite in **`tests/verify-platform.ts`**.

### How to Run the Verification Suite
```bash
npm test
# Executes: tsx tests/verify-platform.ts against http://localhost:3000
```

### Actual Executed Test Log (`Node v22.23.2` — `26/26 PASSED`)

```text
======================================================================
⚖️  JUSTICEBRIDGE AUTOMATED VERIFICATION SUITE
Target Runtime: http://localhost:3000 | Node: v22.23.2
======================================================================

✅ [AUTH-01] Issue cryptographic session token (/api/auth/current-user) (104ms)
   — Issued 256-bit token (jb_sess_b72bc36c2c...)
✅ [AUTH-02] Register isolated Client A, Client B, and Advocate accounts (/api/auth/register) (25ms)
   — Registered client_1791541636593, Client B, and 2 Advocates (isVerifiedLawyer=false by default)
✅ [AUTH-03] Block self-registration privilege escalation to "admin" role (4ms)
   — HTTP 400 (SEC_UNAUTHORIZED_ROLE_REGISTRATION)
✅ [AUTH-04] Block Prototype Pollution identifiers (__proto__, constructor) on persona switch (3ms)
   — HTTP 400 (Prototype pollution vector blocked)

✅ [AUTHZ-01] Verify Bar Council credential format & e-KYC gate (/api/lawyers/verify) (10ms)
   — Rejected placeholder ID (400); Verified D/4821/2018 (200 OK)
✅ [AUTHZ-02] Enforce strict Cross-Client Case Isolation on GET /api/cases/:id (9ms)
   — HTTP 403 (SEC_CLIENT_ISOLATION_BREACH_PREVENTED) when Client B requested case_1791541636633
✅ [AUTHZ-03] Block Unverified Advocate from Confidential Case File Vault (Rule 1) (4ms)
   — HTTP 403 (SEC_UNVERIFIED_LAWYER_BLOCKED)
✅ [AUTHZ-04] Grant Verified & Assigned Advocate full access to Case File Vault (4ms)
   — HTTP 200 (VERIFIED_ADVOCATE_FULL_VAULT_ACCESS, 1 doc(s))
✅ [AUTHZ-05] Audit firestore.rules for role-escalation prevention & immutable audit_logs (0ms)
   — Verified anti-escalation (role != admin, verified == false) & immutable audit_logs

✅ [PAY-01] Reject zero or negative payment amounts (/api/membership/verify-payment) (4ms)
   — HTTP 400 (SEC_ZERO_PAYMENT_PROHIBITED)
✅ [PAY-02] Reject unregistered / fabricated payment order IDs (2ms)
   — HTTP 400 (SEC_UNREGISTERED_ORDER_REJECTED)
✅ [PAY-03] Block cross-user payment order hijacking (Client B verifying Client A order) (264ms)
   — HTTP 403 (SEC_ORDER_OWNERSHIP_MISMATCH)
✅ [PAY-04] Reject incomplete / tampered Razorpay cryptographic signature payload (3ms)
   — HTTP 400 (SEC_INCOMPLETE_PAYMENT_SIGNATURE)
✅ [PAY-05] Activate valid payment order & block duplicate transaction replay (HTTP 409) (7ms)
   — Verified Invoice JB-INV-2026-1962; Replay blocked with HTTP 409 (SEC_ORDER_ALREADY_VERIFIED)

✅ [AI-01] Reject empty or control-character-only AI legal queries (/api/ai/legal-chat) (4ms)
   — HTTP 400 (Sanitized control-character payload rejected)
✅ [AI-02] Enforce language whitelist against prompt injection & verify statutory response (4735ms)
   — Coerced injected langName -> English; Returned 5134 chars (JusticeBridge AI Counsel (English • gemini-3.5-flash-lite))
✅ [AI-03] Block cross-client AI delay analysis on another litigant case (/api/ai/delay-analysis) (4ms)
   — HTTP 403 (SEC_CLIENT_ISOLATION_VIOLATION)
✅ [AI-04] Process vernacular voice testimony into structured petition with SHA-256 digest (1484ms)
   — Structured case VOICE-PET/2026/493 with SHA-256 (sha256:2b1661b15312193a6...)

✅ [DOC-01] Upload binary PDF bytes & compute FIPS 180-4 SHA-256 over raw file bytes (6ms)
   — Stored doc_1791541643157_189 | hashSource=raw_file_bytes | sha256:12000812cfea830d21d...
✅ [DOC-02] Reject executable / unsupported MIME types on document upload (19ms)
   — HTTP 400 (SEC_INVALID_DOCUMENT_MIME)
✅ [DOC-03] Reject oversized document uploads (> 10 MB limit) (4ms)
   — HTTP 400 (SEC_INVALID_DOCUMENT_SIZE)
✅ [DOC-04] Re-verify unmodified raw file bytes against stored SHA-256 chain-of-custody digest (5ms)
   — HTTP 200 (verified=true, algorithm=SHA-256 (FIPS 180-4))
✅ [DOC-05] Detect 1-byte file modification during SHA-256 chain-of-custody verification (5ms)
   — HTTP 400 (SEC_DOCUMENT_HASH_TAMPER_DETECTED — 1-byte mutation caught)

✅ [OPS-01] Verify Cloud Run health check probe (/api/health) (5ms)
   — HTTP 200 (status=ok, service=JusticeBridge)
✅ [OPS-02] Verify PWA Service Worker (public/sw.js) excludes /api/* & private data on shared devices (0ms)
   — Verified static-shell-only caching & PURGE_SENSITIVE_CACHE handler
✅ [OPS-03] Verify production build artifacts (dist/index.html & dist/server.cjs) (0ms)
   — Verified dist/index.html and dist/server.cjs (110 KB)

======================================================================
📊 TEST SUITE SUMMARY: 26/26 PASSED (0 FAILED)
======================================================================
```

---

## 9. Operational Privacy (DPDP Act 2023), PWA Shared-Device Safety & Incident Response

### 9.1 Alignment with India's Digital Personal Data Protection (DPDP) Act, 2023
* **Purpose Limitation & Consent:** Personal data (name, contact details, Bar Council enrollment number, and case narratives) is collected solely for legal case management, advocate discovery, and statutory research.
* **Voice & AI Data Minimization:**
  * Spoken audio in the Voice Case Filer is transcribed via the browser SpeechRecognition API; raw audio waveforms are **not** stored on the server.
  * Text sent to the server-side Gemini API (`/api/ai/*`) is stripped of control characters, bounded to strict token/character limits (`1,000–3,000` chars), and isolated within delimiter tags (`<<<USER_QUERY>>>`).
* **Data Retention & Right to Erasure:**
  * Litigants can clear local session state at any time and request erasure of draft petitions or account data.
  * Immutable security audit logs (`securityLogs` / `audit_logs`) store only pseudonymized UIDs, action types, and cryptographic SHA-256 hashes (no raw PII or case narratives) to preserve evidentiary chain-of-custody without violating privacy rights.

### 9.2 PWA Caching & Shared-Device Privacy Protection (`public/sw.js`)
In rural legal aid centres or shared cyber-cafes, multiple citizens may use the same browser. JusticeBridge prevents cross-user data leakage through three mechanisms:
1. **Static-Only Service Worker Cache:** `public/sw.js` caches only the static application shell (`/`, `/index.html`, `/manifest.json`, icons).
2. **Explicit API & Cloud Bypass:** The Service Worker `fetch` listener explicitly ignores all requests matching `/api/*`, `firestore.googleapis.com`, `identitytoolkit.googleapis.com`, and `firebasestorage.googleapis.com`. Private case JSON responses are **never** written to browser `CacheStorage`.
3. **Cache Purge Handler (`PURGE_SENSITIVE_CACHE`):** Sending `{ type: 'PURGE_SENSITIVE_CACHE' }` to `navigator.serviceWorker.controller` purges all Service Worker caches upon sign-out.

### 9.3 Backup, Recovery, Secret Rotation & Incident Response
* **Database Backups:** Cloud Firestore data in production should be configured with daily managed GCP Firestore exports to a restricted Cloud Storage bucket with 30-day point-in-time recovery (PITR).
* **Secret Management & Rotation:**
  * `GEMINI_API_KEY` and `RAZORPAY_KEY_SECRET` are injected via Cloud Run environment variables (never committed to Git).
  * If a key compromise is suspected, rotate the secret in Google Cloud Console / Razorpay Dashboard and redeploy the Cloud Run revision; zero client code changes are required because neither key is bundled into the frontend.
* **Security Incident Response:** Any repeated `403` isolation breach attempts or `400 SEC_DOCUMENT_HASH_TAMPER_DETECTED` events are logged with timestamps and security error codes for administrative review.

---

## 10. Installation, Reproducible Local Setup & Troubleshooting

### 10.1 Prerequisites
* **Node.js:** `v22.x` (tested on `v22.23.2`)
* **npm:** `>= 10.x`
* **Firebase Project:** Enabled with **Authentication** (Google Sign-In provider), **Cloud Firestore**, and **Firebase Storage**.

### 10.2 Step-by-Step Local Installation

```bash
# 1. Clone the repository and enter the project directory
git clone <your-github-repository-url>
cd justicebridge

# 2. Install dependencies
npm install

# 3. Create your local environment configuration from the template
cp .env.example .env
```

Edit `.env` and supply your server-side credentials:
```ini
# Required for live Gemini AI statutory analysis (falls back to built-in statutory playbook if omitted)
GEMINI_API_KEY=your_gemini_api_key_here

# Optional: Required for live Razorpay order creation & HMAC signature verification
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

```bash
# 4. Start the full-stack development server (Express API + Vite SPA on port 3000)
npm run dev

# 5. In a second terminal, run TypeScript type-checking and the 26-test verification suite
npm run lint
npm test
```

### 10.3 Production Build & Cloud Run Startup
```bash
# Compile frontend assets into dist/ and bundle server into dist/server.cjs
npm run build

# Start production server on port 3000 (0.0.0.0)
npm start
```

### 10.4 Troubleshooting Common Setup Issues
* **Issue: `ERR_MODULE_NOT_FOUND` when running `node server.ts` on Node 22**
  * **Cause:** Node 22 native TypeScript strip-types requires `import type` for pure TypeScript interface files.
  * **Resolution:** Already resolved in `server.ts` (`import type { ... } from './src/types.ts'`). Ensure you are running Node `>= 22.6.0` or use `npm run dev` (`tsx server.ts`).
* **Issue: Firebase `auth/unauthorized-domain` during Google Sign-In**
  * **Cause:** The local or deployed hostname is not whitelisted in Firebase Console.
  * **Resolution:** Add `localhost` and your `.run.app` domain under **Firebase Console → Authentication → Settings → Authorized domains**.
* **Issue: Speech Recognition not starting in Voice Case Filer**
  * **Cause:** Web Speech API (`webkitSpeechRecognition`) requires Chromium-based browsers (Chrome/Edge) and microphone permissions.
  * **Resolution:** Grant microphone permission in Chrome/Edge, or type/paste vernacular text directly into the transcript box.

---

## 11. Step-by-Step End-to-End Demo Walkthrough

Use this 5-minute scenario to demonstrate all core workflows to evaluators, judges, or partners:

1. **Vernacular Voice Petition Intake (Litigant View):**
   * Open the app and click **Speak to File Case** (`VoiceCaseFilerModal`).
   * Select **Telugu (తెలుగు)** or **Hindi (हिन्दी)**, speak or enter a property encroachment grievance, and submit.
   * Observe the structured petition output: mapped **BNS / CPC** sections, relief sought, internal tracking ID (`JB01-...`), and a 64-character SHA-256 petition digest.
2. **Confidential Vault & Raw File-Byte SHA-256 Hashing:**
   * Open **My Cases** → click **View Case Files** on your newly filed case.
   * Click **Add Filing**, attach any PDF or image (`<= 10 MB`), and watch the UI immediately compute and display the **Raw File Bytes SHA-256 Digest** (`sha256:...`) and exact byte count before upload.
   * Submit the document, select it in the vault, and click **Verify SHA-256** to trigger live server-side cryptographic chain-of-custody verification (`Section 63 BSA / 65B IEA Verified`).
3. **Rule 1 Security Enforcement (Unverified vs. Verified Advocate):**
   * Switch to an unverified Advocate profile and attempt to open the **Confidential Case File Vault**.
   * Observe the **Security Policy Rule 1 Enforced (`SEC_UNVERIFIED_LAWYER_BLOCKED`)** screen blocking access until Bar Council credentials (`e.g., D/4821/2018`) are verified.
4. **AI Delay-Reduction & Multilingual Legal Counsel:**
   * Open **Delay Analytics** to run an AI bottleneck audit on the case (`Order XIX CPC` & `Commercial Courts Act` strategy).
   * Open **AI Legal Counsel** and ask a question about **Section 138 NI Act** in English, Hindi, Telugu, or Tamil.
5. **Automated Security & Tamper Proofing (`npm test`):**
   * Run `npm test` in the terminal to show all **26 automated security, payment HMAC, XSS sanitization, and 1-byte tamper detection tests** passing in real time.

---

## 12. Google Play Store Submission Readiness

To prepare JusticeBridge for production release on the Google Play Store, the following requirements have been established and tracked in `metadata.json`:

*   **Content Rating:** Currently set to `Pending`. A complete questionnaire must be submitted via the Google Play Console during the app submission process to obtain the official IARC content rating certificate.
*   **Privacy Policy:** A comprehensive privacy policy is hosted at `https://justicebridge.example.com/privacy-policy`. This must be kept updated to reflect any changes in data handling, particularly concerning the PWA's shared-device privacy features.
*   **Support Information:** The official support contact is `srijenponugoti667@gmail.com`. This address is used for both Play Store listing support and for incident response communications as outlined in section 9.

### Submission Roadmap
1.  **Preparation:** Finalize all promotional assets, privacy policy, and support channels.
2.  **Internal Testing:** Continue testing the PWA and Android Trusted Web Activity (TWA) bundle in the Play Console's internal testing track.
3.  **App Submission:** Complete the Play Console store listing, content rating, and data safety forms, then submit the app for review.

## 13. Known Limitations & Future Production Roadmap

1. **Direct Government e-Courts Phase III API Integration:** Currently, `JB01-...` identifiers and initial scrutiny dates are internal platform records. Future integration with official High Court e-Filing APIs and NJDG webhooks will enable live government CNR synchronization.
2. **Automated Bar Council Roll API Lookup:** Currently relies on format validation, Firebase Storage ID upload, and human verification officer approval (`verificationRequests`). Future partnerships with State Bar Councils will automate roll lookup.
3. **Cloud KMS Hardware Timestamping:** Currently, SHA-256 digests are computed over raw file bytes and logged to append-only Firestore `securityLogs`. Future releases will add RFC 3161 trusted cryptographic timestamping authorities (TSA) for physical court submission certificates.
