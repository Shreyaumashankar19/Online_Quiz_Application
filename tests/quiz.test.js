const { test } = require("node:test");
const assert = require("node:assert/strict");

const {
  TIME_PER_QUESTION,
  getQuestions,
  getTotalQuestions,
  isCorrectAnswer,
  calculateScore,
  calculatePercentage,
  getResultMessage,
  tick,
  isTimeUp
} = require("../quizLogic.js");

// ===== Question loading =====
test("there are at least 10 questions", () => {
  assert.ok(getQuestions().length >= 10);
  assert.equal(getTotalQuestions(), getQuestions().length);
});

test("every question has text, 4 options and a valid correct answer", () => {
  getQuestions().forEach((q) => {
    assert.ok(q.question.length > 0);
    assert.equal(q.options.length, 4);
    assert.ok(q.correctIndex >= 0 && q.correctIndex <= 3);
  });
});

// ===== Answer validation =====
test("correct answer is accepted", () => {
  const q = getQuestions()[0];
  assert.equal(isCorrectAnswer(q, q.correctIndex), true);
});

test("wrong answer is rejected", () => {
  const q = getQuestions()[0];
  const wrongIndex = (q.correctIndex + 1) % 4;
  assert.equal(isCorrectAnswer(q, wrongIndex), false);
});

// ===== Score calculation =====
test("score is full when all answers are correct", () => {
  const list = getQuestions();
  const answers = list.map((q) => q.correctIndex);
  assert.equal(calculateScore(list, answers), list.length);
});

test("score is 0 when all answers are wrong", () => {
  const list = getQuestions();
  const answers = list.map((q) => (q.correctIndex + 1) % 4);
  assert.equal(calculateScore(list, answers), 0);
});

test("unanswered questions (null) give no score", () => {
  const list = getQuestions();
  const answers = list.map(() => null);
  assert.equal(calculateScore(list, answers), 0);
});

test("score is correct for a mix of answers", () => {
  const list = getQuestions();
  const answers = list.map((q, i) => (i < 3 ? q.correctIndex : null));
  assert.equal(calculateScore(list, answers), 3);
});

// ===== Percentage calculation =====
test("percentage is calculated correctly", () => {
  assert.equal(calculatePercentage(8, 10), 80);
  assert.equal(calculatePercentage(10, 10), 100);
  assert.equal(calculatePercentage(0, 10), 0);
  assert.equal(calculatePercentage(1, 3), 33);
});

test("percentage is 0 when total is 0", () => {
  assert.equal(calculatePercentage(0, 0), 0);
});

// ===== Result message =====
test("result message matches the percentage", () => {
  assert.equal(getResultMessage(90), "Excellent! You are a quiz champion!");
  assert.equal(getResultMessage(60), "Good job! Keep practicing.");
  assert.equal(getResultMessage(20), "Keep learning and try again!");
});

// ===== Timer logic =====
test("timer starts at 15 seconds", () => {
  assert.equal(TIME_PER_QUESTION, 15);
});

test("timer goes down by 1 and never below 0", () => {
  assert.equal(tick(10), 9);
  assert.equal(tick(1), 0);
  assert.equal(tick(0), 0);
});

test("isTimeUp is true only when time is 0", () => {
  assert.equal(isTimeUp(0), true);
  assert.equal(isTimeUp(5), false);
});