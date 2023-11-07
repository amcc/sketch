// HOW TO USE
// predictWebcam(video) will start predicting landmarks

// pass a video MediaElement using createCapture
// make sure to call predictWebcam as a callback to createCapture
// this ensures the video is ready

// parts index:
// https://developers.google.com/mediapipe/solutions/vision/pose_landmarker/index

let capture;
let loadedCamera;
let confidence = 0.0;
let yOff = 0;
let defaultWeight = 270;
let lerpRate = 0.4;
let l;
let p;
let madeClone = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  captureWebcam();
}

function draw() {
  background(255);
  // image(capture, 0, 0);

  if (landmarks.length > 0) {
    if (!madeClone) {
      l = JSON.parse(JSON.stringify(landmarks[0]));
      madeClone = true;
    }
    makeBezier({
      start: 8,
      cont1: 5,
      cont2: 2,
      end: 7,
    });
    makeBezier({
      start: 8,
      cont1: 12,
      cont2: 14,
      end: 16,
    });

    makeBezier({
      start: 7,
      cont1: 11,
      cont2: 13,
      end: 15,
    });

    makeBezier({
      start: 16,
      cont1: 24,
      cont2: 26,
      end: 28,
    });

    makeBezier({
      start: 15,
      cont1: 23,
      cont2: 25,
      end: 27,
    });

    makeBezier({
      start: 27,
      cont1: 25,
      cont2: 26,
      end: 28,
    });
  }
}

function makeBezier({
  start,
  cont1,
  cont2,
  end,
  fillColour,
  strokeColour = color(0),
  weight = 270,
}) {
  if (fillColour !== undefined) {
    fill(fillColour);
  } else {
    noFill();
  }

  if (strokeColour === null) {
    noStroke();
  } else {
    stroke(strokeColour);
  }

  strokeWeight(weight);

  let p = landmarks[0];
  l[start].x = simpLerp(l[start].x, p[start].x, lerpRate);
  l[start].y = simpLerp(l[start].y, p[start].y, lerpRate);
  l[cont1].x = simpLerp(l[cont1].x, p[cont1].x, lerpRate);
  l[cont1].y = simpLerp(l[cont1].y, p[cont1].y, lerpRate);
  l[cont2].x = simpLerp(l[cont2].x, p[cont2].x, lerpRate);
  l[cont2].y = simpLerp(l[cont2].y, p[cont2].y, lerpRate);
  l[end].x = simpLerp(l[end].x, p[end].x, lerpRate);
  l[end].y = simpLerp(l[end].y, p[end].y, lerpRate);

  bezier(
    l[start].x * width,
    l[start].y * height + yOff,
    l[cont1].x * width,
    l[cont1].y * height + yOff,
    l[cont2].x * width,
    l[cont2].y * height + yOff,
    l[end].x * width,
    l[end].y * height + yOff
  );
  // console.log(landmarks[0][start].x);
}

function captureWebcam() {
  capture = createCapture(
    {
      audio: false,
      video: {
        facingMode: "user",
      },
    },
    function (e) {
      captureEvent = e;
      // do things when video ready
      // until then, the video element will have no dimensions, or default 640x480
      setCameraDimensions();
      predictWebcam(capture);
    }
  );
  capture.elt.setAttribute("playsinline", "");
  capture.hide();
}

function setCameraDimensions() {
  loadedCamera = captureEvent.getTracks()[0].getSettings();
  // console.log("cameraDimensions", loadedCamera);
  if (capture.width > capture.height) {
    capture.size(width, (capture.height / capture.width) * width);
  } else {
    capture.size((capture.width / capture.height) * height, height);
  }
  // console.log(capture);
}

function getAngle(v0x, v0y, v1x, v1y) {
  return atan2(v1y - v0y, v1x - v0x);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  setCameraDimensions();
}

function simpLerp(a, b, rate) {
  return a + rate * (b - a);
}
