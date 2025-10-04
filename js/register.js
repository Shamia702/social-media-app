import { postRequest } from "./api.js";

const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  let name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  name = name.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "");

  try {
    const data = await postRequest("/auth/register", { name, email, password });

    alert("Account created successfully! Please login.");
    window.location.href = "./login.html";
  } catch (err) {
    console.error("Register error:", err);
    alert(err.message);
  }
});
