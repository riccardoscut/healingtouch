const IS_DEVELOPMENT = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

/* global emailjs */

document.addEventListener("DOMContentLoaded", function () {
  // eslint-disable-next-line no-console
  if (IS_DEVELOPMENT) console.log("TESTIMONIALS: DOMContentLoaded event fired.");
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
  // @ts-ignore
  loadTestimonials(window.testimonials);

  // Modal and Form Handling
  const modal = document.getElementById("testimonialModal");
  const openModalBtn = document.querySelector("a[href^=\"mailto:healingtouch@da-sign.com\"]");
  const closeModalBtn = document.querySelector(".close-modal");
  const form = document.getElementById("testimonialForm");

  // Replace mailto link with modal trigger
  if (openModalBtn) {
    openModalBtn.addEventListener("click", function (e) {
      e.preventDefault();
      modal.style.display = "block";
      document.body.style.overflow = "hidden"; // Prevent background scrolling
    });
  }

  // Close modal when clicking the X
  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", function () {
      modal.style.display = "none";
      document.body.style.overflow = ""; // Restore scrolling
    });
  }

  // Close modal when clicking outside
  window.addEventListener("click", function (e) {
    if (e.target === modal) {
      modal.style.display = "none";
      document.body.style.overflow = "";
    }
  });

  // Initialize EmailJS with your public key
  // @ts-ignore
  window.emailjs.init("fitJ75sG9o72X64G7");

  // Handle form submission
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // Format date from month and year selects
      const month = document.getElementById("month").value;
      const year = document.getElementById("year").value;
      let formattedDate = "Not specified";
      if (month && year) {
        formattedDate = `${month}/${year}`;
      }

      // Get form data
      const formData = {
        experience: document.getElementById("experience").value,
        massageType: Array.from(document.querySelectorAll("input[name=\"massageType\"]:checked"))
          .map(cb => cb.value)
          .join(", ") || "Not specified",
        name: document.getElementById("name").value || "Anonymous",
        date: formattedDate,
        rating: document.getElementById("rating").value
      };

      // Send email using EmailJS
      // @ts-ignore
      window.emailjs.send("service_dwed3y6", "template_9gsve0p", formData)
        .then(function () {
          // Show success message
          alert("Thank you for sharing your experience!");
          // Reset form and close modal
          form.reset();
          modal.style.display = "none";
          document.body.style.overflow = "";
        })
        .catch(function (error) {
          // eslint-disable-next-line no-console
          console.error("Error sending email:", error);
          alert("Sorry, there was an error sending your message. Please try again later.");
        });
    });
  }
});

// Apply content from JSON to the page
function applyContentToPage (data) {
  // eslint-disable-next-line no-console
  if (IS_DEVELOPMENT) console.log("TESTIMONIALS: applyContentToPage called.", data);
  // Update therapist title
  const therapistTitleEl = document.querySelector(".therapist-title");
  if (therapistTitleEl && data["therapist-title"]) {
    therapistTitleEl.textContent = data["therapist-title"];
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

      // Reinitialize animations
      initServiceCardAnimations();
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

  const duration = document.createElement("p");
  duration.className = "service-duration";
  duration.textContent = service.duration;

  const price = document.createElement("div");
  price.className = "service-price";
  price.textContent = `€${service.price}`;

  header.appendChild(title);
  header.appendChild(duration);
  header.appendChild(price);

  // Create service body
  const body = document.createElement("div");
  body.className = "service-body";

  const description = document.createElement("div");
  description.className = "service-description";
  // @ts-ignore
  description.innerHTML = window.snarkdown(service.description);

  // Create service footer with special offers
  const footer = document.createElement("div");
  footer.className = "service-footer";

  const specialOffers = document.createElement("div");
  specialOffers.className = "special-offers";

  const offersTitle = document.createElement("h4");
  offersTitle.className = "special-offers-title";
  offersTitle.textContent = "Special Offers:";

  // Calculate special offers
  const cashPrice = Math.round(service.price * 0.8 * 100) / 100;
  const cryptoPrice = Math.round(service.price * 0.6 * 100) / 100;

  const cashOffer = document.createElement("p");
  cashOffer.className = "offer-item";
  cashOffer.innerHTML = `<span class="offer-discount">Cash Payment (<span class="offer-discount-percentage">-20%</span>):</span> <span class="original-price">€${service.price.toFixed(2)}</span> <span class="offer-price">€${cashPrice.toFixed(2)}</span>`;

  const cryptoOffer = document.createElement("p");
  cryptoOffer.className = "offer-item";
  cryptoOffer.innerHTML = `<span class="offer-discount">Crypto Payment (<span class="offer-discount-percentage">-40%</span>):</span> <span class="original-price">€${service.price.toFixed(2)}</span> <span class="offer-price">€${cryptoPrice.toFixed(2)}</span> <span class="offer-crypto-payment">(BTC, ADA or USDC/USDT)</span>`;

  specialOffers.appendChild(offersTitle);
  specialOffers.appendChild(cashOffer);
  specialOffers.appendChild(cryptoOffer);

  // Create book button
  const bookButton = document.createElement("button");
  bookButton.id = service.id;
  bookButton.className = "book-button";
  bookButton.textContent = "Book Now";

  footer.appendChild(specialOffers);
  footer.appendChild(bookButton);

  body.appendChild(description);
  body.appendChild(footer);

  // Assemble the card
  card.appendChild(header);
  card.appendChild(body);

  return card;
}

function initServiceCardAnimations () {
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
    "detox-foot-massage-30-min",
    "reflexology-foot-massage-1-hour-30-min"
  ];

  ids.forEach(id => {
    const button = document.getElementById(id);
    if (button) {
      button.setAttribute("data-cal-link", `signaturehealingtouch/${id}`);
      button.setAttribute("data-cal-namespace", id);
      button.setAttribute("data-cal-config", "{\"layout\":\"month_view\"}");
      button.removeAttribute("href");

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

  // eslint-disable-next-line no-console
  if (IS_DEVELOPMENT) console.log("TESTIMONIALS: Testimonial data is present, proceeding to populate slider.");
  const swiperWrapper = document.querySelector("#testimonials .swiper-wrapper");
  if (!swiperWrapper) {
    // eslint-disable-next-line no-console
    if (IS_DEVELOPMENT) console.error("TESTIMONIALS: Swiper wrapper '#testimonials .swiper-wrapper' NOT found!");
    return;
  }
  // eslint-disable-next-line no-console
  if (IS_DEVELOPMENT) console.log("TESTIMONIALS: Swiper wrapper found.", swiperWrapper);

  swiperWrapper.innerHTML = ""; // Clear existing slides
  // eslint-disable-next-line no-console
  if (IS_DEVELOPMENT) console.log("TESTIMONIALS: Swiper wrapper cleared.");

  testimonialsData.forEach((testimonial, index) => {
    // eslint-disable-next-line no-console
    if (IS_DEVELOPMENT) console.log(`TESTIMONIALS: Processing testimonial ${index + 1}:`, testimonial);
    const slide = document.createElement("div");
    slide.classList.add("swiper-slide");

    const testimonialCard = document.createElement("div");
    testimonialCard.classList.add("testimonial-card"); // For styling

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
    typeP.textContent = testimonial.type || "Not specified";

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
  // eslint-disable-next-line no-console
  if (IS_DEVELOPMENT) console.log("TESTIMONIALS: All testimonial slides created and appended.");

  // @ts-ignore
  /* global Swiper */
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
  if (IS_DEVELOPMENT) console.log("TESTIMONIALS: Swiper initialized.");
}

// Modal functionality
document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("testimonialModal");
  const openModalBtn = document.getElementById("openTestimonialModal");
  const closeModalBtn = document.querySelector(".close-modal");
  const testimonialForm = document.getElementById("testimonialForm");

  // Open modal
  openModalBtn.addEventListener("click", function () {
    modal.style.display = "block";
    document.body.style.overflow = "hidden"; // Prevent background scrolling
  });

  // Close modal
  closeModalBtn.addEventListener("click", function () {
    modal.style.display = "none";
    document.body.style.overflow = "auto"; // Restore background scrolling
  });

  // Close modal when clicking outside
  window.addEventListener("click", function (event) {
    if (event.target === modal) {
      modal.style.display = "none";
      document.body.style.overflow = "auto";
    }
  });

  // Handle form submission
  testimonialForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Get form data
    const formData = {
      experience: document.getElementById("experience").value,
      rating: document.getElementById("rating").value,
      massageType: document.querySelector("input[name=\"massageType\"]:checked").value,
      name: document.getElementById("name").value,
      month: document.getElementById("month").value,
      year: document.getElementById("year").value
    };

    // Send email using EmailJS
    emailjs.send("service_vchrwj7", "template_9gsve0p", formData)
      .then(function (response) {
        // eslint-disable-next-line no-console
        console.log("SUCCESS!", response.status, response.text);
        alert("Thank you for sharing your experience!");
        testimonialForm.reset();
        modal.style.display = "none";
        document.body.style.overflow = "auto";
      }, function (error) {
        // eslint-disable-next-line no-console
        console.log("FAILED...", error);
        alert("Sorry, there was an error submitting your testimonial. Please try again later.");
      });
  });
});
