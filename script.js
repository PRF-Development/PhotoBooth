let startcamera = document.getElementById("startcamera");
let video = document.getElementById("video");
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
});
