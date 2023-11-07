let capture;
let loadedCamera;
let confidence = 0.0;
let yOff = 0;
let p = person;
let defaultWeight = 270;
let l;
let lerpRate = 0.4;

function setup() {
  createCanvas(windowWidth, windowHeight);
  captureWebcam();
  startPoseNet(capture);

  l = JSON.parse(JSON.stringify(person));
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
    start: "rightEar",
    cont1: "rightEye",
    cont2: "leftEye",
    end: "leftEar",
  });
  makeBezier({
    start: "rightEar",
    cont1: "rightShoulder",
    cont2: "rightElbow",
    end: "rightWrist",
  });

  makeBezier({
    start: "leftEar",
    cont1: "leftShoulder",
    cont2: "leftElbow",
    end: "leftWrist",
  });

  makeBezier({
    start: "rightWrist",
    cont1: "rightHip",
    cont2: "rightKnee",
    end: "rightAnkle",
  });

  makeBezier({
    start: "leftWrist",
    cont1: "leftHip",
    cont2: "leftKnee",
    end: "leftAnkle",
  });

  makeBezier({
    start: "leftAnkle",
    cont1: "leftKnee",
    cont2: "rightKnee",
    end: "rightAnkle",
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
  if (!modelIsReady) return;

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

  if (p[start].confidence > confidence) {
    l[start].x = simpLerp(l[start].x, p[start].x, lerpRate);
    l[start].y = simpLerp(l[start].y, p[start].y, lerpRate);
  }
  if (p[cont1].confidence > confidence) {
    l[cont1].x = simpLerp(l[cont1].x, p[cont1].x, lerpRate);
    l[cont1].y = simpLerp(l[cont1].y, p[cont1].y, lerpRate);
  }
  if (p[cont2].confidence > confidence) {
    l[cont2].x = simpLerp(l[cont2].x, p[cont2].x, lerpRate);
    l[cont2].y = simpLerp(l[cont2].y, p[cont2].y, lerpRate);
  }
  if (p[end].confidence > confidence) {
    l[end].x = simpLerp(l[end].x, p[end].x, lerpRate);
    l[end].y = simpLerp(l[end].y, p[end].y, lerpRate);
  }

  beginShape();
  vertex(l[start].x, l[start].y + yOff);
  bezierVertex(
    l[cont1].x,
    l[cont1].y + yOff,
    l[cont2].x,
    l[cont2].y + yOff,
    l[end].x,
    l[end].y + yOff
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

function simpLerp(a, b, rate) {
  return a + rate * (b - a);
}
