// tests/auth.test.js
const { hashPassword, verifyPassword, generateToken } = require("../backend/lib/auth");

describe("password hashing", () => {
  test("verifies the correct password", () => {
    const { salt, hash } = hashPassword("correct-horse-battery-staple");
    expect(verifyPassword("correct-horse-battery-staple", salt, hash)).toBe(true);
  });

  test("rejects an incorrect password", () => {
    const { salt, hash } = hashPassword("correct-horse-battery-staple");
    expect(verifyPassword("wrong-password", salt, hash)).toBe(false);
  });

  test("produces a different salt each time", () => {
    const a = hashPassword("same-password");
    const b = hashPassword("same-password");
    expect(a.salt).not.toBe(b.salt);
    expect(a.hash).not.toBe(b.hash);
  });
});

describe("session tokens", () => {
  test("generates a 64-character hex token", () => {
    const token = generateToken();
    expect(token).toMatch(/^[0-9a-f]{64}$/);
  });

  test("generates unique tokens", () => {
    expect(generateToken()).not.toBe(generateToken());
  });
});
