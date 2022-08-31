import express from "express";

const PORT = 8000;

// 1) create server
const app = express();

// 2) configue(설정) server
const gossipMiddleware = (req, res, next) => {
  console.log("I'm in the middle!");
  // return res.send("is it work????"); // cant go final controller
  next();
};
const handleHome = (req, res, next) => {
  // last res func이라서 사실상 next가 필요 없음
  return res.end();
  return res.send("res.send()");
};

app.get("/", gossipMiddleware, handleHome);
// express work handleHome({...req...}, {...res...})

// 3) open server
const handleListening = () =>
  console.log(`✅ server listening on port http://localhost:${PORT}`);
app.listen(PORT, handleListening);
