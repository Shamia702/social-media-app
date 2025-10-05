import { getRequest, deleteRequest, followUser, unfollowUser } from "./api.js";

import { getUser, getToken } from "./auth.js";
import { loader } from "./loader.js";

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
const loggedInUser = getUser();

if (!getToken()) {
  window.location.href = "./login.html";
}

let currentUserData = null;

followBtn.addEventListener("click", async () => {
  if (!currentUserData) return;
  followBtn.disabled = true;

  try {
    const isFollowing = currentUserData.followers?.some(
      (f) => f.name === loggedInUser?.name
    );

    if (isFollowing) {
      await unfollowUser(currentUserData.name);
    } else {
      await followUser(currentUserData.name);
    }

    const updatedData = await getRequest(
      `/social/profiles/${currentUserData.name}?_followers=true&_following=true`
    );
    currentUserData = updatedData.data || updatedData;

    followersCountEl.textContent = currentUserData.followers?.length ?? 0;
    followingCountEl.textContent = currentUserData.following?.length ?? 0;

    const nowFollowing = currentUserData.followers?.some(
      (f) => f.name === loggedInUser?.name
    );
    updateFollowButton(nowFollowing);

    if (connectionsList.innerHTML) {
      openConnectionsModal("followers", currentUserData.followers);
    }
  } catch (err) {
    console.error("Follow/unfollow error:", err);
    alert("Failed to follow/unfollow user: " + err.message);
  } finally {
    followBtn.disabled = false;
  }
});
async function loadUserInfo() {
  try {
    const username = queryUser || loggedInUser?.name;

    const data = await getRequest(
      `/social/profiles/${username}?_followers=true&_following=true`
    );
    const user = data.data || data;

    if (!user) throw new Error("User not found");
    currentUserData = user;

    profileNameEl.textContent = user.name;
    profileEmailEl.textContent = user.email || "";
    profileBioEl.textContent = user.bio || "This user has no bio yet.";
    profileAvatarEl.src = user.avatar?.url || "https://via.placeholder.com/150";
    profileBannerEl.src =
      user.banner?.url || "https://via.placeholder.com/1500x500";

    followersCountEl.textContent = user.followers?.length ?? 0;
    followingCountEl.textContent = user.following?.length ?? 0;

    followersBtn.addEventListener("click", () =>
      openConnectionsModal("followers", currentUserData.followers)
    );
    followingBtn.addEventListener("click", () =>
      openConnectionsModal("following", currentUserData.following)
    );

    if (queryUser && queryUser !== loggedInUser?.name) {
      followBtn.classList.remove("d-none");
      const isFollowing = user.followers?.some(
        (f) => f.name === loggedInUser?.name
      );
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

function updateFollowButton(isFollowing) {
  followBtn.textContent = isFollowing ? "Unfollow" : "Follow";
  followBtn.classList.toggle("btn-primary", isFollowing);
  followBtn.classList.toggle("btn-outline-primary", !isFollowing);
}

function openConnectionsModal(type, users = []) {
  connectionsModalLabel.textContent =
    type === "followers" ? "Followers" : "Following";

  if (!users || users.length === 0) {
    connectionsList.innerHTML = `<p class="text-muted">No ${type} found.</p>`;
  } else {
    connectionsList.innerHTML = users
      .map(
        (user) => `
        <li class="d-flex align-items-center gap-3 py-2 border-bottom">
          <img src="${user.avatar?.url || "https://via.placeholder.com/50"}"
               alt="${user.name}'s avatar"
               class="rounded-circle" width="40" height="40" style="object-fit: cover;">
          <div>
            <a href="profile.html?user=${
              user.name
            }" class="text-decoration-none text-dark fw-semibold">
              ${user.name}
            </a>
          </div>
        </li>
      `
      )
      .join("");
  }

  const modal = new bootstrap.Modal(
    document.getElementById("connectionsModal")
  );
  modal.show();
}

async function loadUserPosts(user) {
  if (!user) return;

  try {
    loader.show();
    const data = await getRequest(
      "/social/posts?_author=true&_comments=true&_reactions=true"
    );
    loader.hide();
    const userPosts = data.data.filter(
      (post) => post.author?.name === user.name
    );

    if (!userPosts || userPosts.length === 0) {
      userPostsContainer.innerHTML = `<p class="text-muted">No posts yet.</p>`;
      return;
    }

    userPostsContainer.innerHTML = userPosts.map(renderPost).join("");
  } catch (err) {
    loader.hide();
    console.error("Failed to load posts:", err);
    userPostsContainer.innerHTML = `<p class="text-danger">Failed to load posts. ${err.message}</p>`;
  }
}

function renderPost(post) {
  const title = post.title || "Untitled";
  const body = post.body || "";
  const image = post.media?.url || "";
  const date = new Date(post.created).toLocaleString();
  const postId = post.id;

  const isOwner = post.author?.name === loggedInUser?.name;

  return `
    <div class="col-12 col-md-6 col-lg-4" id="post-${postId}">
      <div class="card shadow-sm border-0 rounded-4">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title fw-bold">${title}</h5>
          <p class="card-text flex-grow-1">${body}</p>
          ${
            image
              ? `<img src="${image}" class="img-fluid rounded mt-2" alt="Post image">`
              : ""
          }
          <small class="text-muted d-block mt-2">${date}</small>

          <div class="mt-3 d-flex gap-2">
            <a href="post.html?id=${postId}" class="btn btn-sm btn-primary">View</a>
            ${
              isOwner
                ? `
              <a href="edit.html?id=${postId}" class="btn btn-sm btn-warning">Edit</a>
              <button class="btn btn-sm btn-danger" onclick="deletePost('${postId}')">Delete</button>
            `
                : ""
            }
          </div>
        </div>
      </div>
    </div>
  `;
}

window.deletePost = async function (postId) {
  if (!confirm("Are you sure you want to delete this post?")) return;

  try {
    await deleteRequest(`/social/posts/${postId}`);
    document.getElementById(`post-${postId}`).remove();
    alert("Post deleted successfully!");
  } catch (err) {
    console.error("Failed to delete post:", err);
    alert("Failed to delete post: " + err.message);
  }
};

document.addEventListener("DOMContentLoaded", async () => {
  const user = await loadUserInfo();
  await loadUserPosts(user);
});
