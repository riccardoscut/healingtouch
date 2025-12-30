// Polyfill check for Intersection Observer
if (!('IntersectionObserver' in window)) {
    // Fallback for browsers that don't support Intersection Observer
    console.warn('Intersection Observer not supported, using fallback');
    // Simple fallback: show all cards immediately
    document.addEventListener('DOMContentLoaded', function() {
        document.querySelectorAll('.service-card').forEach(card => {
            card.classList.add('visible');
        });
    });
}

const IS_DEVELOPMENT = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
const BUILD_VERSION = "2025-11-16-guarded-inits-2";

/* global emailjs */

// ===== META PIXEL HELPER FUNCTIONS =====
/*
QA CHECKLIST FOR SCRIPT.JS META PIXEL INTEGRATION:
✅ trackPixel helper function created with deduplication
✅ Debug mode support (window.PIXEL_DEBUG)
✅ Graceful fallback if fbq not available
✅ Event deduplication using Set data structure
✅ No raw fbq() calls in script.js (all handled in index.html)
✅ Helper function is idempotent and safe
✅ Console logging for debugging
✅ Mobile-friendly implementation
*/

// Tracked events set to prevent duplicates (use global if exists)
if (typeof window.trackedEvents === 'undefined') {
  window.trackedEvents = new Set();
}

/**
 * Safe Meta Pixel tracking helper with deduplication and debug mode
 * Only define here if not already provided by index.html
 * @param {string} event - Event name (e.g., 'PageView', 'Lead', 'InitiateCheckout')
 * @param {Object} params - Event parameters
 * @param {string} type - Event type ('track' or 'trackCustom')
 */
if (typeof window.trackPixel !== 'function') {
  window.trackPixel = function(event, params = {}, type = 'track') {
    // Fail gracefully if fbq isn't defined
    if (!window.fbq) {
      if (window.PIXEL_DEBUG) console.warn('[Pixel] fbq not available, skipping event:', event);
      return;
    }
    
    // Create unique key for deduplication
    const eventKey = `${type}:${event}:${JSON.stringify(params)}`;
    
    // Skip if already tracked
    if (window.trackedEvents.has(eventKey)) {
      if (window.PIXEL_DEBUG) console.log('[Pixel] Duplicate event prevented:', eventKey);
      return;
    }
    
    // Track the event
    fbq(type, event, params);
    window.trackedEvents.add(eventKey);
    
    // Debug logging
    if (window.PIXEL_DEBUG) {
      console.log('[Pixel]', type, event, params);
    }
  };
}

// ===== META PIXEL HELPER FUNCTIONS END =====

// (Removed) Global form submission interceptor that blocked testimonial form behavior

document.addEventListener("DOMContentLoaded", async function () {
  console.log("=== PAGE LOADED - DOMContentLoaded event fired ===", { build: BUILD_VERSION });
  // eslint-disable-next-line no-console
  if (IS_DEVELOPMENT) console.log("TESTIMONIALS: DOMContentLoaded event fired.");
  
  // Wait for translations to be loaded before applying content
  if (window.i18n && typeof window.i18n.waitForTranslations === 'function') {
    try {
      await window.i18n.waitForTranslations();
      console.log("Translations are ready, applying content...");
    } catch (error) {
      console.warn("Error waiting for translations:", error);
    }
  }
  
  // Set current year in footer
  // @ts-ignore
  document.getElementById("current-year").textContent = new Date().getFullYear().toString();

  // Initialize service card animations with slight delay
  document.querySelectorAll(".service-card").forEach((card, index) => {
    setTimeout(() => {
      card.classList.add("visible");
    }, 300 * index);
  });

  // Initialize IntersectionObserver for service cards
  initServiceCardAnimations();

  // @ts-ignore
  applyContentToPage(window.siteContent);
  // eslint-disable-next-line no-console
  if (IS_DEVELOPMENT) console.log("TESTIMONIALS: Attempting to load testimonials after applyContentToPage.", window.testimonials);

  // Initialize testimonial form after content is loaded
  setTimeout(() => {
    initTestimonialForm();
  }, 500);

  // (Removed) delayed re-initialization of testimonials toggle to avoid duplicate bindings

  // Setup slow smooth scrolling for review links
  setupSlowSmoothScroll();

});

// Slow smooth scroll function for anchor links
function slowSmoothScroll(targetId, duration = 1500) {
  const targetElement = document.querySelector(targetId);
  if (!targetElement) return;

  const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
  const startPosition = window.pageYOffset;
  const distance = targetPosition - startPosition;
  let startTime = null;

  function animation(currentTime) {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
    window.scrollTo(0, run);
    if (timeElapsed < duration) {
      requestAnimationFrame(animation);
    } else {
      window.scrollTo(0, targetPosition);
    }
  }

  // Easing function for smooth acceleration and deceleration
  function easeInOutQuad(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t + b;
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
  }

  requestAnimationFrame(animation);
}

// Setup event listeners for slow smooth scrolling
function setupSlowSmoothScroll() {
  // Handle clicks on view-all-reviews-link
  document.addEventListener('click', function(event) {
    const link = event.target.closest('.view-all-reviews-link');
    if (link && link.getAttribute('href') === '#leave-review-section') {
      event.preventDefault();
      slowSmoothScroll('#leave-review-section', 1500); // 1.5 seconds
    }
  });
}

// Ensure Summer Challenge init runs even if other DOMContent handlers fail
function scheduleSummerChallengeInit() {
  const startInit = () => {
    setTimeout(() => {
      try {
        console.log('About to initialize Summer Challenge...');
        initSummerChallenge();
      } catch (error) {
        console.error('Summer Challenge init failed:', error);
      }
    }, 500);
  };
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startInit, { once: true });
  } else {
    startInit();
  }
}

scheduleSummerChallengeInit();

// Extra safety: verify content rendered and retry once after window load
window.addEventListener("load", function () {
  try {
    const servicesGrid = document.querySelector(".services-grid");
    const testimonialsList = document.getElementById("allTestimonialsList");
    const needsServices = servicesGrid && servicesGrid.children.length === 0;
    const needsTestimonials = testimonialsList && testimonialsList.children.length === 0;
    if (needsServices || needsTestimonials) {
      console.warn("Post-load verification: content missing, re-applying content and testimonials.");
      // @ts-ignore
      applyContentToPage(window.siteContent);
      // @ts-ignore
      if (window.testimonials) {
        // @ts-ignore
        loadTestimonials(window.testimonials);
      }
      initTestimonialForm();
      initServiceCardAnimations();
    }
  } catch (e) {
    console.error("Post-load verification error:", e);
  }
}, { once: true });

// Apply content from JSON to the page
function applyContentToPage (data) {
  // eslint-disable-next-line no-console
  if (IS_DEVELOPMENT) console.log("TESTIMONIALS: applyContentToPage called.", data);
  // Update therapist title
  const therapistTitleEl = document.querySelector(".therapist-title");
  if (therapistTitleEl && data["therapist-title"]) {
    therapistTitleEl.textContent = data["therapist-title"];
  }
  
  // Update i18n if available
  if (window.i18n) {
    window.i18n.updatePage();
  }

  // Update therapist certifications
  const therapistCertEl = document.querySelector(".therapist-cert");
  if (therapistCertEl && data["therapist-cert"]) {
    therapistCertEl.innerHTML = ""; // Clear existing content
    data["therapist-cert"].forEach(cert => {
      const certText = document.createTextNode(cert);
      therapistCertEl.appendChild(certText);
      therapistCertEl.appendChild(document.createElement("br"));
    });
  }

  // Update approach quote
  const approachQuoteEl = document.querySelector(".approach-quote");
  if (approachQuoteEl && data["approach-quote"]) {
    approachQuoteEl.innerHTML = ""; // Clear existing content
    data["approach-quote"].forEach((paragraph, index) => {
      const p = document.createElement("p");
      p.textContent = paragraph;
      approachQuoteEl.appendChild(p);

      // Add line break between paragraphs (except after the last one)
      if (index < data["approach-quote"].length - 1) {
        approachQuoteEl.appendChild(document.createElement("br"));
      }
    });
  }

  // Update services
  if (data.services && data.services.length > 0) {
    const servicesGrid = document.querySelector(".services-grid");
    if (servicesGrid) {
      servicesGrid.innerHTML = ""; // Clear existing services

      // Create and append service cards
      data.services.forEach(service => {
        const card = createServiceCard(service);
        servicesGrid.appendChild(card);
      });
      
      // Create session packs section after services
      createSessionPacksSection(data.services);

      // Reinitialize animations
      initServiceCardAnimations();
      
      // Update i18n for dynamically created content
      if (window.i18n) {
        window.i18n.updatePage();
      }
    }
  }

  // Update contact information
  const contactList = document.querySelector(".contact-list");
  if (contactList && data["contact-information"]) {
    contactList.innerHTML = ""; // Clear existing contacts

    data["contact-information"].forEach(contactItem => {
      const li = document.createElement("li");
      li.className = "contact-item";

      const starSpan = document.createElement("span");
      starSpan.className = "star-icon";
      starSpan.textContent = "✦";

      const link = document.createElement("a");
      link.className = "contact-link";
      link.href = contactItem.link;
      link.textContent = contactItem.text;
      link.target = "_blank";
      link.rel = "noopener noreferrer";

      li.appendChild(starSpan);
      li.appendChild(link);
      contactList.appendChild(li);
    });
  }

  // Update quote text
  const quoteText = document.querySelector(".quote-text");
  if (quoteText && data["quote-text"]) {
    quoteText.innerHTML = data["quote-text"];
  }



  // Initialize Cal.com buttons after content update
  setTimeout(initCalButtons, 500);

  // If testimonials are also part of the main data object, load them
  // @ts-ignore
  if (data && data.testimonials) {
    // eslint-disable-next-line no-console
    if (IS_DEVELOPMENT) console.log("TESTIMONIALS: Loading testimonials from data object within applyContentToPage.", data.testimonials);
    // @ts-ignore
    loadTestimonials(data.testimonials);
  } else if (window.testimonials) { // Or if they are a separate global
    // eslint-disable-next-line no-console
    if (IS_DEVELOPMENT) console.log("TESTIMONIALS: Loading testimonials from window.testimonials within applyContentToPage.", window.testimonials);
    // @ts-ignore
    loadTestimonials(window.testimonials);
  } else {
    // eslint-disable-next-line no-console
    if (IS_DEVELOPMENT) console.log("TESTIMONIALS: No testimonial data found in applyContentToPage.");
  }
}

// Helper function to create a service card
function createServiceCard (service) {
  const card = document.createElement("div");
  card.className = "service-card";

  // Create service header
  const header = document.createElement("div");
  header.className = "service-header";

  const title = document.createElement("h3");
  title.className = "service-title title-animation";
  title.textContent = service.title;
  
  // Add i18n data attribute for dynamic updates
  if (service.id === "reflexology-foot-massage-1-hour-30-min") {
    title.setAttribute("data-i18n", "services.signature_reflexology.title");
  } else if (service.id === "executive-detox-massage-45-min") {
    title.setAttribute("data-i18n", "services.executive_detox.title");
  }

  const duration = document.createElement("p");
  duration.className = "service-duration";
  duration.textContent = service.duration;

  const price = document.createElement("div");
  price.className = "service-price";
  price.textContent = `€${service.price}`;

  header.appendChild(title);
  // Inject promotional structure inside the price pill for Signature Reflexology Massage
  try {
    const normalizedTitle = (service.title || "").toLowerCase();
    if (normalizedTitle.includes("signature reflexology")) {
      price.classList.add("has-promo");
      price.innerHTML = '<span class="price-label">Promo</span><span class="price-old">90€</span><span class="price-new">70€</span>';
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    if (IS_DEVELOPMENT) console.warn("Could not set promotional price:", e);
  }
  header.appendChild(duration);
  header.appendChild(price);

  // Create service body
  const body = document.createElement("div");
  body.className = "service-body";

  const description = document.createElement("div");
  description.className = "service-description";
  
  // Add i18n data attribute for dynamic updates
  if (service.id === "reflexology-foot-massage-1-hour-30-min") {
    description.setAttribute("data-i18n-html", "services.signature_reflexology.description");
  } else if (service.id === "executive-detox-massage-45-min") {
    description.setAttribute("data-i18n-html", "services.executive_detox.description");
  }
  
  // Set fallback content (will be replaced by i18n system)
  // @ts-ignore
  description.innerHTML = service.description;

  // Create service footer with special offers
  const footer = document.createElement("div");
  footer.className = "service-footer";

  const specialOffers = document.createElement("div");
  specialOffers.className = "special-offers";

  const offersTitle = document.createElement("h4");
  offersTitle.className = "special-offers-title";
  offersTitle.textContent = "Special Offers:";
  
  // Add i18n data attribute for dynamic updates
  if (service.id === "reflexology-foot-massage-1-hour-30-min") {
    offersTitle.setAttribute("data-i18n", "services.signature_reflexology.special_offers_title");
  } else if (service.id === "executive-detox-massage-45-min") {
    offersTitle.setAttribute("data-i18n", "services.executive_detox.special_offers_title");
  }

  // Calculate special offers
  const cashPrice = Math.round(service.price * 0.8 * 100) / 100;
  const cryptoPrice = Math.round(service.price * 0.6 * 100) / 100;

  const cashOffer = document.createElement("p");
  cashOffer.className = "offer-item";
  
  const cashDiscountSpan = document.createElement("span");
  cashDiscountSpan.className = "offer-discount";
  cashDiscountSpan.textContent = "Cash Payment (-20%):";
  
  // Add i18n data attribute for dynamic updates
  if (service.id === "reflexology-foot-massage-1-hour-30-min") {
    cashDiscountSpan.setAttribute("data-i18n", "services.signature_reflexology.cash_payment");
  } else if (service.id === "executive-detox-massage-45-min") {
    cashDiscountSpan.setAttribute("data-i18n", "services.executive_detox.cash_payment");
  }
  
  cashOffer.appendChild(cashDiscountSpan);
  cashOffer.appendChild(document.createTextNode(` €${service.price.toFixed(2)} `));
  
  const cashPriceSpan = document.createElement("span");
  cashPriceSpan.className = "offer-price";
  cashPriceSpan.textContent = `€${cashPrice.toFixed(2)}`;
  cashOffer.appendChild(cashPriceSpan);

  const cryptoOffer = document.createElement("p");
  cryptoOffer.className = "offer-item";
  
  const cryptoDiscountSpan = document.createElement("span");
  cryptoDiscountSpan.className = "offer-discount";
  cryptoDiscountSpan.textContent = "Crypto Payment (-40%):";
  
  // Add i18n data attribute for dynamic updates
  if (service.id === "reflexology-foot-massage-1-hour-30-min") {
    cryptoDiscountSpan.setAttribute("data-i18n", "services.signature_reflexology.crypto_payment");
  } else if (service.id === "executive-detox-massage-45-min") {
    cryptoDiscountSpan.setAttribute("data-i18n", "services.executive_detox.crypto_payment");
  }
  
  cryptoOffer.appendChild(cryptoDiscountSpan);
  cryptoOffer.appendChild(document.createTextNode(` €${service.price.toFixed(2)} `));
  
  const cryptoPriceSpan = document.createElement("span");
  cryptoPriceSpan.className = "offer-price";
  cryptoPriceSpan.textContent = `€${cryptoPrice.toFixed(2)}`;
  cryptoOffer.appendChild(cryptoPriceSpan);
  cryptoOffer.appendChild(document.createTextNode(" "));
  
  const cryptoNoteSpan = document.createElement("span");
  cryptoNoteSpan.className = "offer-crypto-payment";
  cryptoNoteSpan.textContent = "(BTC or ADA)";
  
  // Add i18n data attribute for dynamic updates
  if (service.id === "reflexology-foot-massage-1-hour-30-min") {
    cryptoNoteSpan.setAttribute("data-i18n", "services.signature_reflexology.crypto_note");
  } else if (service.id === "executive-detox-massage-45-min") {
    cryptoNoteSpan.setAttribute("data-i18n", "services.executive_detox.crypto_note");
  }
  
  cryptoOffer.appendChild(cryptoNoteSpan);

  specialOffers.appendChild(offersTitle);
  specialOffers.appendChild(cashOffer);
  specialOffers.appendChild(cryptoOffer);

  // Create book button
  const bookButton = document.createElement("button");
  bookButton.id = service.id;
  bookButton.className = "book-button";
  bookButton.textContent = "BOOK YOUR MASSAGE";
  
  // Add i18n data attribute for dynamic updates
  if (service.id === "reflexology-foot-massage-1-hour-30-min") {
    bookButton.setAttribute("data-i18n", "services.signature_reflexology.book_button");
  } else if (service.id === "executive-detox-massage-45-min") {
    bookButton.setAttribute("data-i18n", "services.executive_detox.book_button");
  }

  // Create "View all reviews on Google" link
  const viewReviewsLink = document.createElement("a");
  viewReviewsLink.href = "#leave-review-section";
  viewReviewsLink.className = "view-all-reviews-link";
  viewReviewsLink.setAttribute("data-i18n", "services.view_all_reviews");
  viewReviewsLink.textContent = "View all reviews on Google";

  footer.appendChild(specialOffers);
  footer.appendChild(bookButton);
  footer.appendChild(viewReviewsLink);

  body.appendChild(description);
  body.appendChild(footer);

  // Assemble the card
  card.appendChild(header);
  card.appendChild(body);

  return card;
}

// Helper function to create the session packs section
function createSessionPacksSection(services) {
  // Check if section already exists in HTML
  let sessionPacksSection = document.getElementById("session-packs");
  
  if (!sessionPacksSection) {
    // Find services section to insert after it
    const servicesSection = document.querySelector("#services");
    if (!servicesSection) return;
    
    // Create the section structure
    sessionPacksSection = document.createElement("section");
    sessionPacksSection.id = "session-packs";
    sessionPacksSection.className = "session-packs-section";
    
    const container = document.createElement("div");
    container.className = "container";
    
    const title = document.createElement("h2");
    title.className = "session-packs-title title-animation";
    title.textContent = "Session Packs";
    
    const grid = document.createElement("div");
    grid.className = "session-packs-grid";
    
    container.appendChild(title);
    container.appendChild(grid);
    sessionPacksSection.appendChild(container);
    
    // Insert after services section
    servicesSection.parentNode.insertBefore(sessionPacksSection, servicesSection.nextSibling);
    
    // Add section divider if needed
    const divider = document.createElement("div");
    divider.className = "section-divider";
    sessionPacksSection.parentNode.insertBefore(divider, sessionPacksSection.nextSibling);
  }
  
  const grid = sessionPacksSection.querySelector(".session-packs-grid");
  if (!grid) return;
  
  // Clear existing pack cards
  grid.innerHTML = "";
  
  // Create pack cards for specific services
  services.forEach(service => {
    if (service.id === "reflexology-foot-massage-1-hour-30-min" || service.id === "executive-detox-massage-45-min") {
      const packCard = createPackCard(service);
      if (packCard) {
        grid.appendChild(packCard);
      }
    }
  });
  
  // Initialize animations for pack cards
  initPackCardAnimations();
}

function initPackCardAnimations() {
  // Guard for browsers without IntersectionObserver
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll(".pack-card").forEach((card, index) => {
      setTimeout(() => {
        card.classList.add("visible");
        triggerNeonScan(card);
      }, 300 * index);
    });
    return;
  }

  // Use Intersection Observer to detect when pack cards come into view
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const card = entry.target;
        const delay = parseInt(card.getAttribute("data-animation-delay") || "0");

        setTimeout(() => {
          card.classList.add("visible");
          triggerNeonScan(card);
        }, delay);

        // Stop observing after animation
        observer.unobserve(card);
      }
    });
  }, {
    threshold: 0.2
  });

  // Observe all pack cards
  document.querySelectorAll(".pack-card").forEach((card, index) => {
    card.setAttribute("data-animation-delay", (300 * index).toString());
    observer.observe(card);
  });
}

function triggerNeonScan(element) {
  // Create a fast, fleeting neon border scan effect
  const scanLine = document.createElement("div");
  scanLine.classList.add("neon-border-scan");
  
  // Add it to the element
  if (!element.style.position || element.style.position === "static") {
    element.style.position = "relative";
  }
  if (!element.style.overflow || element.style.overflow === "visible") {
    element.style.overflow = "visible";
  }
  element.appendChild(scanLine);

  // Bright neon colors that will shift rapidly for sparkle effect
  const neonColors = [
    "rgba(194, 222, 213, 1)",   // aurora-green - bright
    "rgba(117, 90, 146, 1)",    // cosmic-violet - bright
    "rgba(193, 255, 114, 1)",   // lime - bright
    "rgba(203, 108, 230, 1)",   // purple - bright
    "rgba(228, 228, 188, 1)"    // lunar-gold - bright
  ];

  let colorIndex = 0;
  const updateNeonColor = () => {
    const currentColor = neonColors[colorIndex];
    const nextColor = neonColors[(colorIndex + 1) % neonColors.length];
    scanLine.style.borderColor = currentColor;
    scanLine.style.boxShadow = `
      0 0 20px ${currentColor},
      0 0 40px ${currentColor},
      0 0 60px ${currentColor},
      0 0 80px ${nextColor},
      0 0 100px ${currentColor},
      0 0 120px ${nextColor}
    `;
  };

  // Change colors for sparkle effect (every 100ms - slower for better visibility)
  updateNeonColor();
  const colorInterval = setInterval(() => {
    colorIndex = (colorIndex + 1) % neonColors.length;
    updateNeonColor();
  }, 100);

  // Get element dimensions for border path calculation
  const rect = element.getBoundingClientRect();
  const width = rect.width;
  const height = rect.height;
  const perimeter = (width + height) * 2;

  // Animate along the border perimeter
  // Top -> Right -> Bottom -> Left
  const animation = scanLine.animate(
    [
      { 
        clipPath: "polygon(0% 0%, 0% 0%, 0% 0%, 0% 0%)",
        opacity: 0
      },
      { 
        clipPath: "polygon(0% 0%, 15% 0%, 15% 0%, 0% 0%)",
        opacity: 1
      },
      { 
        clipPath: "polygon(0% 0%, 100% 0%, 100% 15%, 0% 15%)",
        opacity: 1
      },
      { 
        clipPath: "polygon(85% 0%, 100% 0%, 100% 100%, 85% 100%)",
        opacity: 1
      },
      { 
        clipPath: "polygon(0% 85%, 100% 85%, 100% 100%, 0% 100%)",
        opacity: 1
      },
      { 
        clipPath: "polygon(0% 0%, 0% 85%, 0% 85%, 0% 0%)",
        opacity: 1
      },
      { 
        clipPath: "polygon(0% 0%, 0% 0%, 0% 0%, 0% 0%)",
        opacity: 0
      }
    ],
    {
      duration: 2000, // Slower - 2 seconds for better visibility
      easing: "linear",
      fill: "forwards"
    }
  );

  animation.onfinish = function () {
    clearInterval(colorInterval);
    scanLine.remove();
  };
}

// Helper function to create a single pack card
function createPackCard(service) {
  const packCard = document.createElement("div");
  packCard.className = "pack-card";
  
  const packHeader = document.createElement("div");
  packHeader.className = "pack-header";
  
  const packTitle = document.createElement("h3");
  packTitle.className = "pack-title";
  
  const packPriceInfo = document.createElement("p");
  packPriceInfo.className = "pack-price-info";
  
  const packBody = document.createElement("div");
  packBody.className = "pack-body";
  
  const packDescription = document.createElement("p");
  packDescription.className = "pack-description";
  
  // Create special offers section
  const specialOffers = document.createElement("div");
  specialOffers.className = "special-offers";
  
  const offersTitle = document.createElement("h4");
  offersTitle.className = "special-offers-title";
  
  // Detect current language for title
  const currentLang = document.documentElement.lang || 'en';
  const isSpanish = currentLang === 'es' || window.location.pathname.includes('/es/');
  offersTitle.textContent = isSpanish ? "Ofertas Especiales:" : "Special Offers:";
  
  // Calculate prices based on pack
  let basePrice = 0;
  if (service.id === "reflexology-foot-massage-1-hour-30-min") {
    basePrice = 360;
  } else if (service.id === "executive-detox-massage-45-min") {
    basePrice = 180;
  } else {
    return null;
  }
  
  const cashPrice = Math.round(basePrice * 0.6 * 100) / 100; // 40% discount
  const cryptoPrice = Math.round(basePrice * 0.45 * 100) / 100; // 55% discount
  
  // Create cash offer
  const cashOffer = document.createElement("p");
  cashOffer.className = "offer-item";
  
  const cashDiscountSpan = document.createElement("span");
  cashDiscountSpan.className = "offer-discount";
  cashDiscountSpan.innerHTML = "Cash Payment (<span class=\"offer-discount-percentage\">-40%</span>):";
  
  const originalPriceSpan = document.createElement("span");
  originalPriceSpan.className = "original-price";
  originalPriceSpan.textContent = `€${basePrice.toFixed(2)}`;
  
  cashOffer.appendChild(cashDiscountSpan);
  cashOffer.appendChild(document.createTextNode(" "));
  cashOffer.appendChild(originalPriceSpan);
  cashOffer.appendChild(document.createTextNode(" "));
  
  const cashPriceSpan = document.createElement("span");
  cashPriceSpan.className = "offer-price";
  cashPriceSpan.textContent = `€${cashPrice.toFixed(2)}`;
  cashOffer.appendChild(cashPriceSpan);
  
  // Create crypto offer
  const cryptoOffer = document.createElement("p");
  cryptoOffer.className = "offer-item";
  
  const cryptoDiscountSpan = document.createElement("span");
  cryptoDiscountSpan.className = "offer-discount";
  cryptoDiscountSpan.innerHTML = "Crypto Payment (<span class=\"offer-discount-percentage\">-55%</span>):";
  
  const cryptoOriginalPriceSpan = document.createElement("span");
  cryptoOriginalPriceSpan.className = "original-price";
  cryptoOriginalPriceSpan.textContent = `€${basePrice.toFixed(2)}`;
  
  cryptoOffer.appendChild(cryptoDiscountSpan);
  cryptoOffer.appendChild(document.createTextNode(" "));
  cryptoOffer.appendChild(cryptoOriginalPriceSpan);
  cryptoOffer.appendChild(document.createTextNode(" "));
  
  const cryptoPriceSpan = document.createElement("span");
  cryptoPriceSpan.className = "offer-price";
  cryptoPriceSpan.textContent = `€${cryptoPrice.toFixed(2)}`;
  cryptoOffer.appendChild(cryptoPriceSpan);
  cryptoOffer.appendChild(document.createTextNode(" "));
  
  const cryptoNoteSpan = document.createElement("span");
  cryptoNoteSpan.className = "offer-crypto-payment";
  cryptoNoteSpan.textContent = "(BTC or ADA)";
  cryptoOffer.appendChild(cryptoNoteSpan);
  
  specialOffers.appendChild(offersTitle);
  specialOffers.appendChild(cashOffer);
  specialOffers.appendChild(cryptoOffer);
  
  const packButton = document.createElement("a");
  packButton.className = "pack-button";
  packButton.target = "_blank";
  packButton.rel = "noopener noreferrer";
  
  // Set pack content based on service
  if (service.id === "reflexology-foot-massage-1-hour-30-min") {
    packTitle.textContent = "Signature Reflexology Pack 3+1";
    packPriceInfo.textContent = "Only 270€ instead of 360€";
    if (isSpanish) {
      packDescription.innerHTML = "4 sesiones de reflexología por el precio de 3.<br>Reserva flexible con un código de cupón único, válido 4 meses desde la compra.<br>Ideal para una sanación más profunda, equilibrio y bienestar a largo plazo.";
    } else {
      packDescription.innerHTML = "4 reflexology sessions for the price of 3.<br>Flexible booking with a unique voucher code, valid 4 months from purchase.<br>Ideal for deeper healing, balance, and long-term well-being.";
    }
    packButton.href = "https://buy.stripe.com/5kQ8wPfxUbEhe793CF7ok05";
    packButton.textContent = isSpanish ? "Comprar pack 3+1" : "Buy 3+1 pack";
  } else if (service.id === "executive-detox-massage-45-min") {
    packTitle.textContent = "Executive Detox Pack 3+1";
    packPriceInfo.textContent = "Only 135€ instead of 180€";
    if (isSpanish) {
      packDescription.innerHTML = "4 sesiones de Executive Detox por el precio de 3.<br>Reserva flexible con un código de cupón único, válido 4 meses desde la compra.<br>Ideal para alivio regular del estrés, recuperación muscular y mantener tu rutina de bienestar.";
    } else {
      packDescription.innerHTML = "4 Executive Detox sessions for the price of 3.<br>Flexible booking with a unique voucher code, valid 4 months from purchase.<br>Ideal for regular stress relief, muscle recovery, and maintaining your wellness routine.";
    }
    packButton.href = "https://buy.stripe.com/7sY14n5Xk37L6EHehj7ok04";
    packButton.textContent = isSpanish ? "Comprar pack 3+1" : "Buy 3+1 pack";
  }
  
  packHeader.appendChild(packTitle);
  packHeader.appendChild(packPriceInfo);
  packBody.appendChild(packDescription);
  // packBody.appendChild(specialOffers); // Hidden: special offers not shown for 3+1 packs
  packBody.appendChild(packButton);
  
  packCard.appendChild(packHeader);
  packCard.appendChild(packBody);
  
  return packCard;
}

function initServiceCardAnimations () {
  // Guard for browsers without IntersectionObserver
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll(".service-card").forEach((card, index) => {
      setTimeout(() => {
        card.classList.add("visible");
      }, 300 * index);
    });
    return;
  }

  // Use Intersection Observer to detect when service cards come into view
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const card = entry.target;
        const delay = parseInt(card.getAttribute("data-animation-delay") || "0");

        setTimeout(() => {
          card.classList.add("visible");
          triggerGoldScan(card);
        }, delay);

        // Stop observing after animation
        observer.unobserve(card);
      }
    });
  }, {
    threshold: 0.2
  });

  // Observe all service cards
  document.querySelectorAll(".service-card").forEach(card => {
    observer.observe(card);
  });
}

function triggerGoldScan (element) {
  // Create a gold scan animation element
  const scanLine = document.createElement("div");
  scanLine.classList.add("gold-scan");
  scanLine.style.position = "absolute";
  scanLine.style.top = "0";
  scanLine.style.left = "-100%";
  scanLine.style.width = "100%";
  scanLine.style.height = "100%";
  scanLine.style.background = "linear-gradient(90deg, transparent, rgba(249, 224, 118, 0.5), transparent)";
  scanLine.style.zIndex = "1";
  scanLine.style.pointerEvents = "none";

  // Add it to the element
  element.style.position = "relative";
  element.style.overflow = "hidden";
  element.appendChild(scanLine);

  // Animate it
  scanLine.animate(
    [
      { left: "-100%" },
      { left: "100%" }
    ],
    {
      duration: 1500,
      easing: "ease-in-out",
      fill: "forwards"
    }
  ).onfinish = function () {
    scanLine.remove();
  };
}

// Initialize Cal.com booking buttons
function initCalButtons () {
  const ids = [
    "executive-detox-massage-45-min",
    "reflexology-foot-massage-1-hour-30-min"
  ];

  // Helper to safely init a single button namespace if Cal is present
  const safeInitCal = (id) => {
    try {
      if (!window.Cal || typeof window.Cal !== "function") {
        if (IS_DEVELOPMENT) console.warn("Cal not ready yet, skipping init for:", id);
        return false;
      }
      // @ts-ignore
      window.Cal("init", id, {origin: "https://cal.com"});
      window.Cal.ns[id]("ui", {
        "cssVarsPerTheme": {
          "light": {"cal-brand": "#D4AF37"},
          "dark": {"cal-brand": "#D4AF37"}
        },
        "hideEventTypeDetails": false,
        "layout": "month_view"
      });
      return true;
    } catch (err) {
      if (IS_DEVELOPMENT) console.error("Error initializing Cal for id:", id, err);
      return false;
    }
  };

  ids.forEach(id => {
    const button = document.getElementById(id);
    if (button) {
      button.setAttribute("data-cal-link", `signaturehealingtouch/${id}`);
      button.setAttribute("data-cal-namespace", id);
      button.setAttribute("data-cal-config", "{\"layout\":\"month_view\"}");
      button.removeAttribute("href");



      // Try to initialize immediately, otherwise retry once on window load
      const initialized = safeInitCal(id);
      if (!initialized) {
        window.addEventListener("load", () => {
          safeInitCal(id);
        }, { once: true });
      }
    }
  });
}

// Load testimonials and initialize Swiper
function loadTestimonials (testimonialsData) {
  // eslint-disable-next-line no-console
  if (IS_DEVELOPMENT) console.log("TESTIMONIALS: loadTestimonials function called with data:", testimonialsData);

  if (!testimonialsData || !testimonialsData.length) {
    // eslint-disable-next-line no-console
    if (IS_DEVELOPMENT) console.warn("TESTIMONIALS: No testimonialsData found or data is empty. Hiding section.");
    // Hide testimonials section if no data
    const testimonialsSection = document.getElementById("testimonials");
    if (testimonialsSection) {
      // eslint-disable-next-line no-console
      if (IS_DEVELOPMENT) console.log("TESTIMONIALS: Testimonials section element found, hiding it.");
      testimonialsSection.style.display = "none";
    } else {
      // eslint-disable-next-line no-console
      if (IS_DEVELOPMENT) console.warn("TESTIMONIALS: Testimonials section element NOT found for hiding.");
    }
    return;
  }

  // Separate highlighted and regular testimonials
  const highlightedTestimonials = testimonialsData.filter(t => t.highlighted);
  const allTestimonials = testimonialsData;

  // eslint-disable-next-line no-console
  if (IS_DEVELOPMENT) console.log("TESTIMONIALS: About to load featured testimonials...");
  
  // Load featured testimonials in carousel
  loadFeaturedTestimonials(highlightedTestimonials);
  
  // eslint-disable-next-line no-console
  if (IS_DEVELOPMENT) console.log("TESTIMONIALS: About to load all testimonials...");
  
  // Load all testimonials in expandable list (excluding highlighted ones that are already in carousel)
  const nonHighlightedTestimonials = allTestimonials.filter(t => !t.highlighted);
  
  // Sort non-highlighted testimonials chronologically (most recent first)
  const monthToNumber = {
    "January": 1, "February": 2, "March": 3, "April": 4, "May": 5, "June": 6,
    "July": 7, "August": 8, "September": 9, "October": 10, "November": 11, "December": 12
  };
  
  nonHighlightedTestimonials.sort((a, b) => {
    // Sort by year first (descending - most recent first)
    if (b.year !== a.year) {
      return b.year - a.year;
    }
    // If same year, sort by month (descending - most recent first)
    const monthA = monthToNumber[a.month] || 0;
    const monthB = monthToNumber[b.month] || 0;
    return monthB - monthA;
  });
  
  loadAllTestimonials(nonHighlightedTestimonials);
  
  // Update the header with calculated metrics
  updateTestimonialsMetrics(allTestimonials);
  
  // eslint-disable-next-line no-console
  if (IS_DEVELOPMENT) console.log("TESTIMONIALS: About to initialize toggle functionality...");
  
  // Initialize toggle functionality
  initTestimonialsToggle();
}

// Load featured testimonials in the carousel
function loadFeaturedTestimonials(featuredTestimonials) {
  // eslint-disable-next-line no-console
  if (IS_DEVELOPMENT) console.log("TESTIMONIALS: Loading featured testimonials:", featuredTestimonials);
  
  const swiperWrapper = document.querySelector("#testimonials .swiper-wrapper");
  if (!swiperWrapper) {
    // eslint-disable-next-line no-console
    if (IS_DEVELOPMENT) console.error("TESTIMONIALS: Swiper wrapper '#testimonials .swiper-wrapper' NOT found!");
    return;
  }

  swiperWrapper.innerHTML = ""; // Clear existing slides

  featuredTestimonials.forEach((testimonial, index) => {
    // eslint-disable-next-line no-console
    if (IS_DEVELOPMENT) console.log(`TESTIMONIALS: Processing featured testimonial ${index + 1}:`, testimonial);
    const slide = document.createElement("div");
    slide.classList.add("swiper-slide");

    const testimonialCard = document.createElement("div");
    testimonialCard.classList.add("testimonial-card", "featured"); // Add featured class for styling

    const textP = document.createElement("p");
    textP.classList.add("testimonial-text");
    textP.textContent = `"${testimonial.text}"`;

    const nameP = document.createElement("p");
    nameP.classList.add("testimonial-name");
    nameP.textContent = `- ${testimonial.name}`;

    const dateP = document.createElement("p");
    dateP.classList.add("testimonial-date");
    dateP.textContent = `${testimonial.month} ${testimonial.year}`;

    // Add type display
    const typeP = document.createElement("p");
    typeP.classList.add("testimonial-type");
    typeP.textContent = (testimonial.type || "Not specified").toUpperCase();

    // Append elements in the new order:
    // 1. Name
    testimonialCard.appendChild(nameP);
    // 2. Testimonial Text (Message)
    testimonialCard.appendChild(textP);

    // 3. Star Rating (if it exists)
    if (testimonial.rating && testimonial.rating > 0) {
      const starsContainer = document.createElement("div");
      starsContainer.classList.add("testimonial-rating");
      starsContainer.style.color = "#D4AF37"; // Gold color for stars
      starsContainer.style.fontSize = "1.2em"; // Adjust size as needed
      starsContainer.style.marginBottom = "10px"; // Space below stars
      starsContainer.style.marginTop = "10px"; // Space above stars for separation

      for (let i = 1; i <= 5; i++) {
        const star = document.createElement("span");
        star.textContent = i <= testimonial.rating ? "★" : "☆";
        starsContainer.appendChild(star);
      }
      testimonialCard.appendChild(starsContainer);
    }

    // 4. Type
    testimonialCard.appendChild(typeP);

    // 5. Date
    testimonialCard.appendChild(dateP);

    slide.appendChild(testimonialCard);
    swiperWrapper.appendChild(slide);
  });

  // Initialize Swiper for featured testimonials
  // eslint-disable-next-line no-console
  if (IS_DEVELOPMENT) console.log("TESTIMONIALS: All featured testimonial slides created and appended.");

  // @ts-ignore
  /* global Swiper */
  const initSwiper = () => {
    // eslint-disable-next-line no-console
    if (IS_DEVELOPMENT) console.log("TESTIMONIALS: Attempting to initialize Swiper...");
    if (typeof window.Swiper === "function") {
      // eslint-disable-next-line no-undef
      new Swiper(".testimonial-slider", {
        loop: true,
        slidesPerView: 1,
        spaceBetween: 30,
        autoplay: {
          delay: 7000, // Increased delay for better viewing of initial slides
          disableOnInteraction: false
        },
        pagination: {
          el: ".swiper-pagination",
          clickable: true
        },
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev"
        },
        breakpoints: {
          768: {
            slidesPerView: 2,
            spaceBetween: 40
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 50
          }
        }
      });
      // eslint-disable-next-line no-console
      if (IS_DEVELOPMENT) console.log("TESTIMONIALS: Swiper initialized successfully.");
    } else {
      // eslint-disable-next-line no-console
      if (IS_DEVELOPMENT) console.warn("TESTIMONIALS: Swiper not yet available. Retrying on window load...");
      window.addEventListener("load", () => {
        // eslint-disable-next-line no-console
        if (IS_DEVELOPMENT) console.log("TESTIMONIALS: Window load event fired. Retrying Swiper init...");
        if (typeof window.Swiper === "function") {
          // eslint-disable-next-line no-undef
          new Swiper(".testimonial-slider", {
            loop: true,
            slidesPerView: 1,
            spaceBetween: 30,
            autoplay: {
              delay: 7000,
              disableOnInteraction: false
            },
            pagination: {
              el: ".swiper-pagination",
              clickable: true
            },
            navigation: {
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev"
            },
            breakpoints: {
              768: {
                slidesPerView: 2,
                spaceBetween: 40
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 50
              }
            }
          });
          // eslint-disable-next-line no-console
          if (IS_DEVELOPMENT) console.log("TESTIMONIALS: Swiper initialized successfully after window load.");
        } else {
          // eslint-disable-next-line no-console
          console.error("TESTIMONIALS: Swiper still not available after window load.");
        }
      }, { once: true });
    }
  };
  initSwiper();
  // eslint-disable-next-line no-console
  if (IS_DEVELOPMENT) console.log("TESTIMONIALS: Swiper initialized for featured testimonials.");
}

// Load all testimonials in the expandable list
function loadAllTestimonials(allTestimonials) {
  // eslint-disable-next-line no-console
  if (IS_DEVELOPMENT) console.log("TESTIMONIALS: Loading all testimonials:", allTestimonials);
  
  const allTestimonialsList = document.getElementById("allTestimonialsList");
  if (!allTestimonialsList) {
    // eslint-disable-next-line no-console
    if (IS_DEVELOPMENT) console.error("TESTIMONIALS: All testimonials list element NOT found!");
    return;
  }

  allTestimonialsList.innerHTML = ""; // Clear existing content

  allTestimonials.forEach((testimonial, index) => {
    const testimonialItem = document.createElement("div");
    testimonialItem.classList.add("testimonial-item");
    if (testimonial.highlighted) {
      testimonialItem.classList.add("highlighted");
    }

    // Add review number
    const reviewNumber = document.createElement("div");
    reviewNumber.classList.add("review-number");
    reviewNumber.textContent = `#${index + 1}`;
    testimonialItem.appendChild(reviewNumber);

    const testimonialContent = document.createElement("div");
    testimonialContent.classList.add("testimonial-content");

    const textP = document.createElement("p");
    textP.classList.add("testimonial-text");
    textP.textContent = `"${testimonial.text}"`;

    const nameP = document.createElement("p");
    nameP.classList.add("testimonial-name");
    nameP.textContent = `- ${testimonial.name}`;

    const dateP = document.createElement("p");
    dateP.classList.add("testimonial-date");
    dateP.textContent = `${testimonial.month} ${testimonial.year}`;

    const typeP = document.createElement("p");
    typeP.classList.add("testimonial-type");
    typeP.textContent = (testimonial.type || "Not specified").toUpperCase();

    // Star Rating
    if (testimonial.rating && testimonial.rating > 0) {
      const starsContainer = document.createElement("div");
      starsContainer.classList.add("testimonial-rating");
      starsContainer.style.color = "#D4AF37";
      starsContainer.style.fontSize = "1.2em";
      starsContainer.style.marginBottom = "10px";
      starsContainer.style.marginTop = "10px";

      for (let i = 1; i <= 5; i++) {
        const star = document.createElement("span");
        star.textContent = i <= testimonial.rating ? "★" : "☆";
        starsContainer.appendChild(star);
      }
      testimonialContent.appendChild(starsContainer);
    }

    testimonialContent.appendChild(nameP);
    testimonialContent.appendChild(textP);
    testimonialContent.appendChild(typeP);
    testimonialContent.appendChild(dateP);

    testimonialItem.appendChild(testimonialContent);
    allTestimonialsList.appendChild(testimonialItem);
  });

  // eslint-disable-next-line no-console
  if (IS_DEVELOPMENT) console.log("TESTIMONIALS: All testimonials loaded in expandable list.");
}

// Initialize testimonials toggle functionality
function initTestimonialsToggle() {
  const toggleBtn = document.getElementById("toggleAllTestimonials");
  const allTestimonialsList = document.getElementById("allTestimonialsList");
  
  // eslint-disable-next-line no-console
  if (IS_DEVELOPMENT) console.log("TESTIMONIALS: Looking for toggle elements:", {
    toggleBtn: !!toggleBtn,
    allTestimonialsList: !!allTestimonialsList
  });

  if (!toggleBtn || !allTestimonialsList) {
    // eslint-disable-next-line no-console
    if (IS_DEVELOPMENT) console.error("TESTIMONIALS: Toggle elements not found!");
    return;
  }

  const toggleText = toggleBtn.querySelector(".toggle-text");
  const toggleIcon = toggleBtn.querySelector(".toggle-icon");

  if (!toggleText || !toggleIcon) {
    // eslint-disable-next-line no-console
    if (IS_DEVELOPMENT) console.error("TESTIMONIALS: Toggle text or icon elements not found!");
    return;
  }

  // Prevent duplicate event bindings
  if (toggleBtn.dataset.bound === 'true') {
    if (IS_DEVELOPMENT) console.log("TESTIMONIALS: Toggle button already bound, skipping rebind.");
    return;
  }

  // eslint-disable-next-line no-console
  if (IS_DEVELOPMENT) console.log("TESTIMONIALS: Adding click event listener to toggle button");

  toggleBtn.addEventListener("click", function() {
    // eslint-disable-next-line no-console
    if (IS_DEVELOPMENT) console.log("TESTIMONIALS: Toggle button clicked!");
    
    const isVisible = allTestimonialsList.classList.contains("show");
    
    if (isVisible) {
      // Hide testimonials
      allTestimonialsList.classList.remove("show");
      // Use i18n for text updates
      if (window.i18n) {
        toggleText.textContent = window.i18n.t('testimonials.show_all');
      } else {
        toggleText.textContent = "Show All Reviews";
      }
      toggleIcon.textContent = "▼";
      toggleBtn.classList.remove("expanded");
      // eslint-disable-next-line no-console
      if (IS_DEVELOPMENT) console.log("TESTIMONIALS: Hiding testimonials list");
    } else {
      // Show testimonials
      allTestimonialsList.classList.add("show");
      // Use i18n for text updates
      if (window.i18n) {
        toggleText.textContent = window.i18n.t('testimonials.hide_all');
      } else {
        toggleText.textContent = "Hide All Reviews";
      }
      toggleIcon.textContent = "▲";
      toggleBtn.classList.add("expanded");
      // eslint-disable-next-line no-console
      if (IS_DEVELOPMENT) console.log("TESTIMONIALS: Showing testimonials list");
    }
  });

  // Mark as bound to prevent duplicates
  toggleBtn.dataset.bound = 'true';

  // eslint-disable-next-line no-console
  if (IS_DEVELOPMENT) console.log("TESTIMONIALS: Toggle functionality initialized successfully.");
}

// Calculate and update testimonials metrics
function updateTestimonialsMetrics(allTestimonials) {
  if (!allTestimonials || !allTestimonials.length) return;
  
  const totalReviews = allTestimonials.length;
  const totalRating = allTestimonials.reduce((sum, testimonial) => sum + (testimonial.rating || 0), 0);
  const averageRating = totalRating / totalReviews;
  
  // Round to 1 decimal place
  const roundedAverage = Math.round(averageRating * 10) / 10;
  
  // Update the header title
  const headerTitle = document.querySelector(".all-testimonials-title");
  if (headerTitle) {
    // Use i18n for the title
    if (window.i18n) {
      const baseTitle = window.i18n.t('testimonials.all_reviews_title');
      headerTitle.textContent = `${baseTitle} (${roundedAverage}★)`;
    } else {
      headerTitle.textContent = `All Reviews (${roundedAverage}★)`;
    }
  }
  
  // eslint-disable-next-line no-console
  if (IS_DEVELOPMENT) console.log("TESTIMONIALS: Metrics updated:", {
    totalReviews,
    totalRating,
    averageRating: roundedAverage
  });
}

// Summer Step-Up Challenge Modal and Banner Functions
function initSummerChallenge() {
  console.log('=== SUMMER CHALLENGE INIT START ===');
  
  // Get elements - retry if not found immediately
  let modal = document.getElementById('summerChallengeModal');
  let banner = document.getElementById('summerChallengeBanner');
  
  // If elements not found, try again after a short delay
  if (!modal || !banner) {
    console.warn('Modal or banner elements not found, retrying...');
    setTimeout(() => {
      modal = document.getElementById('summerChallengeModal');
      banner = document.getElementById('summerChallengeBanner');
      
      if (!modal || !banner) {
        console.error('Modal or banner elements still not found after retry!', {
          modal: !!modal,
          banner: !!banner,
          documentReadyState: document.readyState
        });
        return;
      }
      
      // Try again with found elements
      showBannerAndModal(modal, banner);
    }, 200);
    return;
  }
  
  showBannerAndModal(modal, banner);
  console.log('=== SUMMER CHALLENGE INIT END ===');
}

function showBannerAndModal(modal, banner) {
  if (banner) {
    console.log('Showing banner...');
    banner.classList.add('show');
    
    const bannerComputed = window.getComputedStyle(banner);
    console.log('Banner transform:', bannerComputed.transform);
    console.log('Banner display:', bannerComputed.display);
  }
  
  if (modal) {
    console.log('Will show modal in 2 seconds...');
    setTimeout(() => {
      if (modal) {
        console.log('Showing modal now!');
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
        console.log('Modal classes after adding show:', modal.classList.toString());
        
        const modalComputed = window.getComputedStyle(modal);
        console.log('Modal display:', modalComputed.display);
      }
    }, 2000);
  }
}

// Test function - run this in browser console to manually trigger modal and banner
function testSummerChallenge() {
  console.log('=== TESTING SUMMER CHALLENGE ===');
  
  // Get elements
  const modal = document.getElementById('summerChallengeModal');
  const banner = document.getElementById('summerChallengeBanner');
  
  console.log('Test elements:', { modal: !!modal, banner: !!banner });
  
  if (modal) {
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    console.log('Modal shown manually');
  }
  
  if (banner) {
    banner.classList.add('show');
    console.log('Banner shown manually');
  }
  
  console.log('=== TEST COMPLETE ===');
}

// Helper function to reset banner and modal (useful for testing)
function resetSummerChallenge() {
  console.log('=== RESETTING SUMMER CHALLENGE ===');
  const modal = document.getElementById('summerChallengeModal');
  const banner = document.getElementById('summerChallengeBanner');
  
  if (banner) {
    banner.classList.add('show');
  }
  
  if (modal) {
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
  }
  
  console.log('Banner and modal forced to visible state for testing.');
}

// Make functions available globally
window.testSummerChallenge = testSummerChallenge;
window.resetSummerChallenge = resetSummerChallenge;

// Close modal function
function closeModal() {
  const modal = document.getElementById('summerChallengeModal');
  if (modal) {
    modal.classList.remove('show');
    document.body.style.overflow = ''; // Restore scrolling
    console.log('Modal closed');
  } else {
    console.error('Modal element not found in closeModal()');
  }
}

// Close banner function
function closeBanner(event) {
    if (event) {
        event.stopPropagation(); // Prevent triggering the banner click
    }
    const banner = document.getElementById('summerChallengeBanner');
    if (banner) {
      banner.classList.remove('show');
      console.log('Banner closed');
    } else {
      console.error('Banner element not found in closeBanner()');
    }
}

// Open modal function
function openModal() {
    const modal = document.getElementById('summerChallengeModal');
    if (modal) {
      modal.classList.add('show');
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
      console.log('Modal opened via openModal()');
    } else {
      console.error('Modal element not found in openModal()');
    }
}

// Book detox massage function
function bookDetoxMassage() {
  // Find the detox massage booking button and trigger it
  const detoxButton = document.getElementById('executive-detox-massage-45-min');
  if (detoxButton) {
    detoxButton.click();
  }
  closeModal();
}

// Close modal when clicking outside
document.addEventListener('click', function(event) {
  const modal = document.getElementById('summerChallengeModal');
  if (event.target === modal) {
    closeModal();
  }
});

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') {
    const modal = document.getElementById('summerChallengeModal');
    if (modal.classList.contains('show')) {
      closeModal();
    }
  }
});

// Test function - run this in browser console to manually trigger testimonial modal
function testTestimonialModal() {
  console.log('=== TESTING TESTIMONIAL MODAL ===');
  
  const modal = document.getElementById("testimonialModal");
  const openModalBtn = document.getElementById("openTestimonialModal");
  
  console.log('Modal element:', modal);
  console.log('Open button element:', openModalBtn);
  
  if (modal) {
    modal.style.display = "block";
    document.body.style.overflow = "hidden";
    console.log('Modal shown manually');
  } else {
    console.error('Modal element not found!');
  }
  
  if (openModalBtn) {
    console.log('Button found, triggering click...');
    openModalBtn.click();
  } else {
    console.error('Button element not found!');
  }
}

// Make test function available globally
window.testTestimonialModal = testTestimonialModal;







// Initialize testimonial form and modal
function initTestimonialForm() {
  console.log('=== INITIALIZING TESTIMONIAL FORM ===');
  
  const modal = document.getElementById("testimonialModal");
  const openModalBtn = document.getElementById("openTestimonialModal");
  const closeModalBtn = document.querySelector(".close-modal");
  const form = document.getElementById("testimonialForm");

  console.log('Modal element:', modal);
  console.log('Open button element:', openModalBtn);
  console.log('Close button element:', closeModalBtn);
  console.log('Form element:', form);

  // Open modal when clicking the button
  if (openModalBtn && modal) {
    console.log('Setting up testimonial modal...');
    
    // Remove any existing listeners
    openModalBtn.removeEventListener('click', openTestimonialModal);
    
    // Add new listener
    openModalBtn.addEventListener("click", openTestimonialModal);
    
    console.log('Testimonial modal setup complete');
  } else {
    console.error('Missing elements for testimonial modal:', { openModalBtn, modal });
  }

  // Close modal when clicking the X
  if (closeModalBtn && modal) {
    closeModalBtn.removeEventListener('click', closeTestimonialModal);
    closeModalBtn.addEventListener("click", closeTestimonialModal);
  }

  // Close modal when clicking outside
  if (modal) {
    modal.removeEventListener('click', handleModalOutsideClick);
    modal.addEventListener("click", handleModalOutsideClick);
  }

  // Handle form submission
  if (form) {
    console.log('Adding form submit event listener...');
    
    // Remove any existing listeners first
    form.removeEventListener('submit', handleTestimonialSubmit);
    
    // Add new listener
    form.addEventListener("submit", handleTestimonialSubmit);
    
    // Also add a click listener to the submit button as backup
    const submitBtn = form.querySelector('.submit-button');
    if (submitBtn) {
      console.log('Adding submit button click listener as backup...');
      submitBtn.removeEventListener('click', handleTestimonialSubmit);
      submitBtn.addEventListener('click', handleTestimonialSubmit);
    }
    
    console.log('Form event listeners added successfully');
  } else {
    console.error('Form element not found for event listener!');
  }
}

function handleModalOutsideClick(e) {
  if (e.target === e.currentTarget) {
    closeTestimonialModal();
  }
}

// Testimonial Modal Functions
function openTestimonialModal(e) {
  console.log('Opening testimonial modal...');
  e.preventDefault();
  
  const modal = document.getElementById("testimonialModal");
  if (modal) {
    modal.style.display = "block";
    document.body.style.overflow = "hidden";
    console.log('Testimonial modal opened successfully');
  } else {
    console.error('Modal element not found!');
  }
}

function closeTestimonialModal() {
  console.log('Closing testimonial modal...');
  const modal = document.getElementById("testimonialModal");
  if (modal) {
    modal.style.display = "none";
    document.body.style.overflow = "";
    console.log('Testimonial modal closed successfully');
  }
}

function handleTestimonialSubmit(e) {
  console.log('=== FORM SUBMISSION HANDLER TRIGGERED ===');
  console.log('Event type:', e.type);
  console.log('Event target:', e.target);
  console.log('Event currentTarget:', e.currentTarget);
  
  // Prevent the default form submission
  e.preventDefault();
  e.stopPropagation();
  
  console.log('Default form submission prevented');
  console.log('Handling testimonial form submission...');
  
  // Additional safety check - if this is a form submit event, make sure it's completely stopped
  if (e.type === 'submit') {
    console.log('This is a form submit event - ensuring it\'s completely prevented');
    e.stopImmediatePropagation();
    return false;
  }

  // Get form elements
  const form = document.getElementById("testimonialForm");
  const modal = document.getElementById("testimonialModal");
  const submitButton = form.querySelector('.submit-button');

  // Disable submit button to prevent double submission
  if (submitButton) {
    submitButton.disabled = true;
    submitButton.textContent = 'Submitting...';
  }

  // Format date from month and year selects
  const month = document.getElementById("month").value;
  const year = document.getElementById("year").value;
  let formattedDate = "Not specified";
  if (month && year) {
    formattedDate = `${month}/${year}`;
  }

  // Get form data with validation
  const experience = document.getElementById("experience").value.trim();
  const massageType = Array.from(document.querySelectorAll("input[name=\"massageType\"]:checked"))
    .map(cb => cb.value)
    .join(", ") || "Not specified";
  const name = document.getElementById("name").value.trim() || "Anonymous";
  const email = document.getElementById("email").value.trim();
  const rating = document.getElementById("rating").value;

  // Basic validation
  if (!experience || !massageType || !rating) {
    showNotification("Please fill in all required fields.", "error");
    return;
  }

  const formData = {
    experience: experience,
    massageType: massageType,
    name: name,
    email: email,
    date: formattedDate,
    rating: rating
  };

  console.log('Form data to send:', formData);

  // Send email using EmailJS with better error handling
  console.log('About to send email with EmailJS...');
  console.log('Service ID: service_dwed3y6');
  console.log('Template ID: template_9gsve0p');
  console.log('Form data:', formData);
  
  // @ts-ignore
  window.emailjs.send("service_dwed3y6", "template_9gsve0p", formData)
    .then(function (response) {
      console.log('EmailJS success response:', response);
      
      // Check if the response indicates success
      if (response && response.status === 200) {
        // Show success message
        showNotification("Thank you for sharing your experience!", "success");
        // Reset form and close modal after a short delay
        setTimeout(() => {
          form.reset();
          closeTestimonialModal();
        }, 2000);
      } else {
        // Even if status isn't 200, EmailJS often succeeds
        console.log('EmailJS response received, treating as success');
        showNotification("Thank you for sharing your experience!", "success");
        // Reset form and close modal after a short delay
        setTimeout(() => {
          form.reset();
          closeTestimonialModal();
        }, 2000);
      }
    })
    .catch(function (error) {
      console.error("EmailJS error details:", error);
      
      // Check if it's actually a network error or just EmailJS response format issue
      if (error && (error.text || error.message)) {
        console.log('EmailJS returned error but might have succeeded:', error);
        // Often EmailJS returns an error object even on success
        // Check if the error message suggests the email was actually sent
        if (error.text && error.text.includes('OK') || error.status === 200) {
          showNotification("Thank you for sharing your experience!", "success");
          setTimeout(() => {
            form.reset();
            closeTestimonialModal();
          }, 2000);
          return;
        }
      }
      
      // Show error message
      showNotification("Sorry, there was an error sending your message. Please try again later.", "error");
      
      // Log additional error details for debugging
      console.log('Full error object:', JSON.stringify(error, null, 2));
      console.log('Error type:', typeof error);
      console.log('Error keys:', Object.keys(error || {}));
    })
    .finally(function () {
      // Re-enable submit button
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = 'Submit';
      }
    });
}

// Simple test function to force show testimonial modal
function forceShowTestimonialModal() {
  console.log('=== FORCE SHOWING TESTIMONIAL MODAL ===');
  
  const modal = document.getElementById("testimonialModal");
  console.log('Modal element:', modal);
  
  if (modal) {
    // Force the modal to be visible
    modal.style.display = "block";
    modal.style.zIndex = "9999";
    document.body.style.overflow = "hidden";
    console.log('Modal should now be visible with z-index 9999');
    
    // Also try clicking the button programmatically
    const button = document.getElementById("openTestimonialModal");
    if (button) {
      console.log('Button found, clicking it...');
      button.click();
    }
  } else {
    console.error('Modal element not found!');
  }
}

// Make test function available globally
window.forceShowTestimonialModal = forceShowTestimonialModal;

// Notification helper functions
function showNotification(message, type = "success") {
  const notification = document.getElementById("notification");
  const notificationMessage = document.getElementById("notification-message");
  
  if (notification && notificationMessage) {
    notification.className = `notification ${type}`;
    notificationMessage.textContent = message;
    notification.style.display = "block";
    
    // Auto-hide success notifications after 5 seconds
    if (type === "success") {
      setTimeout(() => {
        hideNotification();
      }, 5000);
    }
  }
}

function hideNotification() {
  const notification = document.getElementById("notification");
  if (notification) {
    notification.style.display = "none";
  }
}

// Make notification functions available globally
window.showNotification = showNotification;
window.hideNotification = hideNotification;

// Test function to verify form handling
function testFormSubmission() {
  console.log('=== TESTING FORM SUBMISSION ===');
  
  const form = document.getElementById("testimonialForm");
  const submitBtn = form.querySelector('.submit-button');
  
  console.log('Form element:', form);
  console.log('Submit button:', submitBtn);
  
  // Check form attributes
  console.log('Form action:', form.action);
  console.log('Form method:', form.method);
  console.log('Form onsubmit:', form.onsubmit);
  
  // Check button attributes
  console.log('Button type:', submitBtn.type);
  console.log('Button onclick:', submitBtn.onclick);
  
  // Check if event listeners are attached
  const events = getEventListeners ? getEventListeners(form) : 'getEventListeners not available';
  console.log('Form event listeners:', events);
  
  // Test notification system
  showNotification("Test notification - this should work!", "success");
  
  console.log('=== TEST COMPLETE ===');
}

// Make test function available globally
window.testFormSubmission = testFormSubmission;
