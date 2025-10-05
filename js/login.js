import { postRequest } from "./api.js";
import { saveAuth } from "./auth.js";

const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  try {
    const data = await postRequest("/auth/login", { email, password });

    saveAuth({
      accesstoken: data.data.accessToken,
      user: data.data,
    });

    window.location.href = "./feed.html";
  } catch (err) {
    console.error("login error:", err);
    alert(err.message);
  }
});
