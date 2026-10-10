/**
 * FirestoreValidation.ts
 *
 * Utilities for hardening Firestore security by validating document IDs
 * and enforcing schema constraints.
 */

/**
 * Validates a Firestore document or collection ID.
 * 
 * Enforces:
 * - Must be a string
 * - Length <= 128 characters
 * - Only alphanumeric characters, underscores, and hyphens (^[a-zA-Z0-9_\-]+$)
 */
export const isValidFirestoreId = (id: string): boolean => {
  if (typeof id !== 'string') return false;
  if (id.length === 0 || id.length > 128) return false;
  
  const idRegex = /^[a-zA-Z0-9_\-]+$/;
  return idRegex.test(id);
};

/**
 * Validates that an ID is valid, or throws an error.
 * Use this in application code to fail-fast before database operations.
 */
export const assertValidFirestoreId = (id: string, context: string): void => {
  if (!isValidFirestoreId(id)) {
    throw new Error(`Invalid Firestore ID provided in ${context}: ${id}`);
  }
};
