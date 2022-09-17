import mongoose from "mongoose";

mongoose.connect(process.env.DB_URL, {
  // when warning coming that time write solution here
});

const db = mongoose.connection;

const handleOpen = () => console.log("connected to db = mongo ✅");
const handleError = (error) => console.log("db Error", error, "❌");
db.on("error", handleError); // db의 error 시 발생, on = 여러번
db.once("open", handleOpen); // once = 한번
