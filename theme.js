// Theme management
const THEME_KEY = "preferred-theme";

// Get theme from localStorage or system preference
function getInitialTheme () {
  const savedTheme = localStorage.getItem(THEME_KEY);
  if (savedTheme) {
    return savedTheme;
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

// Apply theme to document
function setTheme (theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem(THEME_KEY, theme);

  // Update logo based on theme
  const logoImg = document.querySelector(".logo-img");
  if (logoImg) {
    if (theme === "dark") {
      logoImg.src = "./logo_white_500x500.png";
    } else {
      logoImg.src = "./logo_white_500x500.png";
    }
  }

  // Update footer logo
  const footerLogo = document.querySelector(".footer-logo img");
  if (footerLogo) {
    footerLogo.src = "./logo_wName_transparentBG.png";
  }
}

// Toggle theme
function toggleTheme () {
  const currentTheme = document.documentElement.getAttribute("data-theme") || "dark";
  const newTheme = currentTheme === "dark" ? "light" : "dark";

  // Add rotation animation
  const logoContainer = document.querySelector(".logo-container");
  if (logoContainer) {
    logoContainer.classList.add("rotating");

    // Remove animation class after animation completes
    setTimeout(() => {
      logoContainer.classList.remove("rotating");
    }, 500);
  }

  setTheme(newTheme);
}

// Initialize theme
document.addEventListener("DOMContentLoaded", () => {
  // Set initial theme
  const initialTheme = getInitialTheme();
  setTheme(initialTheme);

  // Add click event to logo
  const logoContainer = document.querySelector(".logo-container");
  if (logoContainer) {
    logoContainer.addEventListener("click", toggleTheme);
  }

  // Listen for system theme changes
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
    if (!localStorage.getItem(THEME_KEY)) {
      setTheme(e.matches ? "dark" : "light");
    }
  });
}); 