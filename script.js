// ============================================
// BRUTALIST CLICKER GAMES WEBSITE SCRIPT
// Modular component loading and interactions
// ============================================

// Game data
const games = [
  { name: "Cookie Clicker", file: "cookie-clicker.html", emoji: "🍪" },
  { name: "Capybara Clicker", file: "capybara-clicker.html", emoji: "🐹" },
  { name: "Planet Clicker", file: "planet-clicker.html", emoji: "🌍" },
  { name: "Space Bar Clicker", file: "space-clicker.html", emoji: "🚀" },
  { name: "Clicker Counter", file: "counter-clicker.html", emoji: "📊" },
  { name: "Candy Clicker", file: "candy-clicker.html", emoji: "🍬" },
  { name: "Duck Clicker", file: "duck-clicker.html", emoji: "🦆" },
  { name: "Energy Clicker", file: "energy-clicker.html", emoji: "⚡" },
  { name: "Money Clicker", file: "money-clicker.html", emoji: "💰" },
  { name: "Cat Clicker", file: "cat-clicker.html", emoji: "🐱" },
  { name: "Kiwi Clicker", file: "kiwi-clicker.html", emoji: "🥝" },
  { name: "Baseball Clicker", file: "baseball-clicker.html", emoji: "⚾" },
  { name: "Minecraft Clicker", file: "minecraft-clicker.html", emoji: "⬜" },
  { name: "Clock Clicker", file: "clock-clicker.html", emoji: "🕐" },
  { name: "Button Clicker", file: "button-clicker.html", emoji: "🔘" },
  { name: "Chicken Clicker", file: "chicken-clicker.html", emoji: "🐔" },
  { name: "Clicker Timer", file: "timer-clicker.html", emoji: "⏱️" },
  { name: "Coin Clicker", file: "coin-clicker.html", emoji: "🪙" },
  { name: "Dog Clicker", file: "dog-clicker.html", emoji: "🐕" },
  { name: "Plant Clicker", file: "plant-clicker.html", emoji: "🌱" },
  { name: "Finger Clicker", file: "finger-clicker.html", emoji: "☝️" },
  { name: "Computer Clicker", file: "computer-clicker.html", emoji: "💻" },
  { name: "Website Clicker", file: "website-clicker.html", emoji: "🌐" },
  { name: "Frog Clicker", file: "frog-clicker.html", emoji: "🐸" },
  { name: "Fish Clicker", file: "fish-clicker.html", emoji: "🐠" },
  { name: "Eye Clicker", file: "eye-clicker.html", emoji: "👁️" },
  { name: "Spider Clicker", file: "spider-clicker.html", emoji: "🕷️" },
  { name: "Lion Clicker", file: "lion-clicker.html", emoji: "🦁" },
  { name: "Box Clicker", file: "box-clicker.html", emoji: "📦" },
  { name: "Clouds Clicker", file: "clouds-clicker.html", emoji: "☁️" },
]

const colors = [
  { name: "blue", class: "game-card-blue", var: "--color-blue" },
  { name: "green", class: "game-card-green", var: "--color-green" },
  { name: "yellow", class: "game-card-yellow", var: "--color-yellow" },
  { name: "red", class: "game-card-red", var: "--color-red" },
  { name: "purple", class: "game-card-purple", var: "--color-purple" },
  { name: "orange", class: "game-card-orange", var: "--color-orange" },
]

// ============================================
// COMPONENT LOADING
// ============================================

/**
 * Load header component
 */
function loadHeader() {
  const headerContainer = document.getElementById("header-container")
  if (headerContainer) {
    fetch("header.html")
      .then((response) => response.text())
      .then((html) => {
        headerContainer.innerHTML = html
        initMenuToggle()
      })
  }
}

/**
 * Load footer component
 */
function loadFooter() {
  const footerContainer = document.getElementById("footer-container")
  if (footerContainer) {
    fetch("footer.html")
      .then((response) => response.text())
      .then((html) => {
        footerContainer.innerHTML = html
      })
  }
}

/**
 * Load sidebar component
 */
function loadSidebar() {
  const sidebarContainer = document.getElementById("sidebar-container")
  if (sidebarContainer) {
    fetch("sidebar.html")
      .then((response) => response.text())
      .then((html) => {
        sidebarContainer.innerHTML = html
        initSidebarEvents()
      })
  }
}

function loadFeaturedGames() {
  const container = document.getElementById("featured-games")
  if (container) {
    const featuredGames = games.slice(0, 6)
    container.innerHTML = featuredGames
      .map((game, index) => {
        const color = colors[index % colors.length]
        return `
          <a href="${game.file}" class="game-card ${color.class}">
            <div class="game-emoji">${game.emoji}</div>
            <div class="game-name">${game.name}</div>
          </a>
        `
      })
      .join("")
  }
}

function loadPopularGames() {
  const container = document.getElementById("popular-games")
  if (container) {
    const popularGames = games.slice(6, 12)
    container.innerHTML = popularGames
      .map((game, index) => {
        const color = colors[(index + 6) % colors.length]
        return `
          <a href="${game.file}" class="game-card ${color.class}">
            <div class="game-emoji">${game.emoji}</div>
            <div class="game-name">${game.name}</div>
          </a>
        `
      })
      .join("")
  }
}

/**
 * Load all games
 */
function loadAllGames() {
  const container = document.getElementById("all-games-container")
  if (container) {
    container.innerHTML = games
      .map((game, index) => {
        const color = colors[index % colors.length]
        return `
          <a href="${game.file}" class="all-game-card ${color.class}">
            <div class="game-emoji-large">${game.emoji}</div>
            <div class="game-name-large">${game.name}</div>
          </a>
        `
      })
      .join("")
  }
}

// ============================================
// MENU & NAVIGATION
// ============================================

/**
 * Initialize menu toggle for mobile
 */
function initMenuToggle() {
  const menuToggle = document.getElementById("menu-toggle")
  const sidebar = document.getElementById("sidebar")

  if (menuToggle && sidebar) {
    menuToggle.addEventListener("click", () => {
      sidebar.classList.add("active")
    })
  }
}

/**
 * Initialize sidebar events
 */
function initSidebarEvents() {
  const sidebarClose = document.getElementById("sidebar-close")
  const sidebar = document.getElementById("sidebar")
  const sidebarLinks = document.querySelectorAll(".sidebar-link")

  if (sidebarClose && sidebar) {
    sidebarClose.addEventListener("click", () => {
      sidebar.classList.remove("active")
    })
  }

  // Close sidebar on link click
  sidebarLinks.forEach((link) => {
    link.addEventListener("click", () => {
      sidebar.classList.remove("active")
    })
  })

  // Close sidebar on outside click
  document.addEventListener("click", (e) => {
    if (sidebar && !sidebar.contains(e.target) && !document.getElementById("menu-toggle").contains(e.target)) {
      sidebar.classList.remove("active")
    }
  })
}

/**
 * Add click animations to buttons
 */
function initButtonAnimations() {
  const buttons = document.querySelectorAll(".game-button, .cta-button")
  buttons.forEach((button) => {
    button.addEventListener("click", (e) => {
      // Visual feedback
      button.style.transform = "scale(0.95)"
      setTimeout(() => {
        button.style.transform = "scale(1)"
      }, 100)
    })
  })
}

/**
 * Add hover animations to game cards
 */
function initCardAnimations() {
  const cards = document.querySelectorAll(".game-card, .all-game-card, .popular-game-item")
  cards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      card.style.borderColor = "rgba(0, 0, 0, 0.5)"
    })
    card.addEventListener("mouseleave", () => {
      card.style.borderColor = "#000000"
    })
  })
}

/**
 * Initialize scroll animations
 */
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.animation = "fadeIn 0.6s ease"
        observer.unobserve(entry.target)
      }
    })
  }, observerOptions)

  // Observe cards
  document.querySelectorAll(".game-card, .step-card, .stat-block").forEach((el) => {
    observer.observe(el)
  })
}

/**
 * Active nav link based on current page
 */
function setActiveNavLink() {
  const currentPage = window.location.pathname.split("/").pop() || "index.html"
  const navLinks = document.querySelectorAll(".nav-link")

  navLinks.forEach((link) => {
    const href = link.getAttribute("href")
    if (href === currentPage || (currentPage === "" && href === "index.html")) {
      link.classList.add("active")
    } else {
      link.classList.remove("active")
    }
  })
}

// ============================================
// INITIALIZATION
// ============================================

/**
 * Initialize all components on page load
 */
function init() {
  // Load components
  loadHeader()
  loadFooter()
  loadSidebar()
  loadFeaturedGames()
  loadPopularGames()
  loadAllGames()

  // Initialize interactions
  setTimeout(() => {
    initMenuToggle()
    setActiveNavLink()
    initButtonAnimations()
    initCardAnimations()
    initScrollAnimations()
  }, 500)
}

// Run on page load
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init)
} else {
  init()
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Add smooth scroll behavior
 */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  })
})
