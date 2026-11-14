const { test } = require("node:test");
const assert = require("node:assert/strict");

const {
  hashPassword,
  validateRegistration,
  registerUser,
  authenticate
} = require("../quizLogic.js");

// ===== Password hashing =====
test("the same password always gives the same hash", () => {
  assert.equal(hashPassword("pass123"), hashPassword("pass123"));
});

test("different passwords give different hashes", () => {
  assert.notEqual(hashPassword("pass123"), hashPassword("pass124"));
});

// ===== Registration form validation =====
test("a correct registration form is accepted", () => {
  assert.equal(validateRegistration("Rahul Sharma", "rahul_1", "pass123").valid, true);
});

test("a very short full name is rejected", () => {
  assert.equal(validateRegistration("R", "rahul_1", "pass123").valid, false);
});

test("a bad username is rejected", () => {
  assert.equal(validateRegistration("Rahul Sharma", "ab", "pass123").valid, false);
  assert.equal(validateRegistration("Rahul Sharma", "rahul sharma", "pass123").valid, false);
});

test("a short password is rejected", () => {
  assert.equal(validateRegistration("Rahul Sharma", "rahul_1", "123").valid, false);
});

// ===== Registering users =====
test("registerUser adds a new user", () => {
  const result = registerUser({}, "Rahul Sharma", "Rahul_1", "pass123", "1/1/2026");
  assert.equal(result.ok, true);
  assert.equal(result.users["rahul_1"].fullName, "Rahul Sharma");
  assert.equal(result.users["rahul_1"].joined, "1/1/2026");
});

test("registerUser rejects a duplicate username (even with different capitals)", () => {
  const first = registerUser({}, "Rahul Sharma", "rahul_1", "pass123", "1/1/2026");
  const second = registerUser(first.users, "Another Person", "RAHUL_1", "abcd", "1/1/2026");
  assert.equal(second.ok, false);
});

test("the plain password is never stored", () => {
  const result = registerUser({}, "Rahul Sharma", "rahul_1", "pass123", "1/1/2026");
  assert.equal(JSON.stringify(result.users).includes("pass123"), false);
});

// ===== Login check =====
test("authenticate accepts the right username and password", () => {
  const result = registerUser({}, "Rahul Sharma", "rahul_1", "pass123", "1/1/2026");
  assert.equal(authenticate(result.users, "RAHUL_1", "pass123"), true);
});

test("authenticate rejects a wrong password", () => {
  const result = registerUser({}, "Rahul Sharma", "rahul_1", "pass123", "1/1/2026");
  assert.equal(authenticate(result.users, "rahul_1", "wrong"), false);
});

test("authenticate rejects an unknown user", () => {
  assert.equal(authenticate({}, "nobody", "pass123"), false);
});