// ===== Variables that remember the state of the app =====
let currentUser = null;
let authMode = "login";
let currentCourse = null;
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

// ===== Get elements from the HTML page =====
const toast = document.getElementById("toast");
const confettiBox = document.getElementById("confetti-box");

const authScreen = document.getElementById("auth-screen");
const appScreen = document.getElementById("app-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");

const tabLogin = document.getElementById("tab-login");
const tabRegister = document.getElementById("tab-register");
const nameField = document.getElementById("name-field");
const fullNameInput = document.getElementById("full-name");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const showPassword = document.getElementById("show-password");
const authError = document.getElementById("auth-error");
const authBtn = document.getElementById("auth-btn");

const navButtons = document.querySelectorAll(".nav-btn");
const viewElements = document.querySelectorAll(".view");
const themeBtn = document.getElementById("theme-btn");
const logoutBtn = document.getElementById("logout-btn");

const welcomeText = document.getElementById("welcome-text");
const statAttempts = document.getElementById("stat-attempts");
const statBest = document.getElementById("stat-best");
const statAverage = document.getElementById("stat-average");
const statLast = document.getElementById("stat-last");
const noHistory = document.getElementById("no-history");
const historyList = document.getElementById("history-list");
const gotoCoursesBtn = document.getElementById("goto-courses-btn");
const randomBtn = document.getElementById("random-btn");

const courseGrid = document.getElementById("course-grid");

const courseFilter = document.getElementById("course-filter");
const barChart = document.getElementById("bar-chart");
const lineChart = document.getElementById("line-chart");
const doughnutChart = document.getElementById("doughnut-chart");
const courseChart = document.getElementById("course-chart");

const profileAvatar = document.getElementById("profile-avatar");
const profileName = document.getElementById("profile-name");
const profileUsername = document.getElementById("profile-username");
const profileJoined = document.getElementById("profile-joined");
const editName = document.getElementById("edit-name");
const saveNameBtn = document.getElementById("save-name-btn");
const badgeGrid = document.getElementById("badge-grid");

const quitBtn = document.getElementById("quit-btn");
const quizCourse = document.getElementById("quiz-course");
const streakDisplay = document.getElementById("streak");
const questionNumber = document.getElementById("question-number");
const timerDisplay = document.getElementById("timer");
const progressBar = document.getElementById("progress-bar");
const questionText = document.getElementById("question-text");
const optionButtons = document.querySelectorAll(".option-btn");
const fiftyBtn = document.getElementById("fifty-btn");
const nextBtn = document.getElementById("next-btn");

const resultCourse = document.getElementById("result-course");
const resultMessage = document.getElementById("result-message");
const percentageDisplay = document.getElementById("percentage");
const finalScoreDisplay = document.getElementById("final-score");
const totalQuestionsDisplay = document.getElementById("total-questions");
const correctCountDisplay = document.getElementById("correct-count");
const wrongCountDisplay = document.getElementById("wrong-count");
const skippedCountDisplay = document.getElementById("skipped-count");
const scoreCircle = document.querySelector(".score-circle");
const restartBtn = document.getElementById("restart-btn");
const reviewBtn = document.getElementById("review-btn");
const homeBtn = document.getElementById("home-btn");
const reviewList = document.getElementById("review-list");

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

function loadHistory() {
  return storageRead(HISTORY_PREFIX + currentUser, []);
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
  }, 2500);
}

function animateNumber(element, target, suffix) {
  const steps = 20;
  let step = 0;
  const interval = setInterval(function () {
    step++;
    element.textContent = Math.round((target * step) / steps) + suffix;
    if (step >= steps) {
      clearInterval(interval);
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

function launchConfetti() {
  const colors = ["#3b82f6", "#6c5ce7", "#a855f7", "#16a34a", "#f59e0b", "#ef4444"];
  for (let i = 0; i < 60; i++) {
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
  currentUser = null;
  storageRemove(SESSION_KEY);
  setAuthMode("login");
  showScreen(authScreen);
  showToast("You have logged out.");
}

// ===== Pages inside the app (Dashboard, Courses, Analytics, Profile) =====
function showView(viewId) {
  viewElements.forEach(function (view) {
    view.classList.add("hidden");
  });
  document.getElementById(viewId).classList.remove("hidden");

  navButtons.forEach(function (button) {
    if (button.dataset.view === viewId) {
      button.classList.add("active");
    } else {
      button.classList.remove("active");
    }
  });

  if (viewId === "dashboard-view") {
    renderDashboard();
  } else if (viewId === "courses-view") {
    renderCourses();
  } else if (viewId === "analytics-view") {
    renderAnalytics();
  } else if (viewId === "profile-view") {
    renderProfile();
  }
}

// ===== Dashboard page =====
function renderDashboard() {
  const record = getUserRecord();
  welcomeText.textContent = "Welcome back, " + record.fullName + " 👋";

  const historyData = loadHistory();
  const stats = calculateStats(historyData);

  animateNumber(statAttempts, stats.attempts, "");
  animateNumber(statBest, stats.bestPercentage, "%");
  animateNumber(statAverage, stats.averagePercentage, "%");
  animateNumber(statLast, stats.lastPercentage, "%");

  historyList.innerHTML = "";
  if (historyData.length === 0) {
    noHistory.classList.remove("hidden");
    historyList.classList.add("hidden");
    return;
  }

  noHistory.classList.add("hidden");
  historyList.classList.remove("hidden");

  historyData.slice().reverse().slice(0, 5).forEach(function (attempt) {
    const item = document.createElement("li");

    const info = document.createElement("span");
    info.textContent = courseLabel(attempt.courseId) + "  •  " + attempt.date + "  •  " + attempt.score + "/" + attempt.total;

    const badge = document.createElement("span");
    badge.className = "history-badge";
    badge.textContent = attempt.percentage + "%";

    item.appendChild(info);
    item.appendChild(badge);
    historyList.appendChild(item);
  });
}

// ===== Courses page =====
function renderCourses() {
  courseGrid.innerHTML = "";
  const historyData = loadHistory();

  getCourses().forEach(function (course) {
    const stats = calculateStats(filterHistory(historyData, course.id));

    const card = document.createElement("button");
    card.className = "course-card";

    let meta = course.questions.length + " questions • Not attempted yet";
    if (stats.attempts > 0) {
      meta = course.questions.length + " questions • Best: " + stats.bestPercentage + "%";
    }

    // Course data comes from our own file, so it is safe to use here
    card.innerHTML =
      '<span class="course-icon">' + course.icon + "</span>" +
      '<span class="course-name">' + course.name + "</span>" +
      '<span class="course-desc">' + course.description + "</span>" +
      '<span class="course-meta">' + meta + "</span>" +
      '<span class="course-go">Start Quiz →</span>';

    card.addEventListener("click", function () {
      startQuiz(course.id);
    });
    courseGrid.appendChild(card);
  });
}

// ===== Analytics page =====
function populateCourseFilter() {
  courseFilter.innerHTML = "";
  const allOption = document.createElement("option");
  allOption.value = "all";
  allOption.textContent = "All Courses";
  courseFilter.appendChild(allOption);

  getCourses().forEach(function (course) {
    const option = document.createElement("option");
    option.value = course.id;
    option.textContent = course.icon + " " + course.name;
    courseFilter.appendChild(option);
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

// Chart 1: Bar chart of the last 8 attempts
function renderBarChart(historyData) {
  barChart.innerHTML = "";
  if (historyData.length === 0) {
    showEmptyChart(barChart);
    return;
  }

  const lastEight = historyData.slice(-8);
  const firstNumber = historyData.length - lastEight.length + 1;

  lastEight.forEach(function (attempt, index) {
    const column = document.createElement("div");
    column.className = "bar-col";
    column.title = courseLabel(attempt.courseId) + " • " + attempt.date + " • " + attempt.score + "/" + attempt.total;

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
    barChart.appendChild(column);

    // Set the real height after a moment so the bar grows with animation
    setTimeout(function () {
      bar.style.height = Math.max(4, attempt.percentage * 1.2) + "px";
    }, 50);
  });
}

// Chart 2: Line chart of the score trend
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

// Chart 3: Doughnut chart of correct / wrong / skipped answers
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

// Chart 4: Horizontal bars with the average score of each course
function renderCourseChart(allHistory) {
  courseChart.innerHTML = "";
  if (allHistory.length === 0) {
    showEmptyChart(courseChart);
    return;
  }

  getCourseStats(allHistory, getCourses()).forEach(function (item) {
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
    courseChart.appendChild(row);

    setTimeout(function () {
      fill.style.width = item.average + "%";
    }, 50);
  });
}

function renderAnalytics() {
  const allHistory = loadHistory();
  const filtered = filterHistory(allHistory, courseFilter.value || "all");

  renderBarChart(filtered);
  renderLineChart(filtered);
  renderDoughnut(filtered);
  renderCourseChart(allHistory);
}

// ===== Profile page =====
function renderProfile() {
  const record = getUserRecord();
  profileAvatar.textContent = getInitial(record.fullName);
  profileName.textContent = record.fullName;
  profileUsername.textContent = "@" + currentUser;
  profileJoined.textContent = "Member since " + record.joined;
  editName.value = record.fullName;

  badgeGrid.innerHTML = "";
  getBadges(loadHistory()).forEach(function (badge) {
    const box = document.createElement("div");
    box.className = "badge " + (badge.earned ? "earned" : "locked");
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
  if (timeLeft <= 5) {
    timerDisplay.classList.add("timer-warning");
  } else {
    timerDisplay.classList.remove("timer-warning");
  }
}

function startTimer() {
  stopTimers();
  timeLeft = TIME_PER_QUESTION;
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

function startQuiz(courseId) {
  currentCourse = getCourseById(courseId);
  if (!currentCourse) {
    return;
  }

  quizQuestions = shuffleArray(getQuestions(courseId), Math.random);
  currentQuestionIndex = 0;
  userAnswers = [];
  streak = 0;
  lifelineUsed = false;

  quizCourse.textContent = currentCourse.icon + " " + currentCourse.name;
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

  resultCourse.textContent = currentCourse.icon + " " + currentCourse.name;
  finalScoreDisplay.textContent = score;
  totalQuestionsDisplay.textContent = total;
  correctCountDisplay.textContent = score;
  wrongCountDisplay.textContent = wrong;
  skippedCountDisplay.textContent = skipped;
  percentageDisplay.textContent = percentage + "%";
  resultMessage.textContent = getResultMessage(percentage);
  scoreCircle.style.setProperty("--percent", percentage + "%");
  renderReview();

  // Save this attempt
  const attempt = {
    date: new Date().toLocaleDateString(),
    courseId: currentCourse.id,
    score: score,
    total: total,
    percentage: percentage,
    correct: score,
    wrong: wrong,
    skipped: skipped
  };

  const oldHistory = loadHistory();
  const earnedBefore = getBadges(oldHistory).filter(function (badge) {
    return badge.earned;
  }).map(function (badge) {
    return badge.id;
  });

  const newHistory = addAttempt(oldHistory, attempt, MAX_HISTORY);
  saveHistory(newHistory);

  const newBadges = getBadges(newHistory).filter(function (badge) {
    return badge.earned && earnedBefore.indexOf(badge.id) === -1;
  });

  showScreen(resultScreen);

  if (percentage >= 80) {
    launchConfetti();
  }
  if (newBadges.length > 0) {
    setTimeout(function () {
      showToast("🏅 New badge unlocked: " + newBadges[0].title);
    }, 1200);
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
randomBtn.addEventListener("click", function () {
  const allCourses = getCourses();
  const randomCourse = allCourses[Math.floor(Math.random() * allCourses.length)];
  showToast("Random pick: " + randomCourse.name);
  startQuiz(randomCourse.id);
});

courseFilter.addEventListener("change", renderAnalytics);
saveNameBtn.addEventListener("click", saveNewName);

quitBtn.addEventListener("click", quitQuiz);
fiftyBtn.addEventListener("click", useLifeline);
nextBtn.addEventListener("click", goToNextQuestion);
restartBtn.addEventListener("click", function () { startQuiz(currentCourse.id); });
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

// Keyboard shortcuts during the quiz
document.addEventListener("keydown", function (event) {
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
  populateCourseFilter();
  setAuthMode("login");

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