/**
 * @typedef {Object} GameEntry
 * @property {string} name - The display name of the clicker game
 * @property {string} file - The HTML file path
 * @property {string} emoji - The visual icon for the game
 */

/**
 * @typedef {Object} ColorTheme
 * @property {string} name - Color identifier
 * @property {string} class - CSS class name for styling
 * @property {string} var - CSS variable name
 */

// ============================================
// BRUTALIST CLICKER GAMES WEBSITE SCRIPT
// ============================================

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
];

const colors = [
  { name: "blue", class: "game-card-blue", var: "--color-blue" },
  { name: "green", class: "game-card-green", var: "--color-green" },
  { name: "yellow", class: "game-card-yellow", var: "--color-yellow" },
  { name: "red", class: "game-card-red", var: "--color-red" },
  { name: "purple", class: "game-card-purple", var: "--color-purple" },
  { name: "orange", class: "game-card-orange", var: "--color-orange" },
];

// ============================================
// COMPONENT LOADING (FIXED WITH ASYNC)
// ============================================

async function loadComponent(id, file) {
  const container = document.getElementById(id);
  if (!container) return false;
  try {
    const response = await fetch(file);
    const html = await response.text();
    container.innerHTML = html;
    return true;
  } catch (err) {
    console.error(`Failed to load ${file}:`, err);
    return false;
  }
}

function renderGamesList(containerId, gameSlice, isLarge = false) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const cardClass = isLarge ? "all-game-card" : "game-card";
  const emojiClass = isLarge ? "game-emoji-large" : "game-emoji";
  const nameClass = isLarge ? "game-name-large" : "game-name";

  container.innerHTML = gameSlice
    .map((game, index) => {
      const color = colors[index % colors.length];
      return `
        <a href="${game.file}" class="${cardClass} ${color.class}">
          <div class="${emojiClass}">${game.emoji}</div>
          <div class="${nameClass}">${game.name}</div>
        </a>
      `;
    })
    .join("");
}

// ============================================
// MENU & NAVIGATION
// ============================================

function initMenuToggle() {
  const menuToggle = document.getElementById("menu-toggle");
  const sidebar = document.getElementById("sidebar");

  if (menuToggle && sidebar) {
    // Remove existing listeners to prevent double-firing
    menuToggle.onclick = () => sidebar.classList.toggle("active");
  }
}

function initSidebarEvents() {
  const sidebarClose = document.getElementById("sidebar-close");
  const sidebar = document.getElementById("sidebar");
  const menuToggle = document.getElementById("menu-toggle");

  if (sidebarClose && sidebar) {
    sidebarClose.onclick = () => sidebar.classList.remove("active");
  }

  // Close sidebar on outside click
  document.addEventListener("click", (e) => {
    if (sidebar && sidebar.classList.contains("active")) {
      const isClickInside = sidebar.contains(e.target) || (menuToggle && menuToggle.contains(e.target));
      if (!isClickInside) {
        sidebar.classList.remove("active");
      }
    }
  });
}

function initButtonAnimations() {
  // Use event delegation for better performance and reliability
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".game-button, .cta-button, .upgrade-button");
    if (btn) {
      btn.style.transform = "scale(0.95)";
      setTimeout(() => (btn.style.transform = "scale(1)"), 100);
    }
  });
}

// ============================================
// INITIALIZATION
// ============================================

async function init() {
  // 1. Load HTML fragments first and WAIT for them
  const headerLoaded = await loadComponent("header-container", "header.html");
  await loadComponent("footer-container", "footer.html");
  const sidebarLoaded = await loadComponent("sidebar-container", "sidebar.html");

  // 2. Render internal game lists
  renderGamesList("featured-games", games.slice(0, 6));
  renderGamesList("popular-games", games.slice(6, 12));
  renderGamesList("all-games-container", games, true);

  // 3. Initialize logic ONLY after HTML is in the DOM
  if (headerLoaded) initMenuToggle();
  if (sidebarLoaded) initSidebarEvents();
  
  initButtonAnimations();
  setActiveNavLink();
}

function setActiveNavLink() {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-link").forEach((link) => {
    if (link.getAttribute("href") === currentPage) {
      link.classList.add("active");
    }
  });
}

// Run on page load
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
