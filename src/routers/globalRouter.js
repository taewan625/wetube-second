import express from "express";
import { join } from "../controller/userController";
import { trending } from "../controller/videoController";

const globalRouter = express.Router();

globalRouter.get("/", trending);
globalRouter.get("/join", join);

export default globalRouter;
