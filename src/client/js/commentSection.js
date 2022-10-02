const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");

let deleteComments = document.querySelectorAll(".deleteComment");

const handleDeleteComment = async (event) => {
  const li = event.srcElement.parentNode;
  // console.log(event);
  const {
    dataset: { id: commentId },
  } = li;
  // console.log(commentId);
  await fetch(`/api/comments/${commentId}/delete`, {
    method: "DELETE",
  });
  li.remove();
};

// realtime comment
const addComment = (text, id) => {
  const videoComments = document.querySelector(".video__comments ul");
  const newComment = document.createElement("li");
  newComment.className = "video__comment";
  newComment.dataset.id = id;
  const icon = document.createElement("i");
  icon.className = "fas fa-comment";
  const span = document.createElement("span");
  const deleteSpan = document.createElement("span");
  deleteSpan.className = "deleteComment";
  deleteSpan.innerText = " delete";
  span.innerText = ` ${text}`;
  newComment.appendChild(icon);
  newComment.appendChild(span);
  newComment.appendChild(deleteSpan);
  videoComments.prepend(newComment);
};

const handleSubmit = async (event) => {
  event.preventDefault();
  const textarea = form.querySelector("textarea");
  const text = textarea.value;
  const { id } = videoContainer.dataset;

  /**
* 무엇인가 1개만 보낼 때는 body(req.body의 body를 의미):text 이렇게 보내서 server의 express.text()로 text를 req.body속으로 넣을 수 있다.
   fetch(`/api/videos/${id}/comment`, { method: "POST", body: text });
*  2개 이상을 보낼 때는 댓글 + 평점 -> body를 object형식으로 사용해야하는데 fetch를 통해서frontEnd ->value-> backEnd로 보낼때 object는 인식하지 못하고 string만 인식하므로 json.stringify로 object를 string으로 변환
   fetch(`/api/videos/${id}/comment`, {
     method: "POST",
     headers: {
       "Content-Type": "application/json", // express.json을 사용하기 전에 express에게 지금 보내는 것은 json을 string으로 바꾼 것이라고 미리 알려줘야함
     }, // req info
     body: JSON.stringify({ text: "wooweee", rating: "5" }), // req.body
   });
*/
  if (text === "") {
    return;
  }
  const response = await fetch(`/api/videos/${id}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // express.json을 사용하기 전에 express에게 지금 보내는 것은 json을 string으로 바꾼 것이라고 미리 알려줘야함
    }, // req info
    body: JSON.stringify({ text }), // req.body
  });
  // console.log(response.status);
  textarea.value = "";
  // window.location.reload(); // realtime comments로 보이도록 하는 법
  // const json = await response.json(); // json으로 backEnd에서 보낸 newCommentId를 추출
  // console.log(json);
  if (response.status === 201) {
    textarea.value = "";
    const { newCommentId } = await response.json(); // json으로 backEnd에서 보낸 newCommentId를 추출
    addComment(text, newCommentId);
  }
};

if (form) {
  form.addEventListener("submit", handleSubmit);
}
if (deleteComments) {
  deleteComments.forEach((deleteComment) => {
    deleteComment.addEventListener("click", handleDeleteComment);
  });
}

// const deleteComments = document.getElementsByClassName("deleteComment");
// let deleteComment;
// for (i = 0; i < deleteComments.length; i++) {
//   deleteComment = deleteComments[i];
//   deleteComment.addEventListener("click", async (e) => {
//     const { id } = videoContainer.dataset;
//     const commentId = e.path[1].dataset.id;
//     const response = await fetch(`/api/videos/${id}/commentDelete`, {
//       method: "delete",
//       headers: {
//         "Content-Type": "application/json", // express.json을 사용하기 전에 express에게 지금 보내는 것은 json을 string으로 바꾼 것이라고 미리 알려줘야함
//       }, // req info
//       body: JSON.stringify({ commentId }), // req.body
//     });
//     // console.log(await response.json());
//     if (response.status === 202) {
//       const { deleteCommentId } = await response.json();
//       realtimeDeleteComment(deleteCommentId);
//     }
//   });
// }

// const realtimeDeleteComment = (id) => {
//   const deleteCommentli = document.querySelector(`li[data-id="${id}"]`);
//   // console.log(deleteCommentli);
//   deleteCommentli.remove();
// };
