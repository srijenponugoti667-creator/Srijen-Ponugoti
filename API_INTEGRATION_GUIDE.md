# API Integration Guide: Lawyer Credential Verification (Karza Technologies)

This document outlines the architectural and implementation steps required to integrate real-time lawyer credential verification with Karza Technologies.

---

## ⚠️ Security Notice: Backend-Only Integration
**NEVER** expose API keys for Karza in client-side code. All integration calls must originate from your secure backend (`server.ts`).

---

## Integration Architecture

`Frontend (Admin Dashboard)` -> `Your Express Backend (/api/verify/bci)` -> `Karza API` -> `BCI/State Registry`

---

## Implementation Guide (Karza)

### Step 1: Karza Account Setup
1.  **Request Access:** Contact Karza sales for "Professional Credential Verification" API access.
2.  **Sandbox Environment:** Obtain API credentials (Base URL and API Key).

### Step 2: Credential Management
*   Configure environment variables in your cloud platform's Secret Manager:
    *   `KARZA_BASE_URL`
    *   `KARZA_API_KEY`

### Step 3: Server-Side API Implementation

```typescript
// server.ts - Karza Specific Structure
app.post('/api/verify/bci', apiLimiter, async (req, res) => {
  const { enrollmentNumber, stateBarCouncil } = req.body;
  
  // 1. Authenticate Request
  const user = getCurrentUser(req);
  if (!user || user.role !== 'admin') return res.status(401).send('Unauthorized');

  try {
    // 2. Call Karza API
    const response = await fetch(`${process.env.KARZA_BASE_URL}/v2/bci-verification`, {
      method: 'POST',
      headers: {
        'x-karza-key': process.env.KARZA_API_KEY as string,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        enrollment_number: enrollmentNumber, 
        state_code: stateBarCouncil // Check Karza mapping
      })
    });

    const result = await response.json();

    // 3. Update Firestore
    await db.collection('advocates').doc(user.uid).update({
      verificationStatus: result.status === 'verified' ? 'VERIFIED' : 'REJECTED',
      lastVerified: new Date().toISOString(),
      verificationDetails: result
    });

    res.json({ success: true, status: result.status });
  } catch (error) {
    res.status(500).json({ error: 'Verification failed' });
  }
});
```

### Step 4: Audit Trail
*   Ensure all interactions are logged in a `verificationLogs` collection in Firestore for compliance.
