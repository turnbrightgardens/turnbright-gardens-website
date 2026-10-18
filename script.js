const toggles = document.querySelectorAll(".toggle");
const projects = document.querySelectorAll(".project-card");
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

// Contact form: optional photo uploads (Netlify Forms: one file per field, 8 MB per submission).
const photoForms = document.querySelectorAll("form[data-photo-form]");
const PHOTO_MAX_TOTAL = 7.5 * 1024 * 1024; // keep under Netlify's 8 MB request limit
const PHOTO_MAX_EDGE = 1600;
const PHOTO_RESIZE_ABOVE = 1024 * 1024;

const formatMb = (bytes) => `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

const shrinkPhoto = async (file) => {
  if (file.size <= PHOTO_RESIZE_ABOVE || !window.createImageBitmap || !file.type.startsWith("image/")) {
    return file;
  }
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, PHOTO_MAX_EDGE / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d").drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close?.();
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.82));
    if (!blob || blob.size >= file.size) {
      return file;
    }
    const name = file.name.replace(/\.[^.]+$/, "") + ".jpg";
    return new File([blob], name, { type: "image/jpeg" });
  } catch (error) {
    return file;
  }
};

photoForms.forEach((form) => {
  const inputs = Array.from(form.querySelectorAll("[data-photo-input]"));
  const errorBox = form.querySelector("[data-photo-error]");
  const submitButton = form.querySelector('button[type="submit"]');

  const showError = (message) => {
    if (!errorBox) return;
    errorBox.textContent = message;
    errorBox.hidden = !message;
  };

  inputs.forEach((input) => {
    input.addEventListener("change", () => {
      const file = input.files && input.files[0];
      if (file && !file.type.startsWith("image/")) {
        input.value = "";
        showError("Please choose a photo (image file) only.");
        return;
      }
      showError("");
    });
  });

  form.addEventListener("submit", async (event) => {
    const chosen = inputs.filter((input) => input.files && input.files[0]);
    if (!chosen.length || !window.fetch || !window.FormData) {
      // No photos: normal form submission, exactly as before.
      return;
    }

    event.preventDefault();
    showError("");
    const originalLabel = submitButton ? submitButton.textContent : "";
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Sending...";
    }

    try {
      const formData = new FormData(form);
      let total = 0;
      for (const input of chosen) {
        const photo = await shrinkPhoto(input.files[0]);
        total += photo.size;
        formData.set(input.name, photo, photo.name);
      }

      if (total > PHOTO_MAX_TOTAL) {
        throw new Error(`Your photos are ${formatMb(total)} in total. Please use fewer or smaller photos (8 MB maximum), or send them on WhatsApp.`);
      }

      const response = await fetch("/", { method: "POST", body: formData });
      if (!response.ok) {
        throw new Error("Sorry, your message could not be sent. Please try again, or call us or send your photos on WhatsApp.");
      }
      window.location.href = form.getAttribute("action") || "/thank-you.html";
    } catch (error) {
      showError(error.message || "Sorry, your message could not be sent. Please try again.");
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = originalLabel;
      }
    }
  });
});
