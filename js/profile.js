// import { getRequest } from "./api.js";

// const profileNameEl = document.getElementById("profileName");
// const profileEmailEl = document.getElementById("profileEmail");
// const profileBioEl = document.getElementById("profileBio");
// const profileAvatarEl = document.getElementById("profileAvatar");
// const profileBannerEl = document.getElementById("profileBanner");
// const userPostsContainer = document.getElementById("userPostsContainer");

// // Check if a user query param is provided
// const queryUser = new URLSearchParams(window.location.search).get("user");

// // Function to load user info
// async function loadUserInfo() {
//   let user = null;

//   if (queryUser) {
//     // Fetch user from API by username
//     try {
//       const data = await getRequest(`/profiles?name=${queryUser}`);
//       if (data.data.length > 0) user = data.data[0];
//     } catch (err) {
//       console.error("Failed to load user info:", err);
//     }
//   } else {
//     // Load logged-in user info
//     user = JSON.parse(localStorage.getItem("user"));
//   }

//   if (!user) {
//     profileNameEl.textContent = "User not found";
//     profileEmailEl.textContent = "";
//     profileBioEl.textContent = "";
//     profileAvatarEl.src = "https://via.placeholder.com/150";
//     profileBannerEl.src = "https://via.placeholder.com/1500x500";
//     return null;
//   }

//   // Fill profile info
//   profileNameEl.textContent = user.name || "Unknown";
//   profileEmailEl.textContent = user.email || "";
//   profileBioEl.textContent = user.bio || "This user has no bio yet.";
//   profileAvatarEl.src = user.avatar?.url || "https://via.placeholder.com/150";
//   profileBannerEl.src = user.banner?.url || "https://via.placeholder.com/1500x500";

//   return user;
// }

// // Load user's posts
// async function loadUserPosts(user) {
//   if (!user) return;

//   try {
//     const data = await getRequest(`/social/posts?_author=true&_comments=true&_reactions=true`);
//     const userPosts = data.data.filter(post => post.author?.name === user.name);

//     if (userPosts.length === 0) {
//       userPostsContainer.innerHTML = `<p class="text-muted">No posts yet.</p>`;
//       return;
//     }

//     userPostsContainer.innerHTML = userPosts
//       .map(post => renderPost(post))
//       .join("");
//   } catch (err) {
//     console.error("Failed to load posts:", err);
//     userPostsContainer.innerHTML = `<p class="text-danger">Failed to load posts. ${err.message}</p>`;
//   }
// }

// // Render single post card
// function renderPost(post) {
//   const title = post.title || "Untitled";
//   const body = post.body || "";
//   const image = post.media?.url || "";
//   const date = new Date(post.created).toLocaleString();

//   return `
//     <div class="col-12 col-md-6 col-lg-4">
//       <div class="card shadow-sm border-0 rounded-4">
//         <div class="card-body">
//           <h5 class="card-title fw-bold">${title}</h5>
//           <p class="card-text">${body}</p>
//           ${image ? `<img src="${image}" class="img-fluid rounded mt-2" alt="Post image">` : ""}
//           <small class="text-muted d-block mt-2">${date}</small>
//           <a href="post.html?id=${post.id}" class="btn btn-sm btn-primary mt-2">View Post</a>
//         </div>
//       </div>
//     </div>
//   `;
// }

// // Initialize
// document.addEventListener("DOMContentLoaded", async () => {
//   const user = await loadUserInfo();
//   await loadUserPosts(user);
// });


import { getRequest, followUser, unfollowUser } from "./api.js";

const profileNameEl = document.getElementById("profileName");
const profileEmailEl = document.getElementById("profileEmail");
const profileBioEl = document.getElementById("profileBio");
const profileAvatarEl = document.getElementById("profileAvatar");
const profileBannerEl = document.getElementById("profileBanner");
const userPostsContainer = document.getElementById("userPostsContainer");

const followersCountEl = document.getElementById("followersCount");
const followingCountEl = document.getElementById("followingCount");
const followBtn = document.getElementById("followBtn");
const followersBtn = document.getElementById("followersBtn");
const followingBtn = document.getElementById("followingBtn");

const connectionsModalLabel = document.getElementById("connectionsModalLabel");
const connectionsList = document.getElementById("connectionsList");

const queryUser = new URLSearchParams(window.location.search).get("user");
const loggedInUser = JSON.parse(localStorage.getItem("user"));

let currentUserData = null; // currently viewed profile

// --- Follow button listener (added once) ---
followBtn.addEventListener("click", async () => {
  if (!currentUserData) return;
  followBtn.disabled = true;

  try {
    const isFollowing = currentUserData.followers?.some(f => f.name === loggedInUser?.name);

    if (isFollowing) {
      await unfollowUser(currentUserData.name);
    } else {
      await followUser(currentUserData.name);
    }

    // Refresh profile data
    const updatedData = await getRequest(`/social/profiles/${currentUserData.name}?_followers=true&_following=true`);
    currentUserData = updatedData.data || updatedData;

    // Update counts
    followersCountEl.textContent = currentUserData.followers?.length ?? 0;
    followingCountEl.textContent = currentUserData.following?.length ?? 0;

    // Update button state
    const nowFollowing = currentUserData.followers?.some(f => f.name === loggedInUser?.name);
    updateFollowButton(nowFollowing);

    // Update modal if open
    if (connectionsList.innerHTML) {
      openConnectionsModal("followers", currentUserData.followers);
    }

  } catch (err) {
    console.error("Follow/unfollow error:", err);
  } finally {
    followBtn.disabled = false;
  }
});

// --- Load profile info ---
async function loadUserInfo() {
  try {
    const username = queryUser || loggedInUser?.name;

    const data = await getRequest(`/social/profiles/${username}?_followers=true&_following=true`);
    const user = data.data || data;

    if (!user) throw new Error("User not found");
    currentUserData = user;

    profileNameEl.textContent = user.name;
    profileEmailEl.textContent = user.email || "";
    profileBioEl.textContent = user.bio || "This user has no bio yet.";
    profileAvatarEl.src = user.avatar?.url || "https://via.placeholder.com/150";
    profileBannerEl.src = user.banner?.url || "https://via.placeholder.com/1500x500";

    followersCountEl.textContent = user.followers?.length ?? 0;
    followingCountEl.textContent = user.following?.length ?? 0;

    followersBtn.addEventListener("click", () => openConnectionsModal("followers", currentUserData.followers));
    followingBtn.addEventListener("click", () => openConnectionsModal("following", currentUserData.following));

    // Show follow button only on other users
    if (queryUser && queryUser !== loggedInUser?.name) {
      followBtn.classList.remove("d-none");
      const isFollowing = user.followers?.some(f => f.name === loggedInUser?.name);
      updateFollowButton(isFollowing);
    } else {
      followBtn.classList.add("d-none");
    }

    return user;
  } catch (err) {
    console.error("Failed to load user info:", err);
    profileNameEl.textContent = "User not found";
    userPostsContainer.innerHTML = `<p class="text-center text-muted">No posts to display.</p>`;
    return null;
  }
}

// --- Update Follow button style ---
function updateFollowButton(isFollowing) {
  followBtn.textContent = isFollowing ? "Unfollow" : "Follow";
  followBtn.classList.toggle("btn-primary", isFollowing);
  followBtn.classList.toggle("btn-outline-primary", !isFollowing);
}

// --- Modal for followers/following ---
function openConnectionsModal(type, users = []) {
  connectionsModalLabel.textContent = type === "followers" ? "Followers" : "Following";

  if (!users || users.length === 0) {
    connectionsList.innerHTML = `<p class="text-muted">No ${type} found.</p>`;
  } else {
    connectionsList.innerHTML = users
      .map(user => `
        <li class="d-flex align-items-center gap-3 py-2 border-bottom">
          <img src="${user.avatar?.url || 'https://via.placeholder.com/50'}"
               alt="${user.name}'s avatar"
               class="rounded-circle" width="40" height="40" style="object-fit: cover;">
          <div>
            <a href="profile.html?user=${user.name}" class="text-decoration-none text-dark fw-semibold">
              ${user.name}
            </a>
          </div>
        </li>
      `).join("");
  }

  const modal = new bootstrap.Modal(document.getElementById("connectionsModal"));
  modal.show();
}

// --- Load posts ---
async function loadUserPosts(user) {
  if (!user) return;

  try {
    const data = await getRequest("/social/posts?_author=true&_comments=true&_reactions=true");
    const userPosts = data.data.filter(post => post.author?.name === user.name);

    if (!userPosts || userPosts.length === 0) {
      userPostsContainer.innerHTML = `<p class="text-muted">No posts yet.</p>`;
      return;
    }

    userPostsContainer.innerHTML = userPosts.map(renderPost).join("");
  } catch (err) {
    console.error("Failed to load posts:", err);
    userPostsContainer.innerHTML = `<p class="text-danger">Failed to load posts. ${err.message}</p>`;
  }
}

// --- Render single post ---
function renderPost(post) {
  const title = post.title || "Untitled";
  const body = post.body || "";
  const image = post.media?.url || "";
  const date = new Date(post.created).toLocaleString();
  const postId = post.id;

  return `
    <div class="col-12 col-md-6 col-lg-4">
      <div class="card shadow-sm border-0 rounded-4">
        <div class="card-body">
          <h5 class="card-title fw-bold">${title}</h5>
          <p class="card-text">${body}</p>
          ${image ? `<img src="${image}" class="img-fluid rounded mt-2" alt="Post image">` : ""}
          <small class="text-muted d-block mt-2">${date}</small>
          <a href="post.html?id=${postId}" class="btn btn-sm btn-primary mt-2">View Post</a>
        </div>
      </div>
    </div>
  `;
}

// --- Initialize ---
document.addEventListener("DOMContentLoaded", async () => {
  const user = await loadUserInfo();
  await loadUserPosts(user);
});
