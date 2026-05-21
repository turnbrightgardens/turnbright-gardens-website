const toggles = document.querySelectorAll(".toggle");
const projects = document.querySelectorAll(".project-card");
const featureWork = document.querySelector(".feature-work");

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
