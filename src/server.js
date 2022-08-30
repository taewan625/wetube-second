import express from "express";

const PORT = 4000;

// 1) create server
const app = express(); // relate express code have to wirte down this line

// 2) configue(설정) server
const handleHome = () => console.log("hi server");
app.get("/", handleHome); // browser의 get request "/". server의 respond(handleHome)

// 3) open server
const handleListening = () =>
  console.log(`✅ server listening on port http://localhost:${PORT}`);

app.listen(PORT, handleListening);

// get is HTTP method, http is communicate with server method
// 1) how http reuest working ; app.get의 get이 browser가 server에게 request 보내는 것 *request: browser said hey I want to get URL
// 2) how to respond GET_request ; request ex) "/" 들어오면 server은 그 request를 다룰 수 있다 ex) handleHome
