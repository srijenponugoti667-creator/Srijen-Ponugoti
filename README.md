# JusticeBridge Legal Engine — Technical & Architecture Documentation

**Document Version:** 4.0 (Production & Audit Specification)

## Claim Traceability
| Claim | file/line | test ID |
| :--- | :--- | :--- |
| Sessions/Orders as Firestore source | `server.ts`: 598 | AUTH-01 |
| Webhook idempotency | `server.ts`: 299-319 | PAY-05 |
| DELETE /api/account | `server.ts`: 749 | V4-01 |

## Production Readiness Checklist
| Task | Status | Evidence |
| :--- | :--- | :--- |
| Firestore Source of Truth | Done | `server.ts` line 598 |
| Webhook Idempotency | Done | `server.ts` lines 299-319 |
| IARC Certificate | Pending | External action required |
| Pen-test | Pending | External action required |

## Needs My Action
- Submit IARC questionnaire for Google Play.
- Schedule third-party penetration testing.
- Appoint DPDP officer.
