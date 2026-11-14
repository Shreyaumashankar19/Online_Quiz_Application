// ===== Quiz settings =====
const TIME_PER_QUESTION = 15; // seconds for each question

// ===== Quiz questions =====
// correctIndex is the position of the right answer (0 = first option, 3 = fourth option)
const questions = [
  {
    question: "What does HTML stand for?",
    options: [
      "Hyper Text Markup Language",
      "High Text Machine Language",
      "Hyper Tool Multi Language",
      "Home Text Markup Language"
    ],
    correctIndex: 0
  },
  {
    question: "Which language is used to style web pages?",
    options: ["HTML", "CSS", "Java", "SQL"],
    correctIndex: 1
  },
  {
    question: "Which symbol starts a single-line comment in JavaScript?",
    options: ["#", "<!--", "//", "**"],
    correctIndex: 2
  },
  {
    question: "What does CPU stand for?",
    options: [
      "Central Process Unit",
      "Central Processing Unit",
      "Computer Personal Unit",
      "Central Program Utility"
    ],
    correctIndex: 1
  },
  {
    question: "Who created Git?",
    options: ["Bill Gates", "Steve Jobs", "Mark Zuckerberg", "Linus Torvalds"],
    correctIndex: 3
  },
  {
    question: "Which tool is used to package an application into a container?",
    options: ["Git", "GitHub", "Docker", "Notepad"],
    correctIndex: 2
  },
  {
    question: "What is the capital of India?",
    options: ["New Delhi", "Mumbai", "Kolkata", "Chennai"],
    correctIndex: 0
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Jupiter", "Mars", "Saturn"],
    correctIndex: 2
  },
  {
    question: "How many days are there in a leap year?",
    options: ["365", "364", "366", "367"],
    correctIndex: 2
  },
  {
    question: "Which is the largest ocean on Earth?",
    options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
    correctIndex: 3
  }
];

// ===== Functions =====

// Returns all questions
function getQuestions() {
  return questions;
}

// Returns how many questions there are
function getTotalQuestions() {
  return questions.length;
}

// Checks if the selected option is the right answer
function isCorrectAnswer(question, selectedIndex) {
  return selectedIndex === question.correctIndex;
}

// Counts correct answers. An unanswered question is saved as null and gets no point.
function calculateScore(questionList, userAnswers) {
  let score = 0;
  for (let i = 0; i < questionList.length; i++) {
    if (userAnswers[i] === questionList[i].correctIndex) {
      score++;
    }
  }
  return score;
}

// Converts score to a whole-number percentage
function calculatePercentage(score, total) {
  if (total <= 0) {
    return 0;
  }
  return Math.round((score / total) * 100);
}

// Returns a message based on the percentage
function getResultMessage(percentage) {
  if (percentage >= 80) {
    return "Excellent! You are a quiz champion!";
  }
  if (percentage >= 50) {
    return "Good job! Keep practicing.";
  }
  return "Keep learning and try again!";
}

// Timer logic: reduces time by 1 second but never goes below 0
function tick(timeLeft) {
  if (timeLeft > 0) {
    return timeLeft - 1;
  }
  return 0;
}

// Timer logic: is the time finished?
function isTimeUp(timeLeft) {
  return timeLeft <= 0;
}

// This lets Node.js (tests) use the functions. The browser ignores this block.
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    TIME_PER_QUESTION,
    getQuestions,
    getTotalQuestions,
    isCorrectAnswer,
    calculateScore,
    calculatePercentage,
    getResultMessage,
    tick,
    isTimeUp
  };
}