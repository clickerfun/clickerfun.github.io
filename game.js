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
    title: "Clicker Novice",
    color: "blue",
  },
  {
    level: 2,
    threshold: 250,
    multiplier: 2,
    reward: 25,
    title: "Clicker Adept",
    color: "green",
  },
  {
    level: 3,
    threshold: 500,
    multiplier: 3,
    reward: 50,
    title: "Clicker Master",
    color: "yellow",
  },
  {
    level: 4,
    threshold: 1000,
    multiplier: 5,
    reward: 100,
    title: "Clicker Legend",
    color: "red",
  },
  {
    level: 5,
    threshold: 2000,
    multiplier: 10,
    reward: 250,
    title: "Clicker Dominator",
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

const GAME_NAME = "Clicker Game" // Declare GAME_NAME variable
const GAME_EMOJI = "🖱️" // Declare GAME_EMOJI variable

function loadGameState() {
  const saved = localStorage.getItem("clickerGameState")
  if (saved) {
    const data = JSON.parse(saved)
    Object.assign(gameState, data)
  }
}

function saveGameState() {
  localStorage.setItem("clickerGameState", JSON.stringify(gameState))
}

function initUpgrades() {
  const upgradesList = document.getElementById("upgrades-list")
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

  // Update displays
  document.getElementById("score-display").textContent = gameState.totalScore
  document.getElementById("clicks-display").textContent = gameState.clicks
  document.getElementById("multiplier-display").textContent = currentLevel.multiplier + "x"

  // Update progress bar
  const progressPercent = Math.min(100, (gameState.levelScore / currentLevel.threshold) * 100)
  document.getElementById("progress-fill").style.width = progressPercent + "%"
  document.getElementById("progress-text").textContent = gameState.levelScore + "/" + currentLevel.threshold

  // Visual feedback
  button.style.transform = "scale(0.92)"
  setTimeout(() => {
    button.style.transform = "scale(1)"
  }, 100)

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
    blue: "#0066ff",
    green: "#00cc00",
    yellow: "#ffcc00",
    red: "#ff3333",
    purple: "#9933ff",
    orange: "#ff6600",
  }
  return colors[colorName] || "#000000"
}

function levelUp() {
  gameState.currentLevel++
  gameState.levelScore = 0
  const newLevel = levels[gameState.currentLevel - 1]

  // Update UI
  document.getElementById("level-display").textContent = gameState.currentLevel
  document.getElementById("multiplier-display").textContent = newLevel.multiplier + "x"

  // Show modal
  const modal = document.getElementById("level-modal")
  document.getElementById("modal-title").textContent = "Level " + gameState.currentLevel + " Unlocked!"
  document.getElementById("modal-message").textContent = "You've become a " + newLevel.title + "!"

  // Apply level color to modal
  modal.style.borderColor = getColorValue(newLevel.color)

  modal.classList.add("active")

  // Reward animation
  createRewardAnimation(newLevel.reward)

  // Play level up sound
  playLevelUpSound()

  saveGameState()
}

function createRewardAnimation(amount) {
  const container = document.getElementById("popup-container")
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
    gameState.multiplier += upgrades.find((u) => u.id === upgradeId).bonus
    document.getElementById("score-display").textContent = gameState.totalScore
    document.getElementById("multiplier-display").textContent = gameState.multiplier + "x"

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

    document.getElementById("level-display").textContent = "1"
    document.getElementById("score-display").textContent = "0"
    document.getElementById("multiplier-display").textContent = "1x"
    document.getElementById("clicks-display").textContent = "0"
    document.getElementById("progress-fill").style.width = "0%"
    document.getElementById("progress-text").textContent = "0/100"

    initAchievements()
    saveGameState()
  }
}

function closeModal() {
  document.getElementById("level-modal").classList.remove("active")
}

function playClickSound() {
  // Create simple beep sound using Web Audio API
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
}

function playLevelUpSound() {
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
}

function playUpgradeSound() {
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
}

function initGame() {
  loadGameState()

  const clickerButton = document.getElementById("clicker-button")
  if (clickerButton) {
    clickerButton.addEventListener("click", handleClick)
  } else {
    console.error("[v0] Clicker button not found")
  }

  // Update game title if global variable exists
  if (typeof GAME_NAME !== "undefined" && GAME_NAME) {
    const titleEl = document.getElementById("game-title")
    if (titleEl) titleEl.textContent = GAME_NAME
  }
  if (typeof GAME_EMOJI !== "undefined" && GAME_EMOJI) {
    const emojiEl = document.getElementById("clicker-text")
    if (emojiEl) emojiEl.textContent = GAME_EMOJI
  }

  initUpgrades()
  initAchievements()

  // Update displays
  const currentLevel = levels[gameState.currentLevel - 1]
  document.getElementById("level-display").textContent = gameState.currentLevel
  document.getElementById("score-display").textContent = gameState.totalScore
  document.getElementById("multiplier-display").textContent = currentLevel.multiplier + "x"
  document.getElementById("clicks-display").textContent = gameState.clicks

  const progressPercent = Math.min(100, (gameState.levelScore / currentLevel.threshold) * 100)
  document.getElementById("progress-fill").style.width = progressPercent + "%"
  document.getElementById("progress-text").textContent = gameState.levelScore + "/" + currentLevel.threshold
}

// Initialize on page load
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initGame)
} else {
  initGame()
}
