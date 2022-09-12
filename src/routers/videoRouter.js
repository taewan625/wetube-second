import express from "express";
import {
  watch,
  getEdit,
  postEdit,
  deleteVideo,
  getUpload,
  postUpload,
} from "../controller/videoController";

const videoRouter = express.Router();

// parameter에서 \d+로도 테스트가 됬는데 JS에서 적용할때는 \\써야함 escape라고 하고 \\해야 \개로 출력됨
videoRouter.get("/:id([0-9a-f]{24})", watch);
videoRouter.route("/:id([0-9a-f]{24})/edit").get(getEdit).post(postEdit);
videoRouter.get("/:id([0-9a-f]{24})/delete", deleteVideo);
videoRouter.route("/upload").get(getUpload).post(postUpload);
export default videoRouter;
