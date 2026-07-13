const toggles = document.querySelectorAll(".toggle");
const projects = document.querySelectorAll(".project-card");
const featureWork = document.querySelector(".feature-work");
const limitedTextareas = document.querySelectorAll("textarea[data-word-limit]");
const slideshows = document.querySelectorAll("[data-gallery-slideshow]");

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
