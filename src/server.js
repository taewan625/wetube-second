import express from "express";
import morgan from "morgan";
import globalRouter from "./routers/globalRouter";
import videoRouter from "./routers/videoRouter";
import userRouter from "./routers/userRouter";
const PORT = 8000;

// 1) create server
const app = express();
const logger = morgan("dev"); // middleware
app.use(logger);

// 2) configure(설정) server

app.use("/", globalRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);

// 3) open server
const handleListening = () =>
  console.log(`✅ server listening on port http://localhost:${PORT}`);
app.listen(PORT, handleListening);
