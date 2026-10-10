import { createHash } from 'crypto';
import { createReadStream, writeFileSync, unlinkSync } from 'fs';
import { resolve } from 'path';

/**
 * Demonstrates Chain-of-Custody integrity verification using SHA-256.
 * 
 * To run:
 *   node scripts/verify-integrity.js
 */

const TEST_FILE = resolve('temp_test_doc.txt');
const TEST_CONTENT = 'JusticeBridge Legal Document Content: This content is protected.';

async function generateHash(filePath) {
  return new Promise((resolve, reject) => {
    const hash = createHash('sha256');
    const stream = createReadStream(filePath);
    stream.on('data', (data) => hash.update(data));
    stream.on('end', () => resolve(hash.digest('hex')));
    stream.on('error', reject);
  });
}

async function runIntegrityTest() {
  console.log('--- Chain-of-Custody Integrity Verification ---');
  
  // 1. Create a dummy file
  writeFileSync(TEST_FILE, TEST_CONTENT);
  console.log('Created test file:', TEST_FILE);

  // 2. Generate initial hash
  const initialHash = await generateHash(TEST_FILE);
  console.log('Initial SHA-256 Hash:', initialHash);

  // 3. Verify integrity
  const recomputedHash = await generateHash(TEST_FILE);
  console.log('Recomputed SHA-256 Hash:', recomputedHash);

  if (initialHash === recomputedHash) {
    console.log('SUCCESS: Integrity verified (hashes match).');
  } else {
    console.error('FAILURE: Integrity check failed (hashes mismatch).');
  }

  // Cleanup
  unlinkSync(TEST_FILE);
  console.log('Cleaned up test file.');
}

runIntegrityTest().catch(console.error);
