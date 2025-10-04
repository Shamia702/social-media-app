// import { getRequest, postRequest } from "./api.js";

// // Get post ID from URL query string
// const postId = new URLSearchParams(window.location.search).get("id");

// // DOM elements
// const postTitleEl = document.getElementById("postTitle");
// const postBodyEl = document.getElementById("postBody");
// const postAuthorEl = document.getElementById("postAuthor");
// const postDateEl = document.getElementById("postDate");
// const commentsContainer = document.getElementById("commentsContainer");
// const commentForm = document.getElementById("commentForm");
// const commentInput = document.getElementById("commentInput");

// // Reaction buttons
// const likeBtn = document.getElementById("likeBtn");
// const likeCountEl = document.getElementById("likeCount");

// let postData = null; // store fetched post

// // Load post data
// async function loadPost() {
//   if (!postId) {
//     postTitleEl.textContent = "Post not found";
//     return;
//   }

//   try {
//     const data = await getRequest(`/social/posts/${postId}?_author=true&_comments=true&_reactions=true`);
//     postData = data.data;

//     // Fill post details
//     postTitleEl.textContent = postData.title || "Untitled Post";
//     postBodyEl.textContent = postData.body || "";
//     postAuthorEl.textContent = `by ${postData.author?.name || "Unknown"}`;
//     postDateEl.textContent = new Date(postData.created).toLocaleString();

//     // Add post image if exists
//     const existingImg = document.querySelector("#postBody + img");
//     if (postData.media?.url) {
//       if (!existingImg) {
//         const img = document.createElement("img");
//         img.src = postData.media.url;
//         img.alt = "Post image";
//         img.className = "img-fluid rounded my-3";
//         postBodyEl.after(img);
//       } else {
//         existingImg.src = postData.media.url;
//       }
//     } else if (existingImg) {
//       existingImg.remove();
//     }

//     // Render comments
//     renderComments();

//     // Show likes (count only "like" reactions)
//     likeCountEl.textContent = postData.reactions?.filter(r => r.type === "like").length || 0;

//   } catch (err) {
//     console.error("Failed to load post:", err);
//     postTitleEl.textContent = "Failed to load post";
//     postBodyEl.textContent = err.message;
//   }
// }

// // Render comments
// function renderComments() {
//   if (!postData.comments || postData.comments.length === 0) {
//     commentsContainer.innerHTML = "<p class='text-muted'>No comments yet.</p>";
//     return;
//   }

//   commentsContainer.innerHTML = postData.comments
//     .map(
//       comment => `
//       <div class="border rounded p-2 mb-2">
//         <strong>${comment.ownerName || "Anonymous"}</strong>: ${comment.body}
//       </div>
//     `
//     )
//     .join("");
// }

// // Handle new comment submission
// if (commentForm) {
//   commentForm.addEventListener("submit", async (e) => {
//     e.preventDefault();
//     const commentBody = commentInput.value.trim();
//     if (!commentBody) return;

//     try {
//       await postRequest(`/social/posts/${postId}/comment`, { body: commentBody });
//       commentInput.value = "";
//       await loadPost(); // reload post to update comments and reactions
//     } catch (err) {
//       console.error("Failed to post comment:", err);
//       alert("Failed to post comment: " + err.message);
//     }
//   });
// }

// // Handle like reaction
// if (likeBtn) {
//   likeBtn.addEventListener("click", async () => {
//     try {
//       await postRequest(`/social/posts/${postId}/react/like`);
//       await loadPost(); // reload to update like count
//     } catch (err) {
//       console.error("Failed to like post:", err);
//       alert("Failed to like post: " + err.message);
//     }
//   });
// }

// // Load post on page load
// document.addEventListener("DOMContentLoaded", loadPost);













// import { getRequest, postRequest, putRequest, deleteRequest } from "./api.js";

// // --- DOM elements ---
// const postTitleEl = document.getElementById("postTitle");
// const postBodyEl = document.getElementById("postBody");
// const postAuthorEl = document.getElementById("postAuthor");
// const postDateEl = document.getElementById("postDate");
// const commentsContainer = document.getElementById("commentsContainer");
// const commentForm = document.getElementById("commentForm");
// const commentInput = document.getElementById("commentInput");

// const likeBtn = document.getElementById("likeBtn");
// const likeCountEl = document.getElementById("likeCount");

// const editPostBtn = document.getElementById("editPostBtn");
// const deletePostBtn = document.getElementById("deletePostBtn");

// let postData = null; // store fetched post
// const loggedInUser = JSON.parse(localStorage.getItem("user"));
// const postId = new URLSearchParams(window.location.search).get("id");

// // --- Load post ---
// async function loadPost() {
//   if (!postId) {
//     postTitleEl.textContent = "Post not found";
//     return;
//   }

//   try {
//     const data = await getRequest(`/social/posts/${postId}?_author=true&_comments=true&_reactions=true`);
//     postData = data.data;

//     // Fill post details
//     postTitleEl.textContent = postData.title || "Untitled Post";
//     postBodyEl.textContent = postData.body || "";
//     postAuthorEl.textContent = `by ${postData.author?.name || "Unknown"}`;
//     postDateEl.textContent = new Date(postData.created).toLocaleString();

//     // Show post image
//     const existingImg = document.querySelector("#postBody + img");
//     if (postData.media?.url) {
//       if (!existingImg) {
//         const img = document.createElement("img");
//         img.src = postData.media.url;
//         img.alt = "Post image";
//         img.className = "img-fluid rounded my-3";
//         postBodyEl.after(img);
//       } else {
//         existingImg.src = postData.media.url;
//       }
//     } else if (existingImg) {
//       existingImg.remove();
//     }

//     // Show likes
//     likeCountEl.textContent = postData.reactions?.filter(r => r.type === "like").length || 0;

//     // Show edit/delete buttons only for post owner
//     if (loggedInUser?.name === postData.author?.name) {
//       editPostBtn.classList.remove("d-none");
//       deletePostBtn.classList.remove("d-none");
//     } else {
//       editPostBtn.classList.add("d-none");
//       deletePostBtn.classList.add("d-none");
//     }

//     renderComments();
//   } catch (err) {
//     console.error("Failed to load post:", err);
//     postTitleEl.textContent = "Failed to load post";
//     postBodyEl.textContent = err.message;
//   }
// }

// // --- Render comments ---
// function renderComments() {
//   if (!postData.comments || postData.comments.length === 0) {
//     commentsContainer.innerHTML = "<p class='text-muted'>No comments yet.</p>";
//     return;
//   }

//   commentsContainer.innerHTML = postData.comments
//     .map(comment => {
//       const isOwner = comment.ownerName === loggedInUser?.name;
//       return `
//       <div class="border rounded p-2 mb-2" data-comment-id="${comment.id}">
//         <strong>${comment.ownerName || "Anonymous"}</strong>: 
//         <span class="comment-body">${comment.body}</span>
//         ${isOwner ? `
//           <div class="mt-1">
//             <button class="btn btn-sm btn-outline-primary edit-comment-btn">Edit</button>
//             <button class="btn btn-sm btn-outline-danger delete-comment-btn">Delete</button>
//           </div>` : ""}
//       </div>
//       `;
//     })
//     .join("");

//   addCommentEventListeners();
// }

// // --- Add/Edit/Delete comment event listeners ---
// function addCommentEventListeners() {
//   const editButtons = document.querySelectorAll(".edit-comment-btn");
//   const deleteButtons = document.querySelectorAll(".delete-comment-btn");

//   editButtons.forEach(btn => {
//     btn.addEventListener("click", async (e) => {
//       const commentDiv = e.target.closest("[data-comment-id]");
//       const commentBodyEl = commentDiv.querySelector(".comment-body");
//       const commentId = commentDiv.getAttribute("data-comment-id");

//       commentBodyEl.contentEditable = true;
//       commentBodyEl.focus();
//       btn.textContent = "Save";

//       btn.onclick = async () => {
//         const updatedBody = commentBodyEl.textContent.trim();
//         if (!updatedBody) return alert("Comment cannot be empty.");

//         try {
//           await putRequest(`/social/posts/${postId}/comment/${commentId}`, { body: updatedBody });
//           commentBodyEl.contentEditable = false;
//           btn.textContent = "Edit";
//           await loadPost();
//         } catch (err) {
//           console.error("Failed to update comment:", err);
//           alert("Failed to update comment: " + err.message);
//         }
//       };
//     });
//   });

//   deleteButtons.forEach(btn => {
//     btn.addEventListener("click", async (e) => {
//       const commentDiv = e.target.closest("[data-comment-id]");
//       const commentId = commentDiv.getAttribute("data-comment-id");

//       if (!confirm("Are you sure you want to delete this comment?")) return;

//       try {
//         await deleteRequest(`/social/posts/${postId}/comment/${commentId}`);
//         await loadPost();
//       } catch (err) {
//         console.error("Failed to delete comment:", err);
//         alert("Failed to delete comment: " + err.message);
//       }
//     });
//   });
// }

// // --- Add new comment ---
// if (commentForm) {
//   commentForm.addEventListener("submit", async (e) => {
//     e.preventDefault();
//     const commentBody = commentInput.value.trim();
//     if (!commentBody) return;

//     try {
//       await postRequest(`/social/posts/${postId}/comment`, { body: commentBody });
//       commentInput.value = "";
//       await loadPost();
//     } catch (err) {
//       console.error("Failed to post comment:", err);
//       alert("Failed to post comment: " + err.message);
//     }
//   });
// }

// // --- Like a post ---
// if (likeBtn) {
//   likeBtn.addEventListener("click", async () => {
//     try {
//       await postRequest(`/social/posts/${postId}/react/like`);
//       await loadPost();
//     } catch (err) {
//       console.error("Failed to like post:", err);
//       alert("Failed to like post: " + err.message);
//     }
//   });
// }

// // --- Edit post ---
// if (editPostBtn) {
//   editPostBtn.addEventListener("click", async () => {
//     const newTitle = prompt("Enter new title:", postData.title);
//     const newBody = prompt("Enter new body:", postData.body);
//     if (!newTitle || !newBody) return;

//     try {
//       await putRequest(`/social/posts/${postId}`, { title: newTitle, body: newBody });
//       await loadPost();
//       alert("Post updated successfully!");
//     } catch (err) {
//       console.error("Failed to update post:", err);
//       alert("Failed to update post: " + err.message);
//     }
//   });
// }

// // --- Delete post ---
// if (deletePostBtn) {
//   deletePostBtn.addEventListener("click", async () => {
//     if (!confirm("Are you sure you want to delete this post?")) return;

//     try {
//       await deleteRequest(`/social/posts/${postId}`);
//       alert("Post deleted successfully!");
//       window.location.href = "feed.html"; // redirect to feed
//     } catch (err) {
//       console.error("Failed to delete post:", err);
//       alert("Failed to delete post: " + err.message);
//     }
//   });
// }

// // --- Initialize ---
// document.addEventListener("DOMContentLoaded", loadPost);









import { getRequest, postRequest, deleteRequest } from "./api.js";

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

// Logged-in user
const loggedInUser = JSON.parse(localStorage.getItem("user"));

let postData = null; // store fetched post

// --- Load post ---
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

// --- Render comments ---
function renderComments() {
  if (!postData.comments || postData.comments.length === 0) {
    commentsContainer.innerHTML = "<p class='text-muted'>No comments yet.</p>";
    return;
  }

  commentsContainer.innerHTML = postData.comments
    .map(comment => {
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

  // Attach delete listeners
  document.querySelectorAll(".delete-comment-btn").forEach(btn => {
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

// --- Handle new comment submission ---
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

// --- Handle like reaction ---
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

// --- Initialize ---
document.addEventListener("DOMContentLoaded", loadPost);
