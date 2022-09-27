import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
const actionBtn = document.getElementById("actionBtn");
const video = document.getElementById("preview");

let stream;
let recorder;
let videoFile;

// string 반복사용시 실수error 방지 위한 object
const files = {
  input: "recording.webm",
  output: "output.mp4",
  thumb: "thumbnail.jpg",
};
// 반복되는 func
const downloadFile = (fileUrl, fileName) => {
  const a = document.createElement("a");
  a.href = fileUrl; // Blob = (Binary Large Object)
  a.download = fileName; // download 시 default name + user가 link url로 넘어가는 것이 아니라 download하도록 설정이 변경
  document.body.appendChild(a);
  a.click(); // download 접근
};

const handleDownload = async () => {
  actionBtn.innerText = "Transcoding...";
  actionBtn.removeEventListener("click", handleDownload);
  actionBtn.disabled = true;

  const ffmpeg = createFFmpeg({ log: true });
  // 상대방의 computer를 이용해서 현재 내 웹사이트에서 ffmpeg progrem을 load를 해야하므로 progrem이 무거우면 느려질수있으므로 load 필요
  await ffmpeg.load();
  // 현재 webassembly를 이용중이고 이제부터 webassembly라는 가상환경속에 mp4 file을 만드는 것이다.
  ffmpeg.FS("writeFile", files.input, await fetchFile(videoFile));
  // webassembly FS(파일생성한다는 명령어, upload할 file NAME, binary data function 주기)
  await ffmpeg.run("-i", files.input, "-r", "60", files.output); // (input -> file -> output) # this is ffmpeg console command

  await ffmpeg.run(
    "-i",
    files.input,
    "-ss",
    "00:00:01",
    "-frames:v",
    "1",
    files.thumb
  );

  const mp4File = ffmpeg.FS("readFile", files.output);
  const thumbFile = ffmpeg.FS("readFile", files.thumb);
  // console.log(mp4File);
  // console.log(mp4File.buffer); //binary data를 사용하기위한 조건이 buffer

  const mp4Blob = new Blob([mp4File.buffer], { type: "video/mp4" });
  const thumbBlob = new Blob([thumbFile.buffer], { type: "image/jpg" });

  const mp4Url = URL.createObjectURL(mp4Blob);
  const thumbUrl = URL.createObjectURL(thumbBlob);

  downloadFile(mp4Url, "MyRecording.mp4");
  downloadFile(thumbUrl, "MyThumbnail.jpg");

  // video download를 위해서 만든 raw file과 mp4, jpg 파일은 필요없으므로 제거
  ffmpeg.FS("unlink", files.input);
  ffmpeg.FS("unlink", files.output);
  ffmpeg.FS("unlink", files.thumb);

  // URL 연결도 끊기 -> user의 browser memory에 있는 file을 지우는 것으로 속도의 향상
  URL.revokeObjectURL(mp4Url);
  URL.revokeObjectURL(thumbUrl);
  URL.revokeObjectURL(videoFile);

  // transcoding finish 된 후
  actionBtn.disabled = false;
  init(); // record again 할때 기본 video 작동화면 보여주도록 하기위함
  actionBtn.innerText = "Record Again";
  actionBtn.addEventListener("click", handleStart);
};

const handleStop = () => {
  actionBtn.innerText = "Download Recording";
  actionBtn.removeEventListener("click", handleStop);
  actionBtn.addEventListener("click", handleDownload);

  recorder.stop();
};

// video record 시작
const handleStart = () => {
  actionBtn.innerText = "Stop Recording";
  actionBtn.removeEventListener("click", handleStart);
  actionBtn.addEventListener("click", handleStop);

  recorder = new MediaRecorder(stream, { mimeType: "video/webm" });

  // media recorder start와 stop은 작동되지만 기록은 사라지게 된다. 하지만 mediaRecorder를 이용해야지 record data가 저장이 된다.
  recorder.ondataavailable = (event) => {
    // createObjectURL은 browser상의 memory에사만 사용가능한 URL을 만드는 것
    videoFile = URL.createObjectURL(event.data); //=blob
    // console.log(videoFile);
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
actionBtn.addEventListener("click", handleStart);
