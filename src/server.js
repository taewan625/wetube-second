import express from "express";
import morgan from "morgan";

const PORT = 8000;

// 1) create server
const app = express();
const logger = morgan("dev"); // middleware

// 2) configue(설정) server
const home = (req, res) => res.end();

const login = (req, res) => res.send("login");

app.use(logger);
app.get("/", home);
app.get("/login", login);

// 3) open server
const handleListening = () =>
  console.log(`✅ server listening on port http://localhost:${PORT}`);
app.listen(PORT, handleListening);
