document.addEventListener("DOMContentLoaded", () => {
  // --- Load header ---
  fetch("header.html")
    .then((res) => res.text())
    .then((data) => {
      const headerContainer = document.getElementById("header-container");
      if (headerContainer) {
        headerContainer.innerHTML = data;
        setupHeaderFeatures();
      }
    })
    .catch((err) => console.error("Header load error:", err));

  // --- Load footer ---
  fetch("footer.html")
    .then((res) => res.text())
    .then((data) => {
      const footerContainer = document.getElementById("footer-container");
      if (footerContainer) {
        footerContainer.innerHTML = data;
        const yearSpan = document.getElementById("copyright-year");
        if (yearSpan) yearSpan.textContent = new Date().getFullYear();
      }
    })
    .catch((err) => console.error("Footer load error:", err));

  // --- Setup header features ---
  function setupHeaderFeatures() {
    const hamburger = document.querySelector(".hamburger");
    const nav = document.querySelector(".main-nav");

    if (hamburger && nav) {
      hamburger.addEventListener("click", () =>
        nav.classList.toggle("nav-open")
      );
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute("href"));
        if (target) target.scrollIntoView({ behavior: "smooth" });
      });
    });

    if (typeof setupAccordion === "function") setupAccordion();
  }

  // --- Scroll animations ---
  function initScrollAnimations() {
    const elements = document.querySelectorAll(".scroll-animate");
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const delayClass = Array.from(entry.target.classList).find((c) =>
              c.startsWith("delay-")
            );
            const delay = delayClass
              ? parseFloat(delayClass.split("-")[1]) * 200
              : 0;
            setTimeout(() => entry.target.classList.add("in-view"), delay);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    elements.forEach((el) => observer.observe(el));
  }

  function runAnimationsWhenReady() {
    const images = document.querySelectorAll(".scroll-animate img");
    let loadedCount = 0;

    if (images.length > 0) {
      images.forEach((img) => {
        if (img.complete) loadedCount++;
        else
          img.addEventListener("load", () => {
            loadedCount++;
            if (loadedCount === images.length) initScrollAnimations();
          });
      });
      if (loadedCount === images.length) initScrollAnimations();
    } else {
      initScrollAnimations();
    }
  }

  function observeNewContent() {
    runAnimationsWhenReady();
    const mutationObserver = new MutationObserver(runAnimationsWhenReady);
    mutationObserver.observe(document.body, { childList: true, subtree: true });
  }

  window.addEventListener("load", observeNewContent);

  // --- FAQ toggle ---
  document.querySelectorAll(".faq-item").forEach((item) => {
    item.addEventListener("click", () => {
      document.querySelectorAll(".faq-item").forEach((i) => {
        if (i !== item) i.classList.remove("active");
      });
      item.classList.toggle("active");
    });
  });

  const wrapper = document.querySelector(".testimonial-cards-wrapper");
  const cards = document.querySelectorAll(".testimonial-card");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  let currentIndex = 0;
  const totalCards = cards.length;

  function updateSliderPosition() {
    wrapper.style.transform = `translateX(-${currentIndex * 100}%)`;
  }

  function showCard(index) {
    if (index < 0) {
      currentIndex = totalCards - 1;
    } else if (index >= totalCards) {
      currentIndex = 0;
    } else {
      currentIndex = index;
    }
    updateSliderPosition();
  }

  prevBtn.addEventListener("click", () => {
    showCard(currentIndex - 1);
  });

  nextBtn.addEventListener("click", () => {
    showCard(currentIndex + 1);
  });

  // Swipe functionality
  let touchStartX = 0;
  let touchEndX = 0;

  wrapper.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });

  wrapper.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  });

  function handleSwipe() {
    const swipeThreshold = 50; // Minimum px swipe distance to count
    if (touchEndX < touchStartX - swipeThreshold) {
      // swiped left
      showCard(currentIndex + 1);
    }
    if (touchEndX > touchStartX + swipeThreshold) {
      // swiped right
      showCard(currentIndex - 1);
    }
  }
});
