import express from "express";

const PORT = 8000;

// 1) create server
const app = express();

// 2) configue(설정) server
const logger = (req, res, next) => {
  console.log("I'm in the middle!");
  // return res.send("is it work????"); // cant go final controller
  next();
};
const handleHome = (req, res, next) => {
  // last res func이라서 사실상 next가 필요 없음
  return res.end();
};
// const handleHome = (req, res, next) => res.end();
// express는 이런 화살표 함수일 때 return을 함유하고 있어서 따로 안써줘도 됨 중요!!!
// 그렇다고 { }으로 코드 쓸 때 무조건 return을 써야된다는 것은 아니다!!
app.get("/", logger, handleHome);
// express work handleHome({...req...}, {...res...})

// 3) open server
const handleListening = () =>
  console.log(`✅ server listening on port http://localhost:${PORT}`);
app.listen(PORT, handleListening);
