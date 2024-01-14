// Daniel Shiffman
// https://youtu.be/rNqaw8LT2ZU
// http://thecodingtrain.com

let video;
let videoSize = {};
let landscape = true;
let go = false;

let rows = 15;
// we will calculate vScale when video loads
let vScale;
let ratio = 1;
let hDiff = 0;
let wDiff = 0;
let rectSize = 10;

// lerping
let lerpRate = 0.1;
let particles = [];

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
    vScale = video.width / rows;
    console.log({ vScale });
    // store original video size
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
  background(255);
  video.loadPixels();
  for (var y = 0; y < video.height; y++) {
    for (var x = 0; x < video.width; x++) {
      let index = (x + y * video.width) * 4;
      let r = video.pixels[index + 0];
      let g = video.pixels[index + 1];
      let b = video.pixels[index + 2];
      let bright = (r + g + b) / 3;
      let rot = map(bright, 0, 255, 0, TWO_PI);
      noStroke();
      stroke(0, 0, 255);
      strokeWeight(14);
      fill(255);
      rectMode(CENTER);
      push();
      let xpos = x * vScale * ratio + (vScale / 2) * ratio + wDiff;
      let ypos = y * vScale * ratio + (vScale / 2) * ratio + hDiff;
      translate(xpos, ypos);
      particles[index] = lerp(particles[index] || 0, rot, lerpRate);
      rotate(particles[index]);
      rect(0, 0, vScale * ratio, vScale / 2, vScale / 4);
      pop();
    }
  }
}
