import { request } from "express";

let videos = [
  { title: "video1", rating: 5, views: 0, id: 1 },
  { title: "video2", rating: 5, views: 1, id: 2 },
  { title: "video3", rating: 5, views: 39, id: 3 },
];
export const trending = (req, res) => {
  return res.render("home", { pageTitle: "Home", videos });
};
export const watch = (req, res) => {
  const { id } = req.params;
  const video = videos[id - 1];
  return res.render("watch", { pageTitle: video.title, video });
};
export const getEdit = (req, res) => {
  const { id } = req.params; // 주소에 포함된 변수를 담는다. 예를 들어 https://localhost:8000/videos/12345/edit 라는 주소가 있다면 12345를 담는다
  const video = videos[id - 1];
  return res.render("edit", { pageTitle: `${video.title} edit`, video });
};
export const postEdit = (req, res) => {
  const { id } = req.params;
  const { title } = req.body; // .pug form의 name. JS형식으로 변경될시 (req.body)에선 title이 object key가 됨.
  console.log(req.body);
  videos[id - 1].title = title; // fakedatabase라서 이럴수 밖에없음
  return res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "upload video" });
};

export const postUpload = (req, res) => {
  const { title } = req.body;
  const newVideo = { title, rating: 6, views: 0, id: videos.length + 1 };
  videos.push(newVideo);
  return res.redirect("/");
};
