/**
 * Language Switcher Component
 * Provides a simple EN | ES language switcher
 */

class LanguageSwitcher {
  constructor() {
    this.currentLanguage = window.i18n ? window.i18n.getCurrentLanguage() : 'en';
    this.createSwitcher();
    this.bindEvents();
  }

  /**
   * Create the language switcher HTML
   */
  createSwitcher() {
    const switcher = document.createElement('div');
    switcher.className = 'language-switcher';
    switcher.innerHTML = `
      <div class="language-switcher-container">
        <button class="language-btn ${this.currentLanguage === 'en' ? 'active' : ''}" data-lang="en">
          EN
        </button>
        <span class="language-separator">|</span>
        <button class="language-btn ${this.currentLanguage === 'es' ? 'active' : ''}" data-lang="es">
          ES
        </button>
      </div>
    `;

    // Insert into header
    const header = document.querySelector('header .container');
    if (header) {
      header.appendChild(switcher);
    } else {
      // Fallback: insert at the beginning of body
      document.body.insertBefore(switcher, document.body.firstChild);
    }
  }

  /**
   * Bind event listeners
   */
  bindEvents() {
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('language-btn')) {
        const lang = e.target.getAttribute('data-lang');
        this.switchLanguage(lang);
      }
    });
  }

  /**
   * Switch to a different language
   * @param {string} lang - Language code
   */
  async switchLanguage(lang) {
    if (!window.i18n || !window.i18n.isLanguageSupported(lang)) {
      console.error('Unsupported language:', lang);
      return;
    }

    // Update active button
    document.querySelectorAll('.language-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    document.querySelector(`[data-lang="${lang}"]`).classList.add('active');

    // Navigate to language-specific URL
    const currentPath = window.location.pathname;
    const baseURL = window.location.origin;
    
    // Remove existing language prefix
    const pathWithoutLang = currentPath.replace(/^\/(en|es)/, '');
    
    // Add new language prefix
    const newPath = `/${lang}${pathWithoutLang}`;
    const newURL = `${baseURL}${newPath}`;
    
    // Navigate to new URL
    window.location.href = newURL;
  }

  /**
   * Update the switcher when language changes
   */
  updateSwitcher() {
    this.currentLanguage = window.i18n ? window.i18n.getCurrentLanguage() : 'en';
    
    document.querySelectorAll('.language-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    
    const activeBtn = document.querySelector(`[data-lang="${this.currentLanguage}"]`);
    if (activeBtn) {
      activeBtn.classList.add('active');
    }
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Wait for i18n to be ready
  const initSwitcher = () => {
    if (window.i18n) {
      new LanguageSwitcher();
    } else {
      setTimeout(initSwitcher, 100);
    }
  };
  
  initSwitcher();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = LanguageSwitcher;
}
