import VideoModel from "../models/Video";

export const home = async (req, res) => {
  const videos = await VideoModel.find({});
  console.log(videos);
  return res.render("home", { pageTitle: "Home", videos });
};
export const watch = async (req, res) => {
  const { id } = req.params;
  const video = await VideoModel.findById(id);
  if (video === null) {
    return res.render("404", { pageTitle: "Wrong url" });
  } else {
    return res.render("watch", { pageTitle: video.title, video });
  }
};
export const getEdit = async (req, res) => {
  const { id } = req.params;
  const video = await VideoModel.findById(id);
  if (!video) {
    return res.render("404", { pageTitle: "Wrong url" });
  } else {
    return res.render("edit", { pageTitle: `edit: ${video.title}`, video });
  }
};
export const postEdit = async (req, res) => {
  const { id } = req.params;
  const { title, description, hashtags } = req.body;
  const video = await VideoModel.findById(id);
  if (!video) {
    return res.render("404", { pageTitle: "Wrong url" });
  }
  video.title = title;
  video.description = description;
  (video.hashtags = hashtags
    .split(",")
    .map((word) => (word.startsWith("#") ? word : `#${word}`))),
    await video.save(); //VideoModel.findeById를 video variable로 지정했으므로 video.save라고 한다.
  return res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "upload video" });
};
export const postUpload = async (req, res) => {
  const { title, description, hashtags } = req.body;
  try {
    await VideoModel.create({
      title,
      description,
      hashtags: hashtags
        .split(",")
        .map((word) => (word.startsWith("#") ? word : `#${word}`)),
    });

    return res.redirect("/");
  } catch (error) {
    return res.render("upload", {
      pageTitle: "Upload Video",
      errorMessage: error._message,
    });
  }
};
