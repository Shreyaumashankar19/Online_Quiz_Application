const { test } = require("node:test");
const assert = require("node:assert/strict");

const {
  getCourses,
  countSkipped,
  addAttempt,
  calculateStats,
  getInitial,
  filterHistory,
  getTotals,
  getCourseStats,
  getBadges
} = require("../quizLogic.js");

// ===== Skipped questions =====
test("countSkipped counts null answers", () => {
  assert.equal(countSkipped([0, null, 2, null], 4), 2);
});

test("countSkipped counts missing answers and is 0 when all are answered", () => {
  assert.equal(countSkipped([0, 1, 2, 3], 4), 0);
  assert.equal(countSkipped([0, 1], 4), 2);
});

// ===== History =====
test("addAttempt adds a new attempt", () => {
  const result = addAttempt([], { percentage: 50 }, 10);
  assert.equal(result.length, 1);
});

test("addAttempt keeps only the latest attempts", () => {
  let historyData = [];
  for (let i = 1; i <= 12; i++) {
    historyData = addAttempt(historyData, { percentage: i }, 10);
  }
  assert.equal(historyData.length, 10);
  assert.equal(historyData[0].percentage, 3);
  assert.equal(historyData[9].percentage, 12);
});

// ===== Dashboard statistics =====
test("calculateStats returns zeros for empty history", () => {
  const stats = calculateStats([]);
  assert.equal(stats.attempts, 0);
  assert.equal(stats.bestPercentage, 0);
  assert.equal(stats.averagePercentage, 0);
  assert.equal(stats.lastPercentage, 0);
});

test("calculateStats calculates best, average and last", () => {
  const historyData = [{ percentage: 40 }, { percentage: 80 }, { percentage: 60 }];
  const stats = calculateStats(historyData);
  assert.equal(stats.attempts, 3);
  assert.equal(stats.bestPercentage, 80);
  assert.equal(stats.averagePercentage, 60);
  assert.equal(stats.lastPercentage, 60);
});

// ===== Profile =====
test("getInitial returns the first letter in capitals", () => {
  assert.equal(getInitial("rahul"), "R");
  assert.equal(getInitial("  anita"), "A");
});

test("getInitial returns ? for an empty name", () => {
  assert.equal(getInitial(""), "?");
  assert.equal(getInitial("   "), "?");
});

// ===== Course filter =====
test("filterHistory with 'all' returns everything", () => {
  const historyData = [{ courseId: "cs" }, { courseId: "gk" }];
  assert.equal(filterHistory(historyData, "all").length, 2);
});

test("filterHistory keeps only the chosen course", () => {
  const historyData = [{ courseId: "cs" }, { courseId: "gk" }, { courseId: "cs" }];
  assert.equal(filterHistory(historyData, "cs").length, 2);
  assert.equal(filterHistory(historyData, "web").length, 0);
});

// ===== Chart data =====
test("getTotals adds up correct, wrong and skipped", () => {
  const historyData = [
    { correct: 5, wrong: 2, skipped: 1 },
    { correct: 3, wrong: 4, skipped: 1 }
  ];
  const totals = getTotals(historyData);
  assert.equal(totals.correct, 8);
  assert.equal(totals.wrong, 6);
  assert.equal(totals.skipped, 2);
});

test("getCourseStats gives the average of every course", () => {
  const historyData = [
    { courseId: "cs", percentage: 50 },
    { courseId: "cs", percentage: 100 },
    { courseId: "gk", percentage: 40 }
  ];
  const stats = getCourseStats(historyData, getCourses());
  assert.equal(stats.length, getCourses().length);
  assert.equal(stats[0].courseId, "cs");
  assert.equal(stats[0].average, 75);
  assert.equal(stats[0].attempts, 2);
  assert.equal(stats[1].average, 40);
  assert.equal(stats[2].average, 0);
});

// ===== Badges =====
test("no badge is earned with an empty history", () => {
  const earned = getBadges([]).filter((badge) => badge.earned);
  assert.equal(earned.length, 0);
});

test("badges are earned after good attempts in 2 courses", () => {
  const historyData = [
    { courseId: "cs", percentage: 100 },
    { courseId: "gk", percentage: 50 }
  ];
  const earnedIds = getBadges(historyData).filter((b) => b.earned).map((b) => b.id);
  assert.ok(earnedIds.includes("first"));
  assert.ok(earnedIds.includes("high"));
  assert.ok(earnedIds.includes("perfect"));
  assert.ok(earnedIds.includes("explorer"));
  assert.equal(earnedIds.includes("five"), false);
});