// ===== Variables that remember the state of the quiz =====
let quizQuestions = [];
let currentQuestionIndex = 0;
let userAnswers = [];
let timeLeft = TIME_PER_QUESTION;
let timerId = null;
let nextQuestionTimeoutId = null;
let answered = false;

// ===== Get elements from the HTML page =====
const homeScreen = document.getElementById("home-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");

const startBtn = document.getElementById("start-btn");
const nextBtn = document.getElementById("next-btn");
const restartBtn = document.getElementById("restart-btn");

const questionNumber = document.getElementById("question-number");
const timerDisplay = document.getElementById("timer");
const progressBar = document.getElementById("progress-bar");
const questionText = document.getElementById("question-text");
const optionButtons = document.querySelectorAll(".option-btn");

const resultMessage = document.getElementById("result-message");
const percentageDisplay = document.getElementById("percentage");
const finalScoreDisplay = document.getElementById("final-score");
const totalQuestionsDisplay = document.getElementById("total-questions");
const correctCountDisplay = document.getElementById("correct-count");
const wrongCountDisplay = document.getElementById("wrong-count");
const scoreCircle = document.querySelector(".score-circle");

// ===== Show only one screen at a time =====
function showScreen(screenToShow) {
  homeScreen.classList.add("hidden");
  quizScreen.classList.add("hidden");
  resultScreen.classList.add("hidden");
  screenToShow.classList.remove("hidden");
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

// ===== When time runs out =====
function handleTimeUp() {
  stopTimers();
  answered = true;
  userAnswers[currentQuestionIndex] = null; // null means "not answered"

  const currentQuestion = quizQuestions[currentQuestionIndex];
  disableOptions();
  optionButtons[currentQuestion.correctIndex].classList.add("correct");
  nextBtn.disabled = true;

  // Wait 1 second so the student can see the right answer, then move on
  nextQuestionTimeoutId = setTimeout(goToNextQuestion, 1000);
}

function disableOptions() {
  optionButtons.forEach(function (button) {
    button.disabled = true;
  });
}

// ===== Start the quiz =====
function startQuiz() {
  quizQuestions = getQuestions();
  currentQuestionIndex = 0;
  userAnswers = [];
  showScreen(quizScreen);
  loadQuestion();
}

// ===== Show the current question =====
function loadQuestion() {
  const currentQuestion = quizQuestions[currentQuestionIndex];
  const total = quizQuestions.length;

  answered = false;

  questionNumber.textContent = "Question " + (currentQuestionIndex + 1) + " of " + total;
  questionText.textContent = currentQuestion.question;
  progressBar.style.width = ((currentQuestionIndex + 1) / total) * 100 + "%";

  optionButtons.forEach(function (button, index) {
    button.textContent = currentQuestion.options[index];
    button.className = "option-btn"; // removes old colors
    button.disabled = false;
  });

  nextBtn.disabled = true;
  if (currentQuestionIndex === total - 1) {
    nextBtn.textContent = "Finish Quiz";
  } else {
    nextBtn.textContent = "Next Question";
  }

  startTimer();
}

// ===== When the student clicks an option =====
function selectAnswer(selectedIndex) {
  if (answered) {
    return;
  }
  answered = true;
  stopTimers();

  const currentQuestion = quizQuestions[currentQuestionIndex];
  userAnswers[currentQuestionIndex] = selectedIndex;

  disableOptions();
  optionButtons[selectedIndex].classList.add("selected");

  if (isCorrectAnswer(currentQuestion, selectedIndex)) {
    optionButtons[selectedIndex].classList.add("correct");
  } else {
    optionButtons[selectedIndex].classList.add("wrong");
    optionButtons[currentQuestion.correctIndex].classList.add("correct");
  }

  nextBtn.disabled = false;
}

// ===== Go to the next question or finish =====
function goToNextQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex >= quizQuestions.length) {
    showResult();
  } else {
    loadQuestion();
  }
}

// ===== Show the result screen =====
function showResult() {
  stopTimers();

  const total = quizQuestions.length;
  const score = calculateScore(quizQuestions, userAnswers);
  const wrong = total - score; // includes unanswered questions
  const percentage = calculatePercentage(score, total);

  finalScoreDisplay.textContent = score;
  totalQuestionsDisplay.textContent = total;
  correctCountDisplay.textContent = score;
  wrongCountDisplay.textContent = wrong;
  percentageDisplay.textContent = percentage + "%";
  resultMessage.textContent = getResultMessage(percentage);
  scoreCircle.style.setProperty("--percent", percentage + "%");

  showScreen(resultScreen);
}

// ===== Connect buttons to functions =====
startBtn.addEventListener("click", startQuiz);
nextBtn.addEventListener("click", goToNextQuestion);
restartBtn.addEventListener("click", startQuiz);

optionButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    selectAnswer(Number(button.dataset.index));
  });
});