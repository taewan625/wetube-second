import express from "express";
import morgan from "morgan";

const PORT = 8000;

// 1) create server
const app = express();
const logger = morgan("dev"); // middleware
app.use(logger);

// 2) configue(설정) server

const globalRouter = express.Router();
const handleHome = (req, res) => res.send("Home");
globalRouter.get("/", handleHome);

const userRouter = express.Router();
// express.Router()로 userRouter라는 variable이 기능을 가지게 되고 밑으로 내려면 app.use("/users", userRouter); 가 있는데
// 이제 브라우저에서는 먼저 /users라는 큰 주제가 있고 app.use의 func인 userRouter로 들어가서 userRouter.get("/edit", handleEditUser);로 이동
// 그럼 이제 사람들이 browser에 /user/edit라고 req하면 userRouter.get이 처음 app.get처럼 작동하여서 handleEidtUser를 작동시킨다.
// app.get을 하지 않는 이유는 router라는 것을 사용하여 브라우저 창에 /users/edit를 한꺼번에 가지고 오려고 먼제 express.Router()를 생성하고 그것을 이용하는 것이다.
const handleEditUser = (req, res) => res.send("edit user");
userRouter.get("/edit", handleEditUser);

const videoRouter = express.Router();
const handlewatchVideo = (req, res) => res.send("watch");
videoRouter.get("/watch", handlewatchVideo);

app.use("/", globalRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);

// 3) open server
const handleListening = () =>
  console.log(`✅ server listening on port http://localhost:${PORT}`);
app.listen(PORT, handleListening);
