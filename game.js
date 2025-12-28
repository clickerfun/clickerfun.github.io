/**
 * @typedef {Object} Level
 * @property {number} level - The level number
 * @property {number} threshold - Score needed to clear the level
 * @property {number} multiplier - Score multiplier for this level
 * @property {number} reward - Bonus given on level up
 * @property {string} title - Display title
 * @property {string} color - Theme color
 */

/**
 * @typedef {Object} GameState
 * @property {number} currentLevel - User's current level
 * @property {number} totalScore - Overall currency/score
 * @property {number} levelScore - Progress toward next level
 * @property {number} clicks - Total clicks performed
 * @property {number} multiplier - Current click power
 */

// ============================================
// CLICKER GAME ENGINE
// ============================================

const gameState = {
  currentLevel: 1,
  totalScore: 0,
  levelScore: 0,
  clicks: 0,
  multiplier: 1,
  levelThreshold: 100,
};

const levels = [
  { level: 1, threshold: 100, multiplier: 1, reward: 10, title: "Clicker Novice", color: "blue" },
  { level: 2, threshold: 250, multiplier: 2, reward: 25, title: "Clicker Adept", color: "green" },
  { level: 3, threshold: 500, multiplier: 3, reward: 50, title: "Clicker Master", color: "yellow" },
  { level: 4, threshold: 1000, multiplier: 5, reward: 100, title: "Clicker Legend", color: "red" },
  { level: 5, threshold: 2000, multiplier: 10, reward: 250, title: "Clicker Dominator", color: "purple" },
];

const upgrades = [
  { id: "double-click", name: "Double Click", cost: 50, bonus: 1 },
  { id: "speed-boost", name: "Speed Boost", cost: 100, bonus: 2 },
  { id: "mega-multiplier", name: "Mega Multiplier", cost: 200, bonus: 5 },
];

const achievements = [
  { id: "first-click", name: "First Click", description: "Click the button once" },
  { id: "hundred-clicks", name: "Hundred Clicker", description: "Reach 100 clicks" },
  { id: "level-up", name: "Level Up", description: "Reach Level 2" },
  { id: "master", name: "Master", description: "Reach Level 5" },
  { id: "upgrader", name: "Upgrader", description: "Purchase an upgrade" },
];

let unlockedAchievements = [];
const GAME_NAME = "Clicker Game";
const GAME_EMOJI = "🖱️";

// Audio Context - Singleton pattern to prevent "suspended" state issues
let audioCtx = null;
function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function loadGameState() {
  const saved = localStorage.getItem("clickerGameState");
  if (saved) {
    const data = JSON.parse(saved);
    Object.assign(gameState, data);
  }
}

function saveGameState() {
  localStorage.setItem("clickerGameState", JSON.stringify(gameState));
}

function initUpgrades() {
  const upgradesList = document.getElementById("upgrades-list");
  if (!upgradesList) return;
  upgradesList.innerHTML = upgrades
    .map(
      (upgrade) => `
        <div class="upgrade-item">
            <div class="upgrade-name">${upgrade.name}</div>
            <button class="upgrade-button" onclick="buyUpgrade('${upgrade.id}', ${upgrade.cost})">
                ${upgrade.cost}
            </button>
        </div>
    `,
    )
    .join("");
}

function initAchievements() {
  const achievementsGrid = document.getElementById("achievements-grid");
  if (!achievementsGrid) return;
  achievementsGrid.innerHTML = achievements
    .map(
      (achievement) => `
        <div class="achievement-card ${unlockedAchievements.includes(achievement.id) ? "unlocked" : "locked"}">
            <div class="achievement-name">${achievement.name}</div>
            <div class="achievement-desc">${achievement.description}</div>
        </div>
    `,
    )
    .join("");
}

function handleClick() {
  const button = document.getElementById("clicker-button");
  if (!button) return;

  const currentLevelData = levels[gameState.currentLevel - 1];

  gameState.clicks++;
  const points = currentLevelData.multiplier;
  gameState.totalScore += points;
  gameState.levelScore += points;

  // UI Updates
  updateDisplay("score-display", gameState.totalScore);
  updateDisplay("clicks-display", gameState.clicks);
  updateDisplay("multiplier-display", currentLevelData.multiplier + "x");

  const progressPercent = Math.min(100, (gameState.levelScore / currentLevelData.threshold) * 100);
  const fill = document.getElementById("progress-fill");
  if (fill) fill.style.width = progressPercent + "%";
  updateDisplay("progress-text", gameState.levelScore + "/" + currentLevelData.threshold);

  button.style.transform = "scale(0.92)";
  setTimeout(() => (button.style.transform = "scale(1)"), 100);

  createPopup(points);
  playClickSound();
  checkAchievements();

  if (gameState.levelScore >= currentLevelData.threshold && gameState.currentLevel < 5) {
    levelUp();
  }

  saveGameState();
}

function updateDisplay(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function createPopup(points) {
  const container = document.getElementById("popup-container");
  if (!container) return;

  const popup = document.createElement("div");
  popup.className = "score-popup";
  popup.textContent = "+" + points;

  const currentLevelData = levels[gameState.currentLevel - 1];
  popup.style.color = getColorValue(currentLevelData.color);

  container.appendChild(popup);

  setTimeout(() => {
    popup.style.opacity = "0";
    popup.style.transform = "translateY(-50px)";
  }, 10);

  setTimeout(() => popup.remove(), 600);
}

function getColorValue(colorName) {
  const colors = {
    blue: "#0066ff",
    green: "#00cc00",
    yellow: "#ffcc00",
    red: "#ff3333",
    purple: "#9933ff",
    orange: "#ff6600",
  };
  return colors[colorName] || "#000000";
}

function levelUp() {
  gameState.currentLevel++;
  gameState.levelScore = 0;
  const newLevel = levels[gameState.currentLevel - 1];

  updateDisplay("level-display", gameState.currentLevel);
  updateDisplay("multiplier-display", newLevel.multiplier + "x");

  const modal = document.getElementById("level-modal");
  if (modal) {
    updateDisplay("modal-title", "Level " + gameState.currentLevel + " Unlocked!");
    updateDisplay("modal-message", "You've become a " + newLevel.title + "!");
    modal.style.borderColor = getColorValue(newLevel.color);
    modal.classList.add("active");
  }

  createRewardAnimation(newLevel.reward);
  playLevelUpSound();
  saveGameState();
}

function createRewardAnimation(amount) {
  const container = document.getElementById("popup-container");
  if (!container) return;
  const reward = document.createElement("div");
  reward.className = "reward-popup";
  reward.textContent = "LEVEL UP! +$" + amount;
  container.appendChild(reward);

  setTimeout(() => {
    reward.style.opacity = "0";
    reward.style.transform = "scale(0.5)";
  }, 500);
  setTimeout(() => reward.remove(), 1500);
}

function buyUpgrade(upgradeId, cost) {
  if (gameState.totalScore >= cost) {
    gameState.totalScore -= cost;
    const upgrade = upgrades.find((u) => u.id === upgradeId);
    gameState.multiplier += upgrade.bonus;
    
    updateDisplay("score-display", gameState.totalScore);
    updateDisplay("multiplier-display", gameState.multiplier + "x");

    createPopup("Upgrade!");
    playUpgradeSound();
    checkAchievements();
    saveGameState();
  }
}

function checkAchievements() {
  if (gameState.clicks === 1 && !unlockedAchievements.includes("first-click")) unlockedAchievements.push("first-click");
  if (gameState.clicks >= 100 && !unlockedAchievements.includes("hundred-clicks")) unlockedAchievements.push("hundred-clicks");
  if (gameState.currentLevel >= 2 && !unlockedAchievements.includes("level-up")) unlockedAchievements.push("level-up");
  if (gameState.currentLevel >= 5 && !unlockedAchievements.includes("master")) unlockedAchievements.push("master");
  if (gameState.multiplier > 1 && !unlockedAchievements.includes("upgrader")) unlockedAchievements.push("upgrader");

  initAchievements();
}

function playClickSound() {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 800;
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  } catch (e) { console.log("Audio blocked"); }
}

function playLevelUpSound() {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1000, ctx.currentTime + 0.3);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  } catch (e) { }
}

function playUpgradeSound() {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 1200;
    osc.type = "square";
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  } catch (e) { }
}

function initGame() {
  loadGameState();
  const clickerButton = document.getElementById("clicker-button");
  if (clickerButton) {
    clickerButton.onclick = handleClick; // Direct assignment is safer in some environments
  }

  updateDisplay("game-title", GAME_NAME);
  updateDisplay("clicker-text", GAME_EMOJI);

  initUpgrades();
  initAchievements();

  const currentLevelData = levels[gameState.currentLevel - 1];
  updateDisplay("level-display", gameState.currentLevel);
  updateDisplay("score-display", gameState.totalScore);
  updateDisplay("multiplier-display", currentLevelData.multiplier + "x");
  updateDisplay("clicks-display", gameState.clicks);
}

document.addEventListener("DOMContentLoaded", initGame);
