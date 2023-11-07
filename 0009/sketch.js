// Daniel Shiffman
// https://youtu.be/rNqaw8LT2ZU
// http://thecodingtrain.com

let video;
let videoSize = {};
let landscape = true;
let go = false;

let vScale = 8;
let ratio = 1;
let hDiff = 0;
let wDiff = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  // video = createCapture(VIDEO, onVideoLoaded);
  video = createCapture({
    audio: false,
    video: {
      facingMode: "user",
      frameRate: 30,
    },
  });
}
function onVideoLoaded() {}

function draw() {
  // wait till the metadate is loaded then set values
  if (video.loadedmetadata && !go) {
    videoSize = {
      height: video.height,
      width: video.width,
    };
    if (videoSize.width < videoSize.height) landscape = false;
    video.size(videoSize.width / vScale, videoSize.height / vScale);

    if (landscape) {
      ratio = width / videoSize.width;
      hDiff = (height - video.height * vScale * ratio) / 2;
    } else {
      ratio = height / videoSize.height;
      wDiff = (width - video.width * vScale * ratio) / 2;
    }
    go = true;

    video.hide();
  }
  if (go) {
    drawMirror();
  }
}

function drawMirror() {
  background(0);
  video.loadPixels();
  for (var y = 0; y < video.height; y++) {
    for (var x = 0; x < video.width; x++) {
      var index = (video.width - x + 1 + y * video.width) * 4;
      var r = video.pixels[index + 0];
      var g = video.pixels[index + 1];
      var b = video.pixels[index + 2];
      var bright = (r + g + b) / 3;
      var r = map(bright, 0, 255, 0, TWO_PI);
      noStroke();
      fill(255);
      rectMode(CENTER);
      push();
      let xpos = x * vScale * ratio + (vScale / 2) * ratio + wDiff;
      let ypos = y * vScale * ratio + (vScale / 2) * ratio + hDiff;
      translate(xpos, ypos);
      rotate(r);
      rect(0, 0, vScale * ratio, 4);
      pop();
    }
  }
}
