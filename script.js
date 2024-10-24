let canvas = document.getElementById("canvas");
let startcamera = document.getElementById("startcamera");
let takephoto = document.getElementById("takephoto");
let video = document.getElementById("video");
let data = null;
video.muted = true;

startcamera.addEventListener("click", () => {
  // Accessing the user camera and video.
  navigator.mediaDevices
    .getUserMedia({ video: true, audio: false })
    .then((stream) => {
      video.srcObject = stream;
      video.play();
      streaming = true;
    })
    .catch((err) => {
      console.error(`An error occurred: ${err}`);
    });
  clearphoto();
});

takephoto.addEventListener("click", () => {
  const height = video.videoHeight;
  const width = video.videoWidth;
  console.log(height);
  canvas.setAttribute("width", width);
  canvas.setAttribute("height", height);
  const context = canvas.getContext("2d");
  context.drawImage(video, 0, 0, width, height);
  const data = canvas.toDataURL("image/png");
});

function clearphoto() {
  canvas.setAttribute("width", width);
  canvas.setAttribute("height", height);
  const context = canvas.getContext("2d");
  context.fillStyle = "#fff";
  context.fillRect(0, 0, canvas.width, canvas.height);
  const data = canvas.toDataURL("image/png");
}

clearphoto();
