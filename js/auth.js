import { postRequest } from "./api.js";

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
    return user? JSON.parse(user) : null;
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

/**
 * Registers a new user on the Noroff API.
 * @async
 * @param {string} name - The user's display name.
 * @param {string} email - The user's Noroff email address.
 * @param {string} password - The user's chosen password.
 * @returns {Promise<Object>} The registered user data.
 * @throws {Error} Throws if registration fails.
 */

export async function registerUser(name, email, password) {
    const body = { name, email, password};
    const data = await postRequest("/auth/register", body);
    return data;
}


/**
 * Logs in an existing user on the Noroff API.
 * @async
 * @param {string} email - The user's Noroff email address.
 * @param {string} password - The user's password.
 * @returns {Promise<Object>} The login response data.
 * @throws {Error} Throws if login fails.
 */

export async function loginUser(email, password) {
  const body = { email, password };
  const data = await postRequest("/auth/login", body);
  return data;
}