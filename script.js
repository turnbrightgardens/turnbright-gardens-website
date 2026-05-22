const toggles = document.querySelectorAll(".toggle");
const projects = document.querySelectorAll(".project-card");
const featureWork = document.querySelector(".feature-work");
const limitedTextareas = document.querySelectorAll("textarea[data-word-limit]");

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
