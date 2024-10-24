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
  canvas.setAttribute("width", width);
  canvas.setAttribute("height", height);
  canvas.style.width = width + "px";
  canvas.style.height = height + "px";
  stylizedImg.setAttribute("width", width);
  stylizedImg.setAttribute("height", height);
  stylizedImg.style.width = width + "px";
  stylizedImg.style.height = height + "px";
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
  stylizedImg.setAttribute("width", width);
  stylizedImg.setAttribute("height", height);
  stylizedImg.style.width = width + "px";
  stylizedImg.style.height = height + "px";
  const context = canvas.getContext("2d");
  context.fillStyle = "#aaa";
  context.fillRect(0, 0, canvas.width, canvas.height);
  const data = canvas.toDataURL("image/png");
}

clearphoto();

var styleNet = null;
async function loadStyleModel() {
  if (!styleNet) {
    styleNet = await tf.loadGraphModel("style_model_js/model.json");
  }
  return styleNet;
}
loadStyleModel();

var transformNet = null;
async function loadTransformerModel() {
  if (!transformNet) {
    transformNet = await tf.loadGraphModel("transformer_model_js/model.json");
  }
  return transformNet;
}
loadTransformerModel();

async function startStyling() {
  await tf.nextFrame();
  console.log("Generating 100D style representation");
  await tf.nextFrame();
  let bottleneck = await tf.tidy(() => {
    return styleNet.predict(
      tf.browser.fromPixels(styleImg).toFloat().div(tf.scalar(255)).expandDims()
    );
  });
  console.log("Stylizing image...");
  await tf.nextFrame();
  stylized = await tf.tidy(() => {
    return transformNet
      .predict([
        tf.browser
          .fromPixels(contentImg)
          .toFloat()
          .div(tf.scalar(255))
          .expandDims(),
        bottleneck,
      ])
      .squeeze();
  });
  console.log("Done stylizing image.");
  await tf.browser.toPixels(stylized, stylizedImg);
  //   bottleneck.dispose(); // keep this around
  stylized.dispose();
}
