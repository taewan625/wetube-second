import VideoModel from "../models/Video";

// callback function
export const home = (req, res) => {
  VideoModel.find({}, (error, videos) => {
    console.log("errors", error);
    console.log("videos", videos);
  });
  return res.render("home", { pageTitle: "Home", videos });
};
export const watch = (req, res) => {
  const { id } = req.params;
  return res.render("watch", { pageTitle: "watch" });
};
export const getEdit = (req, res) => {
  const { id } = req.params; // 주소에 포함된 변수를 담는다. 예를 들어 https://localhost:8000/videos/12345/edit 라는 주소가 있다면 12345를 담는다
  return res.render("edit", { pageTitle: `edit` });
};
export const postEdit = (req, res) => {
  const { id } = req.params;
  const { title } = req.body; // .pug form의 name. JS형식으로 변경될시 (req.body)에선 title이 object key가 됨.
  return res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "upload video" });
};

export const postUpload = (req, res) => {
  const { title } = req.body;
  return res.redirect("/");
};
