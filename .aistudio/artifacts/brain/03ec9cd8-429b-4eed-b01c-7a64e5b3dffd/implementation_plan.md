# JusticeBridge Implementation & Documentation Plan v4.0

## Phase 1: Documentation & Governance
- [ ] Rewrite changelog for v4.0 (list only what changed).
- [ ] Replace "ICRA/ESRB 18+" with "Pending IARC certificate".
- [ ] Update Section 9 (Grievance officer, breach-notification, retention, processor list, children's data, user-rights).
- [ ] Wording fixes ("rule-based classification" for delay risk; folder/repo name match; audio privacy wording).
- [ ] Add Operations section.
- [ ] Add Production Readiness Checklist (Done / Pending-external + evidence).

## Phase 2: Security & Backend Implementation
- [ ] Implement Helmet + strict CSP.
- [ ] Configure strict CORS allowlist.
- [ ] Firestore as source of truth for /sessions and /orders.
- [ ] Server-side Firebase ID token verification.
- [ ] Razorpay webhook (signature + idempotency).
- [ ] Implement DELETE /api/account endpoint.
- [ ] Add consent record at onboarding.

## Phase 3: Testing & Verification
- [ ] Firebase Emulator rules tests (replace AUTHZ-05).
- [ ] Restart persistence test.
- [ ] Webhook tests (valid/invalid/replay).
- [ ] DELETE /api/account test.
- [ ] XSS/sanitization test.
- [ ] Playwright e2e test.
- [ ] Wire tests into CI.
- [ ] Generate raw `npm test` output.

## Phase 4: Final Documentation Traceability
- [ ] Add curl samples + real responses for all endpoints.
- [ ] Explain jb_sess_ vs Firebase Auth.
- [ ] Add Claim Traceability table (claim | file/line | test ID).
- [ ] Compile "Needs my action" list.
