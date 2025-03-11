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

function updatePenalty(team, value) {
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
  // Toggle the "swapped" class on the scoreboard for responsive swapping.
  let scoreboard = document.getElementById("scoreboard");
  scoreboard.classList.toggle("swapped");
}

function openSettings() {
  let overlay = document.getElementById("settings-overlay");
  overlay.classList.remove("hidden");
}

function closeSettings() {
  saveSettings();
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

//Install Prompt

let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    // Show the install button when the event is fired
    const installButton = document.getElementById('install-button');
    if (installButton) {
        installButton.style.display = 'block';

        installButton.addEventListener('click', () => {
            if (deferredPrompt) {
                deferredPrompt.prompt(); // Show install prompt

                deferredPrompt.userChoice.then(choiceResult => {
                    if (choiceResult.outcome === 'accepted') {
                        console.log('User accepted the PWA install');
                    } else {
                        console.log('User dismissed the PWA install');
                    }
                    deferredPrompt = null; // Reset after use
                });
            }
        });
    }
});

window.addEventListener('beforeinstallprompt', (e) => {
    console.log('beforeinstallprompt event fired!');  // Debug log
    e.preventDefault();
    deferredPrompt = e;

    const installButton = document.getElementById('install-button');
    if (installButton) {
        installButton.style.display = 'block';
        console.log('Install button should be visible now!');  // Debug log
    }
});
