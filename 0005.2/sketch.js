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

function setup() {
  createCanvas(windowWidth, windowHeight);
  captureWebcam();
  // blendMode(MULTIPLY)
}

function draw() {
  // background(255);
  let xDiff = width - capture.width;
  let yDiff = height - capture.height;
  clear();
  image(capture, xDiff / 2, yDiff / 2);
  fill(255, 205);
  noStroke();
  rect(0, 0, width, height);

  // console.log({landmarks})
  let first = true;
  if (landmarks.length > 0) {
    for (const hand of landmarks) {
      first ? fill(255, 0, 0) : fill(0, 255, 0);

      for (const m of hand) {
        stroke(0);
        strokeWeight(abs(50 * m.z));

        let x = m.x * capture.width + xDiff/2;
        let y = m.y * capture.height + yDiff/2;
        line(width, 0, x, y);
        line(width, height, x, y);
        line(0, 0, x, y);
        line(0, height, x, y);
        // circle(m.x * capture.width, m.y * capture.height, m.z * 100);
      }
      first = false;
    }
  }
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
  capture.hide();
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
