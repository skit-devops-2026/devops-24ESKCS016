// backend/lib/auth.js
// Password hashing + session tokens using ONLY Node's built-in crypto module.
// No external dependencies (bcrypt/jsonwebtoken) needed to run this project.

const crypto = require("crypto");

const KEY_LEN = 64;

/**
 * Hash a plaintext password with a random salt (scrypt).
 * Returns { salt, hash } — both hex strings, safe to store.
 */
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, KEY_LEN).toString("hex");
  return { salt, hash };
}

/**
 * Verify a plaintext password against a stored salt+hash.
 */
function verifyPassword(password, salt, hash) {
  const attempt = crypto.scryptSync(password, salt, KEY_LEN).toString("hex");
  const a = Buffer.from(attempt, "hex");
  const b = Buffer.from(hash, "hex");
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

/**
 * Generate a random opaque session token.
 */
function generateToken() {
  return crypto.randomBytes(32).toString("hex");
}

module.exports = { hashPassword, verifyPassword, generateToken };
