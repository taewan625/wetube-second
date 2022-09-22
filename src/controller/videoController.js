import VideoModel from "../models/Video";

export const home = async (req, res) => {
  const videos = await VideoModel.find({}).sort({ createdAt: "desc" });
  return res.render("home", { pageTitle: "Home", videos });
};

// mongoose의 populate: ref가 되어있는 key를 populate안에 넣어주면 key의 실제 존재 db로 찾아가서 그것의 모든 object를 가지고 온다.
export const watch = async (req, res) => {
  const { id } = req.params;
  const video = await VideoModel.findById(id).populate("owner");
  // console.log(video); // users data 다 가지고 옴
  if (video === null) {
    return res.status(404).render("404", { pageTitle: "Wrong url" });
  } else {
    return res.render("videos/watch", {
      pageTitle: video.title,
      video,
    });
  }
};
export const getEdit = async (req, res) => {
  const { id } = req.params;
  const video = await VideoModel.findById(id); // edit.pug에서 videoDB의 object를 이용하므로 findById가 적합
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Wrong url" });
  } else {
    return res.render("videos/edit", {
      pageTitle: `edit: ${video.title}`,
      video,
    });
  }
};
export const postEdit = async (req, res) => {
  const { id } = req.params;
  const { title, description, hashtags } = req.body;
  const video = await VideoModel.exists({ _id: id }); // Video db의 object의 유무(true, false)만 필요하지 object자체가 필요하지는 않음
  if (!video) {
    return res.status(400).render("404", { pageTitle: "Wrong url" });
  }
  // mongoose method 방법
  await VideoModel.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: VideoModel.formatHashtags(hashtags),
  });
  return res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => {
  return res.render("videos/upload", { pageTitle: "upload video" });
};
export const postUpload = async (req, res) => {
  const {
    user: { _id },
  } = req.session;
  const { path: fileUrl } = req.file;
  const { title, description, hashtags } = req.body;
  try {
    await VideoModel.create({
      title,
      description,
      fileUrl,
      owner: _id,
      hashtags: VideoModel.formatHashtags(hashtags),
    });
    return res.redirect("/");
  } catch (error) {
    return res.render("videos/upload", {
      pageTitle: "Upload Video",
      errorMessage: error._message,
    });
  }
};

export const deleteVideo = async (req, res) => {
  const { id } = req.params;
  await VideoModel.findByIdAndDelete(id);
  return res.redirect("/");
};

export const search = async (req, res) => {
  const { keyword } = req.query;
  let videos = [];
  if (keyword) {
    // videos에 const 붙이면 if문 안에서만 존재하게 되여서 res.render에서 undefined 됨
    videos = await VideoModel.find({
      title: {
        // mongoDB의 filter engine_operator: Video 중에서 $regex(내가 정한 정규식을 따르는 것을 select), 내가 정한 정규식: New RegExp(JS func)
        $regex: new RegExp(keyword, "i"), // mongodb의 문법이다!!
        // $gt
      },
    });
  }
  res.render("search", { pageTitle: "search", videos });
};
