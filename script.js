/***********************
 * Timer Configuration *
 ***********************/

// Default timer settings
let matchTime = { minutes: 2, seconds: 0 };   // Match duration: 2 minutes
let roundTime = { minutes: 1, seconds: 0 };   // Interval duration: 1 minute
let restTime = { seconds: 30 };               // Rest duration: 30 seconds

// Mode flags
let isIntervalTimer = false;  // Indicates interval timer is active
let isRestTimer = false;      // Indicates rest timer is active
let isRunning = false;        // Whether the timer is currently counting down

let timerInterval;            // Interval ID used to clear the timer
let currentTime = 0;          // Current countdown time in seconds

let alarmSound = new Audio("Arlam.mp3");       // Sound played at end of timer
let currentPreset = "black";                   // Default preset is Black Belt timer


/*************************
 * Initialization Events *
 *************************/

// Preload alarm sound on page load
window.addEventListener("load", () => {
  alarmSound.load();
});

// Initialize the current time and display
updateCurrentTime();
updateTimerDisplay();

// Update currentTime depending on the active mode
function updateCurrentTime() {
  if (isRestTimer) {
    currentTime = restTime.seconds;
  } else if (isIntervalTimer) {
    currentTime = roundTime.minutes * 60 + roundTime.seconds;
  } else {
    currentTime = matchTime.minutes * 60 + matchTime.seconds;
  }
}

// Update the visible timer display (formatted as MM:SS)
function updateTimerDisplay() {
  let minutes = Math.floor(currentTime / 60);
  let seconds = currentTime % 60;
  document.getElementById("timer-display").textContent =
    String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0");
}


/********************
 * Timer Controls *
 ********************/

// Toggle between playing and pausing the timer
function toggleTimer() {
  if (isRunning) {
    pauseTimer();
  } else {
    // Hide adjustment buttons while running
    document.getElementById("flexi-buttons").classList.add("hidden");
    document.getElementById("toggle-flexi-btn").textContent = "⏱";
    startTimer();
  }
}

// Start the countdown and handle end-of-timer logic
function startTimer() {
  if (isRunning) return;
  isRunning = true;
  document.getElementById("play-pause-btn").textContent = "Pause";

  timerInterval = setInterval(() => {
    // Trigger alarm when timer is about to end
    if (currentTime <= 1.8) {
      alarmSound.play().catch(error => {
        console.error("Sound playback failed:", error);
      });
    }

    // If time is up, stop and reset timer
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

// Pause the timer
function pauseTimer() {
  clearInterval(timerInterval);
  isRunning = false;
  document.getElementById("play-pause-btn").textContent = "Play";
}

// Reset the timer to the current mode's default time
function resetTimer() {
  clearInterval(timerInterval);
  isRunning = false;
  document.getElementById("play-pause-btn").textContent = "Play";
  updateCurrentTime();
  updateTimerDisplay();
}


/************************
 * Mode Switching Logic *
 ************************/

// Cycle between Match -> Interval -> Rest timer modes
function toggleTimerMode() {
  if (isRestTimer) {
    isRestTimer = false;
    document.getElementById("timer-mode").textContent = "Match Timer";
  } else if (isIntervalTimer) {
    isIntervalTimer = false;
    isRestTimer = true;
    document.getElementById("timer-mode").textContent = "Rest Timer";
  } else {
    isIntervalTimer = true;
    document.getElementById("timer-mode").textContent = "Interval Timer";
  }

  resetTimer();
}


/**************************
 * Timer Adjustment Logic *
 **************************/

// Adjust the timer manually when not running
function adjustTimer(type, value) {
  if (isRunning) return;

  if (type === "seconds") {
    currentTime = Math.max(0, currentTime + value);
  } else if (type === "minutes") {
    currentTime = Math.max(0, currentTime + value * 60);
  }

  updateTimerDisplay();
}

// Show or hide timer adjustment buttons
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


/******************
 * Score Handling *
 ******************/

// Update the score for a team
function updateScore(team, value) {
  let scoreEl = document.getElementById(team + "-score");
  let currentScore = parseInt(scoreEl.textContent);
  scoreEl.textContent = Math.max(0, currentScore + value);
}

// Swap red and blue score sides
function swapSides() {
  let scoreboard = document.getElementById("scoreboard");
  scoreboard.classList.toggle("swapped");
}


/***************************
 * Presets (Black/Colour) *
 ***************************/

// Toggle between Black Belt and Colour Belt timer presets
function togglePreset() {
  if (currentPreset === "black") {
    // Colour Belt: shorter match and interval
    matchTime = { minutes: 1, seconds: 30 };
    roundTime = { minutes: 0, seconds: 45 };
    restTime = { seconds: 30 };

    currentPreset = "colour";
    document.getElementById("preset-toggle-btn").textContent = "Colour Belt";
  } else {
    // Black Belt: longer durations
    matchTime = { minutes: 2, seconds: 0 };
    roundTime = { minutes: 1, seconds: 0 };
    restTime = { seconds: 30 };

    currentPreset = "black";
    document.getElementById("preset-toggle-btn").textContent = "Black Belt";
  }

  // Update input fields
  document.getElementById("match-minutes").value = matchTime.minutes;
  document.getElementById("match-seconds").value = matchTime.seconds;
  document.getElementById("interval-minutes").value = roundTime.minutes;
  document.getElementById("interval-seconds").value = roundTime.seconds;
  document.getElementById("rest-seconds").value = restTime.seconds;

  updateCurrentTime();
  updateTimerDisplay();
}


/*******************
 * Settings Modal *
 *******************/

// Open the settings modal and pause timer
function openSettings() {
  const overlay = document.getElementById("settings-overlay");
  const modal = document.getElementById("settings-modal");

  overlay.classList.remove("hidden");
  modal.classList.remove("closing");
  modal.classList.add("showing");

  pauseTimer();
}

// Close the settings modal after animation
function closeSettings() {
  const overlay = document.getElementById("settings-overlay");
  const modal = document.getElementById("settings-modal");

  modal.classList.remove("showing");
  modal.classList.add("closing");

  setTimeout(() => {
    overlay.classList.add("hidden");
    modal.classList.remove("closing");
    saveSettings();
  }, 400); // Matches closing animation duration
}

// Apply settings changes from modal input fields
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


/*****************************
 * Match & Score Management *
 *****************************/

// Reset only the match score
function resetMatchScore() {
  document.getElementById("red-score").textContent = "0";
  document.getElementById("blue-score").textContent = "0";
}

// Reset all scores (penalties removed for simplicity)
function resetAllScores() {
  resetMatchScore();
}


/*********************************
 * Modal Event Listener Handling *
 *********************************/

// Close modal if clicking outside of it
document.getElementById("settings-overlay").addEventListener("click", function(e) {
  if (e.target === this) {
    closeSettings();
  }
});

// Close modal if clicking the X button
document.getElementById("modal-close").addEventListener("click", function() {
  closeSettings();
});


/********************
 * Misc / Footer UI *
 ********************/

// Display the current year in the footer
document.getElementById("year").textContent = new Date().getFullYear();

// Disable zoom
document.addEventListener('touchstart', function (e) {
    if (e.touches.length > 1) {
        e.preventDefault(); // Prevent zooming
    }
}, { passive: false });

