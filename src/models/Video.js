// mongoose를 통해서 mongo에 data를 전달하기위해서 video.js라는 파일로 우리의 data가 어떻게 생겼는지 보여준다.
// Video title, sub summary 등등의 detail -> 이 정보를 통해서 mongoose가 CRUD를 도와줌. mongoose는 package  이니깐

// 우리가 일일히 짜는 object를 mongo = DB가 video click, edit, delete할 때 도와달라고 할 것임
// 그 때 db는 object의 datail이 필요한 것이 아니고 string인지 number인지 array인지 등등을 설명이 필요

import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true }, // title: "herry porter" 이딴식으로 detail 안넣고 string 넣음
  fileUrl: { type: String, require: true },
  description: { type: String, required: true, trim: true }, // {type: String}과 String 동일
  createdAt: { type: Date, required: true, default: Date.now },
  hashtags: [{ type: String, trim: true }],
  meta: {
    views: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
  },
});

// middleware; update, upload하기전에 미리 무엇인가를 중간 점검 하고 싶을 때, hashtag 점검이라던지, user sign 시 존재하는 id인지
// middleware는 VideoModel 이전에 만들어져야한다.
/*
videoSchema.pre("save", async function () {
  this.hashtags = this.hashtags[0]
    .split(",")
    .map((word) => (word.startsWith("#") ? word : `#${word}`));
  console.log("asdfa", this);
});
*/
// 내 mongoose func 만들기
videoSchema.static("formatHashtags", function (hashtags) {
  return hashtags
    .split(",")
    .map((word) => (word.startsWith("#") ? word : `#${word}`));
});

const VideoModel = mongoose.model("Video", videoSchema);

export default VideoModel;
