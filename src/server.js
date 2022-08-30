import express from "express";

const PORT = 4000;

// 1) create server
const app = express();

// 2) configue(설정) server
const handleHome = (req, res) => {
  // Express 4.X API에 req와 res에 관한 property(ex)end,send)가 정리 되어 있다.
  // console.log(req); // req.object를 볼 수 있다.
  // console.log(res); // res.object를 볼 수 있다.
  return res.end(); // browser에게 아무것도 안보내고 종료
  return res.send("res.send()");
};
const handleLogin = (req, res) => {
  return res.send("res.send('login')");
};

app.get("/", handleHome);
// express work handleHome({...req...}, {...res...})
app.get("/login", handleLogin);

// 3) open server
const handleListening = () =>
  console.log(`✅ server listening on port http://localhost:${PORT}`);
app.listen(PORT, handleListening); // in express, route handler doesn't have event. but they have two obj
// app.listen(PORT) 만 있어도 됨
