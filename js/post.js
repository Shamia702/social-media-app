import { getRequest, postRequest, deleteRequest } from "./api.js";
import { getUser } from "./auth.js";
import { loader } from "./loader.js";

const postId = new URLSearchParams(window.location.search).get("id");

const postTitleEl = document.getElementById("postTitle");
const postBodyEl = document.getElementById("postBody");
const postAuthorEl = document.getElementById("postAuthor");
const postDateEl = document.getElementById("postDate");
const commentsContainer = document.getElementById("commentsContainer");
const commentForm = document.getElementById("commentForm");
const commentInput = document.getElementById("commentInput");

const likeBtn = document.getElementById("likeBtn");
const likeCountEl = document.getElementById("likeCount");

const loggedInUser = getUser();

let postData = null;

async function loadPost() {
  if (!postId) {
    postTitleEl.textContent = "Post not found";
    return;
  }

  try {
    loader.show();
    const data = await getRequest(
      `/social/posts/${postId}?_author=true&_comments=true&_reactions=true`
    );
    loader.hide();
    postData = data.data;

    postTitleEl.textContent = postData.title || "Untitled Post";
    postBodyEl.textContent = postData.body || "";
    postAuthorEl.textContent = `by ${postData.author?.name || "Unknown"}`;
    postDateEl.textContent = new Date(postData.created).toLocaleString();

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

    renderComments();

    likeCountEl.textContent =
      postData.reactions?.filter((r) => r.type === "like").length || 0;
  } catch (err) {
    loader.hide();
    console.error("Failed to load post:", err);
    postTitleEl.textContent = "Failed to load post";
    postBodyEl.textContent = err.message;
  }
}

function renderComments() {
  if (!postData.comments || postData.comments.length === 0) {
    commentsContainer.innerHTML = "<p class='text-muted'>No comments yet.</p>";
    return;
  }

  commentsContainer.innerHTML = postData.comments
    .map((comment) => {
      const authorName = comment.owner || "Anonymous";
      const isOwner = authorName === loggedInUser?.name;

      return `
      <div class="border rounded p-2 mb-2 d-flex justify-content-between align-items-center">
        <div>
          <strong>${authorName}</strong>: ${comment.body}
        </div>
        ${
          isOwner
            ? `<button class="btn btn-sm btn-outline-danger delete-comment-btn" data-id="${comment.id}">Delete</button>`
            : ""
        }
      </div>
      `;
    })
    .join("");

  document.querySelectorAll(".delete-comment-btn").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const commentId = e.target.dataset.id;
      if (!commentId) return;

      try {
        await deleteRequest(`/social/posts/${postId}/comment/${commentId}`);
        await loadPost();
      } catch (err) {
        console.error("Failed to delete comment:", err);
        alert("Failed to delete comment: " + err.message);
      }
    });
  });
}

if (commentForm) {
  commentForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const commentBody = commentInput.value.trim();
    if (!commentBody) return;

    try {
      await postRequest(`/social/posts/${postId}/comment`, {
        body: commentBody,
      });
      commentInput.value = "";
      await loadPost();
    } catch (err) {
      console.error("Failed to post comment:", err);
      alert("Failed to post comment: " + err.message);
    }
  });
}

if (likeBtn) {
  likeBtn.addEventListener("click", async () => {
    try {
      await postRequest(`/social/posts/${postId}/react/like`);
      await loadPost();
    } catch (err) {
      console.error("Failed to like post:", err);
      alert("Failed to like post: " + err.message);
    }
  });
}

document.addEventListener("DOMContentLoaded", loadPost);
