# Advocate Verification Implementation Plan

This document details the technical strategy and implementation steps for transitioning the JusticeBridge advocate verification process from a simulated flow to a production-ready, highly secure automated system.

---

## 1. System Overview

The verification system utilizes a layered approach to ensure trust:
1.  **Ingestion:** Secure document upload via Firebase Storage.
2.  **Automation (AI Check):** Automated OCR extraction using AI to validate document authenticity.
3.  **Database Integration (BCI Check):** API lookup against verified State Bar Council registries.
4.  **Admin Audit:** Human-in-the-loop portal for high-stakes or ambiguous cases.

---

## 2. Step-by-Step Implementation

### Step 1: Secure Document Handling (ID Proofs)
*   **Infrastructure:** Use **Firebase Storage**.
*   **Storage Path:** `/advocate-verifications/{userId}/id_proof`.
*   **Security Rules:** Implement strict `storage.rules` ensuring:
    *   Advocates can only write to their own user-id-specific path.
    *   Only authorized Admins can read documents across all paths for auditing.
*   **Malware Scanning:** Configure an automated scan (e.g., using Cloud Functions) that triggers upon file finalization to ensure no malicious files are stored.

### Step 2: Automated AI Credential Verification
*   **OCR Pipeline:** Use **Google Vision API** or **Gemini Multimodal** to extract text from the Bar Council ID proof.
*   **Data Structure:** Parse the OCR output into a standard JSON schema:
  ```json
  {
    "name": "string",
    "enrollmentNumber": "string",
    "barCouncil": "string",
    "expiryDate": "string"
  }
  ```
*   **Validation Logic:** Compare the extracted JSON fields against the data provided by the advocate in the application form. Flag discrepancies (> 5% deviation) for manual review.

### Step 3: BCI Database Integration
*   **API Strategy:** Due to the fragmentation of State Bar Council registries, integrate with enterprise KYC API providers (e.g., Perfios, Setu, Karza).
*   **Lookup Mechanism:** The backend triggers an asynchronous lookup using the extracted `enrollmentNumber` and `barCouncil`.
*   **State Mapping:** 
    *   `Verified`: Active Status returned from Registry.
    *   `Rejected/Suspended`: Inactive Status or enrollment mismatch.
    *   `Pending Manual`: API timeout or insufficient match confidence.

### Step 4: Admin Audit Portal
*   **Dashboard:** Build a secure `AdminVerificationDashboard` (protected by role-based access control in `firestore.rules`).
*   **View:** Present side-by-side data:
    *   Application Data (Form).
    *   AI-Extracted Data (OCR).
    *   Registry API Result (BCI).
    *   Direct link to the document (securely generated short-lived URL).
*   **Actions:** "Approve" (writes to `verificationLogs` and updates `verificationStatus`) or "Reject" (requires mandatory justification).

---

## 3. Security and Audit

*   **Immutable Logging:** All verification actions must be recorded in the `verificationLogs` collection, which is restricted to read/write access by admins only via `firestore.rules`.
*   **PII Handling:** Documents must be encrypted at rest (CMEK) and purged after the verification process is complete (automated storage lifecycle policies).
*   **Privilege Escalation Prevention:** The backend must explicitly validate the `user.role` to ensure only legitimate advocates can trigger the verification flow.

---

## 4. Implementation Roadmap

| Phase | Goal | Key Tasks |
| :--- | :--- | :--- |
| **Phase 1** | Foundation | Implement Storage Rules and Secure File Upload UI. |
| **Phase 2** | AI-Automation | Deploy OCR pipeline (Vision API/Gemini) to process uploads. |
| **Phase 3** | Integration | Integrate BCI API partner for registry lookups. |
| **Phase 4** | Audit Portal | Finalize Admin dashboard features and email notifications. |
| **Phase 5** | Hardening | Final security audit of all rules and IAM policies. |
