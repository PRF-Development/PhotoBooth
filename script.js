let canvas = document.getElementById("canvas");
let startcamera = document.getElementById("startcamera");
let takephoto = document.getElementById("takephoto");
let video = document.getElementById("video");

var contentImg = document.getElementById("content-img");
var styleImg = document.getElementById("style-img");
var stylizedImg = document.getElementById("stylized-img");

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
      setTimeout(() => {
        clearphoto();
      }, 1000);
    })
    .catch((err) => {
      console.error(`An error occurred: ${err}`);
    });
});

takephoto.addEventListener("click", () => {
  var height = video.videoHeight;
  var width = video.videoWidth;
  if (height === 0 || width === 0) {
    height = 150;
    width = 300;
  }
  console.log(height);
  canvas.setAttribute("width", width);
  canvas.setAttribute("height", height);
  canvas.style.width = width + "px";
  canvas.style.height = height + "px";
  const context = canvas.getContext("2d");
  context.drawImage(video, 0, 0, width, height);
  data = canvas.toDataURL("image/png");
});

function clearphoto() {
  var height = video.videoHeight;
  var width = video.videoWidth;
  if (height === 0 || width === 0) {
    height = 150;
    width = 300;
  }
  canvas.setAttribute("width", width);
  canvas.setAttribute("height", height);
  canvas.style.width = width + "px";
  canvas.style.height = height + "px";
  const context = canvas.getContext("2d");
  context.fillStyle = "#aaa";
  context.fillRect(0, 0, canvas.width, canvas.height);
  const data = canvas.toDataURL("image/png");
}

clearphoto();
