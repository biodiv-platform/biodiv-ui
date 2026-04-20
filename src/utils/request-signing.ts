import SITE_CONFIG from "@configs/site-config";
import { createHmac } from "crypto";

/**
 * HMAC-based request signing for securing API endpoints
 *
 * How it works:
 * 1. Server generates a rotating secret during SSR
 * 2. Frontend signs each request with HMAC(timestamp + params + secret)
 * 3. Backend verifies signature before processing request
 * 4. Prevents unauthorized access and replay attacks
 */

const SIGNATURE_VALIDITY_MS = 5 * 60 * 1000; // 5 minutes
const SECRET_ROTATION_MS = 15 * 60 * 1000; // 15 minutes

/**
 * Generate a signing secret (server-side only)
 * Secrets are time-based and rotate automatically
 */
export function generateSigningSecret(): string {
  const timestamp = Date.now();
  const rotationWindow = Math.floor(timestamp / SECRET_ROTATION_MS);
  const baseSecret = SITE_CONFIG.SECURITY.HMAC_SECRET_KEY;

  // Create a rotating secret based on time window
  const secret = createHmac("sha256", baseSecret)
    .update(`${rotationWindow}`)
    .digest("hex");

  return secret;
}

/**
 * Generate the previous secret (for grace period during rotation)
 */
export function generatePreviousSecret(): string {
  const timestamp = Date.now();
  const rotationWindow = Math.floor(timestamp / SECRET_ROTATION_MS) - 1;
  const baseSecret = SITE_CONFIG.SECURITY.HMAC_SECRET_KEY;

  const secret = createHmac("sha256", baseSecret)
    .update(`${rotationWindow}`)
    .digest("hex");

  return secret;
}

/**
 * Create a canonical string from request parameters
 * This ensures both client and server create the same string
 */
function createCanonicalString(timestamp: number, params: Record<string, any>): string {
  // Sort keys to ensure consistent ordering
  const sortedKeys = Object.keys(params).sort();
  const paramString = sortedKeys
    .map(key => `${key}=${JSON.stringify(params[key])}`)
    .join("&");

  return `${timestamp}|${paramString}`;
}

/**
 * Sign a request (server-side with Node crypto)
 * @param params - Request parameters
 * @param secret - Signing secret from server
 * @returns Object with timestamp and signature
 */
export function signRequest(params: Record<string, any>, secret: string): {
  timestamp: number;
  signature: string;
} {
  const timestamp = Date.now();
  const canonicalString = createCanonicalString(timestamp, params);

  const signature = createHmac("sha256", secret)
    .update(canonicalString)
    .digest("hex");

  return { timestamp, signature };
}

/**
 * Verify a request signature (server-side)
 * @param params - Request parameters
 * @param timestamp - Timestamp from client
 * @param signature - Signature from client
 * @param secret - Current signing secret
 * @param previousSecret - Previous secret (for grace period)
 * @returns true if signature is valid
 */
export function verifySignature(
  params: Record<string, any>,
  timestamp: number,
  signature: string,
  secret: string,
  previousSecret?: string
): { valid: boolean; reason?: string } {
  const now = Date.now();

  // Check timestamp is within valid window (prevents replay attacks)
  const timeDiff = Math.abs(now - timestamp);
  if (timeDiff > SIGNATURE_VALIDITY_MS) {
    return {
      valid: false,
      reason: `Timestamp expired. Diff: ${Math.floor(timeDiff / 1000)}s, Max: ${SIGNATURE_VALIDITY_MS / 1000}s`
    };
  }

  // Verify signature with current secret
  const canonicalString = createCanonicalString(timestamp, params);
  const expectedSignature = createHmac("sha256", secret)
    .update(canonicalString)
    .digest("hex");

  if (signature === expectedSignature) {
    return { valid: true };
  }

  // Try previous secret (grace period during rotation)
  if (previousSecret) {
    const expectedPreviousSignature = createHmac("sha256", previousSecret)
      .update(canonicalString)
      .digest("hex");

    if (signature === expectedPreviousSignature) {
      return { valid: true };
    }
  }

  return { valid: false, reason: "Invalid signature" };
}

/**
 * Browser-compatible HMAC signing (uses SubtleCrypto)
 * Use this in the frontend since Node's crypto module isn't available
 */
export async function signRequestBrowser(
  params: Record<string, any>,
  secret: string
): Promise<{ timestamp: number; signature: string }> {
  const timestamp = Date.now();
  const canonicalString = createCanonicalString(timestamp, params);

  // Convert secret and message to Uint8Array
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const message = encoder.encode(canonicalString);

  // Import key
  const key = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  // Create signature
  const signatureBuffer = await crypto.subtle.sign("HMAC", key, message);

  // Convert to hex string
  const signatureArray = Array.from(new Uint8Array(signatureBuffer));
  const signature = signatureArray.map(b => b.toString(16).padStart(2, "0")).join("");

  return { timestamp, signature };
}
