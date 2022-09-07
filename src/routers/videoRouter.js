import express from "express";
import {
  upload,
  watch,
  edit,
  deleteVideo,
} from "../controller/videoController";

const videoRouter = express.Router();

videoRouter.get("/upload", upload);
// express가 똑똑해서 라우터 url에 :가 들어간것을 확인하면 이게 변수라는 것을 인지함
// 그래서 url에 videos/123123sagag!@#@$%#해도 정상 작동을 한다.
// 그리고 console.log로 req.params를 확인해보면 :뒤에 있는 variable로 parameter값을 보여준다.

// parameter에서 \d+로도 테스트가 됬는데 JS에서 적용할때는 \\써야함
videoRouter.get("/:id(\\d+)", watch);
videoRouter.get("/:id(\\d+)/edit", edit);
videoRouter.get("/:id(\\d+)/delete", deleteVideo);

export default videoRouter;
