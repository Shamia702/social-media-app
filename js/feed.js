// // js/feed.js

// import { getRequest, postRequest, putRequest, deleteRequest } from "./api.js";
// import { getUser } from "./auth.js";

// const postsContainer = document.getElementById("postsContainer");
// const currentUser = getUser();

// // ------------------- Render posts -------------------
// function renderPosts(posts) {
//   postsContainer.innerHTML = "";

//   posts.forEach(post => {
//     const isOwner = currentUser && post.owner === currentUser.name;

//     const postEl = document.createElement("div");
//     postEl.classList.add("card", "p-3", "mb-3");
//     postEl.innerHTML = `
//       <h5>${post.ownerName || "Anonymous"}</h5>
//       <p>${post.body}</p>
//       ${post.media ? `<img src="${post.media}" class="img-fluid rounded mb-2" alt="Post image">` : ""}
//       ${isOwner ? `<button class="btn btn-sm btn-primary edit-btn">Edit</button>
//                    <button class="btn btn-sm btn-danger delete-btn">Delete</button>` : ""}
//       <hr>
//     `;

//     if (isOwner) {
//       postEl.querySelector(".edit-btn").addEventListener("click", async () => {
//         const newContent = prompt("Edit your post:", post.body);
//         if (newContent) {
//           const updated = await putRequest(`/social/posts/${post.id}`, { body: newContent, media: post.media || null });
//           postEl.querySelector("p").textContent = updated.body;
//         }
//       });

//       postEl.querySelector(".delete-btn").addEventListener("click", async () => {
//         if (confirm("Are you sure you want to delete this post?")) {
//           await deleteRequest(`/social/posts/${post.id}`);
//           postEl.remove();
//         }
//       });
//     }

//     postsContainer.appendChild(postEl);
//   });
// }

// // ------------------- Load feed -------------------
// async function loadFeed() {
//   try {
//     const myPosts = await getRequest("/social/posts");
//     const followingPosts = await getRequest("/social/posts/following");

//     const allPosts = [...myPosts, ...followingPosts]
//       .sort((a, b) => new Date(b.created) - new Date(a.created));

//     renderPosts(allPosts);
//   } catch (err) {
//     console.error("Failed to load feed:", err);
//     postsContainer.innerHTML = `<p class="text-danger">Failed to load posts: ${err.message}</p>`;
//   }
// }

// // ------------------- Create post -------------------
// const createPostForm = document.getElementById("createPostForm");
// createPostForm.addEventListener("submit", async (e) => {
//   e.preventDefault();

//   const body = document.getElementById("postBody").value.trim();
//   const image = document.getElementById("postImage").value.trim();

//   if (!body) return alert("Post content cannot be empty!");

//   try {
//     await postRequest("/social/posts", { body, media: image || null });
//     loadFeed();
//     document.getElementById("createPostModal").querySelector(".btn-close").click();
//     createPostForm.reset();
//   } catch (err) {
//     console.error("Failed to create post:", err);
//     alert(err.message);
//   }
// });

// // ------------------- Initialize -------------------
// document.addEventListener("DOMContentLoaded", loadFeed);

// js/feed.js
import { getRequest, postRequest } from "./api.js";

// Elements
const postsContainer = document.getElementById("postsContainer");
const createPostForm = document.getElementById("createPostForm");
const postTitleInput = document.getElementById("postTitle");
const postBodyInput = document.getElementById("postBody");

// Load all posts
async function loadFeed() {
  try {
    const posts = await getRequest("/social/posts"); // your own posts
    const followingPosts = await getRequest("/social/posts/following"); // posts from followed users
    const allPosts = [...posts, ...followingPosts].sort(
      (a, b) => new Date(b.created) - new Date(a.created)
    );

    postsContainer.innerHTML = "";
    allPosts.forEach((post) => {
      const postEl = document.createElement("div");
      postEl.className = "card p-3 mb-3";
      postEl.innerHTML = `
        <h5>${post.ownerName || "Anonymous"}</h5>
        <p>${post.body}</p>
        ${post.media ? `<img src="${post.media}" class="img-fluid mb-2"/>` : ""}
        <hr>
      `;
      postsContainer.appendChild(postEl);
    });
  } catch (err) {
    console.error("Failed to load feed:", err);
    postsContainer.innerHTML = `<p class="text-danger">Failed to load posts: ${err.message}</p>`;
  }
}

// Handle creating a new post
createPostForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const body = postBodyInput.value.trim();
  const title = postTitleInput.value.trim();

  if (!body) return alert("Post content cannot be empty");

  try {
    await postRequest("/social/posts", { body, title });
    postBodyInput.value = "";
    postTitleInput.value = "";
    loadFeed(); // refresh posts
  } catch (err) {
    console.error("Failed to create post:", err);
    alert(err.message);
  }
});

// Initialize feed
document.addEventListener("DOMContentLoaded", loadFeed);
