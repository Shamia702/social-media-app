const BASE_URL = "https://v2.api.noroff.dev";

/**
 * function to handle API responses
 * @async
 * @param {Response} response - The response object from fetch.
 * @returns {Promise<Object>} Parsed JSON response data.
 * @throws{Error} Throws an error if response is not ok.
 */

async function handleResponse(response) {
  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    const message =
      errData.errors?.[0].message || `HTTP error! Status: ${response.status}`;
    throw new Error(message);
  }
  return response.json();
}

/**
 * Builds headers with Authorization and API key if available.
 * @returns {Object} Headers object for API calls.
 */
function getHeaders() {
  const token = localStorage.getItem("token");
   const apiKey = "4900a64f-c4b6-466c-91a0-a7066502968e"; 

  const headers = {
    "Content-Type": "application/json",
    "X-Noroff-API-Key": apiKey,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
}

/**
 * Sends a GET request to the specified API endpoint.
 * @async
 * @param {string} endpoint - API endpoint.
 * @returns {Promise<Object>} Response data.
 * @throws {Error} Throws error if request fails or response not OK.
 */

export async function getRequest(endpoint) {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: "GET",
    headers: getHeaders(),
  });
  return handleResponse(response);
}

/**
 * Sends a POST request to the specified API endpoint.
 * @async
 * @param {string} endpoint - API endpoint.
 * @param {Object} body - Data to send in the request body.
 * @returns {Promise<Object>} Response data.
 * @throws {Error} Throws error if request fails or response not OK.
 */
export async function postRequest(endpoint, body) {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(body),
  });
  return handleResponse(response);
}

/**
 * Sends a PUT request to the specified API endpoint.
 * @async
 * @param {string} endpoint - API endpoint.
 * @param {Object} body - Updated data to send in the request body.
 * @returns {Promise<Object>} Response data.
 * @throws {Error} Throws error if request fails or response not OK.
 */

export async function putRequest(endpoint, body) {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(body),
  });
  return handleResponse(response);
}

/**
 * Sends a DELETE request to the specified API endpoint.
 * @async
 * @param {string} endpoint - API endpoint.
 * @returns {Promise<Object>} Response data or confirmation message.
 * @throws {Error} Throws error if request fails or response not OK.
 */
export async function deleteRequest(endpoint) {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  return handleResponse(response);
}
