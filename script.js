// ============================================
// BRUTALIST CLICKER GAMES WEBSITE SCRIPT
// Modular component loading and interactions
// ============================================

// Game data
const games = [
  "Cookie Clicker",
  "Capybara Clicker",
  "Planet Clicker",
  "Space Bar Clicker",
  "Clicker Counter",
  "Candy Clicker",
  "Duck Clicker",
  "Energy Clicker",
  "Money Clicker",
  "Cat Clicker",
  "Kiwi Clicker",
  "Baseball Clicker",
  "Minecraft Clicker",
  "Clock Clicker",
  "Button Clicker",
  "Chicken Clicker",
  "Clicker Timer",
  "Coin Clicker",
  "Dog Clicker",
  "Plant Clicker",
  "Finger Clicker",
  "Computer Clicker",
  "Website Clicker",
  "Frog Clicker",
  "Fish Clicker",
  "Eye Clicker",
  "Spider Clicker",
  "Lion Clicker",
  "Box Clicker",
  "Clouds Clicker",
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

/**
 * Load popular games
 */
function loadPopularGames() {
  const container = document.getElementById("popular-games-container")
  if (container) {
    const popularGames = games.slice(0, 6)
    container.innerHTML = popularGames
      .map(
        (game) => `
            <div class="popular-game-item">
                <div class="popular-game-name">${game}</div>
            </div>
        `,
      )
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
                <a href="#" class="all-game-card ${color.class}">
                    <div class="game-name-large">${game}</div>
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
