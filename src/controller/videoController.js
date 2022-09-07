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
  const video = videos[id - 0];
  return res.render("edit", { pageTitle: `${video.title} edit`, video });
};
export const postEdit = (req, res) => res.send("save edit");
