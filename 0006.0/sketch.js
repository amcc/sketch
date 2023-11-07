// HOW TO USE
// predictWebcam(video) will start predicting landmarks

// pass a video MediaElement using createCapture
// make sure to call predictWebcam as a callback to createCapture
// this ensures the video is ready

// parts index:
// https://developers.google.com/mediapipe/solutions/vision/pose_landmarker/index

let capture;
let loadedCamera;
let captureEvent;
let confidence = 0.0;
let yOff = 0;
let defaultWeight = 50;
let lerpRate = 0.4;
let madeClone = false;
let lerpLandmarks = [];
let videGraphics;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  captureWebcam();
  vidGraphics = createGraphics(width, height);

  // blendMode(MULTIPLY)
}

function draw() {
  // background(255);
  let xDiff = width - capture.width;
  let yDiff = height - capture.height;
  clear();
  // image(capture, -width/2 ,-height/2 );
  fill(255, 205);
  noStroke();
  // rect(0, 0, width, height);

  // console.log({landmarks})
  let first = true;
  if (landmarks.length > 0) {
    for (const hand of landmarks) {
      first ? fill(255, 0, 0) : fill(0, 255, 0);

      for (const m of hand) {
        stroke(100, 200, 255);
        noFill();
        strokeWeight(abs(5 * m.z));

        let x = m.x * capture.width + xDiff / 2 - width / 2;
        let y = m.y * capture.height + yDiff / 2 - height / 2;
        let z = m.z * 1000;

        push();
        translate(x, y, z);
        sphere(z);

        pop();
      }

      first = false;
    }
    if (landmarks.length === 2) {
      vidGraphics.image(capture, 0, 0, width, height);
      vidGraphics.pop();
      push();
      fill(0);
      texture(vidGraphics);
      quad(
        ...loc(landmarks[0][8]),
        ...loc(landmarks[1][8]),
        ...loc(landmarks[1][4]),
        ...loc(landmarks[0][4])
      );
      pop();
    }
  }
}

function loc(point) {
  let xDiff = width - capture.width;
  let yDiff = height - capture.height;
  return [
    point.x * capture.width + xDiff / 2 - width / 2,
    point.y * capture.height + yDiff / 2 - height / 2,
    point.z * 1000,
  ];
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
      capture.srcObject = e;

      setCameraDimensions();
      predictWebcam(capture);
    }
  );
  capture.elt.setAttribute("playsinline", "");
  // capture.hide();
}

function setCameraDimensions() {
  loadedCamera = captureEvent.getTracks()[0].getSettings();
  // console.log("cameraDimensions", loadedCamera);
  if (capture.width < capture.height) {
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
