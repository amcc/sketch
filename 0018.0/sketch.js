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

  strokeWeightVal = height / 6;
  lineStart = [strokeWeightVal, height / 2];
  lineEnd = [width - strokeWeightVal, height / 2];
}

function draw() {
  background(255);

  // flip the webcam image so it looks like a mirror
  push();
  scale(-1, 1); // mirror webcam
  image(capture, -capture.width, 0); // draw webcam
  scale(-1, 1); // unset mirror
  pop();

  // mediaPipe.personLandmarks contains an array of people
  if (mediaPipe.personLandmarks.length > 0) {
    mediaPipe.personLandmarks.forEach((person, index) => {
      person.forEach((part, index) => {
        // lerp all positions to smooth out the movement
        let x = getFlipPos(part)[0];
        let y = getFlipPos(part)[1];

        // console.log(lPerson);
        lPerson[index].x = lerp(lPerson[index].x, x, lerpRate);
        lPerson[index].y = lerp(lPerson[index].y, y, lerpRate);
      });
    });
  }

  noFill();

  stroke("black");
  strokeWeight(strokeWeightVal);

  bezier(
    ...lineStart,
    lPerson[19].x,
    lPerson[19].y,
    lPerson[20].x,
    lPerson[20].y,
    ...lineEnd
  );

  stroke("cyan");
  strokeWeight(3);

  circle(lPerson[19].x, lPerson[19].y, 20);
  circle(lPerson[20].x, lPerson[20].y, 20);

  line(...lineStart, lPerson[19].x, lPerson[19].y);
  line(...lineEnd, lPerson[20].x, lPerson[20].y);

  bezier(
    ...lineStart,
    lPerson[19].x,
    lPerson[19].y,
    lPerson[20].x,
    lPerson[20].y,
    ...lineEnd
  );

  // hands landmarks contain an array of hands
  noStroke();
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
      let fingerKnuckleDist = dist(hand[7].x, hand[7].y, hand[8].x, hand[8].y);
      let minDist = Math.max(thumbKnuckleDist, fingerKnuckleDist);

      let thumbFingerDist = dist(hand[4].x, hand[4].y, hand[8].x, hand[8].y);

      let thumbFingerState = thumbFingerDist > minDist ? "open" : "closed";

      if (thumbFingerState === "closed" && handedness === "left") {
        lineStart = getFlipPos(hand[4]);
      }
      if (thumbFingerState === "closed" && handedness === "right") {
        lineEnd = getFlipPos(hand[4]);
      }

      hand.forEach((part, index) => {
        // each part is a knuckle or section of the hand
        // we have x, y and z positions so we could also do this in 3D (WEBGL)
        if (index === 8) {
          textSize(30);
          text(handedness, ...getFlipPos(part, 20));
          text(thumbFingerState, ...getFlipPos(part, 100));
        }
        circle(...getFlipPos(part), part.z * 100);
      });
    });
  }
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
