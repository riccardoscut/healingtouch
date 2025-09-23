/**
 * Simple i18n library for Signature Healing Touch
 * Supports English (en) and Spanish (es) languages
 */

class I18n {
  constructor() {
    this.currentLanguage = this.detectLanguage();
    this.translations = {};
    this.fallbackLanguage = 'en';
    this.loadTranslations();
  }

  /**
   * Detect the current language from URL or localStorage
   */
  detectLanguage() {
    // Check URL path
    const path = window.location.pathname;
    if (path.startsWith('/es/') || path === '/es') return 'es';
    if (path.startsWith('/en/') || path === '/en') return 'en';
    
    // Check localStorage
    const stored = localStorage.getItem('preferred-language');
    if (stored && ['en', 'es'].includes(stored)) return stored;
    
    // Check browser language
    const browserLang = navigator.language.split('-')[0];
    if (browserLang === 'es') return 'es';
    
    // Default to English
    return 'en';
  }

  /**
   * Load translations from JSON files
   */
  async loadTranslations() {
    try {
      // Check if we're in a language subdirectory
      const isInSubdir = window.location.pathname.startsWith('/en/') || window.location.pathname.startsWith('/es/');
      const basePath = isInSubdir ? '../' : './';
      const response = await fetch(`${basePath}locales/${this.currentLanguage}.json`);
      if (response.ok) {
        this.translations = await response.json();
      } else {
        console.warn(`Failed to load ${this.currentLanguage} translations, falling back to ${this.fallbackLanguage}`);
        await this.loadFallbackTranslations();
      }
    } catch (error) {
      console.error('Error loading translations:', error);
      await this.loadFallbackTranslations();
    }
  }

  /**
   * Load fallback translations
   */
  async loadFallbackTranslations() {
    try {
      // Check if we're in a language subdirectory
      const isInSubdir = window.location.pathname.startsWith('/en/') || window.location.pathname.startsWith('/es/');
      const basePath = isInSubdir ? '../' : './';
      const response = await fetch(`${basePath}locales/${this.fallbackLanguage}.json`);
      if (response.ok) {
        this.translations = await response.json();
        this.currentLanguage = this.fallbackLanguage;
      }
    } catch (error) {
      console.error('Error loading fallback translations:', error);
    }
  }

  /**
   * Get raw translation value for a key
   * @param {string} key - Translation key
   * @returns {*} Raw translation value
   */
  getTranslationValue(key) {
    const keys = key.split('.');
    let value = this.translations;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return null;
      }
    }
    
    return value;
  }

  /**
   * Get translation for a key
   * @param {string} key - Translation key (e.g., 'meta.title')
   * @param {Object} params - Parameters for interpolation
   * @returns {string} Translated text
   */
  t(key, params = {}) {
    const value = this.getTranslationValue(key);
    
    if (value === null) {
      console.warn(`Translation key not found: ${key}`);
      return key; // Return the key if translation not found
    }
    
    if (typeof value === 'string') {
      // Simple parameter interpolation
      return value.replace(/\{\{(\w+)\}\}/g, (match, param) => {
        return params[param] || match;
      });
    }
    
    if (Array.isArray(value)) {
      return value.join('<br>');
    }
    
    return key;
  }

  /**
   * Change the current language
   * @param {string} lang - Language code ('en' or 'es')
   */
  async changeLanguage(lang) {
    if (!['en', 'es'].includes(lang)) {
      console.error('Unsupported language:', lang);
      return;
    }
    
    this.currentLanguage = lang;
    localStorage.setItem('preferred-language', lang);
    await this.loadTranslations();
    
    // Update the page
    this.updatePage();
    
    // Update URL without page reload
    this.updateURL(lang);
  }

  /**
   * Update the page with new translations
   */
  updatePage() {
    // Update HTML lang attribute
    document.documentElement.lang = this.currentLanguage;
    
    // Update meta tags
    this.updateMetaTags();
    
    // Update all elements with data-i18n attributes
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      const text = this.t(key);
      
      if (element.tagName === 'INPUT' && element.type === 'text') {
        element.placeholder = text;
      } else if (element.tagName === 'INPUT' && element.type === 'email') {
        element.placeholder = text;
      } else if (element.tagName === 'TEXTAREA') {
        element.placeholder = text;
      } else if (element.tagName === 'SELECT') {
        // Handle select options
        if (element.querySelector('option[value=""]')) {
          element.querySelector('option[value=""]').textContent = text;
        }
      } else {
        element.textContent = text;
      }
    });
    
    // Update elements with data-i18n-html attributes (for HTML content)
    document.querySelectorAll('[data-i18n-html]').forEach(element => {
      const key = element.getAttribute('data-i18n-html');
      const value = this.t(key);
      
      if (element.tagName === 'OL' && Array.isArray(this.getTranslationValue(key))) {
        // Handle ordered lists
        const items = this.getTranslationValue(key);
        element.innerHTML = items.map(item => `<li>${item}</li>`).join('');
      } else if (Array.isArray(this.getTranslationValue(key))) {
        // Handle arrays of strings (like discount rules)
        const items = this.getTranslationValue(key);
        element.innerHTML = items.map(item => `<p class="discount-rules-text" style="color: #F4E4BC;">${item}</p>`).join('');
      } else {
        element.innerHTML = value;
      }
    });
    
    // Update elements with data-i18n-attr attributes
    document.querySelectorAll('[data-i18n-attr]').forEach(element => {
      const attrData = element.getAttribute('data-i18n-attr');
      const [attr, key] = attrData.split(':');
      const value = this.t(key);
      element.setAttribute(attr, value);
    });
  }

  /**
   * Update meta tags
   */
  updateMetaTags() {
    // Update title
    document.title = this.t('meta.title');
    
    // Update meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', this.t('meta.description'));
    }
    
    // Update meta keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', this.t('meta.keywords'));
    }
    
    // Update Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', this.t('meta.title'));
    }
    
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) {
      ogDesc.setAttribute('content', this.t('meta.description'));
    }
    
    // Update hreflang links
    this.updateHreflangLinks();
  }

  /**
   * Update hreflang links for SEO
   */
  updateHreflangLinks() {
    // Remove existing hreflang links
    document.querySelectorAll('link[hreflang]').forEach(link => {
      if (link.getAttribute('hreflang') === 'en' || link.getAttribute('hreflang') === 'es') {
        link.remove();
      }
    });
    
    // Add hreflang links
    const head = document.head;
    
    // English link
    const enLink = document.createElement('link');
    enLink.rel = 'alternate';
    enLink.hreflang = 'en';
    enLink.href = this.getLanguageURL('en');
    head.appendChild(enLink);
    
    // Spanish link
    const esLink = document.createElement('link');
    esLink.rel = 'alternate';
    esLink.hreflang = 'es';
    esLink.href = this.getLanguageURL('es');
    head.appendChild(esLink);
  }

  /**
   * Get URL for a specific language
   * @param {string} lang - Language code
   * @returns {string} URL for the language
   */
  getLanguageURL(lang) {
    const currentPath = window.location.pathname;
    const baseURL = window.location.origin;
    
    // Remove existing language prefix
    const pathWithoutLang = currentPath.replace(/^\/(en|es)/, '');
    
    // Add new language prefix
    const newPath = `/${lang}${pathWithoutLang}`;
    
    return `${baseURL}${newPath}`;
  }

  /**
   * Update URL without page reload
   * @param {string} lang - Language code
   */
  updateURL(lang) {
    const newURL = this.getLanguageURL(lang);
    window.history.pushState({}, '', newURL);
  }

  /**
   * Get current language
   * @returns {string} Current language code
   */
  getCurrentLanguage() {
    return this.currentLanguage;
  }

  /**
   * Check if a language is supported
   * @param {string} lang - Language code
   * @returns {boolean} True if supported
   */
  isLanguageSupported(lang) {
    return ['en', 'es'].includes(lang);
  }
}

// Create global instance
window.i18n = new I18n();

// Make t function globally available
window.t = (key, params) => window.i18n.t(key, params);

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = I18n;
}
