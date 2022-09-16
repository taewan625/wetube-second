// backEnd의 server에 관한 것만 포함
import express from "express";
import morgan from "morgan";
import session from "express-session";
import rootRouter from "./routers/rootRouter";
import videoRouter from "./routers/videoRouter";
import userRouter from "./routers/userRouter";
import { localsMiddleware } from "./middleware";

// 1) create server
const app = express();
const logger = morgan("dev"); // middleware

// 2) configure(설정) server
app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use(logger);

// query
app.use(express.urlencoded({ extended: true })); // html의 form value 이해하고 js object형식으로 전환 req.body 인식할 수 있게 해줌

// session
app.use(session({ secret: "Hello!", resave: true, saveUninitialized: true }));

// sessions data를 확인하기 위한 middleware
// app.use((req, res, next) => {
//   res.locals.key = "This is global object. so can use this in .pug";
//   req.sessionStore.all((error, sessions) => {
//     console.log(sessions);
//     next();
//   });
// });

//router
app.use(localsMiddleware);
app.use("/", rootRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);

export default app;
