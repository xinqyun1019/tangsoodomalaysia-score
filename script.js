// Timer settings objects
let matchTime = { minutes: 2, seconds: 0 };
let roundTime = { minutes: 2, seconds: 0 };
let restTime = { seconds: 30 };

let isIntervalTimer = false;
let isRunning = false;
let timerInterval;

// Toggle Timer Mode
function toggleTimerMode() {
  isIntervalTimer = !isIntervalTimer;
  document.getElementById("timer-mode").textContent = isIntervalTimer ? "Interval Timer" : "Match Timer";
  resetTimer();
}

// Toggle Flexi (adjustment) Buttons
function toggleFlexiButtons() {
  if (isRunning) return; // Prevent adjustments when timer is running
  let flexiButtons = document.getElementById("flexi-buttons");
  let toggleBtn = document.getElementById("toggle-flexi-btn");
  if (flexiButtons.classList.contains("hidden")) {
    flexiButtons.classList.remove("hidden");
    toggleBtn.textContent = "Hide Adjustments";
  } else {
    flexiButtons.classList.add("hidden");
    toggleBtn.textContent = "⏱";
  }
}

// Adjust Timer by type and value
function adjustTimer(type, value) {
  if (isRunning) return; // Prevent adjustments when timer is running
  let time = isIntervalTimer ? roundTime : matchTime;
  if (type === "seconds") {
    time.seconds = Math.max(0, time.seconds + value);
    if (time.seconds >= 60) {
      time.minutes += Math.floor(time.seconds / 60);
      time.seconds %= 60;
    }
  } else if (type === "minutes") {
    time.minutes = Math.max(0, time.minutes + value);
  }
  updateTimerDisplay();
}

// Toggle Timer (Play/Pause)
function toggleTimer() {
  if (isRunning) {
    pauseTimer();
  } else {
    startTimer();
  }
}

// Start Timer
function startTimer() {
  if (isRunning) return;
  isRunning = true;
  document.getElementById("play-pause-btn").textContent = "Pause";
  // Hide flexi adjustments when timer starts
  document.getElementById("flexi-buttons").classList.add("hidden");
  document.getElementById("toggle-flexi-btn").textContent = "⏱";

  timerInterval = setInterval(() => {
    let time = isIntervalTimer ? roundTime : matchTime;
    if (time.minutes === 0 && time.seconds === 0) {
      clearInterval(timerInterval);
      isRunning = false;
      document.getElementById("play-pause-btn").textContent = "Play";
      return;
    }
    if (time.seconds === 0) {
      time.minutes = Math.max(0, time.minutes - 1);
      time.seconds = 59;
    } else {
      time.seconds--;
    }
    updateTimerDisplay();
  }, 1000);
}

// Pause Timer
function pauseTimer() {
  clearInterval(timerInterval);
  isRunning = false;
  document.getElementById("play-pause-btn").textContent = "Play";
}

// Reset Timer
function resetTimer() {
  clearInterval(timerInterval);
  isRunning = false;
  document.getElementById("play-pause-btn").textContent = "Play";
  updateTimerDisplay();
}

// Update Timer Display
function updateTimerDisplay() {
  let time = isIntervalTimer ? roundTime : matchTime;
  document.getElementById("timer-display").textContent =
    `${String(time.minutes).padStart(2, "0")}:${String(time.seconds).padStart(2, "0")}`;
}

// Update Penalty (adds to opponent's score)
function updatePenalty(team, value) {
  let penaltyEl = document.getElementById(`${team}-penalty`);
  let opponent = team === "red" ? "blue" : "red";
  let opponentScoreEl = document.getElementById(`${opponent}-score`);

  let currentPenalty = parseInt(penaltyEl.textContent);
  let currentOpponentScore = parseInt(opponentScoreEl.textContent);
  let newPenalty = Math.max(0, currentPenalty + value);
  let diff = newPenalty - currentPenalty;
  penaltyEl.textContent = newPenalty;
  opponentScoreEl.textContent = Math.max(0, currentOpponentScore + diff);
}

// Update Score
function updateScore(team, value) {
  let scoreEl = document.getElementById(`${team}-score`);
  let currentScore = parseInt(scoreEl.textContent);
  scoreEl.textContent = Math.max(0, currentScore + value);
}

// Swap Sides (Swap the innerHTML and swap container classes to swap colors)
function swapSides() {
  let redContainer = document.getElementById("red-container");
  let blueContainer = document.getElementById("blue-container");

  // Swap innerHTML
  let tempHTML = redContainer.innerHTML;
  redContainer.innerHTML = blueContainer.innerHTML;
  blueContainer.innerHTML = tempHTML;

  // Swap classes to swap colors
  if (redContainer.classList.contains("red")) {
    redContainer.classList.remove("red");
    redContainer.classList.add("blue");
    blueContainer.classList.remove("blue");
    blueContainer.classList.add("red");
  } else {
    redContainer.classList.remove("blue");
    redContainer.classList.add("red");
    blueContainer.classList.remove("red");
    blueContainer.classList.add("blue");
  }
}

// Open Settings Modal
function openSettings() {
  let modal = document.getElementById("settings-modal");
  modal.classList.remove("hidden");
  modal.style.display = "block";
}

// Close Settings Modal
function closeSettings() {
  let modal = document.getElementById("settings-modal");
  modal.classList.add("hidden");
  modal.style.display = "none";
}

// Save Settings
function saveSettings() {
  matchTime.minutes = parseInt(document.getElementById("match-minutes").value);
  matchTime.seconds = 0;
  roundTime.minutes = parseInt(document.getElementById("interval-minutes").value);
  roundTime.seconds = 0;
  restTime.seconds = parseInt(document.getElementById("rest-seconds").value);
  updateTimerDisplay();
  closeSettings();
}

// Reset Match Score (reset both teams' scores)
function resetMatchScore() {
  document.getElementById("red-score").textContent = "0";
  document.getElementById("blue-score").textContent = "0";
}

// Reset Penalty Score (remove penalties and subtract from opponent's score)
function resetPenaltyScore() {
  let redPenaltyEl = document.getElementById("red-penalty");
  let bluePenaltyEl = document.getElementById("blue-penalty");
  let redPenalty = parseInt(redPenaltyEl.textContent);
  let bluePenalty = parseInt(bluePenaltyEl.textContent);
  
  // Subtract red penalty from blue score
  let blueScoreEl = document.getElementById("blue-score");
  let blueScore = parseInt(blueScoreEl.textContent);
  blueScoreEl.textContent = Math.max(0, blueScore - redPenalty);
  
  // Subtract blue penalty from red score
  let redScoreEl = document.getElementById("red-score");
  let redScore = parseInt(redScoreEl.textContent);
  redScoreEl.textContent = Math.max(0, redScore - bluePenalty);
  
  redPenaltyEl.textContent = "0";
  bluePenaltyEl.textContent = "0";
}

// Reset All Scores (match and penalty)
function resetAllScores() {
  resetMatchScore();
  resetPenaltyScore();
}
