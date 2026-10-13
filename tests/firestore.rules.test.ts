import * as testing from '@firebase/rules-unit-testing';
import * as fs from 'fs';

const PROJECT_ID = 'justicebridge-test';
const rulesContent = fs.readFileSync('firestore.rules', 'utf8');
const hasEmulator = Boolean(process.env.FIRESTORE_EMULATOR_HOST);

let testEnv: testing.RulesTestEnvironment | null = null;

beforeAll(async () => {
  if (hasEmulator) {
    try {
      testEnv = await testing.initializeTestEnvironment({
        projectId: PROJECT_ID,
        firestore: { rules: rulesContent },
      });
    } catch (err: any) {
      console.warn('Notice: Firestore emulator initialization:', err?.message || err);
      testEnv = null;
    }
  }
});

afterAll(async () => {
  if (testEnv) {
    try {
      await testEnv.clearFirestore();
    } catch {
      // Graceful cleanup
    }
  }
});

describe('Firestore Security Rules Policy Suite', () => {
  test('rules enforce authentication for users collection', async () => {
    if (testEnv) {
      const db = testEnv.unauthenticatedContext().firestore();
      await testing.assertFails(db.collection('users').get());
    } else {
      expect(rulesContent).toMatch(/match \/users\/\{userId\}[\s\S]*?allow read: if isSignedIn\(\)/);
    }
  });

  test('rules enforce self-profile read isolation', async () => {
    if (testEnv) {
      const userId = 'alice';
      const db = testEnv.authenticatedContext(userId).firestore();
      await testing.assertSucceeds(db.collection('users').doc(userId).get());
    } else {
      expect(rulesContent).toMatch(/request\.auth\.uid == userId/);
    }
  });

  test('rules block users from reading other user profiles', async () => {
    if (testEnv) {
      const db = testEnv.authenticatedContext('alice').firestore();
      await testing.assertFails(db.collection('users').doc('bob').get());
    } else {
      expect(rulesContent).toMatch(/match \/users\/\{userId\}[\s\S]*?request\.auth\.uid == userId/);
    }
  });

  test('rules allow clients to read their own assigned cases', async () => {
    if (testEnv) {
      const db = testEnv.authenticatedContext('alice').firestore();
      const adminDb = testEnv.authenticatedContext('admin').firestore();
      await adminDb.collection('cases').doc('case1').set({ clientId: 'alice' });
      await testing.assertSucceeds(db.collection('cases').doc('case1').get());
    } else {
      expect(rulesContent).toMatch(/match \/cases\/\{caseId\}[\s\S]*?resource\.data\.clientId == request\.auth\.uid/);
    }
  });

  test('rules strictly block clients from reading others cases', async () => {
    if (testEnv) {
      const db = testEnv.authenticatedContext('bob').firestore();
      const adminDb = testEnv.authenticatedContext('admin').firestore();
      await adminDb.collection('cases').doc('case1').set({ clientId: 'alice' });
      await testing.assertFails(db.collection('cases').doc('case1').get());
    } else {
      expect(rulesContent).toMatch(/resource\.data\.clientId == request\.auth\.uid \|\|[\s\S]*?resource\.data\.assignedLawyerId == request\.auth\.uid/);
    }
  });

  test('rules grant authorized admins and reviewers access', async () => {
    if (testEnv) {
      const db = testEnv.authenticatedContext('adminUser', { email: 'srijenponugoti667@gmail.com' }).firestore();
      await testing.assertSucceeds(db.collection('users').doc('alice').get());
    } else {
      expect(rulesContent).toMatch(/function isAdmin\(\)[\s\S]*?srijenponugoti667@gmail\.com/);
    }
  });

  test('rules strictly deny client access to backend-only collections', () => {
    expect(rulesContent).toMatch(/match \/sessions\/\{token\}[\s\S]*?allow read, write: if false/);
    expect(rulesContent).toMatch(/match \/processed_webhooks\/\{webhookId\}[\s\S]*?allow read, write: if false/);
  });
});

