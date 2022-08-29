// const express = require("express"); old code
import express from "express"; // node module에서 express 찾음

const PORT = 4000;

const app = express(); //creates express application

// what is server? app=server have to wait for listenomg request  / server is computer that always running and connect with internet.
// request meaning is go to other URL

const handleListening = () =>
  console.log(`✅ server listening on port http://localhost:${PORT}`);

// server need to wait client request => waiting is callback;when server start, that time running
// before connect server, say to server what port we listen.  port; window
app.listen(PORT, handleListening);

// server에 접속하는 방법: 보통은 localhost를 통해서 접속이 가능 -> when demon die server also die
