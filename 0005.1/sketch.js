// HOW TO USE
// predictWebcam(video) will start predicting landmarks

// pass a video MediaElement using createCapture
// make sure to call predictWebcam as a callback to createCapture
// this ensures the video is ready

// parts index:
// https://developers.google.com/mediapipe/solutions/vision/pose_landmarker/index

let capture;
let w;
let h;
let z;
let loadedCamera;
let captureEvent;
let confidence = 0.0;
let yOff = 0;
let defaultWeight = 50;
let lerpRate = 0.4;
let madeClone = false;
let lerpLandmarks = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  captureWebcam();
}

function draw() {
  background(255);
  // image(capture, 0, 0);
  fill(255, 240);
  noStroke();
  // rect(0,0,width, height)

  z = w * 2.0
  // console.log({landmarks})
  let first = true;
  if (landmarks.length > 0) {
    for (const hand of landmarks) {
      first ? fill(255, 0, 0) : fill(0, 255, 0);
      first = false;
      for (const m of hand) {
        // console.log(m)
        push();
        translate(m.x * w - w / 2, m.y * h - h / 2, -m.z * z);
        normalMaterial();
        sphere(10);
        pop();
        // circle(m.x * capture.width, m.y * capture.height, m.z * 100);
      }
      stroke(0);
      makeLine(hand[0], hand[1]);
      makeLine(hand[1], hand[2]);
      makeLine(hand[2], hand[3]);
      makeLine(hand[3], hand[4]);

      makeLine(hand[5], hand[6]);
      makeLine(hand[6], hand[7]);
      makeLine(hand[7], hand[8]);

      makeLine(hand[9], hand[10]);
      makeLine(hand[10], hand[11]);
      makeLine(hand[11], hand[12]);

      makeLine(hand[13], hand[14]);
      makeLine(hand[14], hand[15]);
      makeLine(hand[15], hand[16]);

      makeLine(hand[17], hand[18]);
      makeLine(hand[18], hand[19]);
      makeLine(hand[19], hand[20]);
    }
  }
}

function makeLine(a, b) {
  line(
    a.x * w - w / 2,
    a.y * h - h / 2,
    -a.z * z,
    b.x * w - w / 2,
    b.y * h - h / 2,
    -b.z * z
  );
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
  if (capture.width > capture.height) {
    capture.size(width, (capture.height / capture.width) * width);
  } else {
    capture.size((capture.width / capture.height) * height, height);
  }

  w = capture.width;
  h = capture.height;
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
