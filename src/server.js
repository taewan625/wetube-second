import express from "express";
import morgan from "morgan";
import globalRouter from "./routers/globalRouter";
import videoRouter from "./routers/videoRouter";
import userRouter from "./routers/userRouter";
const PORT = 8000;

// 1) create server
const app = express();
const logger = morgan("dev"); // middleware

// 2) configure(설정) server
app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use(logger);
// query
app.use(express.urlencoded({ extended: true })); // html의 form value 이해하고 js object형식으로 전환 req.body 인식할 수 있게 해줌

//router
app.use("/", globalRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);

// 3) open server
const handleListening = () =>
  console.log(`✅ server listening on port http://localhost:${PORT}`);
app.listen(PORT, handleListening);
