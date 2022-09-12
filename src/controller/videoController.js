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
  const video = await VideoModel.findById(id); // edit.pug에서 videoDB의 object를 이용하므로 findById가 적합
  if (!video) {
    return res.render("404", { pageTitle: "Wrong url" });
  } else {
    return res.render("edit", { pageTitle: `edit: ${video.title}`, video });
  }
};
export const postEdit = async (req, res) => {
  const { id } = req.params;
  const { title, description, hashtags } = req.body;
  const video = await VideoModel.exists({ _id: id }); // Video db의 object의 유무(true, false)만 필요하지 object자체가 필요하지는 않음
  if (!video) {
    return res.render("404", { pageTitle: "Wrong url" });
  }
  // mongoose method 방법
  await VideoModel.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: hashtags
      .split(",")
      .map((word) => (word.startsWith("#") ? word : `#${word}`)),
  });
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
