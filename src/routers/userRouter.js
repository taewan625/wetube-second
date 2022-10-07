import express from "express";
import {
  getEdit,
  postEdit,
  logout,
  see,
  startGithubLogin,
  finishGithubLogin,
  getChangePassword,
  postChangePassword,
  getDeleteAccount,
  postDeleteAccount,
} from "../controller/userController";

import {
  avatarUpload,
  protectorMiddleware,
  publicOnlyMiddleware,
} from "../middlewares";

const userRouter = express.Router();

userRouter.get("/logout", protectorMiddleware, logout);

userRouter
  .route("/edit")
  .all(protectorMiddleware)
  .get(getEdit)
  .post(avatarUpload.single("avatar"), postEdit);
//req.file is the `avatar` file
userRouter
  .route("/change-password")
  .all(protectorMiddleware)
  .get(getChangePassword)
  .post(postChangePassword);
userRouter
  .route("/delete-account")
  .all(protectorMiddleware)
  .get(getDeleteAccount)
  .post(postDeleteAccount);
userRouter.get("/github/start", publicOnlyMiddleware, startGithubLogin);
userRouter.get("/github/finish", publicOnlyMiddleware, finishGithubLogin);
userRouter.get("/:id", see);

export default userRouter;
