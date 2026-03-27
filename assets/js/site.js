/*
  Minimal JavaScript for menu behavior.
  HOW TO EXTEND:
  - Add small interactions in this file (scroll effects, form checks, etc.).
  - Keep logic simple and split into small functions.
  - If you add features, place a short note above each function.
*/

(function () {
  function initMenu() {
    const menuButton = document.querySelector(".menu-toggle");
    const navLinks = document.querySelector(".nav-links");

    if (!menuButton || !navLinks) return;

    menuButton.addEventListener("click", function () {
      const isOpen = navLinks.classList.toggle("open");
      menuButton.setAttribute("aria-expanded", String(isOpen));
    });

    navLinks.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navLinks.classList.remove("open");
        menuButton.setAttribute("aria-expanded", "false");
      });
    });
  }

  function loadIncludes() {
    const includeNodes = document.querySelectorAll("[data-include]");
    if (!includeNodes.length) {
      initMenu();
      return;
    }

    Promise.all(
      Array.from(includeNodes).map(function (node) {
        const path = node.getAttribute("data-include");
        if (!path) return Promise.resolve();
        const includeUrl = new URL(path, window.location.href).toString();

        return fetch(includeUrl)
          .then(function (response) {
            if (!response.ok) throw new Error("Failed to load include: " + includeUrl);
            return response.text();
          })
          .then(function (html) {
            node.innerHTML = html;
          })
          .catch(function (error) {
            console.error(error);
          });
      })
    ).then(function () {
      initMenu();
    });
  }

  loadIncludes();
})();
