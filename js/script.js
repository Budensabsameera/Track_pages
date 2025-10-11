document.addEventListener("DOMContentLoaded", function () {
  // --- Load header ---
  fetch("header.html")
    .then((res) => res.text())
    .then((data) => {
      document.getElementById("header-container").innerHTML = data;
      setupHeaderFeatures();
    })
    .catch((err) => console.error("Header load error:", err));

  // --- Load footer ---
  fetch("footer.html")
    .then((res) => res.text())
    .then((data) => {
      document.getElementById("footer-container").innerHTML = data;
      const yearSpan = document.getElementById("copyright-year");
      if (yearSpan) yearSpan.textContent = new Date().getFullYear();
    })
    .catch((err) => console.error("Footer load error:", err));

  function setupHeaderFeatures() {
    const hamburger = document.querySelector(".hamburger");
    const nav = document.querySelector(".main-nav");
    if (hamburger && nav) {
      hamburger.addEventListener("click", () => {
        nav.classList.toggle("nav-open");
      });
    }

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));
        if (target) target.scrollIntoView({ behavior: "smooth" });
      });
    });

    if (typeof setupAccordion === "function") {
      setupAccordion();
    }
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
            let delay = 0;
            if (delayClass) delay = parseFloat(delayClass.split("-")[1]) * 200;
            setTimeout(() => {
              entry.target.classList.add("in-view");
            }, delay);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    elements.forEach((el) => {
      observer.observe(el);

      // Trigger if already visible
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const delayClass = Array.from(el.classList).find((c) =>
          c.startsWith("delay-")
        );
        let delay = 0;
        if (delayClass) delay = parseFloat(delayClass.split("-")[1]) * 200;
        setTimeout(() => el.classList.add("in-view"), delay);
      }
    });
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

  // --- Re-run animations after AJAX content loads ---
  function observeNewContent() {
    runAnimationsWhenReady();


    const contentContainer = document.body; 
    const mutationObserver = new MutationObserver(runAnimationsWhenReady);
    mutationObserver.observe(contentContainer, {
      childList: true,
      subtree: true,
    });
  }

  // Run after everything loads
  window.addEventListener("load", observeNewContent);

  // --- FAQ toggle ---
  document.querySelectorAll(".faq-item").forEach((item) => {
    item.addEventListener("click", () => {
      document.querySelectorAll(".faq-item").forEach((i) => {
        if (i !== item) {
          i.classList.remove("active");
        }
      });
      item.classList.toggle("active");
    });
  });
});
