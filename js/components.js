export function loadHeader() {
    fetch("../components/header.html")
    .then(res => res.text())
    .then(data => {
        document.getElementById("header").innerHTML = data;

        const token = localStorage.getItem("token");

        const loginLink = document.getElementById("nav-login");
        const registerLink = document.getElementById("nav-register");

        const feedLink = document.getElementById("nav-feed");
        const profileLink = document.getElementById("nav-profile");
        const logoutLink = document.getElementById("nav-logout");

        if (token) {
            if (loginLink) loginLink.style.display = "none";
            if (registerLink) registerLink.style.display = "none";
            if (feedLink) feedLink.style.display = "block";
            if (profileLink) profileLink.style.display = "block";
            if (logoutLink) logoutLink.style.display = "block";

            const logoutBtn = document.getElementById("logoutBtn");
            if(logoutBtn) {
                logoutBtn.addEventListener("click", () => {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user"); // optional
                    window.location.href= "../index.html";

                });
            }
        } else {
             if (loginLink) loginLink.style.display = "block";
            if (registerLink) registerLink.style.display = "block";
            if (feedLink) feedLink.style.display = "none";
            if (profileLink) profileLink.style.display = "none";
            if (logoutLink) logoutLink.style.display = "none";
        }
    })
    .catch(err => console.error("Error loading header:", err));
}


export function loadFooter() {
    fetch("../components/footer.html")
    .then(response => response.text())
    .then(data => {
        document.getElementById("footer").innerHTML = data;
    })
    .catch(err => console.error("Error loadding footer:", err));
}

loadHeader();
loadFooter();