let points = [];
let numPoints = 200;
let sw = 2;
let alpha = 255;
let colour = [60, 60, 240];
// let colour = [240, 86, 59];
let grid = 100;
let length;
let lengthScale = 6;
let lerpRate = 0.1;
let lerpRateVariance = 0.3;
let cSize;

// noisy stuff
let offset = 0;
let people = [];
const travellerSpeed = 0.002;

// console.log(app);

function setup() {
  // colorMode(HSB);
  cSize = min(windowWidth, windowHeight);
  length = (cSize * lengthScale) / numPoints;
  createCanvas(windowWidth, windowHeight);

  // for (let i = 0; i < 600; i++) {
  //   addArrow(random(width), random(height));
  // }
  addArrow();

  // make people
  for (let i = 0; i < 10; i++) {
    people.push({
      x: random(width),
      y: random(height),
      offset: random(10000),
      colour: [random(360), 50, 100],
    });
  }
}

function draw() {
  // background(255, 0, 10);
  background(255);
  // translate(100,100)
  // triangle(length, -100, length+100, 0, length, -100)

  //   translate(width/2, height/2)

  for (let i = 0; i < points.length; i++) {
    const min = people.reduce(
      (accumulator, person, index, array) => {
        const distance = dist(person.x, person.y, points[i].x, points[i].y);
        // If the value of "accumulator" is less than "currentValue"
        // return the "accumulator", else return the "currentValue":
        // accumulator.distance = distance;
        // accumulator.index = index;
        if (index < array.length && distance < accumulator.distance) {
          accumulator.index = index;
          accumulator.distance = distance;
          return accumulator;
          // return accumulator.distance < distance ? accumulator.distance : distance;
        } else {
          return accumulator;
        }
      },
      {
        distance: 1000000000,
        object: null,
      }
    );

    lookAtMe(points[i], people[min.index], length);
  }

  //for (let y = 0; y < grid; y++) {
  // for (let x = 0; x < grid; x++) {
  //  let gridGap = width / grid;
  // let xPos = gridGap * x + gridGap / 2;
  // let yPos = gridGap * y + gridGap / 2;
  //   lookAtMe(xPos, yPos, length);
  //    }
  // }

  noFill();
  strokeWeight(sw * 3);
  stroke(colour);

  // perlin movement
  people.forEach((person) => {
    const travel = traveller(person.offset);
    person.x = travel.x;
    person.y = travel.y;
    person.offset = travel.off;
    // stroke(person.colour);
    stroke(colour);
    noFill();
    // fill(255, 0, 100);
    circle(person.x, person.y, width / 50);
    // fill(person.colour);
    circle(person.x, person.y, 2);
  });

  // let dPeople = retrieveValueFromFirebase("people");
  // console.log(dPeople);
}

function lookAtMe(point, person, length) {
  let x = point.x;
  let y = point.y;
  let r = point.r;
  push();

  stroke(colour);
  // stroke(person.colour);
  strokeWeight(sw);
  strokeCap(ROUND);
  translate(x, y);
  let angle = atan2(person.y - y, person.x - x);

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
  if (frameCount % 3 === 0) addArrow(mouseX, mouseY);
}
function mousePressed() {
  addArrow(mouseX, mouseY);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function addArrow(x = width / 2, y = height / 2) {
  points.push({
    x: x,
    y: y,
    r: random(TWO_PI),
    l: randomLerpRate(),
  });
}

function randomLerpRate() {
  return random(
    lerpRate * lerpRateVariance,
    lerpRate * ((1 - lerpRateVariance) * 2 + lerpRateVariance)
  );
}

function traveller(offset) {
  let x = noise(offset) * width * 2 - width / 2;
  let y = noise(offset + 100) * height * 2 - height / 2;
  let off = (offset += travellerSpeed);
  return { x, y, off };
}
