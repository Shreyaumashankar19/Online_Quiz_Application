const { test } = require("node:test");
const assert = require("node:assert/strict");

const {
  getCourses,
  getQuestions,
  getDifficultyList,
  getDifficultyInfo,
  getTimeForDifficulty,
  getQuestionsByDifficulty,
  selectQuestions,
  calculateXP,
  getLevelInfo,
  getTotalXP,
  filterByDifficulty,
  getDifficultyStats,
  buildLeaderboard,
  getGreeting,
  getBadges
} = require("../quizLogic.js");

// ===== Questions and difficulty =====
test("every course has at least 6 questions for each difficulty", () => {
  getCourses().forEach((course) => {
    ["easy", "medium", "hard"].forEach((level) => {
      assert.ok(getQuestionsByDifficulty(course.id, level).length >= 6);
    });
  });
});

test("every question has a valid difficulty", () => {
  getCourses().forEach((course) => {
    course.questions.forEach((q) => {
      assert.ok(["easy", "medium", "hard"].includes(q.difficulty));
    });
  });
});

test("there are 4 difficulty options and unknown ones return null", () => {
  assert.equal(getDifficultyList().length, 4);
  assert.equal(getDifficultyInfo("hard").label, "Hard");
  assert.equal(getDifficultyInfo("nope"), null);
});

test("time per question depends on the difficulty", () => {
  assert.equal(getTimeForDifficulty("easy"), 20);
  assert.equal(getTimeForDifficulty("medium"), 15);
  assert.equal(getTimeForDifficulty("hard"), 10);
  assert.equal(getTimeForDifficulty("mixed"), 15);
  assert.equal(getTimeForDifficulty("unknown"), 15);
});

// ===== Building a quiz =====
test("selectQuestions returns only questions of the chosen difficulty", () => {
  const list = selectQuestions("gk", "easy", Math.random);
  assert.equal(list.length, 6);
  list.forEach((q) => assert.equal(q.difficulty, "easy"));
});

test("mixed mode returns 10 questions that belong to the course", () => {
  const list = selectQuestions("cs", "mixed", Math.random);
  const pool = getQuestions("cs");
  assert.equal(list.length, 10);
  list.forEach((q) => assert.ok(pool.includes(q)));
});

test("selectQuestions returns an empty list for an unknown course or level", () => {
  assert.deepEqual(selectQuestions("unknown", "easy", Math.random), []);
  assert.deepEqual(selectQuestions("cs", "unknown", Math.random), []);
});

// ===== XP and levels =====
test("harder levels give more XP", () => {
  assert.equal(calculateXP(5, "easy"), 50);
  assert.equal(calculateXP(5, "medium"), 75);
  assert.equal(calculateXP(5, "hard"), 100);
  assert.equal(calculateXP(5, "unknown"), 50);
});

test("getLevelInfo calculates level and progress", () => {
  const start = getLevelInfo(0);
  assert.equal(start.level, 1);
  assert.equal(start.progress, 0);

  const later = getLevelInfo(250);
  assert.equal(later.level, 3);
  assert.equal(later.xpInLevel, 50);
  assert.equal(later.xpForNext, 100);
  assert.equal(later.progress, 50);
});

test("getTotalXP adds XP and ignores old attempts without XP", () => {
  assert.equal(getTotalXP([{ xp: 10 }, { xp: 20 }, {}]), 30);
  assert.equal(getTotalXP([]), 0);
});

// ===== Analytics =====
test("filterByDifficulty treats old attempts as mixed", () => {
  const historyData = [{ difficulty: "easy" }, { difficulty: "hard" }, {}];
  assert.equal(filterByDifficulty(historyData, "all").length, 3);
  assert.equal(filterByDifficulty(historyData, "easy").length, 1);
  assert.equal(filterByDifficulty(historyData, "mixed").length, 1);
});

test("getDifficultyStats gives the average of each difficulty", () => {
  const historyData = [
    { difficulty: "easy", percentage: 100 },
    { difficulty: "easy", percentage: 50 },
    { percentage: 40 }
  ];
  const stats = getDifficultyStats(historyData);
  assert.equal(stats.length, 4);
  assert.equal(stats[0].id, "easy");
  assert.equal(stats[0].average, 75);
  assert.equal(stats[0].attempts, 2);
  assert.equal(stats[1].attempts, 0);
  assert.equal(stats[3].id, "mixed");
  assert.equal(stats[3].average, 40);
});

// ===== Leaderboard =====
test("buildLeaderboard sorts players by XP", () => {
  const rows = buildLeaderboard([
    { username: "a", fullName: "A", history: [{ percentage: 50, xp: 20 }] },
    { username: "b", fullName: "B", history: [{ percentage: 100, xp: 150 }] },
    { username: "c", fullName: "C", history: [] }
  ]);
  assert.equal(rows[0].username, "b");
  assert.equal(rows[0].level, 2);
  assert.equal(rows[0].best, 100);
  assert.equal(rows[1].username, "a");
  assert.equal(rows[2].username, "c");
  assert.equal(rows[2].attempts, 0);
});

// ===== Greeting and badge =====
test("getGreeting changes with the time of day", () => {
  assert.equal(getGreeting(9), "Good morning");
  assert.equal(getGreeting(14), "Good afternoon");
  assert.equal(getGreeting(20), "Good evening");
});

test("the Hard Mode Hero badge needs a hard quiz with 80% or more", () => {
  const earned = (history) => getBadges(history).find((b) => b.id === "hardcore").earned;
  assert.equal(earned([{ courseId: "cs", percentage: 90, difficulty: "hard" }]), true);
  assert.equal(earned([{ courseId: "cs", percentage: 90, difficulty: "easy" }]), false);
  assert.equal(earned([{ courseId: "cs", percentage: 60, difficulty: "hard" }]), false);
});