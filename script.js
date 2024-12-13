let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");
let startcamera = document.getElementById("startcamera");
let takephoto = document.getElementById("takephoto");
let video = document.getElementById("video");
let startstyle = document.getElementById("startstyle");

var contentImg = document.getElementById("content-img");
var styleImg = document.getElementById("style-img");
var stylizedImg = document.getElementById("stylized-img");

let data = null;
video.muted = true;

function openCamera() {
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
}

window.onload = function () {
  clearphoto();
  openCamera();
  load_style_image("style_images/bricks.jpg");
  startstyle.disabled = true;
  document.getElementById("bricks").click();
};
startcamera.addEventListener("click", openCamera);

takephoto.addEventListener("click", async () => {
  takephoto.disabled = true;
  var height = video.videoHeight;
  var width = video.videoWidth;
  if (height === 0 || width === 0) {
    height = 150;
    width = 300;
  }
  var resize_width = Math.min(500, width);
  var resize_height = Math.round((resize_width * height) / width);
  canvas.setAttribute("width", resize_width);
  canvas.setAttribute("height", resize_height);
  canvas.style.width = width + "px";
  canvas.style.height = height + "px";
  stylizedImg.setAttribute("width", resize_width);
  stylizedImg.setAttribute("height", resize_height);
  stylizedImg.style.width = width + "px";
  stylizedImg.style.height = height + "px";
  context.drawImage(video, 0, 0, resize_width, resize_height);
  const data = await canvas.toDataURL("image/png");
  await contentImg.setAttribute("src", data);
  takephoto.disabled = false;
  startstyle.disabled = false;
});

startstyle.addEventListener("click", async () => {
  startstyle.disabled = true;
  const data = await styleImg.getAttribute("src");
  await styleImg.setAttribute("src", data);
  await startStyling();
  startstyle.disabled = false;
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
}

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

function load_style_image(src) {
  styleImg.src = src;
}
