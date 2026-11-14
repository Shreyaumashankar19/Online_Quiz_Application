// ===== Quiz settings =====
const TIME_PER_QUESTION = 15; // seconds for each question

// ===== Courses and questions =====
// correctIndex is the position of the right answer (0 = first option, 3 = fourth option)
const courses = [
  {
    id: "cs",
    name: "Computer Science",
    icon: "💻",
    description: "Hardware, data structures, networks and programming basics.",
    questions: [
      {
        question: "What does CPU stand for?",
        options: ["Central Process Unit", "Central Processing Unit", "Computer Personal Unit", "Central Program Utility"],
        correctIndex: 1
      },
      {
        question: "Which data structure works on the LIFO principle?",
        options: ["Queue", "Array", "Stack", "Graph"],
        correctIndex: 2
      },
      {
        question: "What is the binary form of the decimal number 5?",
        options: ["101", "110", "011", "111"],
        correctIndex: 0
      },
      {
        question: "Which of these is NOT a programming language?",
        options: ["Java", "Python", "C++", "HTTP"],
        correctIndex: 3
      },
      {
        question: "What does RAM stand for?",
        options: ["Read Access Memory", "Random Access Memory", "Run Access Module", "Rapid Action Memory"],
        correctIndex: 1
      },
      {
        question: "Which of these memories is the fastest?",
        options: ["Hard disk", "Pen drive", "Cache memory", "DVD"],
        correctIndex: 2
      },
      {
        question: "What is the time complexity of binary search?",
        options: ["O(log n)", "O(n)", "O(n squared)", "O(1)"],
        correctIndex: 0
      },
      {
        question: "Which device connects different networks together?",
        options: ["Keyboard", "Monitor", "Printer", "Router"],
        correctIndex: 3
      }
    ]
  },
  {
    id: "gk",
    name: "General Knowledge",
    icon: "🌍",
    description: "Geography, science and facts about the world around us.",
    questions: [
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
      },
      {
        question: "Who wrote the national anthem of India?",
        options: ["Bankim Chandra Chatterjee", "Rabindranath Tagore", "Sarojini Naidu", "Mahatma Gandhi"],
        correctIndex: 1
      },
      {
        question: "What is the chemical formula of water?",
        options: ["H2O", "CO2", "O2", "NaCl"],
        correctIndex: 0
      },
      {
        question: "Which is the largest country in the world by area?",
        options: ["India", "USA", "China", "Russia"],
        correctIndex: 3
      },
      {
        question: "How many continents are there on Earth?",
        options: ["5", "7", "6", "8"],
        correctIndex: 1
      }
    ]
  },
  {
    id: "devops",
    name: "DevOps Basics",
    icon: "⚙️",
    description: "Git, GitHub, CI/CD and Docker fundamentals.",
    questions: [
      {
        question: "Who created Git?",
        options: ["Bill Gates", "Steve Jobs", "Linus Torvalds", "Mark Zuckerberg"],
        correctIndex: 2
      },
      {
        question: "What does CI stand for in CI/CD?",
        options: ["Continuous Integration", "Computer Interface", "Code Inspection", "Central Installation"],
        correctIndex: 0
      },
      {
        question: "Which tool packages an application into a container?",
        options: ["Git", "Docker", "Notepad", "Excel"],
        correctIndex: 1
      },
      {
        question: "Which command uploads your local commits to GitHub?",
        options: ["git add", "git init", "git clone", "git push"],
        correctIndex: 3
      },
      {
        question: "Which file format is commonly used for GitHub Actions workflows?",
        options: ["HTML", "CSS", "YAML", "PDF"],
        correctIndex: 2
      },
      {
        question: "What is a Docker image?",
        options: ["A blueprint used to create containers", "A photo file", "A type of virus", "A text editor"],
        correctIndex: 0
      },
      {
        question: "What does the git commit command do?",
        options: ["Deletes all files", "Saves a snapshot of your changes", "Installs Node.js", "Opens GitHub"],
        correctIndex: 1
      },
      {
        question: "What is the main goal of DevOps?",
        options: ["Replace all developers", "Design logos", "Reduce internet cost", "Deliver software faster and more reliably"],
        correctIndex: 3
      }
    ]
  },
  {
    id: "web",
    name: "Web Development",
    icon: "🌐",
    description: "HTML, CSS and JavaScript for building websites.",
    questions: [
      {
        question: "What does HTML stand for?",
        options: ["Hyper Trainer Marking Language", "Hyper Text Markup Language", "High Text Machine Language", "Hyper Tool Multi Language"],
        correctIndex: 1
      },
      {
        question: "Which language is used to style web pages?",
        options: ["HTML", "SQL", "Java", "CSS"],
        correctIndex: 3
      },
      {
        question: "Which symbol starts a single-line comment in JavaScript?",
        options: ["//", "#", "<!--", "**"],
        correctIndex: 0
      },
      {
        question: "Which HTML tag creates the largest heading?",
        options: ["<h6>", "<head>", "<h1>", "<title>"],
        correctIndex: 2
      },
      {
        question: "Which CSS property changes the text color?",
        options: ["font-size", "color", "margin", "display"],
        correctIndex: 1
      },
      {
        question: "Which JavaScript method finds an element by its id?",
        options: ["document.getElementById()", "document.write()", "window.alert()", "console.log()"],
        correctIndex: 0
      },
      {
        question: "What does CSS stand for?",
        options: ["Creative Style Sheets", "Computer Style Sheets", "Colorful Style Sheets", "Cascading Style Sheets"],
        correctIndex: 3
      },
      {
        question: "Which HTML tag is used to add a JavaScript file?",
        options: ["<link>", "<style>", "<script>", "<js>"],
        correctIndex: 2
      }
    ]
  }
];

// ===== Course and question functions =====

// Returns all courses
function getCourses() {
  return courses;
}

// Finds one course by its id. Returns null if not found.
function getCourseById(courseId) {
  for (let i = 0; i < courses.length; i++) {
    if (courses[i].id === courseId) {
      return courses[i];
    }
  }
  return null;
}

// Returns the questions of one course. Returns an empty list if the course does not exist.
function getQuestions(courseId) {
  const course = getCourseById(courseId);
  if (course) {
    return course.questions;
  }
  return [];
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

// ===== Timer logic =====

// Reduces time by 1 second but never goes below 0
function tick(timeLeft) {
  if (timeLeft > 0) {
    return timeLeft - 1;
  }
  return 0;
}

// Is the time finished?
function isTimeUp(timeLeft) {
  return timeLeft <= 0;
}

// ===== Interactive features =====

// Returns a shuffled copy of a list. The original list is not changed.
function shuffleArray(list, randomFn) {
  const copy = list.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(randomFn() * (i + 1));
    const temp = copy[i];
    copy[i] = copy[j];
    copy[j] = temp;
  }
  return copy;
}

// Streak = number of correct answers in a row
function updateStreak(streak, wasCorrect) {
  if (wasCorrect) {
    return streak + 1;
  }
  return 0;
}

// 50:50 lifeline: returns the positions of two wrong options to remove
function getFiftyFiftyRemoval(question) {
  const wrongOptions = [];
  for (let i = 0; i < question.options.length; i++) {
    if (i !== question.correctIndex) {
      wrongOptions.push(i);
    }
  }
  return wrongOptions.slice(0, 2);
}

// ===== Dashboard and analytics functions =====

// Counts questions that were not answered (time ran out)
function countSkipped(userAnswers, totalQuestions) {
  let answeredCount = 0;
  for (let i = 0; i < totalQuestions; i++) {
    if (userAnswers[i] !== null && userAnswers[i] !== undefined) {
      answeredCount++;
    }
  }
  return totalQuestions - answeredCount;
}

// Adds one attempt to the history and keeps only the latest maxItems attempts
function addAttempt(historyList, attempt, maxItems) {
  const updated = historyList.concat([attempt]);
  if (updated.length > maxItems) {
    return updated.slice(updated.length - maxItems);
  }
  return updated;
}

// Calculates dashboard numbers from the history list
function calculateStats(historyList) {
  if (!historyList || historyList.length === 0) {
    return { attempts: 0, bestPercentage: 0, averagePercentage: 0, lastPercentage: 0 };
  }

  let total = 0;
  let best = 0;
  historyList.forEach(function (attempt) {
    total += attempt.percentage;
    if (attempt.percentage > best) {
      best = attempt.percentage;
    }
  });

  return {
    attempts: historyList.length,
    bestPercentage: best,
    averagePercentage: Math.round(total / historyList.length),
    lastPercentage: historyList[historyList.length - 1].percentage
  };
}

// Returns the first letter of the name for the avatar
function getInitial(name) {
  if (!name || name.trim() === "") {
    return "?";
  }
  return name.trim().charAt(0).toUpperCase();
}

// Keeps only the attempts of one course. "all" keeps everything.
function filterHistory(historyList, courseId) {
  if (courseId === "all") {
    return historyList;
  }
  return historyList.filter(function (attempt) {
    return attempt.courseId === courseId;
  });
}

// Adds up correct, wrong and skipped answers from all attempts
function getTotals(historyList) {
  const totals = { correct: 0, wrong: 0, skipped: 0 };
  historyList.forEach(function (attempt) {
    totals.correct += attempt.correct || 0;
    totals.wrong += attempt.wrong || 0;
    totals.skipped += attempt.skipped || 0;
  });
  return totals;
}

// Average score of every course (used by the course-wise chart)
function getCourseStats(historyList, courseList) {
  return courseList.map(function (course) {
    const stats = calculateStats(filterHistory(historyList, course.id));
    return {
      courseId: course.id,
      name: course.name,
      attempts: stats.attempts,
      average: stats.averagePercentage
    };
  });
}

// Achievement badges
function getBadges(historyList) {
  let hasPerfect = false;
  let hasHigh = false;
  const courseIds = [];

  historyList.forEach(function (attempt) {
    if (attempt.percentage === 100) {
      hasPerfect = true;
    }
    if (attempt.percentage >= 80) {
      hasHigh = true;
    }
    if (courseIds.indexOf(attempt.courseId) === -1) {
      courseIds.push(attempt.courseId);
    }
  });

  return [
    { id: "first", icon: "🚀", title: "First Step", description: "Complete your first quiz", earned: historyList.length >= 1 },
    { id: "five", icon: "📘", title: "Quiz Lover", description: "Complete 5 quizzes", earned: historyList.length >= 5 },
    { id: "high", icon: "⭐", title: "High Achiever", description: "Score 80% or more", earned: hasHigh },
    { id: "perfect", icon: "🏆", title: "Perfectionist", description: "Score 100%", earned: hasPerfect },
    { id: "explorer", icon: "🧭", title: "Explorer", description: "Try 2 different courses", earned: courseIds.length >= 2 }
  ];
}

// ===== Login and profile functions =====

// Turns a password into a scrambled number string (simple hash, for demo only)
function hashPassword(text) {
  let hash = 5381;
  for (let i = 0; i < text.length; i++) {
    hash = ((hash << 5) + hash + text.charCodeAt(i)) | 0;
  }
  return String(hash >>> 0);
}

// Checks the registration form values
function validateRegistration(fullName, username, password) {
  if (!fullName || fullName.trim().length < 2) {
    return { valid: false, message: "Please enter your full name (at least 2 letters)." };
  }
  if (!/^[a-zA-Z0-9_]{3,15}$/.test(username)) {
    return { valid: false, message: "Username must be 3 to 15 letters, numbers or underscores." };
  }
  if (!password || password.length < 4) {
    return { valid: false, message: "Password must be at least 4 characters." };
  }
  return { valid: true, message: "" };
}

// Does this username already exist?
function userExists(users, username) {
  return Object.prototype.hasOwnProperty.call(users, username.toLowerCase());
}

// Adds a new user. Returns a new users object (the old one is not changed).
function registerUser(users, fullName, username, password, joinedDate) {
  if (userExists(users, username)) {
    return { ok: false, message: "That username is already taken.", users: users };
  }
  const key = username.toLowerCase();
  const newUser = {
    fullName: fullName.trim(),
    passwordHash: hashPassword(password),
    joined: joinedDate
  };
  const updatedUsers = Object.assign({}, users);
  updatedUsers[key] = newUser;
  return { ok: true, message: "", users: updatedUsers };
}

// Checks the username and password during login
function authenticate(users, username, password) {
  if (!userExists(users, username)) {
    return false;
  }
  return users[username.toLowerCase()].passwordHash === hashPassword(password);
}

// This lets Node.js (tests) use the functions. The browser ignores this block.
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    TIME_PER_QUESTION,
    getCourses,
    getCourseById,
    getQuestions,
    isCorrectAnswer,
    calculateScore,
    calculatePercentage,
    getResultMessage,
    tick,
    isTimeUp,
    shuffleArray,
    updateStreak,
    getFiftyFiftyRemoval,
    countSkipped,
    addAttempt,
    calculateStats,
    getInitial,
    filterHistory,
    getTotals,
    getCourseStats,
    getBadges,
    hashPassword,
    validateRegistration,
    userExists,
    registerUser,
    authenticate
  };
}