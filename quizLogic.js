// ===== Quiz settings =====
const TIME_PER_QUESTION = 15; // default seconds for a question

// ===== Difficulty levels =====
// time = seconds per question, count = how many questions in one quiz, xp = points per correct answer
const DIFFICULTIES = [
  { id: "easy",   label: "Easy",   icon: "🟢", time: 20, count: 6,  xp: 10 },
  { id: "medium", label: "Medium", icon: "🟡", time: 15, count: 6,  xp: 15 },
  { id: "hard",   label: "Hard",   icon: "🔴", time: 10, count: 6,  xp: 20 },
  { id: "mixed",  label: "Mixed",  icon: "🎲", time: 15, count: 10, xp: 15 }
];

// Small helper that builds one question.
// correctIndex is the position of the right answer (0 = first option, 3 = fourth option)
function q(text, options, correctIndex, difficulty) {
  return { question: text, options: options, correctIndex: correctIndex, difficulty: difficulty };
}

// ===== Courses and questions (4 courses x 18 questions = 72) =====
const courses = [
  {
    id: "cs",
    name: "Computer Science",
    icon: "💻",
    accent: "#3b82f6",
    description: "Hardware, data structures, networks, databases and programming basics.",
    questions: [
      // ----- Easy -----
      q("What does CPU stand for?", ["Central Process Unit", "Central Processing Unit", "Computer Personal Unit", "Central Program Utility"], 1, "easy"),
      q("Which device is used to type text into a computer?", ["Monitor", "Keyboard", "Speaker", "Printer"], 1, "easy"),
      q("What is the binary form of the decimal number 5?", ["101", "110", "011", "111"], 0, "easy"),
      q("Which of these is NOT a programming language?", ["Java", "Python", "C++", "HTTP"], 3, "easy"),
      q("What does RAM stand for?", ["Read Access Memory", "Random Access Memory", "Run Access Module", "Rapid Action Memory"], 1, "easy"),
      q("Which of these is an operating system?", ["Oracle", "Linux", "Python", "Intel"], 1, "easy"),
      // ----- Medium -----
      q("Which data structure works on the LIFO principle?", ["Queue", "Array", "Stack", "Graph"], 2, "medium"),
      q("Which data structure works on the FIFO principle?", ["Stack", "Tree", "Queue", "Heap"], 2, "medium"),
      q("Which of these memories is the fastest?", ["Hard disk", "Pen drive", "Cache memory", "DVD"], 2, "medium"),
      q("Which device connects different networks together?", ["Keyboard", "Monitor", "Printer", "Router"], 3, "medium"),
      q("What does SQL stand for?", ["Structured Query Language", "Simple Question Language", "Sequential Query Logic", "Standard Quick Language"], 0, "medium"),
      q("Which protocol is used to load web pages securely?", ["FTP", "HTTPS", "SMTP", "SSH"], 1, "medium"),
      // ----- Hard -----
      q("What is the time complexity of binary search?", ["O(n)", "O(log n)", "O(n squared)", "O(1)"], 1, "hard"),
      q("Which sorting algorithm picks a pivot and uses divide and conquer?", ["Bubble sort", "Insertion sort", "Quick sort", "Selection sort"], 2, "hard"),
      q("How many bits are there in an IPv4 address?", ["16", "32", "64", "128"], 1, "hard"),
      q("Which layer of the OSI model is responsible for routing packets?", ["Physical layer", "Data Link layer", "Network layer", "Transport layer"], 2, "hard"),
      q("What does a primary key do in a database table?", ["Uniquely identifies each row", "Stores passwords", "Sorts the table", "Deletes duplicate tables"], 0, "hard"),
      q("Which CPU scheduling algorithm can starve long processes?", ["Round Robin", "First Come First Served", "Shortest Job First", "Time slicing"], 2, "hard")
    ]
  },
  {
    id: "gk",
    name: "General Knowledge",
    icon: "🌍",
    accent: "#10b981",
    description: "Geography, science, history and facts about the world around us.",
    questions: [
      // ----- Easy -----
      q("What is the capital of India?", ["New Delhi", "Mumbai", "Kolkata", "Chennai"], 0, "easy"),
      q("Which planet is known as the Red Planet?", ["Venus", "Jupiter", "Mars", "Saturn"], 2, "easy"),
      q("How many days are there in a leap year?", ["365", "364", "366", "367"], 2, "easy"),
      q("Which is the largest ocean on Earth?", ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"], 3, "easy"),
      q("What is the chemical formula of water?", ["H2O", "CO2", "O2", "NaCl"], 0, "easy"),
      q("How many continents are there on Earth?", ["5", "7", "6", "8"], 1, "easy"),
      // ----- Medium -----
      q("Who wrote the national anthem of India?", ["Bankim Chandra Chatterjee", "Rabindranath Tagore", "Sarojini Naidu", "Mahatma Gandhi"], 1, "medium"),
      q("Which is the largest country in the world by area?", ["India", "USA", "China", "Russia"], 3, "medium"),
      q("Which gas do plants take in from the air for photosynthesis?", ["Oxygen", "Nitrogen", "Carbon dioxide", "Hydrogen"], 2, "medium"),
      q("Who is known as the Father of the Nation in India?", ["Jawaharlal Nehru", "Mahatma Gandhi", "Subhas Chandra Bose", "Sardar Patel"], 1, "medium"),
      q("Which country gifted the Statue of Liberty to the USA?", ["England", "Germany", "France", "Spain"], 2, "medium"),
      q("What is the smallest prime number?", ["0", "1", "2", "3"], 2, "medium"),
      // ----- Hard -----
      q("Which is the smallest country in the world by area?", ["Monaco", "San Marino", "Vatican City", "Malta"], 2, "hard"),
      q("Who discovered penicillin?", ["Louis Pasteur", "Alexander Fleming", "Marie Curie", "Robert Koch"], 1, "hard"),
      q("What is the SI unit of electric current?", ["Volt", "Ohm", "Watt", "Ampere"], 3, "hard"),
      q("In which year did World War II end?", ["1942", "1945", "1947", "1950"], 1, "hard"),
      q("What is the capital city of Australia?", ["Sydney", "Melbourne", "Canberra", "Perth"], 2, "hard"),
      q("Which is the lightest chemical element?", ["Helium", "Lithium", "Hydrogen", "Oxygen"], 2, "hard")
    ]
  },
  {
    id: "devops",
    name: "DevOps Basics",
    icon: "⚙️",
    accent: "#f59e0b",
    description: "Git, GitHub, CI/CD and Docker fundamentals.",
    questions: [
      // ----- Easy -----
      q("Who created Git?", ["Bill Gates", "Steve Jobs", "Linus Torvalds", "Mark Zuckerberg"], 2, "easy"),
      q("Which tool packages an application into a container?", ["Git", "Docker", "Notepad", "Excel"], 1, "easy"),
      q("Which command uploads your local commits to GitHub?", ["git add", "git init", "git clone", "git push"], 3, "easy"),
      q("Which website is commonly used to host Git repositories online?", ["GitHub", "Google Maps", "Wikipedia", "YouTube"], 0, "easy"),
      q("Which command creates a new Git repository?", ["git push", "git init", "git copy", "git start"], 1, "easy"),
      q("What does the command git add . do?", ["Deletes all files", "Selects all changed files for the next commit", "Uploads code to GitHub", "Installs Git"], 1, "easy"),
      // ----- Medium -----
      q("What does CI stand for in CI/CD?", ["Continuous Integration", "Computer Interface", "Code Inspection", "Central Installation"], 0, "medium"),
      q("Which file format is commonly used for GitHub Actions workflows?", ["HTML", "CSS", "YAML", "PDF"], 2, "medium"),
      q("What is a Docker image?", ["A blueprint used to create containers", "A photo file", "A type of virus", "A text editor"], 0, "medium"),
      q("What does the git commit command do?", ["Deletes all files", "Saves a snapshot of your changes", "Installs Node.js", "Opens GitHub"], 1, "medium"),
      q("What is the main goal of DevOps?", ["Replace all developers", "Design logos", "Reduce internet cost", "Deliver software faster and more reliably"], 3, "medium"),
      q("Which folder holds GitHub Actions workflow files?", ["src/tests", ".github/workflows", "docs/actions", "build/ci"], 1, "medium"),
      // ----- Hard -----
      q("What does CD stand for in CI/CD?", ["Code Debugging", "Central Database", "Continuous Delivery or Deployment", "Container Distribution"], 2, "hard"),
      q("Which Dockerfile instruction sets the base image?", ["RUN", "COPY", "FROM", "EXPOSE"], 2, "hard"),
      q("What does docker run -p 8080:80 do?", ["Maps host port 8080 to container port 80", "Runs 80 containers", "Deletes port 8080", "Limits memory to 80 MB"], 0, "hard"),
      q("Which command downloads a copy of a remote repository?", ["git push", "git commit", "git status", "git clone"], 3, "hard"),
      q("What is the purpose of a .gitignore file?", ["Stores passwords", "Tells Git which files not to track", "Speeds up the internet", "Compiles the code"], 1, "hard"),
      q("Which is a benefit of containers compared to virtual machines?", ["They each include a full guest operating system", "They only run on Windows", "They are usually lighter and start faster", "They need no host computer"], 2, "hard")
    ]
  },
  {
    id: "web",
    name: "Web Development",
    icon: "🌐",
    accent: "#ec4899",
    description: "HTML, CSS and JavaScript for building websites.",
    questions: [
      // ----- Easy -----
      q("What does HTML stand for?", ["Hyper Trainer Marking Language", "Hyper Text Markup Language", "High Text Machine Language", "Hyper Tool Multi Language"], 1, "easy"),
      q("Which language is used to style web pages?", ["HTML", "SQL", "Java", "CSS"], 3, "easy"),
      q("Which HTML tag creates the largest heading?", ["<h6>", "<head>", "<h1>", "<title>"], 2, "easy"),
      q("Which HTML tag creates a hyperlink?", ["<img>", "<p>", "<a>", "<div>"], 2, "easy"),
      q("Which CSS property changes the text color?", ["font-size", "color", "margin", "display"], 1, "easy"),
      q("Which HTML tag is used to show an image?", ["<image>", "<pic>", "<src>", "<img>"], 3, "easy"),
      // ----- Medium -----
      q("Which symbol starts a single-line comment in JavaScript?", ["//", "#", "<!--", "**"], 0, "medium"),
      q("Which JavaScript method finds an element by its id?", ["document.getElementById()", "document.write()", "window.alert()", "console.log()"], 0, "medium"),
      q("What does CSS stand for?", ["Creative Style Sheets", "Computer Style Sheets", "Colorful Style Sheets", "Cascading Style Sheets"], 3, "medium"),
      q("Which HTML tag is used to add a JavaScript file?", ["<link>", "<style>", "<script>", "<js>"], 2, "medium"),
      q("Which JavaScript keyword declares a variable that cannot be reassigned?", ["var", "let", "const", "static"], 2, "medium"),
      q("Which CSS feature arranges items in a flexible row or column?", ["Flexbox", "Float", "Marquee", "Frameset"], 0, "medium"),
      // ----- Hard -----
      q("What does the === operator do in JavaScript?", ["Assigns a value", "Compares value and type", "Compares only the value", "Declares a constant"], 1, "hard"),
      q("What does typeof null return in JavaScript?", ["null", "undefined", "number", "object"], 3, "hard"),
      q("Which HTTP status code means Not Found?", ["200", "301", "404", "500"], 2, "hard"),
      q("Which CSS property adds space outside an element's border?", ["padding", "margin", "spacing", "border-radius"], 1, "hard"),
      q("Which JavaScript array method adds an item to the end of an array?", ["pop()", "shift()", "push()", "unshift()"], 2, "hard"),
      q("Which HTML5 attribute makes an input field compulsory?", ["mandatory", "needed", "validate", "required"], 3, "hard")
    ]
  }
];

// ===== Difficulty functions =====

// Returns all difficulty levels
function getDifficultyList() {
  return DIFFICULTIES;
}

// Finds one difficulty level by its id. Returns null if not found.
function getDifficultyInfo(levelId) {
  for (let i = 0; i < DIFFICULTIES.length; i++) {
    if (DIFFICULTIES[i].id === levelId) {
      return DIFFICULTIES[i];
    }
  }
  return null;
}

// Seconds allowed per question for a level
function getTimeForDifficulty(levelId) {
  const info = getDifficultyInfo(levelId);
  if (info) {
    return info.time;
  }
  return TIME_PER_QUESTION;
}

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

// Returns every question of one course. Returns an empty list if the course does not exist.
function getQuestions(courseId) {
  const course = getCourseById(courseId);
  if (course) {
    return course.questions;
  }
  return [];
}

// Returns the questions of a course for one level. "mixed" returns all of them.
function getQuestionsByDifficulty(courseId, levelId) {
  const all = getQuestions(courseId);
  if (levelId === "mixed") {
    return all;
  }
  return all.filter(function (question) {
    return question.difficulty === levelId;
  });
}

// Builds the question list for one quiz: right level, shuffled, limited to the right count
function selectQuestions(courseId, levelId, randomFn) {
  const info = getDifficultyInfo(levelId);
  if (!info) {
    return [];
  }
  const pool = getQuestionsByDifficulty(courseId, levelId);
  return shuffleArray(pool, randomFn).slice(0, info.count);
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

// Greeting that depends on the hour of the day (0 to 23)
function getGreeting(hour) {
  if (hour < 12) {
    return "Good morning";
  }
  if (hour < 17) {
    return "Good afternoon";
  }
  return "Good evening";
}

// ===== XP and levels =====

// XP earned in one quiz = correct answers x XP of that difficulty
function calculateXP(score, levelId) {
  const info = getDifficultyInfo(levelId);
  const perAnswer = info ? info.xp : 10;
  return score * perAnswer;
}

// Adds up the XP of every attempt. Old attempts without XP count as 0.
function getTotalXP(historyList) {
  let total = 0;
  historyList.forEach(function (attempt) {
    total += attempt.xp || 0;
  });
  return total;
}

// Every 100 XP is one level
function getLevelInfo(totalXP) {
  const xpPerLevel = 100;
  const xpInLevel = totalXP % xpPerLevel;
  return {
    level: Math.floor(totalXP / xpPerLevel) + 1,
    xpInLevel: xpInLevel,
    xpForNext: xpPerLevel,
    progress: Math.round((xpInLevel / xpPerLevel) * 100)
  };
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

// Keeps only the attempts of one difficulty. "all" keeps everything.
// Old attempts saved without a difficulty are treated as "mixed".
function filterByDifficulty(historyList, levelId) {
  if (levelId === "all") {
    return historyList;
  }
  return historyList.filter(function (attempt) {
    return (attempt.difficulty || "mixed") === levelId;
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

// Average score of every course (used by the course chart)
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

// Average score of every difficulty (used by the difficulty chart)
function getDifficultyStats(historyList) {
  return DIFFICULTIES.map(function (info) {
    const stats = calculateStats(filterByDifficulty(historyList, info.id));
    return {
      id: info.id,
      name: info.icon + " " + info.label,
      attempts: stats.attempts,
      average: stats.averagePercentage
    };
  });
}

// Builds the leaderboard. entries = [{ username, fullName, history }]
function buildLeaderboard(entries) {
  const rows = entries.map(function (entry) {
    const stats = calculateStats(entry.history);
    const xp = getTotalXP(entry.history);
    return {
      username: entry.username,
      fullName: entry.fullName,
      attempts: stats.attempts,
      best: stats.bestPercentage,
      average: stats.averagePercentage,
      xp: xp,
      level: getLevelInfo(xp).level
    };
  });

  rows.sort(function (a, b) {
    if (b.xp !== a.xp) {
      return b.xp - a.xp;
    }
    return b.best - a.best;
  });
  return rows;
}

// Achievement badges
function getBadges(historyList) {
  let hasPerfect = false;
  let hasHigh = false;
  let hasHardWin = false;
  const courseIds = [];

  historyList.forEach(function (attempt) {
    if (attempt.percentage === 100) {
      hasPerfect = true;
    }
    if (attempt.percentage >= 80) {
      hasHigh = true;
    }
    if (attempt.difficulty === "hard" && attempt.percentage >= 80) {
      hasHardWin = true;
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
    { id: "explorer", icon: "🧭", title: "Explorer", description: "Try 2 different courses", earned: courseIds.length >= 2 },
    { id: "hardcore", icon: "🔥", title: "Hard Mode Hero", description: "Score 80% or more on Hard", earned: hasHardWin }
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
    getDifficultyList,
    getDifficultyInfo,
    getTimeForDifficulty,
    getCourses,
    getCourseById,
    getQuestions,
    getQuestionsByDifficulty,
    selectQuestions,
    isCorrectAnswer,
    calculateScore,
    calculatePercentage,
    getResultMessage,
    tick,
    isTimeUp,
    shuffleArray,
    updateStreak,
    getFiftyFiftyRemoval,
    getGreeting,
    calculateXP,
    getTotalXP,
    getLevelInfo,
    countSkipped,
    addAttempt,
    calculateStats,
    getInitial,
    filterHistory,
    filterByDifficulty,
    getTotals,
    getCourseStats,
    getDifficultyStats,
    buildLeaderboard,
    getBadges,
    hashPassword,
    validateRegistration,
    userExists,
    registerUser,
    authenticate
  };
}