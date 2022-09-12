import VideoModel from "../models/Video";

export const home = async (req, res) => {
  const videos = await VideoModel.find({});
  console.log(videos);
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

/* upload video의 input data save 후 db에 저장하는 방법
1) document 만들기
2) database에 저장
*/
// 1) video doc은 만들어졌지만 아직 JS에서만 존재
export const postUpload = async (req, res) => {
  const { title, description, hashtags } = req.body;
  try {
    await VideoModel.create({
      title,
      description,
      hashtags: hashtags.split(",").map((word) => `#${word}`),
      // createdAt: Date.now(),         # Video.js에서 default값으로 지정함
      // meta: { views: 0, rating: 0 }, # default 값으로 지정
    });
    return res.redirect("/");
  } catch (error) {
    return res.render("upload", {
      pageTitle: "Upload Video",
      errorMessage: error._message,
    });
  }
};
