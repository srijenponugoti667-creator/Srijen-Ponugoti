/**
 * JusticeBridge Cryptographic Evidence Hasher & File Validator
 *
 * Implements FIPS 180-4 SHA-256 hashing over raw file bytes (`ArrayBuffer`)
 * via the browser Web Crypto API (`crypto.subtle.digest('SHA-256', buffer)`)
 * to support Section 63 Bharatiya Sakshya Adhiniyam (BSA), 2023 /
 * Section 65B Indian Evidence Act electronic evidence integrity.
 */

export const ALLOWED_CASE_DOCUMENT_MIMES = [
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/webp',
] as const;

export const ALLOWED_INCIDENT_EVIDENCE_MIMES = [
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/webp',
  'video/mp4',
  'video/webm',
] as const;

export const MAX_CASE_DOCUMENT_BYTES = 10 * 1024 * 1024; // 10 MB
export const MAX_INCIDENT_EVIDENCE_BYTES = 25 * 1024 * 1024; // 25 MB

export interface FileValidationResult {
  valid: boolean;
  error?: string;
  formattedSize: string;
  byteLength: number;
  mimeType: string;
}

export function formatBytes(bytes: number): string {
  if (bytes <= 0) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function validateEvidenceFile(
  file: File,
  options?: {
    maxBytes?: number;
    allowedMimes?: readonly string[];
  }
): FileValidationResult {
  const maxBytes = options?.maxBytes ?? MAX_CASE_DOCUMENT_BYTES;
  const allowedMimes = options?.allowedMimes ?? ALLOWED_CASE_DOCUMENT_MIMES;
  const byteLength = file.size;
  const formattedSize = formatBytes(byteLength);
  const mimeType = file.type || 'application/octet-stream';

  if (byteLength <= 0) {
    return {
      valid: false,
      error: 'Selected file is empty (0 bytes).',
      formattedSize,
      byteLength,
      mimeType,
    };
  }

  if (byteLength > maxBytes) {
    return {
      valid: false,
      error: `File size (${formattedSize}) exceeds the maximum permitted limit of ${formatBytes(maxBytes)}.`,
      formattedSize,
      byteLength,
      mimeType,
    };
  }

  const isAllowedMime =
    allowedMimes.includes(mimeType) ||
    (mimeType.startsWith('image/') && allowedMimes.some((m) => m.startsWith('image/'))) ||
    (mimeType.startsWith('video/') && allowedMimes.some((m) => m.startsWith('video/')));

  if (!isAllowedMime) {
    return {
      valid: false,
      error: `Unsupported file format (${mimeType}). Allowed formats: ${allowedMimes.join(', ')}.`,
      formattedSize,
      byteLength,
      mimeType,
    };
  }

  return {
    valid: true,
    formattedSize,
    byteLength,
    mimeType,
  };
}

/**
 * Computes a 64-character lowercase hexadecimal SHA-256 digest directly from
 * the raw binary bytes (`ArrayBuffer`) of a File or Blob.
 */
export async function computeFileBytesSha256(input: File | Blob | ArrayBuffer): Promise<string> {
  const arrayBuffer =
    input instanceof ArrayBuffer ? input : await input.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hexDigest = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  return `sha256:${hexDigest}`;
}

/**
 * Computes a deterministic 64-character lowercase hexadecimal SHA-256 digest
 * over a UTF-8 canonical string payload when no binary file is attached.
 */
export async function computeCanonicalTextSha256(canonicalText: string): Promise<string> {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(canonicalText);
  return computeFileBytesSha256(bytes.buffer as ArrayBuffer);
}
