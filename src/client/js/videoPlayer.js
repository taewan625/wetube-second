const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const muteBtn = document.getElementById("mute");
const volumeRange = document.getElementById("volume");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const timeline = document.getElementById("timeline");
const fullScreenBtn = document.getElementById("fullScreen");
const videoContainer = document.getElementById("videoContainer");
const videoControls = document.getElementById("videoControls");

let controlsTimeout = null;
let controlsMovementTimeout = null;
let volumeValue = 0.5;
video.volume = volumeValue;
const handlePlay = (e) => {
  // if video is playing . puase it
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
  playBtn.innerText = video.paused ? "Play" : "Paused";
};

const handleMute = (e) => {
  if (video.muted) {
    video.muted = false;
  } else {
    video.muted = true;
  }
  muteBtn.innerText = video.muted ? "Unmute" : " Mute";
  volumeRange.value = video.muted ? 0 : volumeValue;
  // console.log(volumeValue, "order3");
};

const handlevolumeChange = (event) => {
  //console.log(event); -> 여기서 target은 element의 input을 의미. 그리고 그 input의 value를 건드리는 것
  const {
    target: { value },
  } = event;
  if (video.muted) {
    video.muted = false;
    muteBtn.innerText = "Mute";
  }
  volumeValue = value;
  video.volume = value; //obj.volume은 media가 시작될 때 volume을 설정해주는 것. 소리 크기 기준을 input의 value롤 잡음
};

// js trick substr에 왜 밑줄이 되어있는지는 모르겠다 ->mdn에서 느낌표 있는 것. 그래서 substring으로 바꿔줌
const formatTime = (seconds) =>
  new Date(seconds * 1000).toISOString().substring(11, 19);

const handleLoadedMetadata = () => {
  totalTime.innerText = formatTime(Math.floor(video.duration)); //obj.duration: video의 property; media sec time
  timeline.max = Math.floor(video.duration);
};

const handleTimeUpdate = () => {
  currentTime.innerText = formatTime(Math.floor(video.currentTime));
  timeline.value = Math.floor(video.currentTime); // value는 input이 움직이는 모든 것을 의미
};

const handleTimelineChange = (banana) => {
  const {
    target: { value },
  } = banana;
  // console.log(banana);
  video.currentTime = value;
};

const handleFullscreen = () => {
  const fullScreen = document.fullscreenElement;
  if (fullScreen) {
    document.exitFullscreen();
    fullScreenBtn.innerText = "Enter Full Screen";
  } else {
    videoContainer.requestFullscreen();
    fullScreenBtn.innerText = "Eixt Full Screen";
  }
};

const hideControls = () => videoControls.classList.remove("showing");

const handleMouseMove = () => {
  if (controlsTimeout) {
    clearTimeout(controlsTimeout);
    controlsTimeout = null;
  }
  // handleMouseMove의 func이 mouse가 moving 할 때만 적용되는 것이므로
  // controlsMovementTimeout는 move 하지 않을 때 조건을 만들어주는 것
  if (controlsMovementTimeout) {
    clearTimeout(controlsMovementTimeout);
    controlsMovementTimeout = null;
  }
  videoControls.classList.add("showing");
  controlsMovementTimeout = setTimeout(() => {
    videoControls.classList.remove("showing");
  }, 3000);
};

const handleMouseLeave = () => {
  controlsTimeout = setTimeout(hideControls, 3000);
  // console.log(id);
};

const handleEnded = () => {
  const { id } = videoContainer.dataset;
  fetch(`/api/videos/${id}/view`, { method: "post" });
};

playBtn.addEventListener("click", handlePlay);
muteBtn.addEventListener("click", handleMute);
volumeRange.addEventListener("input", handlevolumeChange);
// volume바를 조절하는 것을 input event라고 함
video.addEventListener("loadedmetadata", handleLoadedMetadata);
video.addEventListener("timeupdate", handleTimeUpdate);
timeline.addEventListener("input", handleTimelineChange);
fullScreenBtn.addEventListener("click", handleFullscreen);
videoContainer.addEventListener("mousemove", handleMouseMove);
videoContainer.addEventListener("mouseleave", handleMouseLeave);

video.addEventListener("ended", handleEnded); //video event
