// HOW TO USE
// predictWebcam(video) will start predicting mediaPipe.personLandmarks

// pass a video MediaElement using createCapture
// make sure to call predictWebcam as a callback to createCapture
// this ensures the video is ready

// parts index:
// https://developers.google.com/mediapipe/solutions/vision/pose_landmarker/index

let capture;
let confidence = 0.0;
let yOff = 0;

let lPerson = [];
let lerpRate = 0.2;
let lerpStartPos = 0;

let lineStart;
let lineEnd;
let strokeWeightVal;

// blackish
// let lineStrokeColor = [0, 0, 0, 200];
//tomato
let lineStrokeColor = [255, 99, 71, 220];

let bezierHandles = {
  rightIndex: {
    x: 0,
    y: 0,
  },
  leftIndex: {
    x: 0,
    y: 0,
  },
};

function setup() {
  createCanvas(windowWidth, windowHeight);
  captureWebcam();
  for (let i = 0; i < 33; i++) {
    lPerson.push({
      x: lerpStartPos,
      y: lerpStartPos,
      z: lerpStartPos,
    });
  }

  strokeWeightVal = height / 4;
  lineStart = [strokeWeightVal, height / 2];
  lineEnd = [width - strokeWeightVal, height / 2];

  // blendMode(DIFFERENCE);
}

function draw() {
  noStroke();
  clear();
  background(255);

  // flip the webcam image so it looks like a mirror
  push();
  scale(-1, 1); // mirror webcam
  image(capture, -capture.width, 0); // draw webcam
  scale(-1, 1); // unset mirror
  // fill(255, 100);
  // fill(255);
  // rect(0, 0, width, height);
  pop();

  // hands landmarks contain an array of hands

  if (mediaPipe.handLandmarks.length > 0) {
    mediaPipe.handLandmarks.forEach((hand, index) => {
      // each hand contains an array of finger/knuckle positions

      // handedness stores if the hands are right/left
      let handedness = mediaPipe.handednesses[index][0].displayName;

      // if using a front camera hands are the wrong way round so we flip them
      handedness === "Right" ? (handedness = "left") : (handedness = "right");

      // lets colour each hand depeding on whether its the first or second hand
      handedness === "right" ? fill(255, 0, 0) : fill(0, 255, 0);

      let thumbKnuckleDist = dist(hand[3].x, hand[3].y, hand[4].x, hand[4].y);
      let fingerKnuckleDist = dist(
        hand[19].x,
        hand[19].y,
        hand[20].x,
        hand[20].y
      );
      let minDist = Math.max(thumbKnuckleDist, fingerKnuckleDist);

      let thumbFingerDist = dist(hand[4].x, hand[4].y, hand[20].x, hand[20].y);

      let thumbFingerState =
        thumbFingerDist > minDist * 1.5 ? "open" : "closed";

      if (thumbFingerState === "closed" && handedness === "left") {
        lineStart = getFlipPos(hand[4]);
      }
      if (thumbFingerState === "closed" && handedness === "right") {
        lineEnd = getFlipPos(hand[4]);
      }

      hand.forEach((part, index) => {
        // each part is a knuckle or section of the hand
        // we have x, y and z positions so we could also do this in 3D (WEBGL)
        // if (index === 8) {
        //   textSize(30);
        //   text(handedness, ...getFlipPos(part, 20));
        //   text(thumbFingerState, ...getFlipPos(part, 100));
        // }
        if (index === 8) {
          fill("cyan");
          bezierHandles[`${handedness}Index`] = {
            x: getFlipPos(part)[0],
            y: getFlipPos(part)[1],
          };
        } else {
          thumbFingerState === "closed" ? fill("magenta") : fill("yellow");
        }
        circle(...getFlipPos(part), part.z * 500);
      });
    });
  }

  noFill();

  // tomato
  // stroke(255, 99, 71, 220);
  stroke(...lineStrokeColor);
  strokeWeight(strokeWeightVal);
  bezier(
    ...lineStart,
    bezierHandles.leftIndex.x,
    bezierHandles.leftIndex.y,
    bezierHandles.rightIndex.x,
    bezierHandles.rightIndex.y,
    ...lineEnd
  );

  stroke("cyan");
  strokeWeight(3);

  circle(
    bezierHandles.rightIndex.x,
    bezierHandles.rightIndex.y,
    strokeWeightVal / 8
  );
  circle(
    bezierHandles.leftIndex.x,
    bezierHandles.leftIndex.y,
    strokeWeightVal / 8
  );

  line(...lineStart, bezierHandles.leftIndex.x, bezierHandles.leftIndex.y);
  line(...lineEnd, bezierHandles.rightIndex.x, bezierHandles.rightIndex.y);

  bezier(
    ...lineStart,
    bezierHandles.leftIndex.x,
    bezierHandles.leftIndex.y,
    bezierHandles.rightIndex.x,
    bezierHandles.rightIndex.y,
    ...lineEnd
  );
}

// return flipped x and y positions
function getFlipPos(part, xAdd = 0, yAdd = 0) {
  return [
    capture.width - part.x * capture.width + xAdd,
    part.y * capture.height + yAdd,
  ];
}

// this function helps to captuer the webcam in a way that ensure video is loaded
// before we start predicting mediaPipe.personLandmarks. Creatcapture has a callback which is
// only called when the video is correctly loaded. At that point we set the dimensions
// and start predicting mediaPipe.personLandmarks
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
      mediaPipe.predictWebcam(capture);
    }
  );
  capture.elt.setAttribute("playsinline", "");
  capture.hide();
}

// this function sets the dimensions of the video element to match the
// dimensions of the camera. This is important because the camera may have
// different dimensions than the default video element
function setCameraDimensions() {
  // resize the capture depending on whether
  // the camera is landscape or portrait

  if (capture.width > capture.height) {
    capture.size(width, (capture.height / capture.width) * width);
  } else {
    capture.size((capture.width / capture.height) * height, height);
  }
}

// resize the canvas when the window is resized
// also reset the camera dimensions
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  setCameraDimensions();
}
