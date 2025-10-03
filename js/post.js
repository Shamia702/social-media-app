import { getRequest, postRequest } from "./api.js";

// Get post ID from URL query string
const postId = new URLSearchParams(window.location.search).get("id");

// DOM elements
const postTitleEl = document.getElementById("postTitle");
const postBodyEl = document.getElementById("postBody");
const postAuthorEl = document.getElementById("postAuthor");
const postDateEl = document.getElementById("postDate");
const commentsContainer = document.getElementById("commentsContainer");
const commentForm = document.getElementById("commentForm");
const commentInput = document.getElementById("commentInput");

// Reaction buttons
const likeBtn = document.getElementById("likeBtn");
const likeCountEl = document.getElementById("likeCount");

let postData = null; // store fetched post

// Load post data
async function loadPost() {
  if (!postId) {
    postTitleEl.textContent = "Post not found";
    return;
  }

  try {
    const data = await getRequest(`/social/posts/${postId}?_author=true&_comments=true&_reactions=true`);
    postData = data.data;

    // Fill post details
    postTitleEl.textContent = postData.title || "Untitled Post";
    postBodyEl.textContent = postData.body || "";
    postAuthorEl.textContent = `by ${postData.author?.name || "Unknown"}`;
    postDateEl.textContent = new Date(postData.created).toLocaleString();

    // Add post image if exists
    const existingImg = document.querySelector("#postBody + img");
    if (postData.media?.url) {
      if (!existingImg) {
        const img = document.createElement("img");
        img.src = postData.media.url;
        img.alt = "Post image";
        img.className = "img-fluid rounded my-3";
        postBodyEl.after(img);
      } else {
        existingImg.src = postData.media.url;
      }
    } else if (existingImg) {
      existingImg.remove();
    }

    // Render comments
    renderComments();

    // Show likes (count only "like" reactions)
    likeCountEl.textContent = postData.reactions?.filter(r => r.type === "like").length || 0;

  } catch (err) {
    console.error("Failed to load post:", err);
    postTitleEl.textContent = "Failed to load post";
    postBodyEl.textContent = err.message;
  }
}

// Render comments
function renderComments() {
  if (!postData.comments || postData.comments.length === 0) {
    commentsContainer.innerHTML = "<p class='text-muted'>No comments yet.</p>";
    return;
  }

  commentsContainer.innerHTML = postData.comments
    .map(
      comment => `
      <div class="border rounded p-2 mb-2">
        <strong>${comment.ownerName || "Anonymous"}</strong>: ${comment.body}
      </div>
    `
    )
    .join("");
}

// Handle new comment submission
if (commentForm) {
  commentForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const commentBody = commentInput.value.trim();
    if (!commentBody) return;

    try {
      await postRequest(`/social/posts/${postId}/comment`, { body: commentBody });
      commentInput.value = "";
      await loadPost(); // reload post to update comments and reactions
    } catch (err) {
      console.error("Failed to post comment:", err);
      alert("Failed to post comment: " + err.message);
    }
  });
}

// Handle like reaction
if (likeBtn) {
  likeBtn.addEventListener("click", async () => {
    try {
      await postRequest(`/social/posts/${postId}/react/like`);
      await loadPost(); // reload to update like count
    } catch (err) {
      console.error("Failed to like post:", err);
      alert("Failed to like post: " + err.message);
    }
  });
}

// Load post on page load
document.addEventListener("DOMContentLoaded", loadPost);
