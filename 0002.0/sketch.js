let capture;
let loadedCamera;
let confidence = 0.65;
let yOff = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  captureWebcam();
  angleMode(DEGREES);
  startPoseNet(capture);

  rectMode(CENTER);
}

function draw() {
  blendMode(BLEND);
  yOff = (height - capture.height) / 2;
  clear();
  background(255);
  // display video
  image(capture, 0, yOff);
  fill(255, 255);
  rect(width / 2, height / 2, width, height);

  blendMode(MULTIPLY);
  noStroke();
  fill("red");
  // keypoints.forEach((keypoint) => {
  //   circle(keypoint.position.x, keypoint.position.y, 10);
  // });

  fill(255, 255, 0);
  let headAngle = getAngle(
    person.rightEye.x,
    person.rightEye.y,
    person.leftEye.x,
    person.leftEye.y
  );

  push();
  translate(person.nose.x, person.nose.y + yOff);
  rotate(headAngle);
  rect(
    0,
    0,
    dist(
      person.rightWrist.x,
      person.rightWrist.y,
      person.leftWrist.x,
      person.leftWrist.y
    )
  );
  pop();

  makeShape(
    person.rightShoulder,
    person.rightWrist,
    person.rightWrist,
    color(0, 255, 255)
  );

  makeShape(
    person.leftShoulder,
    person.leftWrist,
    person.leftWrist,
    color(255, 0, 255)
  );

  makeShape(
    person.rightShoulder,
    person.rightElbow,
    person.rightElbow,
    color(0, 255, 255),
    "circle"
  );

  makeShape(
    person.leftShoulder,
    person.leftElbow,
    person.leftElbow,
    color(255, 0, 255),
    "circle"
  );
  
  makeShape(
    person.rightKnee,
    person.rightHip,
    person.rightKnee,
    color(0, 255, 255),
    "rect"
  );

  makeShape(
    person.leftKnee,
    person.leftHip,
    person.leftKnee,
    color(255, 0, 255),
    "rect"
  );
  
  makeShape(
    person.rightAnkle,
    person.rightHip,
    person.rightAnkle,
    color(0, 255, 255),
    "circle"
  );

  makeShape(
    person.leftAnkle,
    person.leftHip,
    person.leftAnkle,
    color(255, 0, 255),
    "circle"
  );
}

function makeShape(anglePart1, anglePart2, anchor, colour, shape = "rect", conf = confidence) {
  rectMode(CENTER)
  // get the angle
  let angle = getAngle(anglePart1.x, anglePart1.y, anglePart2.x, anglePart2.y);

  let partSize = dist(anglePart1.x, anglePart1.y, anglePart2.x, anglePart2.y);

  if (
    anglePart1.confidence > conf &&
    anglePart2.confidence > conf &&
    anchor.confidence > conf
  ) {
    fill(colour);
    push();
    translate(anchor.x, anchor.y + yOff);
    rotate(angle);
    if(shape === "rect") {
      rect(0, 0, partSize);
    } else if (shape === "circle") {
      circle(0, 0, partSize);
    }
    
    pop();
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
      setCameraDimensions();
    }
  );
  capture.elt.setAttribute("playsinline", "");
  capture.hide();
}

function setCameraDimensions() {
  loadedCamera = captureEvent.getTracks()[0].getSettings();
  console.log("cameraDimensions", loadedCamera);
  if (capture.width > capture.height) {
    capture.size(width*0.7, (capture.height / capture.width) * width*0.7);
  } else {
    capture.size((capture.width / capture.height) * height, height);
  }
  console.log(capture);
}

function getAngle(v0x, v0y, v1x, v1y) {
  return atan2(v1y - v0y, v1x - v0x);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  setCameraDimensions();
}
