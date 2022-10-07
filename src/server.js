// backEnd의 server에 관한 것만 포함
import express from "express";
import morgan from "morgan";
import session from "express-session";
import flash from "express-flash";
import MongoStore from "connect-mongo";
import rootRouter from "./routers/rootRouter";
import videoRouter from "./routers/videoRouter";
import userRouter from "./routers/userRouter";
import apiRouter from "./routers/apiRouter";
import { localsMiddleware } from "./middlewares";

// 1) create server
const app = express();
const logger = morgan("dev"); // middleware

// 2) configure(설정) server
app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use(logger);

// query
// 1) html form
app.use(express.urlencoded({ extended: true })); // html의 form value 이해하고 js object형식으로 전환 req.body 인식할 수 있게 해줌
// 2) fetch one value
// fetch의 text를 인식할 수 있도록 함 fetch로 받는 값이 1개일 때
// app.use(express.text());
// 3) fetch two value
// commentSection에서 text와 rating 같이 2가지를 받을 때 처음엔 object형식을 string으로 받아야된다. 왜냐하면 fetch의 body는 object의 값을 나타내지 못하기 때문이다.
// 두번째로는 string형식으로 바꾸어서 backEnd의 req.body로 값을 가져왔는데 string으로 가지고 온 문제로 인해서 req.body.text 나 req.body.rating으로 각각 값을 가지고 올 수 없다.
// 그래서 일단은 front에서 back으로 값을 가지고 오고 다시 back에서 req.body로 값을 저장할 때 express.json()이란 function으로 string을 다시 object로 변환한다.
app.use(express.json()); // json.parse()와 같은 역할 <-> json.stringify()

// session
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    // cookie: {
    //   maxAge: 5000,
    // },
    store: MongoStore.create({ mongoUrl: process.env.DB_URL }),
    // session data의 id만 cookie에 저장할 수 있으므로 store DB에 설정해 주어야 함
  })
);

// sessions data를 확인하기 위한 middleware
// app.use((req, res, next) => {
//   res.locals.key = "This is global object. so can use this in .pug";
//   req.sessionStore.all((error, sessions) => {
//     console.log(sessions);
//     next();
//   });
// });

//ffmpeg error solve
// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   next();
// });
app.use((req, res, next) => {
  res.header("Cross-Origin-Embedder-Policy", "require-corp");
  res.header("Cross-Origin-Opener-Policy", "same-origin");
  next();
});

//message for who has session
app.use(flash());

//router
app.use(localsMiddleware);

// folder안의 data들을 url상에서 접근할 수 있도록 함 // 내가 지정한 것에 따라 상대경로 절대경로 설정 가능
// -> backEnd의 경로에 static 경로를 덮어서 더 풍족하게 만들어준다고 생각하기
// static은 전역적으로 data를 볼 수 있는 것
app.use("/uploads", express.static("uploads"));
app.use("/assets", express.static("assets"));

app.use("/", rootRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);
app.use("/api", apiRouter);
export default app;
