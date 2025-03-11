// Timer settings objects
let matchTime = { minutes: 2, seconds: 0 };
let roundTime = { minutes: 1, seconds: 0 }; // default interval timer = 1 minute
let restTime = { seconds: 30 };             // default rest time = 30 sec

let isIntervalTimer = false;
let isRunning = false;
let timerInterval;
let currentTime = 0;

// Set currentTime based on current mode
function updateCurrentTime() {
  currentTime = isIntervalTimer
    ? roundTime.minutes * 60 + roundTime.seconds
    : matchTime.minutes * 60 + matchTime.seconds;
}

function updateTimerDisplay() {
  let minutes = Math.floor(currentTime / 60);
  let seconds = currentTime % 60;
  document.getElementById("timer-display").textContent =
    String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0");
}

function toggleTimer() {
  if (isRunning) {
    pauseTimer();
  } else {
    startTimer();
  }
}

function startTimer() {
  if (isRunning) return;
  isRunning = true;
  document.getElementById("play-pause-btn").textContent = "Pause";
  timerInterval = setInterval(() => {
    if (currentTime <= 0) {
      clearInterval(timerInterval);
      isRunning = false;
      document.getElementById("play-pause-btn").textContent = "Play";
      return;
    }
    currentTime--;
    updateTimerDisplay();
  }, 1000);
}

function pauseTimer() {
  clearInterval(timerInterval);
  isRunning = false;
  document.getElementById("play-pause-btn").textContent = "Play";
}

function resetTimer() {
  clearInterval(timerInterval);
  isRunning = false;
  document.getElementById("play-pause-btn").textContent = "Play";
  updateCurrentTime();
  updateTimerDisplay();
}

function toggleTimerMode() {
  isIntervalTimer = !isIntervalTimer;
  document.getElementById("timer-mode").textContent = isIntervalTimer ? "Interval Timer" : "Match Timer";
  resetTimer();
}

function adjustTimer(type, value) {
  if (isRunning) return;
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
  updateCurrentTime();
  updateTimerDisplay();
}

function updateScore(team, value) {
  let scoreEl = document.getElementById(team + "-score");
  let currentScore = parseInt(scoreEl.textContent);
  scoreEl.textContent = Math.max(0, currentScore + value);
}

function updatePenalty(team, value) {
  // Penalty for a team adds/subtracts from opponent's score.
  let penaltyEl = document.getElementById(team + "-penalty");
  let opponent = team === "red" ? "blue" : "red";
  let opponentScoreEl = document.getElementById(opponent + "-score");
  let currentPenalty = parseInt(penaltyEl.textContent);
  let currentOpponentScore = parseInt(opponentScoreEl.textContent);
  let newPenalty = Math.max(0, currentPenalty + value);
  let diff = newPenalty - currentPenalty;
  penaltyEl.textContent = newPenalty;
  opponentScoreEl.textContent = Math.max(0, currentOpponentScore + diff);
}

function swapSides() {
  // Swap the team nodes by swapping their positions in the DOM.
  let red = document.getElementById("red-container");
  let blue = document.getElementById("blue-container");
  let parent = red.parentElement;
  // Insert blue before red if red comes first.
  if (red.compareDocumentPosition(blue) & Node.DOCUMENT_POSITION_FOLLOWING) {
    parent.insertBefore(blue, red);
  } else {
    parent.insertBefore(red, blue);
  }
  // Swap the color classes
  if (red.classList.contains("red")) {
    red.classList.remove("red");
    red.classList.add("blue");
    blue.classList.remove("blue");
    blue.classList.add("red");
  } else {
    red.classList.remove("blue");
    red.classList.add("red");
    blue.classList.remove("red");
    blue.classList.add("blue");
  }
}

function openSettings() {
  let overlay = document.getElementById("settings-overlay");
  overlay.classList.remove("hidden");
}

function closeSettings() {
  // Auto-save on close
  saveSettings();
}

function saveSettings() {
  matchTime.minutes = parseInt(document.getElementById("match-minutes").value);
  matchTime.seconds = 0;
  roundTime.minutes = parseInt(document.getElementById("interval-minutes").value);
  roundTime.seconds = 0;
  restTime.seconds = parseInt(document.getElementById("rest-seconds").value);
  updateCurrentTime();
  updateTimerDisplay();
  let overlay = document.getElementById("settings-overlay");
  overlay.classList.add("hidden");
}

function resetMatchScore() {
  document.getElementById("red-score").textContent = "0";
  document.getElementById("blue-score").textContent = "0";
}

function resetPenaltyScore() {
  let redPenaltyEl = document.getElementById("red-penalty");
  let bluePenaltyEl = document.getElementById("blue-penalty");
  let redPenalty = parseInt(redPenaltyEl.textContent);
  let bluePenalty = parseInt(bluePenaltyEl.textContent);
  let blueScoreEl = document.getElementById("blue-score");
  let blueScore = parseInt(blueScoreEl.textContent);
  blueScoreEl.textContent = Math.max(0, blueScore - redPenalty);
  let redScoreEl = document.getElementById("red-score");
  let redScore = parseInt(redScoreEl.textContent);
  redScoreEl.textContent = Math.max(0, redScore - bluePenalty);
  redPenaltyEl.textContent = "0";
  bluePenaltyEl.textContent = "0";
}

function resetAllScores() {
  resetMatchScore();
  resetPenaltyScore();
}

// Close modal when clicking outside modal content
document.getElementById("settings-overlay").addEventListener("click", function(e) {
  if (e.target === this) {
    closeSettings();
  }
});

// Close modal when clicking the X button
document.getElementById("modal-close").addEventListener("click", function() {
  closeSettings();
});

// Initialize timer on load
updateCurrentTime();
updateTimerDisplay();
