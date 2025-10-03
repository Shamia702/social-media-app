import { getRequest, postRequest } from "./api.js";

const postsContainer = document.getElementById("postsContainer");
const createPostForm = document.getElementById("createPostForm");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

let allPosts = []; // store fetched posts

// Load posts from API
async function loadFeed() {
  try {
    const data = await getRequest("/social/posts?_author=true&_comments=true&_reactions=true");
    console.log("Fetched posts:", data);

    if (!data || !data.data || data.data.length === 0) {
      postsContainer.innerHTML = `
        <p class="text-center text-muted fs-5">No posts yet. Follow someone or create a new post!</p>
      `;
      allPosts = [];
      return;
    }

    allPosts = data.data;
    renderPosts(allPosts);

  } catch (error) {
    console.error("Failed to load feed:", error);
    postsContainer.innerHTML = `
      <p class="text-danger text-center mt-5">Failed to load posts. ${error.message}</p>
    `;
  }
}

// Render posts array
function renderPosts(posts) {
  if (!posts || posts.length === 0) {
    postsContainer.innerHTML = `
      <p class="text-center text-muted fs-5">No posts match your search.</p>
    `;
    return;
  }

  postsContainer.innerHTML = posts
    .map(post => renderPost(post))
    .join("");
}

// Render single post card
function renderPost(post) {
  const authorName = post.author?.name || "Unknown";
  const avatar = post.author?.avatar?.url || "https://via.placeholder.com/50";
  const title = post.title || "Untitled Post";
  const body = post.body || "";
  const image = post.media?.url || "";
  const postId = post.id;

  return `
    <div class="col-12 col-md-6 col-lg-4 d-flex">
      <div class="card shadow-sm border-0 rounded-4 flex-fill d-flex flex-column">
        <div class="card-body d-flex flex-column">
          <div class="d-flex align-items-center mb-3">
            <img src="${avatar}" alt="${authorName}" class="rounded-circle me-3" width="50" height="50" />
            <h5 class="mb-0">${authorName}</h5>
          </div>
          <h5 class="card-title fw-bold">${title}</h5>
          <p class="card-text flex-grow-1">${body}</p>
          ${image ? `<img src="${image}" class="img-fluid rounded mt-2" alt="Post image">` : ""}
          <a href="./post.html?id=${postId}" class="btn btn-primary mt-3">View Post</a>
        </div>
      </div>
    </div>
  `;
}

// Handle creating a new post
if (createPostForm) {
  createPostForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.getElementById("postTitle").value.trim();
    const body = document.getElementById("postBody").value.trim();
    const imageUrl = document.getElementById("postImage")?.value.trim() || "";

    if (!title || !body) return alert("Please fill in all required fields.");

    try {
      const newPost = await postRequest("/social/posts", {
        title,
        body,
        media: imageUrl ? { url: imageUrl } : undefined,
      });

      console.log("Post created:", newPost);
      alert("Post created successfully!");
      
      createPostForm.reset();
      loadFeed(); // reload feed

    } catch (error) {
      console.error("Failed to create post:", error);
      alert("Failed to create post. " + error.message);
    }
  });
}

// Handle search functionality
if (searchBtn) {
  searchBtn.addEventListener("click", () => {
    const query = searchInput.value.trim().toLowerCase();
    if (!query) {
      renderPosts(allPosts);
      return;
    }

    const filteredPosts = allPosts.filter(post => {
      const title = post.title?.toLowerCase() || "";
      const body = post.body?.toLowerCase() || "";
      return title.includes(query) || body.includes(query);
    });

    renderPosts(filteredPosts);
  });
}

// Optional: search on Enter key press
if (searchInput) {
  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      searchBtn.click();
    }
  });
}

// Load feed on page load
document.addEventListener("DOMContentLoaded", loadFeed);
