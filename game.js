// ============================================
// CLICKER GAME ENGINE
// Main game mechanics, levels, rewards, and animations
// ============================================

// Game State
const gameState = {
  currentLevel: 1,
  totalScore: 0,
  levelScore: 0,
  clicks: 0,
  multiplier: 1,
  levelThreshold: 100,
}

// Level data - 5 levels with increasing multipliers
const levels = [
  {
    level: 1,
    threshold: 100,
    multiplier: 1,
    reward: 10,
    title: "Novice",
    color: "blue",
  },
  {
    level: 2,
    threshold: 250,
    multiplier: 2,
    reward: 25,
    title: "Adept",
    color: "green",
  },
  {
    level: 3,
    threshold: 500,
    multiplier: 3,
    reward: 50,
    title: "Master",
    color: "yellow",
  },
  {
    level: 4,
    threshold: 1000,
    multiplier: 5,
    reward: 100,
    title: "Legend",
    color: "red",
  },
  {
    level: 5,
    threshold: 2000,
    multiplier: 10,
    reward: 250,
    title: "Dominator",
    color: "purple",
  },
]

// Upgrades system
const upgrades = [
  { id: "double-click", name: "Double Click", cost: 50, bonus: 1 },
  { id: "speed-boost", name: "Speed Boost", cost: 100, bonus: 2 },
  { id: "mega-multiplier", name: "Mega Multiplier", cost: 200, bonus: 5 },
]

// Achievements
const achievements = [
  { id: "first-click", name: "First Click", description: "Click the button once" },
  { id: "hundred-clicks", name: "Hundred Clicker", description: "Reach 100 clicks" },
  { id: "level-up", name: "Level Up", description: "Reach Level 2" },
  { id: "master", name: "Master", description: "Reach Level 5" },
  { id: "upgrader", name: "Upgrader", description: "Purchase an upgrade" },
]

let unlockedAchievements = []

// Default values if not set in HTML
const GAME_NAME = "Clicker Game"
const GAME_ID = "clicker-game"
const GAME_EMOJI = "🖱️"

function loadGameState() {
  const saveKey = "game_" + GAME_ID
  const saved = localStorage.getItem(saveKey)
  if (saved) {
    const data = JSON.parse(saved)
    Object.assign(gameState, data)
  }
}

function saveGameState() {
  const saveKey = "game_" + GAME_ID
  localStorage.setItem(saveKey, JSON.stringify(gameState))
}

function initUpgrades() {
  const upgradesList = document.getElementById("upgrades-list")
  if (!upgradesList) return

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
    .join("")
}

function initAchievements() {
  const achievementsGrid = document.getElementById("achievements-grid")
  if (!achievementsGrid) return

  achievementsGrid.innerHTML = achievements
    .map(
      (achievement) => `
        <div class="achievement-card ${unlockedAchievements.includes(achievement.id) ? "unlocked" : "locked"}">
            <div class="achievement-name">${achievement.name}</div>
            <div class="achievement-desc">${achievement.description}</div>
        </div>
    `,
    )
    .join("")
}

function handleClick() {
  const button = document.getElementById("clicker-button")
  const currentLevel = levels[gameState.currentLevel - 1]

  // Update game state
  gameState.clicks++
  const points = currentLevel.multiplier
  gameState.totalScore += points
  gameState.levelScore += points

  // Update displays with null checks
  const scoreDisplay = document.getElementById("score-display")
  const clicksDisplay = document.getElementById("clicks-display")
  const multiplierDisplay = document.getElementById("multiplier-display")

  if (scoreDisplay) scoreDisplay.textContent = gameState.totalScore
  if (clicksDisplay) clicksDisplay.textContent = gameState.clicks
  if (multiplierDisplay) multiplierDisplay.textContent = currentLevel.multiplier + "x"

  // Update progress bar
  const progressFill = document.getElementById("progress-fill")
  const progressText = document.getElementById("progress-text")

  if (progressFill && progressText) {
    const progressPercent = Math.min(100, (gameState.levelScore / currentLevel.threshold) * 100)
    progressFill.style.width = progressPercent + "%"
    progressText.textContent = gameState.levelScore + "/" + currentLevel.threshold
  }

  // Visual feedback
  if (button) {
    button.style.transform = "scale(0.92)"
    setTimeout(() => {
      if (button) button.style.transform = "scale(1)"
    }, 100)
  }

  // Show floating number
  createPopup(points)

  // Play sound
  playClickSound()

  // Check achievements
  checkAchievements()

  // Check level up
  if (gameState.levelScore >= currentLevel.threshold && gameState.currentLevel < 5) {
    levelUp()
  }

  // Save state
  saveGameState()
}

function createPopup(points) {
  const container = document.getElementById("popup-container")
  if (!container) return

  const popup = document.createElement("div")
  popup.className = "score-popup"
  popup.textContent = "+" + points

  // Color based on current level
  const currentLevel = levels[gameState.currentLevel - 1]
  popup.style.color = getColorValue(currentLevel.color)

  container.appendChild(popup)

  // Animate and remove
  setTimeout(() => {
    popup.style.opacity = "0"
    popup.style.transform = "translateY(-50px)"
  }, 10)

  setTimeout(() => {
    popup.remove()
  }, 600)
}

function getColorValue(colorName) {
  const colors = {
    blue: "#0052cc",
    green: "#00a650",
    yellow: "#ffb81c",
    red: "#e50000",
    purple: "#7b2cbf",
    orange: "#ff6b35",
  }
  return colors[colorName] || "#000000"
}

function levelUp() {
  gameState.currentLevel++
  gameState.levelScore = 0
  const newLevel = levels[gameState.currentLevel - 1]

  // Update UI
  const levelDisplay = document.getElementById("level-display")
  const multiplierDisplay = document.getElementById("multiplier-display")

  if (levelDisplay) levelDisplay.textContent = gameState.currentLevel
  if (multiplierDisplay) multiplierDisplay.textContent = newLevel.multiplier + "x"

  // Show modal
  const modal = document.getElementById("level-modal")
  if (modal) {
    const modalTitle = document.getElementById("modal-title")
    const modalMessage = document.getElementById("modal-message")

    if (modalTitle) modalTitle.textContent = "Level " + gameState.currentLevel + " Unlocked!"
    if (modalMessage) modalMessage.textContent = "You've become a " + newLevel.title + "!"

    // Apply level color to modal
    modal.style.borderColor = getColorValue(newLevel.color)
    modal.classList.add("active")
  }

  // Reward animation
  createRewardAnimation(newLevel.reward)

  // Play level up sound
  playLevelUpSound()

  saveGameState()
}

function createRewardAnimation(amount) {
  const container = document.getElementById("popup-container")
  if (!container) return

  const reward = document.createElement("div")
  reward.className = "reward-popup"
  reward.textContent = "LEVEL UP! +$" + amount

  container.appendChild(reward)

  setTimeout(() => {
    reward.style.opacity = "0"
    reward.style.transform = "scale(0.5)"
  }, 500)

  setTimeout(() => {
    reward.remove()
  }, 1500)
}

function buyUpgrade(upgradeId, cost) {
  if (gameState.totalScore >= cost) {
    gameState.totalScore -= cost
    const upgrade = upgrades.find((u) => u.id === upgradeId)
    gameState.multiplier += upgrade.bonus

    const scoreDisplay = document.getElementById("score-display")
    const multiplierDisplay = document.getElementById("multiplier-display")

    if (scoreDisplay) scoreDisplay.textContent = gameState.totalScore
    if (multiplierDisplay) multiplierDisplay.textContent = gameState.multiplier + "x"

    createPopup("Upgrade!")
    playUpgradeSound()
    checkAchievements()
    saveGameState()
  }
}

function checkAchievements() {
  if (gameState.clicks === 1 && !unlockedAchievements.includes("first-click")) {
    unlockedAchievements.push("first-click")
  }
  if (gameState.clicks >= 100 && !unlockedAchievements.includes("hundred-clicks")) {
    unlockedAchievements.push("hundred-clicks")
  }
  if (gameState.currentLevel >= 2 && !unlockedAchievements.includes("level-up")) {
    unlockedAchievements.push("level-up")
  }
  if (gameState.currentLevel >= 5 && !unlockedAchievements.includes("master")) {
    unlockedAchievements.push("master")
  }
  if (gameState.multiplier > 1 && !unlockedAchievements.includes("upgrader")) {
    unlockedAchievements.push("upgrader")
  }

  initAchievements()
}

function resetGame() {
  if (confirm("Are you sure you want to reset your game?")) {
    gameState.currentLevel = 1
    gameState.totalScore = 0
    gameState.levelScore = 0
    gameState.clicks = 0
    gameState.multiplier = 1
    unlockedAchievements = []

    const levelDisplay = document.getElementById("level-display")
    const scoreDisplay = document.getElementById("score-display")
    const multiplierDisplay = document.getElementById("multiplier-display")
    const clicksDisplay = document.getElementById("clicks-display")
    const progressFill = document.getElementById("progress-fill")
    const progressText = document.getElementById("progress-text")

    if (levelDisplay) levelDisplay.textContent = "1"
    if (scoreDisplay) scoreDisplay.textContent = "0"
    if (multiplierDisplay) multiplierDisplay.textContent = "1x"
    if (clicksDisplay) clicksDisplay.textContent = "0"
    if (progressFill) progressFill.style.width = "0%"
    if (progressText) progressText.textContent = "0/100"

    initAchievements()
    saveGameState()
  }
}

function closeModal() {
  const modal = document.getElementById("level-modal")
  if (modal) modal.classList.remove("active")
}

function playClickSound() {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillator.frequency.value = 800
    oscillator.type = "sine"

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1)

    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.1)
  } catch (e) {
    console.log("[v0] Audio context error:", e)
  }
}

function playLevelUpSound() {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillator.frequency.setValueAtTime(600, audioContext.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(1000, audioContext.currentTime + 0.3)
    oscillator.type = "sine"

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)

    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.3)
  } catch (e) {
    console.log("[v0] Audio context error:", e)
  }
}

function playUpgradeSound() {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillator.frequency.value = 1200
    oscillator.type = "square"

    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15)

    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.15)
  } catch (e) {
    console.log("[v0] Audio context error:", e)
  }
}

function initGame() {
  loadGameState()

  const clickerButton = document.getElementById("clicker-button")
  if (clickerButton) {
    clickerButton.addEventListener("click", handleClick)
  }

  // Update game title and emoji if set in HTML
  const gameTitle = document.getElementById("game-title")
  const clickerText = document.getElementById("clicker-text")

  if (gameTitle && typeof GAME_NAME !== "undefined") {
    gameTitle.textContent = GAME_NAME
  }
  if (clickerText && typeof GAME_EMOJI !== "undefined") {
    clickerText.textContent = GAME_EMOJI
  }

  initUpgrades()
  initAchievements()

  // Update displays
  const currentLevel = levels[gameState.currentLevel - 1]
  const levelDisplay = document.getElementById("level-display")
  const scoreDisplay = document.getElementById("score-display")
  const multiplierDisplay = document.getElementById("multiplier-display")
  const clicksDisplay = document.getElementById("clicks-display")
  const progressFill = document.getElementById("progress-fill")
  const progressText = document.getElementById("progress-text")

  if (levelDisplay) levelDisplay.textContent = gameState.currentLevel
  if (scoreDisplay) scoreDisplay.textContent = gameState.totalScore
  if (multiplierDisplay) multiplierDisplay.textContent = currentLevel.multiplier + "x"
  if (clicksDisplay) clicksDisplay.textContent = gameState.clicks

  if (progressFill && progressText) {
    const progressPercent = Math.min(100, (gameState.levelScore / currentLevel.threshold) * 100)
    progressFill.style.width = progressPercent + "%"
    progressText.textContent = gameState.levelScore + "/" + currentLevel.threshold
  }
}

// Initialize on page load
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initGame)
} else {
  initGame()
}
