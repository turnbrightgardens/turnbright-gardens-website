const toggles = document.querySelectorAll(".toggle");
const projects = document.querySelectorAll(".project-card, .bento-item");
const featureWork = document.querySelector(".feature-work");
const limitedTextareas = document.querySelectorAll("textarea[data-word-limit]");
const slideshows = document.querySelectorAll("[data-gallery-slideshow]");
const reviewCarousels = document.querySelectorAll("[data-review-carousel]");

toggles.forEach((toggle) => {
  toggle.addEventListener("click", () => {
    const filter = toggle.dataset.filter;

    toggles.forEach((item) => item.classList.toggle("active", item === toggle));

    projects.forEach((project) => {
      const isVisible = filter === "all" || project.dataset.category === filter;
      project.classList.toggle("is-hidden", !isVisible);
    });

    if (featureWork) {
      const showFeature = filter === "all" || featureWork.dataset.category === filter;
      featureWork.classList.toggle("is-hidden", !showFeature);
    }
  });
});

limitedTextareas.forEach((textarea) => {
  const limit = Number(textarea.dataset.wordLimit);
  const hint = textarea.getAttribute("aria-describedby")
    ? document.getElementById(textarea.getAttribute("aria-describedby"))
    : null;

  const updateCount = () => {
    const words = textarea.value.trim().split(/\s+/).filter(Boolean);

    if (words.length > limit) {
      textarea.value = words.slice(0, limit).join(" ");
    }

    const current = textarea.value.trim().split(/\s+/).filter(Boolean).length;
    if (hint) {
      hint.textContent = `${current}/${limit} words used.`;
    }
  };

  textarea.addEventListener("input", updateCount);
  updateCount();
});

slideshows.forEach((slideshow) => {
  const slides = Array.from(slideshow.querySelectorAll(".gallery-slide"));
  const dots = Array.from(slideshow.querySelectorAll("[data-slide-dot]"));
  const previousButton = slideshow.querySelector("[data-slide-prev]");
  const nextButton = slideshow.querySelector("[data-slide-next]");
  const currentCount = slideshow.querySelector("[data-slide-current]");
  const totalCount = slideshow.querySelector("[data-slide-total]");
  let currentIndex = 0;

  if (!slides.length) {
    return;
  }

  if (totalCount) {
    totalCount.textContent = String(slides.length);
  }

  const showSlide = (index) => {
    currentIndex = (index + slides.length) % slides.length;

    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle("is-active", slideIndex === currentIndex);
    });

    dots.forEach((dot, dotIndex) => {
      const isActive = dotIndex === currentIndex;
      dot.classList.toggle("is-active", isActive);
      dot.setAttribute("aria-selected", String(isActive));
    });

    if (currentCount) {
      currentCount.textContent = String(currentIndex + 1);
    }
  };

  previousButton?.addEventListener("click", () => showSlide(currentIndex - 1));
  nextButton?.addEventListener("click", () => showSlide(currentIndex + 1));

  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      showSlide(Number(dot.dataset.slideDot));
    });
  });

  slideshow.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      showSlide(currentIndex - 1);
    }

    if (event.key === "ArrowRight") {
      showSlide(currentIndex + 1);
    }
  });

  showSlide(0);
});

reviewCarousels.forEach((carousel) => {
  const slides = Array.from(carousel.querySelectorAll(".review-slide"));
  const dots = Array.from(carousel.querySelectorAll("[data-review-dot]"));
  const previousButton = carousel.querySelector("[data-review-prev]");
  const nextButton = carousel.querySelector("[data-review-next]");
  let currentIndex = 0;
  let autoplayTimer;

  if (!slides.length) {
    return;
  }

  const showReview = (index) => {
    currentIndex = (index + slides.length) % slides.length;

    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle("is-active", slideIndex === currentIndex);
    });

    dots.forEach((dot, dotIndex) => {
      const isActive = dotIndex === currentIndex;
      dot.classList.toggle("is-active", isActive);
      dot.setAttribute("aria-selected", String(isActive));
    });
  };

  const restartAutoplay = () => {
    window.clearInterval(autoplayTimer);
    autoplayTimer = window.setInterval(() => showReview(currentIndex + 1), 6500);
  };

  previousButton?.addEventListener("click", () => {
    showReview(currentIndex - 1);
    restartAutoplay();
  });

  nextButton?.addEventListener("click", () => {
    showReview(currentIndex + 1);
    restartAutoplay();
  });

  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      showReview(Number(dot.dataset.reviewDot));
      restartAutoplay();
    });
  });

  carousel.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      showReview(currentIndex - 1);
      restartAutoplay();
    }

    if (event.key === "ArrowRight") {
      showReview(currentIndex + 1);
      restartAutoplay();
    }
  });

  showReview(0);
  restartAutoplay();
});

const navDropdowns = document.querySelectorAll(".nav-dropdown");

const closeNavDropdown = (dropdown) => {
  dropdown.classList.remove("is-open");
  dropdown.querySelector(".nav-dropdown-toggle")?.setAttribute("aria-expanded", "false");
};

const openNavDropdown = (dropdown) => {
  navDropdowns.forEach((other) => {
    if (other !== dropdown) closeNavDropdown(other);
  });
  dropdown.classList.add("is-open");
  dropdown.querySelector(".nav-dropdown-toggle")?.setAttribute("aria-expanded", "true");
};

navDropdowns.forEach((dropdown) => {
  const toggle = dropdown.querySelector(".nav-dropdown-toggle");
  const menu = dropdown.querySelector(".nav-dropdown-menu");
  const menuLinks = () => Array.from(menu?.querySelectorAll("a") || []);

  toggle?.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    const willOpen = !dropdown.classList.contains("is-open");
    if (willOpen) {
      openNavDropdown(dropdown);
    } else {
      closeNavDropdown(dropdown);
    }
  });

  toggle?.addEventListener("keydown", (event) => {
    if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openNavDropdown(dropdown);
      menuLinks()[0]?.focus();
    }
  });

  dropdown.addEventListener("keydown", (event) => {
    const links = menuLinks();
    const index = links.indexOf(document.activeElement);

    if (event.key === "Escape") {
      event.preventDefault();
      closeNavDropdown(dropdown);
      toggle?.focus();
      return;
    }

    if (!links.length) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      const next = index < 0 ? 0 : (index + 1) % links.length;
      links[next].focus();
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      const next = index <= 0 ? links.length - 1 : index - 1;
      links[next].focus();
    }

    if (event.key === "Home") {
      event.preventDefault();
      links[0].focus();
    }

    if (event.key === "End") {
      event.preventDefault();
      links[links.length - 1].focus();
    }
  });
});

document.addEventListener("click", (event) => {
  navDropdowns.forEach((dropdown) => {
    if (!dropdown.contains(event.target)) {
      closeNavDropdown(dropdown);
    }
  });
});

// Gallery lightbox
const lightbox = document.querySelector("[data-lightbox-modal]");
if (lightbox) {
  const lbImg = lightbox.querySelector("[data-lightbox-img]");
  const lbCap = lightbox.querySelector("[data-lightbox-cap]");
  let lbItems = [];
  let lbIndex = 0;
  let lastFocus = null;

  const show = (i) => {
    lbIndex = (i + lbItems.length) % lbItems.length;
    const item = lbItems[lbIndex];
    lbImg.src = item.dataset.lightbox;
    lbImg.alt = item.querySelector("img").alt;
    lbCap.textContent = item.dataset.caption;
  };
  const close = () => {
    lightbox.hidden = true;
    document.body.classList.remove("lightbox-open");
    if (lastFocus) lastFocus.focus();
  };

  document.querySelectorAll("[data-lightbox]").forEach((button) => {
    button.addEventListener("click", () => {
      lbItems = Array.from(document.querySelectorAll("[data-lightbox]")).filter(
        (b) => !b.closest(".is-hidden")
      );
      lastFocus = button;
      show(lbItems.indexOf(button));
      lightbox.hidden = false;
      document.body.classList.add("lightbox-open");
      lightbox.querySelector("[data-lightbox-close]").focus();
    });
  });

  lightbox.querySelector("[data-lightbox-close]").addEventListener("click", close);
  lightbox.querySelector("[data-lightbox-prev]").addEventListener("click", () => show(lbIndex - 1));
  lightbox.querySelector("[data-lightbox-next]").addEventListener("click", () => show(lbIndex + 1));
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) close();
  });
  document.addEventListener("keydown", (e) => {
    if (lightbox.hidden) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") show(lbIndex - 1);
    if (e.key === "ArrowRight") show(lbIndex + 1);
  });
}


/* Homepage-only scroll reveals + hero entrance */
(() => {
  if (!document.body.classList.contains("page-home")) {
    return;
  }

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hero = document.querySelector(".hero.hero-focus");

  if (hero) {
    if (reduceMotion) {
      hero.classList.add("is-ready");
    } else {
      window.requestAnimationFrame(() => hero.classList.add("is-ready"));
    }
  }

  const revealTargets = [
    ...document.querySelectorAll(
      ".page-home main > section:not(.hero), .page-home .reviews-section, .page-home .service-path-card, .page-home .service-card, .page-home .proof-image, .page-home .proof-copy"
    ),
  ];

  revealTargets.forEach((el, index) => {
    el.classList.add("reveal");
    const delay = index % 3;
    if (delay) {
      el.classList.add(`reveal-delay-${delay}`);
    }
  });

  if (reduceMotion) {
    revealTargets.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  if (!("IntersectionObserver" in window)) {
    revealTargets.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { root: null, rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
  );

  revealTargets.forEach((el) => observer.observe(el));
})();


/* Mobile nav hamburger */
(() => {
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("site-nav");
  if (!header || !toggle || !nav) return;

  const setOpen = (open) => {
    header.classList.toggle("nav-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  };

  toggle.addEventListener("click", () => {
    setOpen(!header.classList.contains("nav-open"));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setOpen(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setOpen(false);
  });
})();

/* Open FAQ details when linked with #anchor */
(() => {
  const openHash = () => {
    const id = window.location.hash.replace(/^#/, "");
    if (!id) return;
    const el = document.getElementById(id);
    if (!el || el.tagName !== "DETAILS") return;
    el.open = true;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  openHash();
  window.addEventListener("hashchange", openHash);
})();

document.querySelectorAll(".quote-form").forEach((form) => {
  const firstPhoto = form.querySelector('input[name="photo-1"]');
  firstPhoto?.addEventListener("change", () => {
    if (firstPhoto.files && firstPhoto.files.length) {
      form.classList.add("has-photos");
    }
  });
});
