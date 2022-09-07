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
export const edit = (req, res) => res.render("edit");
export const search = (req, res) => res.send("search");
export const upload = (req, res) => res.send("upload");
export const deleteVideo = (req, res) => res.send("deleteVideo");
