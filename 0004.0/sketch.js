let capture;
let loadedCamera;
let confidence = 0.1;
let yOff = 0;
let p = person;
let defaultWeight = 270;
let l;
let lerpRate = 0.05;
let imageGraphics;

function setup() {
  createCanvas(windowWidth, windowHeight);
  captureWebcam();
  startPoseNet(capture);

  l = JSON.parse(JSON.stringify(person));
  
  imageGraphics = createGraphics(width, height)
}

function draw() {
  let p = person;
  noStroke();
  yOff = (height - capture.height) / 2;
  clear();
  background(255);
  // display video
  
  imageGraphics.image(capture, 0, yOff);
  // imageGraphics.filter(GRAY)
  image(imageGraphics, 0, 0)
  fill(0, 100);
  rect(0, 0, width, height);

  fill("red");
  noStroke();
  // keypoints.forEach((keypoint) => {
  //   circle(keypoint.position.x, keypoint.position.y + yOff, 10);
  // });

  makeBezierWithText({
    start: "rightWrist",
    cont1: "rightShoulder",
    cont2: "leftShoulder",
    end: "leftWrist",
    string: " why",
    strokeColour: color(255, 100),
  });
  
    makeBezierWithText({
    start: "rightWrist",
    cont1: "rightKnee",
    cont2: "leftKnee",
    end: "leftWrist",
    string: " not",
    strokeColour: color(255, 100),
  });
}

function makeBezierWithText({
  start,
  cont1,
  cont2,
  end,
  fillColour,
  string,
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

  bezier(
    l[start].x,
    l[start].y + yOff,
    l[cont1].x,
    l[cont1].y + yOff,
    l[cont2].x,
    l[cont2].y + yOff,
    l[end].x,
    l[end].y + yOff
  );

  for (let i in string) {
    fill(0);
    noStroke();
    let t = i / string.length;
    let t1 = i / string.length + 1;
    let t2 = i / string.length -1;
    let [x,y] = getBezierPoint(start, cont1, cont2, end, t)
    let [x1,y1] = getBezierPoint(start, cont1, cont2, end, t1)
    let [x2,y2] = getBezierPoint(start, cont1, cont2, end, t2)
    let angle = atan2(x2-x1, y2-y1)
    // circle(x, y, 5);
    push();
    translate(x, y)
    rotate(-angle-PI/2)
    let fontSize = width / 6.5
    textSize(fontSize);
    textFont("Source Code Pro")
    text(string[i], 0,fontSize*0.3);
    pop();
  }
}

function getBezierPoint(start, cont1, cont2, end, t) {
  let x = bezierPoint(l[start].x, l[cont1].x, l[cont2].x, l[end].x, t);
  let y = bezierPoint(
    l[start].y + yOff,
    l[cont1].y + yOff,
    l[cont2].y + yOff,
    l[end].y + yOff,
    t
  );
  return [x,y]
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
