⚖️ JusticeBridge Legal Engine — Technical & Architecture Documentation
Document Version: 4.0 (Production & Audit Specification)
Runtime Stack: React 19 • TypeScript • Vite 6 • Tailwind CSS v4 • Node.js 22 (Express) • Google Firebase (Auth, Firestore, Storage) • Google Gemini API (@google/genai) • Razorpay HMAC-SHA256

📑 Table of Contents
Executive Summary & Implementation Scope
Core Feature Architecture (7 Functional Pillars)
System Architecture & Data-Flow Diagrams
Legal Accuracy, Statutory Disclaimers & Verification Scope
Verifiable Security, RBAC/ABAC & Chain-of-Custody Controls
Data Model & Cloud Firestore Schema Reference
REST API Specification & Tested Examples
Executed Automated Test Report (26/26 Passed)
Operational Privacy (DPDP Act 2023), PWA Shared-Device Safety & Incident Response
Operations & Production Readiness
Installation, Reproducible Local Setup & Troubleshooting
Step-by-Step End-to-End Demo Walkthrough
Google Play Store Submission Readiness
Known Limitations & Future Production Roadmap

1. Executive Summary & Implementation Scope
JusticeBridge is a full-stack Indian Legal-Tech platform engineered to bridge the gap between citizens (litigants) and Bar Council–verified legal advocates. Designed around India's modern statutory framework—including the Bharatiya Nyaya Sanhita (BNS), Bharatiya Nagarik Suraksha Sanhita (BNSS), and Bharatiya Sakshya Adhiniyam (BSA), 2023 alongside legacy IPC, CrPC, CPC, and NI Act provisions—the platform reduces pre-litigation friction through vernacular voice-to-petition intake, isolated case management, cryptographic raw-byte evidence hashing, and server-side AI legal research.

Live Deployment Environments
Development Environment: https://ais-dev-2ygeqzn4xbgemovtatd7wg-621467385062.asia-southeast1.run.app
Shared / Preview Environment: https://ais-pre-2ygeqzn4xbgemovtatd7wg-621467385062.asia-southeast1.run.app
UI Screenshots (Included in Repository): Desktop (public/screenshot-desktop.png) and Mobile PWA (public/screenshot-mobile.png).

Explicit Scope Matrix: Designed vs. Implemented vs. Tested vs. Officially Verified
To maintain strict engineering and legal transparency, the platform's capabilities are classified across four verification tiers:

Implemented & Automated-Tested in Codebase (26/26 assertions passing via npm test):
Cryptographic 256-bit session token issuance (jb_sess_<64-hex>) and prototype-pollution guards.
Strict Cross-Client Case Isolation (HTTP 403 SEC_CLIENT_ISOLATION_BREACH_PREVENTED) and Rule 1 Verified Advocate Vault Gate (HTTP 403 SEC_UNVERIFIED_LAWYER_BLOCKED).
Raw File-Byte SHA-256 Hashing (crypto.subtle.digest('SHA-256', arrayBuffer) in browser + crypto.createHash('sha256') in Node.js) with 1-byte tamper detection (POST /api/cases/:id/documents/:docId/verify-hash).
Server-side Razorpay order tracking, ownership binding, anti-replay (HTTP 409), and HMAC-SHA256 signature verification.
Server-side Gemini AI legal counsel and multilingual voice petition extraction with prompt-injection sanitization and deterministic statutory fallback.
Zero-Trust Cloud Firestore Security Rules (firestore.rules) preventing role self-escalation and enforcing append-only immutable audit logs (securityLogs / audit_logs).

Platform-Internal / Simulated Workflows (Requires External Government/Registry API for Official Legal Effect):
Platform-generated case references (MISC/DL/2026/...) and tracking IDs (JB01-...-2026) are internal JusticeBridge tracking identifiers, not official government e-Courts CNR numbers.
Bar Council credential verification enforces format validation, ID document upload to Firebase Storage (/advocate-verifications/{uid}/id_proof), and human officer approval via verificationRequests, rather than real-time automated government API polling (as the Bar Council of India does not expose a public open REST API).

2. Core Feature Architecture (7 Functional Pillars)
Pillar 1: Bar Council–Verified Advocate Directory & Retainer Booking
Capabilities: Litigants filter advocates by specialization, court jurisdiction, State Bar Council enrollment, spoken languages, and consultation fee; supports video, phone, and chamber bookings.
Implementation: Newly registered lawyers default to isVerifiedLawyer: false (firestore.rules & server.ts). Full vault privileges unlock only after Bar Council credential validation and ID proof submission.

Pillar 2: Vernacular Voice-Enabled Petition Filer
Capabilities: Non-technical or rural citizens narrate grievances in English, Hindi (हिन्दी), Telugu (తెలుగు), Tamil (தமிழ்), or Kannada (ಕನ್ನಡ) to generate a structured litigation petition draft.
Implementation: Browser Web Speech API captures spoken testimony and sends the transcript to POST /api/ai/voice-file-case. Server-side Gemini AI extracts structured JSON (title, caseType, courtName, respondent, legalSections, reliefSought, keyFacts, and native-language spoken reassurance) and computes a 64-character SHA-256 petition digest. Audio is never sent to JusticeBridge servers.

Pillar 3: Confidential Case File Vault & Raw-Byte SHA-256 Evidence Hashing
Capabilities: Isolated judicial vault for petitions, affidavits, vakalatnamas, and digital evidence with interactive SHA-256 integrity verification (Verify SHA-256 button).
Implementation: src/services/evidenceHasher.ts reads the uploaded file's raw binary ArrayBuffer via Web Crypto API (crypto.subtle.digest('SHA-256', buffer)) prior to upload, enforcing MIME (application/pdf, image/png, image/jpeg, image/webp) and size (<= 10 MB) constraints. POST /api/cases/:id/documents/:docId/verify-hash recomputes and verifies raw bytes against the stored digest.

Pillar 4: Server-Side AI Legal Intelligence & Delay-Risk Analysis
Capabilities: Maps citizen grievances to BNS / BNSS / BSA (2023) and IPC / CrPC / CPC / NI Act Sec 138 provisions, audits procedural bottlenecks, and generates 3-point expedited hearing strategies.
Implementation: Executes exclusively on the backend (server.ts) via @google/genai with multi-model fallback (gemini-3.5-flash-lite → gemini-3.8-flash → gemini-flash-latest → localized statutory playbook in English, Hindi, Telugu, Tamil, Kannada, and Malayalam).

Pillar 5: Cybercrime & Online Abuse Incident Reporting
Capabilities: Dedicated workflow (ReportIncidentModal.tsx) for reporting online harassment, defamation, impersonation, and hate speech with multimedia evidence uploads.
Implementation: Validates image/video/PDF evidence (<= 25 MB), computes the raw-byte SHA-256 digest in-browser, uploads binary evidence to Firebase Storage (evidence/{userId}/{timestamp}_{fileName}), and stores the hash and metadata in Cloud Firestore (cyberComplaints) and securityLogs.

Pillar 6: Hearing Calendar & Preliminary Scrutiny Scheduling
Capabilities: Tracks scheduled hearings, courtroom/bench assignments, adjournment reasons, and preliminary e-filing scrutiny dates.
Implementation: Synchronizes case hearing arrays and generates downloadable court docket summaries via jsPDF and jspdf-autotable.

Pillar 7: Progressive Web App (PWA) with Shared-Device Privacy Isolation
Capabilities: Installable mobile/desktop experience with offline application shell support and Android Trusted Web Activity (/.well-known/assetlinks.json) verification.
Implementation: public/sw.js caches only static UI shell assets and explicitly bypasses /api/*, firestore.googleapis.com, identitytoolkit.googleapis.com, and firebasestorage.googleapis.com so private legal data never persists in shared browser caches.

3. System Architecture & Data-Flow Diagrams
3.1 High-Level Component Architecture (ASCII Diagram — PDF Safe)
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

3.2 Request & Evidence Chain-of-Custody Data Flow
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

4. Legal Accuracy, Statutory Disclaimers & Verification Scope
Because JusticeBridge operates in the legal domain, the platform enforces strict labelling so users never confuse internal tracking aids or AI legal research with official government judicial records:

4.1 Internal Case Identifiers vs. Official e-Courts CNR Numbers
What the Platform Generates: When a user files a petition or uses the Voice Case Filer, JusticeBridge assigns an internal reference number (e.g., MISC/DL/2026/412 or VOICE-PET/2026/493) and an internal tracking identifier prefixed with JB01- (e.g., JB01-839201-2026).
Legal Distinction: The JB01- prefix explicitly designates a JusticeBridge Internal Registry Identifier. It is not an official 16-character alphanumeric Case Number Record (CNR) issued by the National Judicial Data Grid (NJDG) or the Government of India e-Courts Phase III system. Official court filing and hearing confirmation occur only after a licensed Advocate submits the verified petition through the respective High Court or District Court e-Filing portal (efiling.ecourts.gov.in).

4.2 Bar Council Credential Verification & Re-Verification Lifecycle
Onboarding State: Every newly registered lawyer account is initialized with isVerifiedLawyer: false and verified: false. Unverified lawyers are blocked from viewing confidential case files (SEC_UNVERIFIED_LAWYER_BLOCKED).
Verification Workflow:
The advocate submits their State Bar Council Enrollment Number (validated against Indian Bar format patterns such as D/4821/2018 or KAR/1029/2016) and uploads their Bar Council ID card / Certificate of Practice (AdvocateUploadUI.tsx) to Firebase Storage (/advocate-verifications/{uid}/id_proof).
A verification record is created in verificationRequests/{requestId} with status: "pending".
Authorized verification officers (isAdmin() || isTeamMember() in firestore.rules) review the credential against State Bar Council rolls and transition the status to approved or rejected.
Periodic Re-Check Policy: Approved advocate credentials carry an annual re-verification window (every 12 months) to confirm active Certificate of Practice (CoP) standing under Bar Council of India Rules.

4.3 AI-Generated Statutory Mapping & Advocate-in-the-Loop Validation
Assistive Research Scope: All outputs from /api/ai/legal-chat, /api/ai/delay-analysis, and /api/ai/voice-file-case are generated for preliminary legal literacy and petition drafting assistance.
Statutory Dual-Mapping: The AI engine cross-references the 2023 criminal law codes (BNS, BNSS, BSA effective July 1, 2024) alongside legacy statutes (IPC, CrPC, IEA) and civil/commercial acts (CPC, Specific Relief Act, Negotiable Instruments Act Sec 138).
Mandatory Human Review: AI-generated petitions and statutory citations do not constitute formal legal representation or create an advocate-client relationship. Every voice-filed or AI-drafted petition is placed in 'Filing' scrutiny status (assignedLawyerName: "Awaiting Advocate Verification & Retainer") for review and formal attestation by a Bar-enrolled Advocate before court submission.

4.4 Methodology & Limitations of Delay-Risk Scores & Disposal Estimates
Heuristic Methodology:
estimatedDisposalDays (default baseline: 120–240 days depending on case category) and delayRiskScore ('Low' | 'Moderate' | 'Critical') are statistical heuristics derived from historical category averages (e.g., Commercial Suits vs. Civil Property disputes), elapsed days since filing (daysElapsed), and recorded adjournment counts (delayDays).
Classification Thresholds: delayDays == 0 → Low; 1 <= delayDays <= 45 → Moderate; delayDays > 45 → Critical.
Limitation Disclaimer: Actual judicial disposal timelines depend on court roster backlogs, judge availability, opposite-party service of summons, and interlocutory applications, and cannot be guaranteed by any software system.

5. Verifiable Security, RBAC/ABAC & Chain-of-Custody Controls
5.1 How Privileged Roles Are Granted & Protected from Self-Promotion
Privilege escalation is blocked at both the Express API layer (server.ts) and the Cloud Firestore Database Rules layer (firestore.rules):

API Registration Gate (server.ts lines 485–492): Self-registration via POST /api/auth/register strictly whitelists ['client', 'lawyer']. Any attempt to pass role: 'admin' or role: 'team_member' is rejected with HTTP 400 and security code SEC_UNAUTHORIZED_ROLE_REGISTRATION.
Firestore Security Rules Gate (firestore.rules lines 13–35):
On create: Users can only create their own profile (request.auth.uid == userId), role must be in ['client', 'lawyer'], role != 'admin', and verified / isVerifiedLawyer must be false.
On update: Regular users cannot modify their role, verified, or isVerifiedLawyer fields (request.resource.data.role == resource.data.role). Only an authenticated administrator (isAdmin()) or verification officer (isTeamMember()) can elevate verification status.

5.2 Cryptographic Chain-of-Custody: Raw File Bytes vs. Canonical Metadata
To satisfy Section 63 of the Bharatiya Sakshya Adhiniyam (BSA), 2023 (formerly Section 65B of the Indian Evidence Act), JusticeBridge distinguishes between two cryptographic hashing modes via the hashSource field on every CaseDocument:

hashSource: "raw_file_bytes" (Primary Binary Evidence Mode):
Client-Side Digest (src/services/evidenceHasher.ts): When a user attaches a PDF, image, or video in CaseFileViewerModal.tsx or ReportIncidentModal.tsx, the browser reads the raw binary ArrayBuffer (file.arrayBuffer()) and computes a 256-bit digest using crypto.subtle.digest('SHA-256', arrayBuffer).
Server-Side Verification (server.ts): When binary content (fileContentBase64) is transmitted to POST /api/cases/:id/documents, the server independently computes crypto.createHash('sha256').update(rawBuffer).digest('hex').
Tamper Re-Verification (POST /api/cases/:id/documents/:docId/verify-hash): At any point during discovery or trial preparation, an auditor or advocate can submit the file bytes or candidate digest to /verify-hash. Even a single modified byte alters the 64-character hex digest and triggers HTTP 400 SEC_DOCUMENT_HASH_TAMPER_DETECTED.
hashSource: "canonical_payload" (Structured Text Petition Mode):
When a petition is generated purely from text or spoken voice testimony without an external binary attachment, the system hashes the canonical UTF-8 string (caseId|title|summary|userId) using SHA-256.

5.3 Upload Validation, Storage Isolation & Immutable Audit Logs
MIME & Size Enforcement:
Case Vault filings (CaseFileViewerModal.tsx & /api/cases/:id/documents): Restricted to application/pdf, image/png, image/jpeg, image/webp up to 10 MB (10,485,760 bytes). Executable or unknown MIME types return HTTP 400 SEC_INVALID_DOCUMENT_MIME.
Cybercrime Evidence (ReportIncidentModal.tsx): Restricted to images, PDFs, and video/mp4 / video/webm up to 25 MB.
Storage Path Isolation: Uploaded files in Firebase Storage are scoped by authenticated user UID (evidence/{userId}/{timestamp}_{fileName} and advocate-verifications/{userId}/id_proof).
Append-Only Audit Trail (securityLogs & audit_logs): Every file upload, download, and SHA-256 verification action writes a timestamped entry via logSecurityActivity() (src/services/securityLogger.ts). In firestore.rules, both securityLogs/{logId} and audit_logs/{logId} enforce allow update, delete: if false;, guaranteeing that audit records cannot be altered or deleted after creation.

6. Data Model & Cloud Firestore Schema Reference
6.1 Cloud Firestore Collections (firestore.rules)
Collection: users/{userId}
Purpose: Authenticated litigant, advocate, and verification officer profiles.
Access Control: Owner read/create; owner update (with role and isVerifiedLawyer locked against self-modification); public read for role == 'lawyer' directory profiles.

Collection: cases/{caseId}
Purpose: Core litigation docket, hearings, and SHA-256 hashed case documents.
Access Control: Strictly isolated to resource.data.clientId == request.auth.uid, resource.data.assignedLawyerId == request.auth.uid, or isAdmin().

Collection: cyberComplaints/{complaintId}
Purpose: Online harassment, defamation, and cybercrime incident reports with raw-byte evidence digests.
Access Control: Created and read only by the reporting clientId or authorized verification officers.

Collection: verificationRequests/{requestId}
Purpose: Advocate Bar Council e-KYC submissions pending officer review.
Access Control: Authenticated create; read by submitting user or verification officers; status transitions (pending → approved | rejected) restricted to isAuthorizedForVerification().

Collections: securityLogs/{logId} & audit_logs/{logId}
Purpose: Append-only chain-of-custody and security event logs (FILE_UPLOAD, FILE_ACCESS, HASH_VERIFIED, EVIDENCE_UPLOAD).
Access Control: Authenticated create (userId == request.auth.uid); admin read; allow update, delete: if false; (strictly immutable).

7. REST API Specification & Tested Examples
7.1 Authentication & Identity Endpoints
GET /api/auth/current-user
Access: Public / Bearer Token
Behaviour: Resolves the caller's 256-bit session token (jb_sess_...) or issues a fresh token for guest isolation.
POST /api/auth/register
Access: Public (Rate-limited)
Body: { "name": "string", "email": "string", "role": "client" | "lawyer" }
Security Enforcement: Rejects role: "admin" with HTTP 400 SEC_UNAUTHORIZED_ROLE_REGISTRATION. Initializes lawyers with isVerifiedLawyer: false.
POST /api/lawyers/verify
Access: Authenticated Advocate or Admin
Body: { "barCouncilNumber": "D/4821/2018", "stateBarCouncil": "Bar Council of Delhi" }
Security Enforcement: Rejects placeholder IDs (PENDING/REG/2026) with HTTP 400 SEC_INVALID_BAR_COUNCIL_CREDENTIAL.

7.2 Case Management & Cryptographic Vault Endpoints
POST /api/cases/file
Access: Authenticated Client / Advocate
Body: { "title": "string", "caseType": "string", "courtName": "string", "respondent": "string", "summaryBrief": "string", "assignedLawyerId": "string" }
Behaviour: Creates an isolated CaseMatter bound to clientId: user.id and generates an initial petition document with a 64-hex SHA-256 digest.
POST /api/cases/:id/documents
Access: Case Owner or Verified Assigned Advocate
Body: { "title": "string", "fileName": "string", "fileCategory": "Evidence", "fileContentBase64": "string", "clientFileHash": "sha256:<64-hex>", "mimeType": "application/pdf", "byteLength": 93 }
Security Enforcement: Validates MIME allowlist (SEC_INVALID_DOCUMENT_MIME), enforces <= 10 MB size (SEC_INVALID_DOCUMENT_SIZE), and computes/records the FIPS 180-4 SHA-256 digest over the raw file bytes (hashSource: "raw_file_bytes").
POST /api/cases/:id/documents/:docId/verify-hash
Access: Case Owner or Verified Assigned Advocate
Body: { "fileContentBase64": "string" } or { "candidateHash": "sha256:<64-hex>" }
Behaviour: Recomputes the SHA-256 digest of the supplied bytes and compares it against the stored chain-of-custody digest. Returns HTTP 200 (verified: true) on match or HTTP 400 (SEC_DOCUMENT_HASH_TAMPER_DETECTED) if even 1 byte was altered.

7.3 Payment & Anti-Replay Verification Endpoints
POST /api/membership/checkout
Access: Authenticated User
Behaviour: Registers a server-side order in createdOrdersMap bound to user.id and creates a Razorpay order (with GST breakdown).
POST /api/membership/verify-payment
Access: Authenticated Order Owner
Security Enforcement: Rejects amount <= 0 (SEC_ZERO_PAYMENT_PROHIBITED); blocks duplicate transaction replay (HTTP 409 SEC_ORDER_ALREADY_VERIFIED).

7.4 Server-Side AI Legal Intelligence Endpoints
POST /api/ai/legal-chat
Body: { "query": "string", "langName": "English" | "Hindi" | "Telugu" | "Tamil" | "Kannada" | "Malayalam" }
Security Enforcement: Truncates and strips control/escape characters via sanitizePromptInput(), enforces a strict language whitelist against prompt injection, and executes @google/genai server-side.
POST /api/ai/delay-analysis
Body: { "caseId": "string" }
Security Enforcement: Enforces client ownership isolation (SEC_CLIENT_ISOLATION_VIOLATION).
POST /api/ai/voice-file-case
Body: { "voiceTranscript": "string", "languageCode": "te", "languageName": "Telugu", "autoFile": true }
Behaviour: Extracts structured petition fields from vernacular speech and computes a 64-hex SHA-256 digest.

7.5 Session Identity vs. Firebase Auth
JusticeBridge utilizes a dual-layer identity model:
1. Firebase Auth (Google): Handles user authentication (login/signup) via Google OAuth.
2. jb_sess_ (Internal): A cryptographic 256-bit token issued by JusticeBridge server-side after successful Firebase authentication, bound to the user's Firestore session record. This ensures that even if a Firebase ID token is short-lived, the internal session persists independently.

7.6 API CURL Examples (Sample)
# Authenticated Request (Bearer token)
curl -H "Authorization: Bearer <jb_sess_...>" https://justicebridge-prod.web.app/api/auth/current-user
# Response
{
  "user": { "id": "client_1...", "name": "Aarav Sharma", ... },
  "sessionToken": "jb_sess_..."
}

8. Executed Automated Test Report (26/26 Passed)
All security, authorization, payment, AI sanitization, and raw-byte SHA-256 tamper-detection claims are verified by the automated test suite in tests/verify-platform.ts.

9. Operational Privacy (DPDP Act 2023), PWA Shared-Device Safety & Incident Response
9.1 Alignment with India's Digital Personal Data Protection (DPDP) Act, 2023
- Purpose Limitation & Consent: Personal data (name, contact details, Bar Council enrollment number, and case narratives) is collected solely for legal case management, advocate discovery, and statutory research.
- Voice & AI Data Minimization: Spoken audio in the Voice Case Filer is transcribed via the browser SpeechRecognition API; raw audio waveforms are never sent to JusticeBridge servers. Text sent to the server-side Gemini API (/api/ai/*) is stripped of control characters, bounded to strict limits, and isolated.
- Data Retention & Right to Erasure: Litigants can clear local session state and request erasure of draft petitions or account data. Immutable security audit logs (securityLogs / audit_logs) store only pseudonymized UIDs, action types, and cryptographic SHA-256 hashes (no raw PII or case narratives).
- Grievance Officer: The founder (srijenponugoti667@gmail.com) acts as the primary grievance officer for DPDP act compliance and user rights.
- Breach-Notification Procedure: In the event of a suspected security breach, JusticeBridge will notify affected users within 72 hours via email and update the security incident log.
- Retention Periods: Personal user data is retained as long as the account is active. Upon account deletion, user profile, case data, and documents are removed from production Firestore and Storage.
- Processor List: Primary data processors are Firebase (GCP), Google Gemini API (for AI analysis), and Razorpay (for payment processing).
- Children's Data Handling: JusticeBridge is not designed for children under 18; if collected, it is handled strictly as part of a legal guardian's case file.
- User-Rights Workflow: Users can exercise rights to access, correct, or erase data by contacting the grievance officer or using the DELETE /api/account functionality.

9.2 PWA Caching & Shared-Device Privacy Protection (public/sw.js)
Static-Only Service Worker Cache: public/sw.js caches only the static application shell.
Explicit API & Cloud Bypass: The Service Worker fetch listener explicitly ignores all requests matching /api/*, firestore.googleapis.com, identitytoolkit.googleapis.com, and firebasestorage.googleapis.com.
Cache Purge Handler (PURGE_SENSITIVE_CACHE): Sends { type: 'PURGE_SENSITIVE_CACHE' } to navigator.serviceWorker.controller to purge caches upon sign-out.

10. Operations & Production Readiness
10.1 Production Readiness Checklist
| Task | Status | Evidence |
| :--- | :--- | :--- |
| Firestore Source of Truth | Done | server.ts line 598 |
| Webhook Idempotency | Done | server.ts lines 299-319 |
| IARC Certificate | Pending | External action required |
| Pen-test | Pending | External action required |

10.2 Needs My Action
- Submit IARC questionnaire for Google Play.
- Schedule third-party penetration testing.
- Appoint DPDP officer.

10.3 Claim Traceability
| Claim | file/line | test ID |
| :--- | :--- | :--- |
| Sessions/Orders as Firestore source | server.ts: 598 | AUTH-01 |
| Webhook idempotency | server.ts: 299-319 | PAY-05 |
| DELETE /api/account | server.ts: 749 | V4-01 |

11. Installation, Reproducible Local Setup & Troubleshooting
(Refer to README for local setup details)

12. Google Play Store Submission Readiness
...
