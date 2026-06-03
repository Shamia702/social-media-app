import "../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js";
export function loadHeader() {
  const header = document.getElementById("header");

  header.innerHTML = `
    <nav class="navbar navbar-expand-lg navbar-light fixed-top talkify-navbar shadow-sm">
      <div class="container-fluid">
        <a class="navbar-brand" href="../index.html">Talkify</a>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item"><a class="nav-link" id="nav-feed" href="feed.html">Feed</a></li>
            <li class="nav-item"><a class="nav-link" id="nav-profile" href="profile.html">Profile</a></li>
            <li class="nav-item"><a class="nav-link" id="nav-login" href="../pages/login.html">Login</a></li>
            <li class="nav-item"><a class="nav-link" id="nav-register" href="../pages/register.html">Register</a></li>
            <li class="nav-item"><button class="nav-link btn btn-link" id="logoutBtn">Logout</button></li>
          </ul>
        </div>
      </div>
    </nav>
  `;

  const loginLink = document.getElementById("nav-login");
  const registerLink = document.getElementById("nav-register");
  const feedLink = document.getElementById("nav-feed");
  const profileLink = document.getElementById("nav-profile");
  const logoutBtn = document.getElementById("logoutBtn");
  const navbarCollapse = document.querySelector(".navbar-collapse");

  function updateNavbar() {
    const token = localStorage.getItem("token");

    if (token) {
      loginLink.style.display = "none";
      registerLink.style.display = "none";
      feedLink.style.display = "block";
      profileLink.style.display = "block";
      logoutBtn.style.display = "block";
    } else {
      loginLink.style.display = "block";
      registerLink.style.display = "block";
      feedLink.style.display = "none";
      profileLink.style.display = "none";
      logoutBtn.style.display = "none";
    }
  }
  updateNavbar();

  logoutBtn?.addEventListener("click", () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    updateNavbar();
    if (navbarCollapse.classList.contains("show")) {
      navbarCollapse.classList.remove("show");
    }
    window.location.href = "../index.html";
  });

  document.querySelectorAll(".navbar-nav .nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      if (navbarCollapse.classList.contains("show")) {
        navbarCollapse.classList.remove("show");
      }
    });
  });
}
export function loadFooter() {
  const footer = document.getElementById("footer");
  footer.innerHTML = `
    <footer class="footer text-center py-3 mt-auto">
      <p class="mb-0">© 2025 Talkify. All Rights Reserved.</p>
    </footer>
  `;
}

document.addEventListener("DOMContentLoaded", () => {
  loadHeader();
  loadFooter();
});
