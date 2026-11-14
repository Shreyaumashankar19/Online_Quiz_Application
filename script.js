// ===== Variables that remember the state of the app =====
let currentUser = null;
let authMode = "login";
let currentCourse = null;
let currentLevel = "mixed";
let questionTime = TIME_PER_QUESTION;
let quizQuestions = [];
let currentQuestionIndex = 0;
let userAnswers = [];
let timeLeft = TIME_PER_QUESTION;
let timerId = null;
let nextQuestionTimeoutId = null;
let toastTimeoutId = null;
let answered = false;
let streak = 0;
let lifelineUsed = false;

const USERS_KEY = "quizUsers";
const SESSION_KEY = "quizSession";
const THEME_KEY = "quizTheme";
const HISTORY_PREFIX = "quizHistory_";
const MAX_HISTORY = 30;
const LETTERS = ["A", "B", "C", "D"];

const PAGE_TITLES = {
  "dashboard-view": "Dashboard",
  "courses-view": "Courses",
  "analytics-view": "Analytics",
  "leaderboard-view": "Leaderboard",
  "profile-view": "My Profile"
};

const TIPS = [
  "Read every option before choosing. Some answers look right but are not the best one.",
  "Short and regular practice beats one long study session. Try one quiz a day!",
  "Use the 50:50 lifeline on your hardest question, because you can only use it once per quiz.",
  "After each quiz, open Review Answers. Learning from mistakes is the fastest way to improve.",
  "Hard mode gives the most XP per correct answer. Try it once you score 80% on Medium.",
  "If you are not sure, eliminate the options you know are wrong first."
];

// A small helper: $("my-id") is the same as document.getElementById("my-id")
function $(id) {
  return document.getElementById(id);
}

// ===== Get elements from the HTML page =====
const toast = $("toast");
const confettiBox = $("confetti-box");

const authScreen = $("auth-screen");
const appScreen = $("app-screen");
const quizScreen = $("quiz-screen");
const resultScreen = $("result-screen");

const tabLogin = $("tab-login");
const tabRegister = $("tab-register");
const nameField = $("name-field");
const fullNameInput = $("full-name");
const usernameInput = $("username");
const passwordInput = $("password");
const showPassword = $("show-password");
const authError = $("auth-error");
const authBtn = $("auth-btn");

const navButtons = document.querySelectorAll(".nav-btn");
const viewElements = document.querySelectorAll(".view");
const contentArea = $("content-area");
const pageTitle = $("page-title");
const pageDate = $("page-date");
const topXp = $("top-xp");
const sideAvatar = $("side-avatar");
const sideName = $("side-name");
const sideLevel = $("side-level");
const themeBtn = $("theme-btn");
const logoutBtn = $("logout-btn");

const welcomeText = $("welcome-text");
const heroSub = $("hero-sub");
const levelRing = $("level-ring");
const levelNumber = $("level-number");
const levelText = $("level-text");
const statAttempts = $("stat-attempts");
const statBest = $("stat-best");
const statAverage = $("stat-average");
const statXp = $("stat-xp");
const quickCourses = $("quick-courses");
const noHistory = $("no-history");
const historyList = $("history-list");
const dashBarChart = $("dash-bar-chart");
const tipText = $("tip-text");
const tipBtn = $("tip-btn");
const gotoCoursesBtn = $("goto-courses-btn");
const randomBtn = $("random-btn");

const courseGrid = $("course-grid");

const courseFilter = $("course-filter");
const levelFilter = $("level-filter");
const barChart = $("bar-chart");
const lineChart = $("line-chart");
const doughnutChart = $("doughnut-chart");
const courseChart = $("course-chart");
const levelChart = $("level-chart");

const boardBody = $("board-body");
const boardNote = $("board-note");

const profileAvatar = $("profile-avatar");
const profileName = $("profile-name");
const profileUsername = $("profile-username");
const profileJoined = $("profile-joined");
const profileLevel = $("profile-level");
const editName = $("edit-name");
const saveNameBtn = $("save-name-btn");
const badgeGrid = $("badge-grid");

const modal = $("modal");
const modalSub = $("modal-sub");
const difficultyGrid = $("difficulty-grid");
const modalCancel = $("modal-cancel");

const quitBtn = $("quit-btn");
const quizCourse = $("quiz-course");
const quizDifficulty = $("quiz-difficulty");
const streakDisplay = $("streak");
const questionNumber = $("question-number");
const timerDisplay = $("timer");
const timerBar = $("timer-bar");
const progressBar = $("progress-bar");
const questionText = $("question-text");
const optionButtons = document.querySelectorAll(".option-btn");
const fiftyBtn = $("fifty-btn");
const nextBtn = $("next-btn");

const resultCourse = $("result-course");
const resultMessage = $("result-message");
const percentageDisplay = $("percentage");
const finalScoreDisplay = $("final-score");
const totalQuestionsDisplay = $("total-questions");
const correctCountDisplay = $("correct-count");
const wrongCountDisplay = $("wrong-count");
const skippedCountDisplay = $("skipped-count");
const xpEarnedDisplay = $("xp-earned");
const scoreCircle = document.querySelector(".score-circle");
const restartBtn = $("restart-btn");
const reviewBtn = $("review-btn");
const homeBtn = $("home-btn");
const reviewList = $("review-list");

// ===== Saving and loading data in the browser =====
// If the browser blocks storage, data is kept in memory until the page is closed.
const memoryStore = {};

function storageRead(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    if (saved !== null) {
      return JSON.parse(saved);
    }
  } catch (error) {
    // ignore and use the memory copy
  }
  if (Object.prototype.hasOwnProperty.call(memoryStore, key)) {
    return memoryStore[key];
  }
  return fallback;
}

function storageWrite(key, value) {
  memoryStore[key] = value;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    // storage not available, memory copy is used
  }
}

function storageRemove(key) {
  delete memoryStore[key];
  try {
    localStorage.removeItem(key);
  } catch (error) {
    // nothing to do
  }
}

function loadHistoryFor(username) {
  return storageRead(HISTORY_PREFIX + username, []);
}

function loadHistory() {
  return loadHistoryFor(currentUser);
}

function saveHistory(historyData) {
  storageWrite(HISTORY_PREFIX + currentUser, historyData);
}

function getUserRecord() {
  const users = storageRead(USERS_KEY, {});
  return users[currentUser];
}

// ===== Small helpers =====
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimeoutId);
  toastTimeoutId = setTimeout(function () {
    toast.classList.remove("show");
  }, 2800);
}

function animateNumber(element, target, suffix) {
  clearInterval(element.animationId);
  const steps = 20;
  let step = 0;
  element.animationId = setInterval(function () {
    step++;
    element.textContent = Math.round((target * step) / steps) + suffix;
    if (step >= steps) {
      clearInterval(element.animationId);
    }
  }, 30);
}

function courseLabel(courseId) {
  const course = getCourseById(courseId);
  if (course) {
    return course.icon + " " + course.name;
  }
  return "Quiz";
}

function levelLabel(levelId) {
  const info = getDifficultyInfo(levelId || "mixed");
  if (info) {
    return info.icon + " " + info.label;
  }
  return "";
}

function launchConfetti() {
  const colors = ["#3b82f6", "#6c5ce7", "#a855f7", "#16a34a", "#f59e0b", "#ef4444"];
  for (let i = 0; i < 70; i++) {
    const piece = document.createElement("span");
    piece.className = "confetti-piece";
    piece.style.left = Math.random() * 100 + "%";
    piece.style.background = colors[i % colors.length];
    piece.style.animationDelay = Math.random() * 0.8 + "s";
    piece.style.animationDuration = 2 + Math.random() * 2 + "s";
    confettiBox.appendChild(piece);
  }
  setTimeout(function () {
    confettiBox.innerHTML = "";
  }, 4500);
}

// ===== Theme (light / dark) =====
function applyTheme(theme) {
  if (theme === "dark") {
    document.body.classList.add("dark");
    themeBtn.textContent = "☀️";
  } else {
    document.body.classList.remove("dark");
    themeBtn.textContent = "🌙";
  }
}

// ===== Show only one main screen at a time =====
function showScreen(screenToShow) {
  authScreen.classList.add("hidden");
  appScreen.classList.add("hidden");
  quizScreen.classList.add("hidden");
  resultScreen.classList.add("hidden");
  screenToShow.classList.remove("hidden");
  window.scrollTo(0, 0);
}

// ===== Login and Register =====
function setAuthMode(mode) {
  authMode = mode;
  authError.textContent = "";
  if (mode === "login") {
    tabLogin.classList.add("active");
    tabRegister.classList.remove("active");
    nameField.classList.add("hidden");
    authBtn.textContent = "Login";
  } else {
    tabRegister.classList.add("active");
    tabLogin.classList.remove("active");
    nameField.classList.remove("hidden");
    authBtn.textContent = "Create Account";
  }
}

function loginUser(userKey) {
  currentUser = userKey;
  storageWrite(SESSION_KEY, userKey);
  fullNameInput.value = "";
  usernameInput.value = "";
  passwordInput.value = "";
  authError.textContent = "";
  showScreen(appScreen);
  showView("dashboard-view");
}

function handleAuth() {
  const username = usernameInput.value.trim();
  const password = passwordInput.value;
  const users = storageRead(USERS_KEY, {});

  if (authMode === "register") {
    const fullName = fullNameInput.value.trim();
    const check = validateRegistration(fullName, username, password);
    if (!check.valid) {
      authError.textContent = check.message;
      return;
    }
    const result = registerUser(users, fullName, username, password, new Date().toLocaleDateString());
    if (!result.ok) {
      authError.textContent = result.message;
      return;
    }
    storageWrite(USERS_KEY, result.users);
    loginUser(username.toLowerCase());
    showToast("Account created. Welcome, " + fullName + "!");
  } else {
    if (!authenticate(users, username, password)) {
      authError.textContent = "Wrong username or password.";
      return;
    }
    loginUser(username.toLowerCase());
    showToast("Login successful. Welcome back!");
  }
}

function logout() {
  stopTimers();
  closeModal();
  currentUser = null;
  storageRemove(SESSION_KEY);
  setAuthMode("login");
  showScreen(authScreen);
  showToast("You have logged out.");
}

// ===== Pages inside the app =====
function updateSidebarAndTopbar() {
  const record = getUserRecord();
  const totalXP = getTotalXP(loadHistory());
  const levelInfo = getLevelInfo(totalXP);

  sideAvatar.textContent = getInitial(record.fullName);
  sideName.textContent = record.fullName;
  sideLevel.textContent = "Level " + levelInfo.level;
  topXp.textContent = totalXP;
}

function showView(viewId) {
  viewElements.forEach(function (view) {
    view.classList.add("hidden");
  });
  $(viewId).classList.remove("hidden");

  navButtons.forEach(function (button) {
    if (button.dataset.view === viewId) {
      button.classList.add("active");
    } else {
      button.classList.remove("active");
    }
  });

  pageTitle.textContent = PAGE_TITLES[viewId];
  updateSidebarAndTopbar();
  contentArea.scrollTop = 0;

  if (viewId === "dashboard-view") {
    renderDashboard();
  } else if (viewId === "courses-view") {
    renderCourses();
  } else if (viewId === "analytics-view") {
    renderAnalytics();
  } else if (viewId === "leaderboard-view") {
    renderLeaderboard();
  } else if (viewId === "profile-view") {
    renderProfile();
  }
}

// ===== Dashboard page =====
function showTip() {
  tipText.textContent = TIPS[Math.floor(Math.random() * TIPS.length)];
}

function renderQuickCourses(historyData) {
  quickCourses.innerHTML = "";
  getCourses().forEach(function (course) {
    const stats = calculateStats(filterHistory(historyData, course.id));
    const info = stats.attempts > 0 ? "Best: " + stats.bestPercentage + "%" : "Not started";

    const button = document.createElement("button");
    button.className = "quick-course";
    button.style.setProperty("--accent", course.accent);
    // Course data comes from our own file, so it is safe to use here
    button.innerHTML =
      '<span class="quick-icon">' + course.icon + "</span>" +
      '<span class="quick-info"><strong>' + course.name + "</strong><small>" + info + "</small></span>";
    button.addEventListener("click", function () {
      openDifficultyModal(course.id);
    });
    quickCourses.appendChild(button);
  });
}

function renderRecentActivity(historyData) {
  historyList.innerHTML = "";
  if (historyData.length === 0) {
    noHistory.classList.remove("hidden");
    historyList.classList.add("hidden");
    return;
  }

  noHistory.classList.add("hidden");
  historyList.classList.remove("hidden");

  historyData.slice().reverse().slice(0, 6).forEach(function (attempt) {
    const item = document.createElement("li");

    const info = document.createElement("span");
    info.textContent = courseLabel(attempt.courseId) + " • " + levelLabel(attempt.difficulty) + " • " + attempt.score + "/" + attempt.total;

    const badge = document.createElement("span");
    badge.className = "history-badge";
    badge.textContent = attempt.percentage + "%";

    item.appendChild(info);
    item.appendChild(badge);
    historyList.appendChild(item);
  });
}

function renderDashboard() {
  const record = getUserRecord();
  const historyData = loadHistory();
  const stats = calculateStats(historyData);
  const totalXP = getTotalXP(historyData);
  const levelInfo = getLevelInfo(totalXP);

  const firstName = record.fullName.split(" ")[0];
  welcomeText.textContent = getGreeting(new Date().getHours()) + ", " + firstName + " 👋";

  if (stats.attempts === 0) {
    heroSub.textContent = "Take your first quiz to start earning XP and badges.";
  } else {
    const word = stats.attempts === 1 ? " quiz" : " quizzes";
    heroSub.textContent = "You have completed " + stats.attempts + word + ". Keep your streak going!";
  }

  levelNumber.textContent = levelInfo.level;
  levelText.textContent = levelInfo.xpInLevel + " / " + levelInfo.xpForNext + " XP to next level";
  levelRing.style.setProperty("--percent", levelInfo.progress + "%");

  animateNumber(statAttempts, stats.attempts, "");
  animateNumber(statBest, stats.bestPercentage, "%");
  animateNumber(statAverage, stats.averagePercentage, "%");
  animateNumber(statXp, totalXP, "");

  renderQuickCourses(historyData);
  renderRecentActivity(historyData);
  renderBarChart(historyData, dashBarChart);
  showTip();
}

// ===== Courses page =====
function renderCourses() {
  courseGrid.innerHTML = "";
  const historyData = loadHistory();

  getCourses().forEach(function (course) {
    const stats = calculateStats(filterHistory(historyData, course.id));
    const easyCount = getQuestionsByDifficulty(course.id, "easy").length;
    const mediumCount = getQuestionsByDifficulty(course.id, "medium").length;
    const hardCount = getQuestionsByDifficulty(course.id, "hard").length;

    let meta = "Not attempted yet";
    if (stats.attempts > 0) {
      meta = stats.attempts + " attempt(s) • Best: " + stats.bestPercentage + "%";
    }

    const card = document.createElement("button");
    card.className = "course-card";
    card.style.setProperty("--accent", course.accent);

    // Course data comes from our own file, so it is safe to use here
    card.innerHTML =
      '<span class="course-icon">' + course.icon + "</span>" +
      '<span class="course-name">' + course.name + "</span>" +
      '<span class="course-desc">' + course.description + "</span>" +
      '<span class="course-chips">' +
        '<span class="chip">🟢 ' + easyCount + "</span>" +
        '<span class="chip">🟡 ' + mediumCount + "</span>" +
        '<span class="chip">🔴 ' + hardCount + "</span>" +
      "</span>" +
      '<span class="course-meta">' + meta + "</span>" +
      '<span class="course-go">Choose difficulty →</span>';

    card.addEventListener("click", function () {
      openDifficultyModal(course.id);
    });
    courseGrid.appendChild(card);
  });
}

// ===== Difficulty pop-up =====
function openDifficultyModal(courseId) {
  const course = getCourseById(courseId);
  if (!course) {
    return;
  }

  modalSub.textContent = course.icon + " " + course.name;
  difficultyGrid.innerHTML = "";

  getDifficultyList().forEach(function (info) {
    const available = Math.min(info.count, getQuestionsByDifficulty(courseId, info.id).length);

    const button = document.createElement("button");
    button.className = "difficulty-btn";
    // Difficulty data comes from our own file, so it is safe to use here
    button.innerHTML =
      '<span class="difficulty-icon">' + info.icon + "</span>" +
      '<span class="difficulty-name">' + info.label + "</span>" +
      '<span class="difficulty-info">' + available + " questions • " + info.time + "s each</span>";

    button.addEventListener("click", function () {
      closeModal();
      startQuiz(courseId, info.id);
    });
    difficultyGrid.appendChild(button);
  });

  modal.classList.remove("hidden");
}

function closeModal() {
  modal.classList.add("hidden");
}

// ===== Analytics page =====
function populateFilters() {
  courseFilter.innerHTML = "";
  const allCourses = document.createElement("option");
  allCourses.value = "all";
  allCourses.textContent = "All Courses";
  courseFilter.appendChild(allCourses);

  getCourses().forEach(function (course) {
    const option = document.createElement("option");
    option.value = course.id;
    option.textContent = course.icon + " " + course.name;
    courseFilter.appendChild(option);
  });

  levelFilter.innerHTML = "";
  const allLevels = document.createElement("option");
  allLevels.value = "all";
  allLevels.textContent = "All Difficulties";
  levelFilter.appendChild(allLevels);

  getDifficultyList().forEach(function (info) {
    const option = document.createElement("option");
    option.value = info.id;
    option.textContent = info.icon + " " + info.label;
    levelFilter.appendChild(option);
  });
}

function showEmptyChart(container) {
  container.innerHTML = '<p class="no-history">Take a quiz to see this chart.</p>';
}

function svgElement(name, attributes) {
  const element = document.createElementNS("http://www.w3.org/2000/svg", name);
  for (const key in attributes) {
    element.setAttribute(key, attributes[key]);
  }
  return element;
}

// Bar chart of the last 8 attempts (used on the dashboard and the analytics page)
function renderBarChart(historyData, container) {
  container.innerHTML = "";
  if (historyData.length === 0) {
    showEmptyChart(container);
    return;
  }

  const lastEight = historyData.slice(-8);
  const firstNumber = historyData.length - lastEight.length + 1;

  lastEight.forEach(function (attempt, index) {
    const column = document.createElement("div");
    column.className = "bar-col";
    column.title = courseLabel(attempt.courseId) + " • " + levelLabel(attempt.difficulty) + " • " + attempt.date + " • " + attempt.score + "/" + attempt.total;

    const value = document.createElement("span");
    value.className = "bar-value";
    value.textContent = attempt.percentage + "%";

    const bar = document.createElement("div");
    let colorClass = "low";
    if (attempt.percentage >= 80) {
      colorClass = "high";
    } else if (attempt.percentage >= 50) {
      colorClass = "mid";
    }
    bar.className = "bar " + colorClass;
    bar.style.height = "4px";

    const label = document.createElement("span");
    label.className = "bar-label";
    label.textContent = "#" + (firstNumber + index);

    column.appendChild(value);
    column.appendChild(bar);
    column.appendChild(label);
    container.appendChild(column);

    // Set the real height after a moment so the bar grows with animation
    setTimeout(function () {
      bar.style.height = Math.max(4, attempt.percentage * 1.3) + "px";
    }, 50);
  });
}

// Line chart of the score trend
function renderLineChart(historyData) {
  lineChart.innerHTML = "";
  if (historyData.length === 0) {
    showEmptyChart(lineChart);
    return;
  }

  const points = historyData.slice(-10);
  const width = 300;
  const height = 170;
  const left = 30;
  const right = 15;
  const top = 15;
  const bottom = 25;
  const plotWidth = width - left - right;
  const plotHeight = height - top - bottom;

  const svg = svgElement("svg", { viewBox: "0 0 " + width + " " + height, class: "line-svg" });

  [0, 50, 100].forEach(function (value) {
    const y = top + (1 - value / 100) * plotHeight;
    svg.appendChild(svgElement("line", { x1: left, y1: y, x2: width - right, y2: y, class: "grid-line" }));
    const text = svgElement("text", { x: left - 6, y: y + 3, class: "axis-text", "text-anchor": "end" });
    text.textContent = value;
    svg.appendChild(text);
  });

  const coords = points.map(function (attempt, index) {
    let x = left + plotWidth / 2;
    if (points.length > 1) {
      x = left + index * (plotWidth / (points.length - 1));
    }
    const y = top + (1 - attempt.percentage / 100) * plotHeight;
    return { x: x, y: y, attempt: attempt };
  });

  const pointText = coords.map(function (c) {
    return c.x + "," + c.y;
  }).join(" ");
  svg.appendChild(svgElement("polyline", { points: pointText, class: "line-path" }));

  coords.forEach(function (c) {
    const circle = svgElement("circle", { cx: c.x, cy: c.y, r: 4.5, class: "line-dot" });
    const title = svgElement("title", {});
    title.textContent = courseLabel(c.attempt.courseId) + " • " + c.attempt.date + " • " + c.attempt.percentage + "%";
    circle.appendChild(title);
    svg.appendChild(circle);
  });

  lineChart.appendChild(svg);
}

// Doughnut chart of correct / wrong / skipped answers
function renderDoughnut(historyData) {
  doughnutChart.innerHTML = "";
  const totals = getTotals(historyData);
  const sum = totals.correct + totals.wrong + totals.skipped;

  if (sum === 0) {
    showEmptyChart(doughnutChart);
    return;
  }

  const correctPct = (totals.correct / sum) * 100;
  const wrongPct = (totals.wrong / sum) * 100;
  const wrapper = document.createElement("div");
  wrapper.className = "doughnut-wrap";

  const ring = document.createElement("div");
  ring.className = "doughnut";
  ring.style.background =
    "conic-gradient(#16a34a 0% " + correctPct + "%, " +
    "#dc2626 " + correctPct + "% " + (correctPct + wrongPct) + "%, " +
    "#f59e0b " + (correctPct + wrongPct) + "% 100%)";

  const center = document.createElement("span");
  center.className = "doughnut-center";
  center.textContent = Math.round(correctPct) + "%";
  ring.appendChild(center);

  const legend = document.createElement("div");
  legend.className = "legend";
  legend.innerHTML =
    '<span><span class="dot" style="background:#16a34a"></span>Correct ' + totals.correct + "</span>" +
    '<span><span class="dot" style="background:#dc2626"></span>Wrong ' + totals.wrong + "</span>" +
    '<span><span class="dot" style="background:#f59e0b"></span>Skipped ' + totals.skipped + "</span>";

  wrapper.appendChild(ring);
  wrapper.appendChild(legend);
  doughnutChart.appendChild(wrapper);
}

// Horizontal bars (used for the course chart and the difficulty chart)
// items = [{ name, attempts, average }]
function renderHorizontalBars(container, items) {
  container.innerHTML = "";

  const totalAttempts = items.reduce(function (sum, item) {
    return sum + item.attempts;
  }, 0);
  if (totalAttempts === 0) {
    showEmptyChart(container);
    return;
  }

  items.forEach(function (item) {
    const row = document.createElement("div");
    row.className = "hbar-row";

    const label = document.createElement("span");
    label.textContent = item.name;

    const track = document.createElement("div");
    track.className = "hbar-track";
    track.title = item.attempts + " attempt(s)";

    const fill = document.createElement("div");
    fill.className = "hbar-fill";
    track.appendChild(fill);

    const value = document.createElement("span");
    value.className = "hbar-value";
    value.textContent = item.average + "%";

    row.appendChild(label);
    row.appendChild(track);
    row.appendChild(value);
    container.appendChild(row);

    setTimeout(function () {
      fill.style.width = item.average + "%";
    }, 50);
  });
}

function renderAnalytics() {
  const allHistory = loadHistory();
  const chosenCourse = courseFilter.value || "all";
  const chosenLevel = levelFilter.value || "all";

  const byCourse = filterHistory(allHistory, chosenCourse);
  const filtered = filterByDifficulty(byCourse, chosenLevel);

  renderBarChart(filtered, barChart);
  renderLineChart(filtered);
  renderDoughnut(filtered);
  renderHorizontalBars(courseChart, getCourseStats(filterByDifficulty(allHistory, chosenLevel), getCourses()));
  renderHorizontalBars(levelChart, getDifficultyStats(byCourse));
}

// ===== Leaderboard page =====
function renderLeaderboard() {
  const users = storageRead(USERS_KEY, {});
  const entries = Object.keys(users).map(function (username) {
    return {
      username: username,
      fullName: users[username].fullName,
      history: loadHistoryFor(username)
    };
  });

  const rows = buildLeaderboard(entries);
  const medals = ["🥇", "🥈", "🥉"];
  boardBody.innerHTML = "";

  rows.forEach(function (row, index) {
    const tr = document.createElement("tr");
    const isMe = row.username === currentUser;
    if (isMe) {
      tr.className = "me";
    }

    const cells = [
      medals[index] || String(index + 1),
      row.fullName + (isMe ? " (You)" : ""),
      "Lv " + row.level,
      row.attempts,
      row.best + "%",
      row.average + "%",
      row.xp + " XP"
    ];

    cells.forEach(function (value) {
      const td = document.createElement("td");
      td.textContent = value;
      tr.appendChild(td);
    });
    boardBody.appendChild(tr);
  });

  boardNote.textContent = "Ranked by XP. Players shown: " + rows.length + " (accounts saved in this browser).";
}

// ===== Profile page =====
function renderProfile() {
  const record = getUserRecord();
  const historyData = loadHistory();
  const totalXP = getTotalXP(historyData);

  profileAvatar.textContent = getInitial(record.fullName);
  profileName.textContent = record.fullName;
  profileUsername.textContent = "@" + currentUser;
  profileJoined.textContent = "Member since " + record.joined;
  profileLevel.textContent = "Level " + getLevelInfo(totalXP).level + " • " + totalXP + " XP";
  editName.value = record.fullName;

  badgeGrid.innerHTML = "";
  getBadges(historyData).forEach(function (badge) {
    const box = document.createElement("div");
    box.className = "badge " + (badge.earned ? "earned" : "locked");
    // Badge data comes from our own file, so it is safe to use here
    box.innerHTML =
      '<div class="badge-icon">' + badge.icon + "</div>" +
      '<div class="badge-name">' + badge.title + "</div>" +
      '<div class="badge-desc">' + badge.description + "</div>";
    badgeGrid.appendChild(box);
  });
}

function saveNewName() {
  const newName = editName.value.trim();
  if (newName.length < 2) {
    showToast("Please enter at least 2 letters.");
    return;
  }
  const users = storageRead(USERS_KEY, {});
  users[currentUser].fullName = newName;
  storageWrite(USERS_KEY, users);
  updateSidebarAndTopbar();
  renderProfile();
  showToast("Name updated!");
}

// ===== Timer functions =====
function stopTimers() {
  clearInterval(timerId);
  clearTimeout(nextQuestionTimeoutId);
  timerId = null;
  nextQuestionTimeoutId = null;
}

function updateTimerDisplay() {
  timerDisplay.textContent = "⏱ " + timeLeft;
  timerBar.style.width = (timeLeft / questionTime) * 100 + "%";

  if (timeLeft <= 5) {
    timerDisplay.classList.add("timer-warning");
    timerBar.classList.add("warning");
  } else {
    timerDisplay.classList.remove("timer-warning");
    timerBar.classList.remove("warning");
  }
}

function startTimer() {
  stopTimers();
  timeLeft = questionTime;
  updateTimerDisplay();

  timerId = setInterval(function () {
    timeLeft = tick(timeLeft);
    updateTimerDisplay();
    if (isTimeUp(timeLeft)) {
      handleTimeUp();
    }
  }, 1000);
}

function disableOptions() {
  optionButtons.forEach(function (button) {
    button.disabled = true;
  });
}

// ===== When time runs out =====
function handleTimeUp() {
  stopTimers();
  answered = true;
  userAnswers[currentQuestionIndex] = null; // null means "not answered"
  streak = updateStreak(streak, false);
  updateStreakDisplay();

  const currentQuestion = quizQuestions[currentQuestionIndex];
  disableOptions();
  optionButtons[currentQuestion.correctIndex].classList.add("correct");
  nextBtn.disabled = true;
  fiftyBtn.disabled = true;

  // Wait 1 second so the student can see the right answer, then move on
  nextQuestionTimeoutId = setTimeout(goToNextQuestion, 1000);
}

// ===== Quiz =====
function updateStreakDisplay() {
  streakDisplay.textContent = "🔥 " + streak;
  streakDisplay.classList.remove("pulse");
  void streakDisplay.offsetWidth; // restarts the small animation
  if (streak > 0) {
    streakDisplay.classList.add("pulse");
  }
}

function startQuiz(courseId, levelId) {
  currentCourse = getCourseById(courseId);
  if (!currentCourse || !getDifficultyInfo(levelId)) {
    return;
  }

  currentLevel = levelId;
  questionTime = getTimeForDifficulty(levelId);
  quizQuestions = selectQuestions(courseId, levelId, Math.random);
  if (quizQuestions.length === 0) {
    showToast("No questions available for this choice.");
    return;
  }

  currentQuestionIndex = 0;
  userAnswers = [];
  streak = 0;
  lifelineUsed = false;

  quizCourse.textContent = currentCourse.icon + " " + currentCourse.name;
  quizDifficulty.textContent = levelLabel(levelId);
  updateStreakDisplay();
  reviewList.classList.add("hidden");
  reviewBtn.textContent = "Review Answers";

  showScreen(quizScreen);
  loadQuestion();
}

function loadQuestion() {
  const currentQuestion = quizQuestions[currentQuestionIndex];
  const total = quizQuestions.length;

  answered = false;

  questionNumber.textContent = "Question " + (currentQuestionIndex + 1) + " of " + total;
  questionText.textContent = currentQuestion.question;
  progressBar.style.width = ((currentQuestionIndex + 1) / total) * 100 + "%";

  optionButtons.forEach(function (button, index) {
    button.textContent = LETTERS[index] + ".  " + currentQuestion.options[index];
    button.className = "option-btn"; // removes old colors
    button.disabled = false;
  });

  nextBtn.disabled = true;
  if (currentQuestionIndex === total - 1) {
    nextBtn.textContent = "Finish Quiz";
  } else {
    nextBtn.textContent = "Next Question";
  }

  fiftyBtn.disabled = lifelineUsed;
  fiftyBtn.textContent = lifelineUsed ? "✂ 50:50 used" : "✂ 50:50";

  startTimer();
}

// 50:50 lifeline (one use per quiz)
function useLifeline() {
  if (answered || lifelineUsed) {
    return;
  }
  const removeList = getFiftyFiftyRemoval(quizQuestions[currentQuestionIndex]);
  removeList.forEach(function (index) {
    optionButtons[index].disabled = true;
    optionButtons[index].classList.add("removed");
  });
  lifelineUsed = true;
  fiftyBtn.disabled = true;
  fiftyBtn.textContent = "✂ 50:50 used";
  showToast("Two wrong answers removed!");
}

// When the student clicks an option
function selectAnswer(selectedIndex) {
  if (answered) {
    return;
  }
  answered = true;
  stopTimers();

  const currentQuestion = quizQuestions[currentQuestionIndex];
  userAnswers[currentQuestionIndex] = selectedIndex;

  disableOptions();
  fiftyBtn.disabled = true;
  optionButtons[selectedIndex].classList.add("selected");

  const correct = isCorrectAnswer(currentQuestion, selectedIndex);
  if (correct) {
    optionButtons[selectedIndex].classList.add("correct");
  } else {
    optionButtons[selectedIndex].classList.add("wrong");
    optionButtons[currentQuestion.correctIndex].classList.add("correct");
  }

  streak = updateStreak(streak, correct);
  updateStreakDisplay();
  if (correct && streak >= 3) {
    showToast("🔥 " + streak + " correct answers in a row!");
  }

  nextBtn.disabled = false;
}

function goToNextQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex >= quizQuestions.length) {
    showResult();
  } else {
    loadQuestion();
  }
}

function quitQuiz() {
  if (confirm("Quit this quiz? Your progress will not be saved.")) {
    stopTimers();
    showScreen(appScreen);
    showView("dashboard-view");
  }
}

// ===== Result screen =====
function renderReview() {
  reviewList.innerHTML = "";

  quizQuestions.forEach(function (question, index) {
    const answerIndex = userAnswers[index];
    const isSkipped = answerIndex === null || answerIndex === undefined;

    let statusClass = "wrong";
    let statusText = "❌ Wrong";
    if (isSkipped) {
      statusClass = "skipped";
      statusText = "⏰ Skipped";
    } else if (isCorrectAnswer(question, answerIndex)) {
      statusClass = "correct";
      statusText = "✅ Correct";
    }

    const item = document.createElement("li");
    item.className = "review-item " + statusClass;

    const title = document.createElement("strong");
    title.textContent = (index + 1) + ". " + question.question + "  " + statusText;

    const yourAnswer = document.createElement("span");
    yourAnswer.textContent = "Your answer: " + (isSkipped ? "No answer" : question.options[answerIndex]);

    const rightAnswer = document.createElement("span");
    rightAnswer.textContent = "Correct answer: " + question.options[question.correctIndex];

    item.appendChild(title);
    item.appendChild(yourAnswer);
    item.appendChild(rightAnswer);
    reviewList.appendChild(item);
  });
}

function showResult() {
  stopTimers();

  const total = quizQuestions.length;
  const score = calculateScore(quizQuestions, userAnswers);
  const skipped = countSkipped(userAnswers, total);
  const wrong = total - score - skipped; // answered but incorrect
  const percentage = calculatePercentage(score, total);
  const xpEarned = calculateXP(score, currentLevel);

  resultCourse.textContent = currentCourse.icon + " " + currentCourse.name + " • " + levelLabel(currentLevel);
  finalScoreDisplay.textContent = score;
  totalQuestionsDisplay.textContent = total;
  correctCountDisplay.textContent = score;
  wrongCountDisplay.textContent = wrong;
  skippedCountDisplay.textContent = skipped;
  xpEarnedDisplay.textContent = xpEarned;
  percentageDisplay.textContent = percentage + "%";
  resultMessage.textContent = getResultMessage(percentage);
  scoreCircle.style.setProperty("--percent", percentage + "%");
  renderReview();

  // Save this attempt
  const attempt = {
    date: new Date().toLocaleDateString(),
    courseId: currentCourse.id,
    difficulty: currentLevel,
    score: score,
    total: total,
    percentage: percentage,
    correct: score,
    wrong: wrong,
    skipped: skipped,
    xp: xpEarned
  };

  const oldHistory = loadHistory();
  const oldLevel = getLevelInfo(getTotalXP(oldHistory)).level;
  const earnedBefore = getBadges(oldHistory).filter(function (badge) {
    return badge.earned;
  }).map(function (badge) {
    return badge.id;
  });

  const newHistory = addAttempt(oldHistory, attempt, MAX_HISTORY);
  saveHistory(newHistory);

  const newLevel = getLevelInfo(getTotalXP(newHistory)).level;
  const newBadges = getBadges(newHistory).filter(function (badge) {
    return badge.earned && earnedBefore.indexOf(badge.id) === -1;
  });

  showScreen(resultScreen);

  if (percentage >= 80) {
    launchConfetti();
  }
  if (newLevel > oldLevel) {
    setTimeout(function () {
      showToast("🎉 Level up! You are now Level " + newLevel);
    }, 1000);
  }
  if (newBadges.length > 0) {
    setTimeout(function () {
      showToast("🏅 New badge unlocked: " + newBadges[0].title);
    }, newLevel > oldLevel ? 4000 : 1000);
  }
}

function goToDashboard() {
  stopTimers();
  showScreen(appScreen);
  showView("dashboard-view");
}

// ===== Connect buttons to functions =====
tabLogin.addEventListener("click", function () { setAuthMode("login"); });
tabRegister.addEventListener("click", function () { setAuthMode("register"); });
authBtn.addEventListener("click", handleAuth);

[fullNameInput, usernameInput, passwordInput].forEach(function (input) {
  input.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      handleAuth();
    }
  });
});

showPassword.addEventListener("change", function () {
  passwordInput.type = showPassword.checked ? "text" : "password";
});

navButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    showView(button.dataset.view);
  });
});

themeBtn.addEventListener("click", function () {
  const nextTheme = document.body.classList.contains("dark") ? "light" : "dark";
  applyTheme(nextTheme);
  storageWrite(THEME_KEY, nextTheme);
});

logoutBtn.addEventListener("click", logout);
gotoCoursesBtn.addEventListener("click", function () { showView("courses-view"); });
tipBtn.addEventListener("click", showTip);

randomBtn.addEventListener("click", function () {
  const allCourses = getCourses();
  const allLevels = getDifficultyList();
  const randomCourse = allCourses[Math.floor(Math.random() * allCourses.length)];
  const randomLevel = allLevels[Math.floor(Math.random() * allLevels.length)];
  showToast("Random pick: " + randomCourse.name + " (" + randomLevel.label + ")");
  startQuiz(randomCourse.id, randomLevel.id);
});

courseFilter.addEventListener("change", renderAnalytics);
levelFilter.addEventListener("change", renderAnalytics);
saveNameBtn.addEventListener("click", saveNewName);

modalCancel.addEventListener("click", closeModal);
modal.addEventListener("click", function (event) {
  if (event.target === modal) {
    closeModal(); // clicking the dark background closes the pop-up
  }
});

quitBtn.addEventListener("click", quitQuiz);
fiftyBtn.addEventListener("click", useLifeline);
nextBtn.addEventListener("click", goToNextQuestion);
restartBtn.addEventListener("click", function () { startQuiz(currentCourse.id, currentLevel); });
homeBtn.addEventListener("click", goToDashboard);
reviewBtn.addEventListener("click", function () {
  reviewList.classList.toggle("hidden");
  if (reviewList.classList.contains("hidden")) {
    reviewBtn.textContent = "Review Answers";
  } else {
    reviewBtn.textContent = "Hide Review";
  }
});

optionButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    selectAnswer(Number(button.dataset.index));
  });
});

// Keyboard shortcuts
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
    return;
  }

  if (quizScreen.classList.contains("hidden")) {
    return;
  }
  const key = event.key.toLowerCase();
  const keyMap = { "1": 0, "2": 1, "3": 2, "4": 3, "a": 0, "b": 1, "c": 2, "d": 3 };

  if (Object.prototype.hasOwnProperty.call(keyMap, key)) {
    const index = keyMap[key];
    if (!answered && !optionButtons[index].disabled) {
      selectAnswer(index);
    }
  } else if ((key === "enter" || key === "arrowright") && !nextBtn.disabled) {
    event.preventDefault(); // stops the Next button from being clicked twice
    goToNextQuestion();
  }
});

// ===== Start the app =====
function init() {
  applyTheme(storageRead(THEME_KEY, "light"));
  populateFilters();
  setAuthMode("login");
  pageDate.textContent = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  const sessionUser = storageRead(SESSION_KEY, null);
  const users = storageRead(USERS_KEY, {});

  if (sessionUser && Object.prototype.hasOwnProperty.call(users, sessionUser)) {
    currentUser = sessionUser;
    showScreen(appScreen);
    showView("dashboard-view");
  } else {
    showScreen(authScreen);
  }
}

init();