let capture;
let loadedCamera;
let confidence = 0.5;
let yOff = 0;
let p = person;
let defaultWeight = 300;
let lerpRate = 0.5

function setup() {
  createCanvas(windowWidth, windowHeight);
  captureWebcam();
  startPoseNet(capture);
}

function draw() {
  let p = person;
  noStroke();
  yOff = (height - capture.height) / 2;
  clear();
  background(255);
  // display video
  image(capture, 0, yOff);
  fill(255, 255);
  rect(0, 0, width, height);

  fill("red");
  noStroke();
  // keypoints.forEach((keypoint) => {
  //   circle(keypoint.position.x, keypoint.position.y + yOff, 10);
  // });

  makeBezier({
    start: p.rightEar,
    cont1: p.rightEye,
    cont2: p.leftEye,
    end: p.leftEar,
  });
  makeBezier({
    start: p.rightEar,
    cont1: p.rightShoulder,
    cont2: p.rightElbow,
    end: p.rightWrist,
  });

  makeBezier({
    start: p.leftEar,
    cont1: p.leftShoulder,
    cont2: p.leftElbow,
    end: p.leftWrist,
  });

  makeBezier({
    start: p.rightWrist,
    cont1: p.rightHip,
    cont2: p.rightKnee,
    end: p.rightAnkle,
  });

  makeBezier({
    start: p.leftWrist,
    cont1: p.leftHip,
    cont2: p.leftKnee,
    end: p.leftAnkle,
  });

  makeBezier({
    start: p.leftAnkle,
    cont1: p.leftKnee,
    cont2: p.rightKnee,
    end: p.rightAnkle,
  });
}

function makeBezier({
  start,
  cont1,
  cont2,
  end,
  fillColour,
  strokeColour = color(0),
  weight = defaultWeight,
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

  beginShape();
  vertex(start.x, start.y + yOff);
  bezierVertex(
    cont1.x,
    cont1.y + yOff,
    cont2.x,
    cont2.y + yOff,
    end.x,
    end.y + yOff
  );
  endShape();
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
