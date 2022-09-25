const startBtn = document.getElementById("startBtn");
const video = document.getElementById("preview");

let stream;
let recorder;
let videoFile;

const handleDownload = () => {
  const a = document.createElement("a");
  a.href = videoFile;
  a.download = "Record Video File Name.webm"; // download 시 default name
  document.body.appendChild(a);
  a.click(); // download 접근
};

const handleStop = () => {
  startBtn.innerText = "Download Recording";
  startBtn.removeEventListener("click", handleStop);
  startBtn.addEventListener("click", handleDownload);

  recorder.stop();
};

// video record 시작
const handleStart = () => {
  startBtn.innerText = "Stop Recording";
  startBtn.removeEventListener("click", handleStart);
  startBtn.addEventListener("click", handleStop);

  // media recorder start와 stop은 작동되지만 기록은 사라지게 된다. 하지만 mediaRecorder를 이용해야지 record data가 저장이 된다.
  recorder = new MediaRecorder(stream);
  recorder.ondataavailable = (event) => {
    // createObjectURL은 browser상의 memory에사만 사용가능한 URL을 만드는 것
    videoFile = URL.createObjectURL(event.data);
    video.srcObject = null;
    video.src = videoFile;
    video.loop = true;
    video.play();
  };
  recorder.start();
};

// video record 전에 video가 작동하는지 미리보기
const init = async () => {
  stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: true,
  });
  video.srcObject = stream; // src를 upload.pug에 따로 지정하지 않은 것을 여기서 해결
  video.play(); // video 실제 작동 하는 func
};

init();
startBtn.addEventListener("click", handleStart);
