import { postRequest } from "./api.js";

const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  try {
    const data = await postRequest("/auth/login", { email, password });

    localStorage.setItem("token", data.data.accessToken);
    localStorage.setItem("user", JSON.stringify(data.data));

    window.location.href = "./feed.html";
  } catch (err) {
    console.error("login error:", err);
    alert(err.message);
  }
});
