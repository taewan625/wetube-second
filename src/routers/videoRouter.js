import express from "express";
import {
  watch,
  getEdit,
  postEdit,
  getUpload,
  postUpload,
} from "../controller/videoController";

const videoRouter = express.Router();

// parameter에서 \d+로도 테스트가 됬는데 JS에서 적용할때는 \\써야함 escape라고 하고 \\해야 \개로 출력됨
videoRouter.get("/:id(\\d+)", watch);
videoRouter.route("/:id(\\d+)/edit").get(getEdit).post(postEdit);
videoRouter.route("/upload").get(getUpload).post(postUpload);

export default videoRouter;
