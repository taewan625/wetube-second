import { S3Client } from "@aws-sdk/client-s3"; // ver3 이므로 multerS3 version 또한 3.x.x로 맞춰줘야함
// import aws from "aws-sdk"; -> "aws-sdk" version은 2.x.x여서 multer-s3 설치시 npm i multer-s3@^2.10.0으로 진행
import multer from "multer";
import multerS3 from "multer-s3";

// AWS s3에 접근할 수 있는 API key secret 작성

// ver2 일때 : multer가 aws와 상호작용하는 방법. 주의점: credentials:{accessKeyId: 1234, sercretAccessKey:xxxxx}로 넣지말고 그냥 new aws.S3{}object 안에 key-value 다 넣기
// const s3 = new aws.S3({
//   region: "ap-northeast-2",
//   accessKeyId: process.env.AWS_ID,
//   secretAccessKey: process.env.AWS_SECRET,
// });

// ver3 일때 : aws.S3이 아니라 S3Client 사용. 주위점: ver2와 반대로 credentials안에 credentials를 넣어주어야 작동을 함
const s3 = new S3Client({
  region: "ap-northeast-2", // region error가 나는 문제로 인해서 넣음
  credentials: {
    apiVersion: "2022-10-07", // 넣어도 되고 안넣어도 되고
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET,
  },
});

// aip연결 후 AWS 어느 bucket에 저장할지 설정
// multer-s3의 read-me에서 storage안에 multerS3이 들어가는 걸로 적용이 되어있는데 이는 const avaterupload와 const videoUpload안에 이미 들어있기 때문에 일부만 쓰는 것
const upload = multerS3({
  s3: s3,
  bucket: "setubee",
  acl: "public-read",
});

export const localsMiddleware = (req, res, next) => {
  //   console.log(req.session);
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.loggedInUser = req.session.user || {}; // loggedin 안된 사람이 url로 접근할 때 {}로 error 방지
  // console.log(req.session);
  res.locals.siteName = "wetube"; // base.pug title에 사용
  // console.log(res.locals);
  next();
};

// login 안된 client가 url에다가 직접 users/login or /edit 치게 될 때 template화면에 들어가지니깐 이를 방지
export const protectorMiddleware = (req, res, next) => {
  if (req.session.loggedIn) {
    next();
  } else {
    req.flash("error", "Not authorized"); // ("type", "message")
    return res.redirect("/login");
  }
};
// login 된 client가 url에다가 직접 users/login 치게 될 때 login화면에 들어가지니깐 이를 방지
export const publicOnlyMiddleware = (req, res, next) => {
  if (!req.session.loggedIn) {
    return next();
  } else {
    req.flash("error", "Not authorized"); // ("type", "message")
    return res.redirect("/");
  }
};

export const avatarUpload = multer({
  dest: "uploads/avatars/",
  limits: { fileSize: 3000000 },
  storage: upload,
});
// edit profile의 input의 파일을 받고 -> router에서 post middleware로 간 후 여기서 uploads에 file 저장 후 postEdit controller로 이동
export const videoUpload = multer({
  dest: "uploads/videos/",
  limits: { fileSize: 10000000 },
  storage: upload, // 이렇게 보면 storage안에 multerS3의 값이 들어가는 것이 성립
});

// export const thumbUpload = multer({
//   dest: "uploads/thumbs/",
//   limits: { fileSize: 3000000000 },
// });
