let matchTime = { minutes: 2, seconds: 0 };
let roundTime = { minutes: 1, seconds: 0 }; // default interval timer = 1 minute
let restTime = { seconds: 30 };             // default rest time = 30 sec

let isIntervalTimer = false;
let isRestTimer = false;  // New flag for Rest Timer mode
let isRunning = false;
let timerInterval;
let currentTime = 0;
let alarmSound = new Audio("Arlam.mp3");
let currentPreset = "black"; // Default: Black Belt Timer

window.addEventListener("load", () => {
  alarmSound.load();
});

// Set currentTime based on current mode
function updateCurrentTime() {
  if (isRestTimer) {
    currentTime = restTime.seconds;  // Rest Timer
  } else if (isIntervalTimer) {
    currentTime = roundTime.minutes * 60 + roundTime.seconds;  // Interval Timer
  } else {
    currentTime = matchTime.minutes * 60 + matchTime.seconds;  // Match Timer
  }
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
    // Hide timer modifier controls when starting
    document.getElementById("flexi-buttons").classList.add("hidden");
    document.getElementById("toggle-flexi-btn").textContent = "⏱";
    startTimer();
  }
}

function startTimer() {
  if (isRunning) return;
  isRunning = true;
  document.getElementById("play-pause-btn").textContent = "Pause";
  timerInterval = setInterval(() => {
    if (currentTime <= 1.8) {
      alarmSound.play().catch(error => {
        console.error("Sound playback failed:", error);
      });
    }
  
    if (currentTime <= 0) {
      clearInterval(timerInterval);
      isRunning = false;
      resetTimer();
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
  if (isRestTimer) {
    // If it's currently Rest Timer, switch to Match Timer
    isRestTimer = false;
    document.getElementById("timer-mode").textContent = "Match Timer";
  } else if (isIntervalTimer) {
    // If it's currently Interval Timer, switch to Rest Timer
    isIntervalTimer = false;
    isRestTimer = true;
    document.getElementById("timer-mode").textContent = "Rest Timer";
  } else {
    // If it's currently Match Timer, switch to Interval Timer
    isIntervalTimer = true;
    document.getElementById("timer-mode").textContent = "Interval Timer";
  }

  resetTimer();
}

function adjustTimer(type, value) {
  if (isRunning) return;
  if (type === "seconds") {
    currentTime = Math.max(0, currentTime + value);
  } else if (type === "minutes") {
    currentTime = Math.max(0, currentTime + value * 60);
  }
  updateTimerDisplay();
}

function toggleFlexiButtons() {
  if (isRunning) return;
  let flexi = document.getElementById("flexi-buttons");
  let toggleBtn = document.getElementById("toggle-flexi-btn");
  if (flexi.classList.contains("hidden")) {
    flexi.classList.remove("hidden");
    toggleBtn.textContent = "Hide Adjustments";
  } else {
    flexi.classList.add("hidden");
    toggleBtn.textContent = "⏱";
  }
}

function updateScore(team, value) {
  let scoreEl = document.getElementById(team + "-score");
  let currentScore = parseInt(scoreEl.textContent);
  scoreEl.textContent = Math.max(0, currentScore + value);
}

function swapSides() {
  // Toggle the "swapped" class on the scoreboard for responsive swapping.
  let scoreboard = document.getElementById("scoreboard");
  scoreboard.classList.toggle("swapped");
}

function togglePreset() {
  if (currentPreset === "black") {
    // Colour Belt Timer: 1:30 match / 0:45 interval
    matchTime.minutes = 1;
    matchTime.seconds = 30;
    roundTime.minutes = 0;
    roundTime.seconds = 45;

    document.getElementById("match-minutes").value = 1;
    document.getElementById("match-seconds").value = 30;
    document.getElementById("interval-minutes").value = 0;
    document.getElementById("interval-seconds").value = 45;

    currentPreset = "colour";
    document.getElementById("preset-toggle-btn").textContent = "Colour Belt";

  } else {
    // Black Belt Timer: 2:00 match / 1:00 interval
    matchTime.minutes = 2;
    matchTime.seconds = 0;
    roundTime.minutes = 1;
    roundTime.seconds = 0;

    document.getElementById("match-minutes").value = 2;
    document.getElementById("match-seconds").value = 0;
    document.getElementById("interval-minutes").value = 1;
    document.getElementById("interval-seconds").value = 0;

    currentPreset = "black";
    document.getElementById("preset-toggle-btn").textContent = "Black Belt";
  }

  updateCurrentTime();
  updateTimerDisplay();
}

function openSettings() {
  const overlay = document.getElementById("settings-overlay");
  overlay.classList.remove("hidden"); // Show the overlay

  const modal = document.getElementById("settings-modal");
  modal.classList.remove("closing"); // Ensure closing class is removed
  modal.classList.add("showing"); // Trigger open animation
  pauseTimer();
}

function closeSettings() {
  const overlay = document.getElementById("settings-overlay");
  const modal = document.getElementById("settings-modal");

  // Remove "showing" to prevent conflicts
  modal.classList.remove("showing");
  // Add "closing" to trigger the close animation
  modal.classList.add("closing");

  // Ensure overlay is hidden *after* animation completes (match the animation duration)
  setTimeout(() => {
    overlay.classList.add("hidden");
    modal.classList.remove("closing");
    saveSettings();
  }, 400); // 400ms = animation duration
}

function saveSettings() {
  matchTime.minutes = parseInt(document.getElementById("match-minutes").value);
  matchTime.seconds = parseInt(document.getElementById("match-seconds").value);
  roundTime.minutes = parseInt(document.getElementById("interval-minutes").value);
  roundTime.seconds = parseInt(document.getElementById("interval-seconds").value);
  restTime.seconds = parseInt(document.getElementById("rest-seconds").value);
  updateCurrentTime();
  updateTimerDisplay();
  document.getElementById("settings-overlay").classList.add("hidden");
}

function resetMatchScore() {
  document.getElementById("red-score").textContent = "0";
  document.getElementById("blue-score").textContent = "0";
}

function resetAllScores() {
  resetMatchScore();
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

document.getElementById("year").textContent = new Date().getFullYear();
