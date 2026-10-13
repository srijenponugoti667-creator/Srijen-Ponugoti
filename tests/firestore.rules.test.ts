import * as testing from '@firebase/rules-unit-testing';
import * as fs from 'fs';

const PROJECT_ID = "justicebridge-test";
let testEnv: testing.RulesTestEnvironment;

beforeAll(async () => {
  testEnv = await testing.initializeTestEnvironment({
    projectId: PROJECT_ID,
    firestore: { rules: fs.readFileSync("firestore.rules", "utf8") },
  });
});

afterAll(async () => {
  await testEnv.clearFirestore();
});

describe("Firestore Security Rules", () => {
  
  test("unauthenticated users cannot read users", async () => {
    const db = testEnv.unauthenticatedContext().firestore();
    await testing.assertFails(db.collection("users").get());
  });

  test("users can read their own profile", async () => {
    const userId = "alice";
    const db = testEnv.authenticatedContext(userId).firestore();
    await testing.assertSucceeds(db.collection("users").doc(userId).get());
  });

  test("users cannot read other users' profiles", async () => {
    const db = testEnv.authenticatedContext("alice").firestore();
    await testing.assertFails(db.collection("users").doc("bob").get());
  });

  test("clients can read their own cases", async () => {
    const db = testEnv.authenticatedContext("alice").firestore();
    const adminDb = testEnv.authenticatedContext("admin").firestore();
    await adminDb.collection("cases").doc("case1").set({ clientId: "alice" });

    await testing.assertSucceeds(db.collection("cases").doc("case1").get());
  });

  test("clients cannot read others' cases", async () => {
    const db = testEnv.authenticatedContext("bob").firestore();
    const adminDb = testEnv.authenticatedContext("admin").firestore();
    await adminDb.collection("cases").doc("case1").set({ clientId: "alice" });

    await testing.assertFails(db.collection("cases").doc("case1").get());
  });

  test("admins can read users", async () => {
    const db = testEnv.authenticatedContext("adminUser", { email: "srijenponugoti667@gmail.com" }).firestore();
    await testing.assertSucceeds(db.collection("users").doc("alice").get());
  });
});
