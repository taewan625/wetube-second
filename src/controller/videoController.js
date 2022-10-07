import UserModel from "../models/User";
import VideoModel from "../models/Video";
import CommentModel from "../models/Commnet";

export const home = async (req, res) => {
  const videos = await VideoModel.find({})
    .sort({ createdAt: "desc" })
    .populate("owner");
  return res.render("home", { pageTitle: "Home", videos });
};

// mongoose의 populate: ref가 되어있는 key를 populate안에 넣어주면 key의 실제 존재 db로 찾아가서 그것의 모든 object를 가지고 온다.
export const watch = async (req, res) => {
  const { id } = req.params;
  const video = await VideoModel.findById(id)
    .populate("owner")
    .populate("comments");
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
  const { _id } = req.session.user;

  const video = await VideoModel.findById(id); // edit.pug에서 videoDB의 object를 이용하므로 findById가 적합
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Wrong url" });
  }
  if (String(video.owner) !== String(_id)) {
    req.flash("error", "Not authorized"); // ("type", "message")
    return res.status(403).redirect("/");
  }
  return res.render("videos/edit", {
    pageTitle: `edit: ${video.title}`,
    video,
  });
};
export const postEdit = async (req, res) => {
  const { id } = req.params;
  const { title, description, hashtags } = req.body;
  const { _id } = req.session.user;
  const video = await VideoModel.findById({ _id: id }); // findById로 바꾸어줘야만 video 수정시 작동함
  if (!video) {
    return res.status(400).render("404", { pageTitle: "Wrong url" });
  }
  // console.log(video);
  // console.log(video.owner, _id);
  if (String(video.owner) !== String(_id)) {
    return res.status(403).redirect("/");
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
  // console.log(req.files); req.field -> req.fields로 변경 됨. single이 아니기 때문
  const { video, thumb } = req.files;
  const { title, description, hashtags } = req.body;
  try {
    const newVideo = await VideoModel.create({
      title,
      description,
      fileUrl: video[0].location,
      thumbUrl: thumb[0].location,
      owner: _id,
      hashtags: VideoModel.formatHashtags(hashtags),
    });
    // video자체를 usermodel속으로 넣으러고 함 -> 하지만 User.js에서 조건으로 objectId만 넣기로 해서 db상에서 myvideo에는 array만 존재하게 됨
    const user = await UserModel.findById(_id);
    user.myVideos.push(newVideo); // usermodel의 myvideo는 array이다.
    user.save();
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
  const { _id } = req.session.user;
  const video = await VideoModel.findById(id);
  const user = await UserModel.findById(_id);
  if (!video) {
    return res.status(400).render("404", { pageTitle: "Wrong url" });
  }
  if (String(video.owner) !== String(_id)) {
    return res.status(403).redirect("/");
  }
  await CommentModel.deleteMany({ video: video._id });
  await VideoModel.findByIdAndDelete(id);
  user.myVideos.splice(user.myVideos.indexOf(id), 2); // method: indexOf(), spliac(array,deletecount,addsomthing)
  user.save(); // save 해주어야지 updata가 된다.
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
    }).populate("owner");
  }
  res.render("search", { pageTitle: "search", videos });
};

// frontEnd에서 이 route(URL)을 이동 없이 적용하기 위함. form없이 post & route 하기 ## rendering이 따로 없음
// status는 상태코드로 현재 network가 이런상태이고 그 다음에 이걸 작동한다는 return값을 받아야한다. ex) status(200).render()or redirect()
// 그러지않으면 network가 pendding 상태로 남아있게 된다. 그래서 status 대신 sendStatus를 사용해서 연결을 끝난다.
export const registerView = async (req, res) => {
  const { id } = req.params;
  const video = await VideoModel.findById(id);
  if (!video) {
    return res.sendStatus(404);
  }
  video.meta.views = video.meta.views + 1;
  await video.save();
  return res.sendStatus(200);
};

export const createComment = async (req, res) => {
  // console.log(req.body);
  // console.log(req.params);
  // console.log(req.body.text, req.body.rating);
  // console.log(req.session.user);
  const {
    session: { user },
    body: { text },
    params: { id },
  } = req;
  const video = await VideoModel.findById(id);

  if (!video) {
    return res.sendStatus(404);
  }
  const comment = await CommentModel.create({
    text,
    owner: user._id,
    //Comment.js에서 type이 ObjectId이므로 objectid가 필요함
    video: id,
  });
  video.comments.push(comment._id);
  video.save();
  return res.status(201).json({ newCommentId: comment._id }); // json을 통해서 comment._id를 frontEnd 로 보내줌
};

export const deleteComment = async (req, res) => {
  const {
    session: {
      user: { _id },
    },
    params: { commentId },
  } = req;

  const comment = await CommentModel.findById(commentId).populate("owner");
  const videoId = comment.video;
  if (String(_id) !== String(comment.owner._id)) {
    return res.sendStatus(404);
  }
  const video = await VideoModel.findById(videoId);
  if (!video) {
    return res.sendStatus(404);
  }

  video.comments.splice(video.comments.indexOf(commentId), 2);
  await video.save();
  await CommentModel.findByIdAndDelete(commentId);

  return res.sendStatus(200);
};
