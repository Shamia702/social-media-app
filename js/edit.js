import { getRequest, putRequest } from "./api.js";

const postId = new URLSearchParams(window.location.search).get("id");
const postTitleInput = document.getElementById("postTitle");
const postBodyInput = document.getElementById("postBody");
const postImageInput = document.getElementById("postImage");
const editPostForm = document.getElementById("editPostForm");

if (!postId) {
  alert("No post specified!");
  window.location.href = "profile.html";
}

async function loadPost() {
  try {
    const data = await getRequest(
      `/social/posts/${postId}?_author=true&_comments=true&_reactions=true`
    );
    const post = data.data;

    postTitleInput.value = post.title || "";
    postBodyInput.value = post.body || "";
    postImageInput.value = post.media?.url || "";
  } catch (err) {
    console.error("Failed to load post:", err);
    alert("Failed to load post: " + err.message);
    window.location.href = "profile.html";
  }
}

editPostForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const updatedPost = {
    title: postTitleInput.value.trim(),
    body: postBodyInput.value.trim(),
  };

  if (postImageInput.value.trim()) {
    updatedPost.media = { url: postImageInput.value.trim() };
  }

  try {
    await putRequest(`/social/posts/${postId}`, updatedPost);
    alert("Post updated successfully!");
    window.location.href = "profile.html";
  } catch (err) {
    console.error("Failed to update post:", err);
    alert("Failed to update post: " + err.message);
  }
});

document.addEventListener("DOMContentLoaded", loadPost);
