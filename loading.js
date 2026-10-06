document.addEventListener("DOMContentLoaded", () => {
  const loading = document.getElementById("loading-screen");
  const main = document.querySelector(".container");

  if (!loading || !main) return;

  main.style.display = "none";

  const LOADING_TIME = 2000;

  setTimeout(() => {
    loading.style.opacity = "0";
    loading.style.transition = "opacity 0.8s ease";

    setTimeout(() => {
      loading.remove();
      main.style.display = "block";
    }, 800);

  }, LOADING_TIME);
});
