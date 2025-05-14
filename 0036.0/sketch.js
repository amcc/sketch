let points = [];
let numPoints = 200;
let sw = 2;
let alpha = 255;
let colour = [60, 60, 240];
let grid = 100;
let length;
let lengthScale = 6;
let lerpRate = 0.1;
let lerpRateVariance = 0.3;
let cSize;

function setup() {
  cSize = min(windowWidth, windowHeight);
  length = (cSize * lengthScale) / numPoints;
  createCanvas(windowWidth, windowHeight);

  addArrow();
}

function randomLerpRate() {
  return random(
    lerpRate * lerpRateVariance,
    lerpRate * ((1 - lerpRateVariance) * 2 + lerpRateVariance)
  );
}

function draw() {
  background(255);
  // translate(100,100)
  // triangle(length, -100, length+100, 0, length, -100)

  //   translate(width/2, height/2)

  for (let i = 0; i < points.length; i++) {
    lookAtMe(points[i], length);
  }

  //for (let y = 0; y < grid; y++) {
  // for (let x = 0; x < grid; x++) {
  //  let gridGap = width / grid;
  // let xPos = gridGap * x + gridGap / 2;
  // let yPos = gridGap * y + gridGap / 2;
  //   lookAtMe(xPos, yPos, length);
  //    }
  // }
}

function lookAtMe(point, length) {
  let x = point.x;
  let y = point.y;
  let r = point.r;
  push();

  stroke(colour);
  strokeWeight(sw);
  strokeCap(ROUND);
  translate(x, y);
  let angle = atan2(mouseY - y, mouseX - x);

  let deltaAngle = angle - r;

  // Ensure the shortest rotation direction
  if (deltaAngle > PI) {
    deltaAngle -= TWO_PI;
  } else if (deltaAngle < -PI) {
    deltaAngle += TWO_PI;
  }

  let lerpRotation = lerp(r, deltaAngle + r, point.l);

  // if lerpRotation goes over a full rotation then reset to zero
  if (lerpRotation > TWO_PI || lerpRotation < -TWO_PI) lerpRotation = 0;

  point.r = lerpRotation;
  rotate(lerpRotation);

  line(-length, 0, 0, 0);
  line(-length / 3, -length / 3, 0, 0);
  line(-length / 3, length / 3, 0, 0);
  // triangle(length, -10, length+10, 0, length, 10)

  pop();
  // text(lerpRotation.toFixed(2), x, y);
}

function mouseDragged() {
  if (frameCount % 3 === 0) addArrow();
}
function mousePressed() {
  addArrow();
}

function addArrow() {
  points.push({
    x: mouseX || width / 2,
    y: mouseY || height / 2,
    r: random(TWO_PI),
    l: randomLerpRate(),
  });
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
