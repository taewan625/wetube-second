// data base 같은 server 이외의 것들 정리
// server 작동 후 db 연결 확인하고 정상 작동 여부 확인가능해야 하므로 handleListen을 이쪽으로 가지고 옴

// dotenv
import "dotenv/config";

import "./db";
import "./models/Video";
import "./models/User";
import app from "./server";

const PORT = 8000;

const handleListening = () =>
  console.log(`server listening on port http://localhost:${PORT} ✅`);
app.listen(PORT, handleListening);
