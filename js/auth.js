/**
 * saves the user token and profile in local storage.
 * @param {Object} data- The login or registration response data.
 * @param {string} data.accesstoken - The JWT access token.
 * @param {Object} data.user- The user profile information.
 */

export function saveAuth(data) {
  localStorage.setItem("token", data.accesstoken);
  localStorage.setItem("user", JSON.stringify(data.user));
}

/**
 * Get the logged-in user’s information from localStorage.
 * @returns {Object|null} The user object if available, otherwise null.
 */

export function getUser() {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}

/**
 * Retrieves the saved authentication token.
 * @returns {string|null} The access token if available, otherwise null.
 */

export function getToken() {
  return localStorage.getItem("token");
}

/**
 * log the user out by clearing localStorage and redirecting to the login page.
 */

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "../pages/login.html";
}
