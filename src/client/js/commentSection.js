const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const textarea = document.querySelector("textarea");
const commentNbDiv = document.querySelector(".video__comments-nb");
const commentNb = commentNbDiv.querySelector("span:nth-child(2)");
const deleteBtns = document.querySelectorAll(".delete__btn");
const videoComments = document.querySelectorAll(".video__comment");

const addComment = (text, id) => {
  const nb = commentNb.innerText;
  commentNb.innerText = Number(nb) + 1;
  const videoComments = document.querySelector(".video__comments ul");
  const newComment = document.createElement("li");
  newComment.dataset.id = id;
  newComment.className = "video__comment";
  const icon = document.createElement("i");
  icon.className = "fas fa-comment";
  const span = document.createElement("span");
  span.innerText = text;
  const div = document.createElement("div");
  div.className = "delete__btn";
  const deleteIcon = document.createElement("i");
  deleteIcon.className = "fas fa-trash-can";
  const deleteSpan = document.createElement("span");
  deleteSpan.innerText = "삭제";
  div.appendChild(deleteIcon);
  div.appendChild(deleteSpan);
  div.addEventListener("click", handleDelete);
  newComment.appendChild(icon);
  newComment.appendChild(span);
  newComment.appendChild(div);

  videoComments.prepend(newComment);
};
const handleSubmit = async (event) => {
  event.preventDefault();
  textarea.style.height = initialHeight + "px";
  const text = textarea.value;
  const videoId = videoContainer.dataset.id;
  if (text === "") return;

  const response = await fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });
  if (response.status === 201) {
    textarea.value = "";
    const { newCommentId } = await response.json();
    addComment(text, newCommentId);
  }
};

const handleDelete = async (event) => {
  console.log("실행됨");
  const clickedDeleteBtn = event.target.closest(".delete__btn");
  const commentToDelete = clickedDeleteBtn.closest(".video__comment");
  const commentId = commentToDelete.dataset.id;
  const response = await fetch(`/api/comments/${commentId}/delete`, {
    method: "DELETE",
  });
  console.log(response);

  if (response.status === 200) {
    commentToDelete.remove();
    const nb = commentNb.innerText;
    commentNb.innerText = Number(nb) - 1;
  } else {
    console.log("무언가 잘못되었음.");
  }
};

if (form) {
  form.addEventListener("submit", handleSubmit);
}
deleteBtns.forEach((deleteBtn) =>
  deleteBtn.addEventListener("click", handleDelete)
);

textarea.oldLines = 1;
textarea.style.height = 23;
const initialHeight = 15;
textarea.addEventListener("input", (event) => {
  const lines = textarea.value.split("\n").length;
  if (lines == 1) {
    textarea.scrollHeight = 0;
  }
  if (lines !== textarea.oldLines) {
    textarea.style.height = lines * initialHeight + "px";
    console.log(lines);
    console.log(textarea.style.height);
  }
  textarea.oldLines = lines;
});
