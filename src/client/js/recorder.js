const startBtn = document.getElementById("startBtn");
const video = document.getElementById("preview");

let stream;
let recorder;

const handleStop = () => {
  startBtn.innerText = "Start Recording";
  startBtn.removeEventListener("click", handleStop);
  startBtn.addEventListener("click", handleStart);

  recorder.stop();
};

// video record 시작
const handleStart = () => {
  startBtn.innerText = "Stop Recording";
  startBtn.removeEventListener("click", handleStart);
  startBtn.addEventListener("click", handleStop);

  // media recorder start와 stop은 작동되지만 기록은 사라지게 된다. 하지만 mediaRecorder를 이용해야지 record data가 저장이 된다.
  recorder = new MediaRecorder(stream);
  //   console.log(recorder);
  recorder.ondataavailable = (event) => {
    // console.log("recording done");
    // console.log(event);
    console.log(event.data);
    // createObjectURL은 browser상의 memory에사만 사용가능한 URL을 만드는 것
    const video = URL.createObjectURL();
    console.log(video);
  };
  recorder.start();
  //   console.log(recorder);
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
