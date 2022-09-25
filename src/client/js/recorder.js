import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
const startBtn = document.getElementById("startBtn");
const video = document.getElementById("preview");

let stream;
let recorder;
let videoFile;

const handleDownload = async () => {
  const ffmpeg = createFFmpeg({ log: true });
  // 상대방의 computer를 이용해서 현재 내 웹사이트에서 ffmpeg progrem을 load를 해야하므로 progrem이 무거우면 느려질수있으므로 load 필요
  await ffmpeg.load();
  // 현재 webassembly를 이용중이고 이제부터 webassembly라는 가상환경속에 mp4 file을 만드는 것이다.
  ffmpeg.FS("writeFile", "recording.webm", await fetchFile(videoFile));
  // webassembly FS(파일생성한다는 명령어, upload할 file NAME, binary data function 주기)
  await ffmpeg.run("-i", "recording.webm", "-r", "60", "output.mp4"); // (input -> file -> output) # this is ffmpeg console command

  const mp4File = ffmpeg.FS("readFile", "output.mp4");
  // console.log(mp4File);
  // console.log(mp4File.buffer); //binary data를 사용하기위한 조건이 buffer

  const mp4Blob = new Blob([mp4File.buffer], { type: "video/mp4" });

  const mp4URL = URL.createObjectURL(mp4Blob);

  const a = document.createElement("a");
  a.href = mp4URL; // Blob = (Binary Large Object)
  a.download = "MyRecording.mp4"; // download 시 default name + user가 link url로 넘어가는 것이 아니라 download하도록 설정이 변경
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

  recorder = new MediaRecorder(stream, { mimeType: "video/webm" });

  // media recorder start와 stop은 작동되지만 기록은 사라지게 된다. 하지만 mediaRecorder를 이용해야지 record data가 저장이 된다.
  recorder.ondataavailable = (event) => {
    // createObjectURL은 browser상의 memory에사만 사용가능한 URL을 만드는 것
    videoFile = URL.createObjectURL(event.data); //=blob
    // console.log(videoFile);
    video.srcObject = null;
    video.src = videoFile;
    // video.loop = true;
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
