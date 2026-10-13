# JusticeBridge 10/10 Production Roadmap

This plan outlines the critical fixes to achieve a 10/10 production-ready status, addressing persistent state, security, and compliance blockers.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following technical changes are required to transition from a prototype to a production-grade legal platform.

- **Persistent State**: Migration of in-memory data (users, cases, consultations) to Cloud Firestore.
- **Rules Testing**: Implementing Firebase Emulator for `firestore.rules` validation.
- **Naming Consistency**: Renaming `cnrNumber` to `internalTrackingId` across all schemas.
- **Compliance**: Adding consent notices and DPDP-compliant structures.

## 1. Overview & Core Concept

**Goal**: Transform JusticeBridge from a functional prototype with simulated data into a secure, persistent, audit-ready Indian legal-tech platform.

## 2. User Experience & Visual Design

- **Flows**: The core user experience remains consistent, but will now be powered by durable, multi-instance persistent storage (Firestore).
- **Compliance**: Addition of a DPDP-compliant consent notice on first-time boot.

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Firestore Migration**
    - *Chosen Approach*: Replace in-memory Maps and Arrays with Firestore collections (`users`, `cases`, `consultations`, `invoices`).
    - *Why*: Enables multi-instance scalability on Cloud Run and guarantees anti-replay integrity for payment and evidence chain-of-custody.
- **Decision 2: Renaming Identifiers**
    - *Chosen Approach*: Rename `cnrNumber` to `internalTrackingId`.
    - *Why*: Eliminates misleading legal claims and aligns documentation with technical reality.

## 4. Technical Architecture & Data Strategy

```text
┌──────────────────────────────────────────────────────────────┐
│                  BROWSER CLIENT (React SPA)                  │
└──────────────┬──────────────────────────────┬────────────────┘
               │ HTTPS (Bearer Auth)          │
┌──────────────▼──────────────────────────────▼────────────────┐
│               TRUSTED BACKEND SERVER (Node.js)               │
│  [1. Rate Limiter] -> [2. Auth/Sanitizer] -> [3. API Logic]  │
└──────────────┬──────────────────────────────┬────────────────┘
               │ CRUD Operations              │ 
┌──────────────▼──────────────────────────────▼────────────────┐
│             CLOUD FIRESTORE (Persistent Storage)             │
│ [users] [cases] [consultations] [invoices] [cyberComplaints] │
└──────────────────────────────────────────────────────────────┘
```
- **Data Model**: Firestore entities for `User`, `Case`, `Consultation`, `Invoice`.
- **State Strategy**: All ephemeral in-memory state will be persisted in Firestore to support horizontal scaling.
