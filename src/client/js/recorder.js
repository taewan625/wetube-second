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

  await ffmpeg.run(
    "-i",
    "recording.webm",
    "-ss",
    "00:00:01",
    "-frames:v",
    "1",
    "thumbnail.jpg"
  );
  const mp4File = ffmpeg.FS("readFile", "output.mp4");
  const thumbFile = ffmpeg.FS("readFile", "thumbnail.jpg");
  // console.log(mp4File);
  // console.log(mp4File.buffer); //binary data를 사용하기위한 조건이 buffer

  const mp4Blob = new Blob([mp4File.buffer], { type: "video/mp4" });
  const thumbBlob = new Blob([thumbFile.buffer], { type: "image/jpg" });

  const mp4URL = URL.createObjectURL(mp4Blob);
  const thumbURL = URL.createObjectURL(thumbBlob);
  const videoA = document.createElement("a");
  videoA.href = mp4URL; // Blob = (Binary Large Object)
  videoA.download = "MyRecording.mp4"; // download 시 default name + user가 link url로 넘어가는 것이 아니라 download하도록 설정이 변경
  document.body.appendChild(videoA);
  videoA.click(); // download 접근

  const thumbA = document.createElement("a");
  thumbA.href = thumbURL; // Blob = (Binary Large Object)
  thumbA.download = "MyThumbnail.jpg"; // download 시 default name + user가 link url로 넘어가는 것이 아니라 download하도록 설정이 변경
  document.body.appendChild(thumbA);
  thumbA.click(); // download 접근

  // video download를 위해서 만든 raw file과 mp4, jpg 파일은 필요없으므로 제거
  ffmpeg.FS("unlink", "recording.webm");
  ffmpeg.FS("unlink", "output.mp4");
  ffmpeg.FS("unlink", "thumbnail.jpg");

  // URL 연결도 끊기 -> user의 browser memory에 있는 file을 지우는 것으로 속도의 향상
  URL.revokeObjectURL(mp4URL);
  URL.revokeObjectURL(thumbURL);
  URL.revokeObjectURL(videoFile);
};

const handleStop = () => {
  startBtn.innerText = "Download Recording";
  startBtn.removeEventListener("click", handleStop);
  startBtn.addEventListener("click", handleDownload);

  recorder.stop();
};
``;

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
