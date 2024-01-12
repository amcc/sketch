// Example based on https://www.youtube.com/watch?v=urR596FsU68
// 5.17: Introduction to Matter.js - The Nature of Code
// by @shiffman

// module aliases

var Engine = Matter.Engine,
  //    Render = Matter.Render,
  World = Matter.World,
  MouseConstraint = Matter.MouseConstraint,
  Mouse = Matter.Mouse,
  Bodies = Matter.Bodies;

let engine;
let world;
let boxes = [];
let circles = [];
let grounds = [];
let mConstraint;

let canvas;
let sizes = [5, 10, 20, 30, 40];
let capture;

function setup() {
  // frameRate(20);
  canvas = createCanvas(540, 960);

  createCanvas(windowWidth, windowHeight);
  captureWebcam();

  engine = Engine.create();
  world = engine.world;
  //  Engine.run(engine);
  grounds.push(new Boundary(0, height / 2, 10, height));
  grounds.push(new Boundary(width, height / 2, 10, height));
  grounds.push(new Boundary(width / 2, 0, width, 10));
  grounds.push(new Boundary(width / 2, height, width, 10));
  World.add(world, grounds);

  let mouse = Mouse.create(canvas.elt);
  mouse.pixelRatio = pixelDensity(); // for retina displays etc
  let options = {
    mouse: mouse,
  };
  mConstraint = MouseConstraint.create(engine, options);
  World.add(world, mConstraint);

  for (let i = 0; i < 600; i++) {
    let c = floor(random(3));
    let colour;
    if (c === 0) {
      colour = "red";
    } else if (c === 1) {
      colour = "green";
    } else {
      colour = "blue";
    }
    // colour = [random(255), random(255), random(255)];
    let radius = random(15) + 3;
    circles.push(
      new Circle(
        random(width),
        random(height),
        radius,
        "black"
        // colour,
        // radius * 2
      )
    );
  }
  for (let i = 0; i < 6; i++) {
    circles.push(
      new Circle(random(width), random(height), random(120) + 30, [255, 0], 255)
    );
  }

  // blendMode(SCREEN);
}

let count = 0;

function draw() {
  clear();
  push();
  scale(-1, 1); // mirror webcam
  image(capture, -capture.width, 0); // draw webcam
  scale(-1, 1); // unset mirror
  pop();

  // background(255);
  // if (frameCount % 137 === 0) {
  //   let xG = random(2) - 1;
  //   world.gravity.x = xG;
  // }
  // if (frameCount % 100 === 0) {
  //   let yG = random(2) - 1;
  //   world.gravity.y = yG;
  // }
  Engine.update(engine);
  // for (let box of boxes) {
  //   box.show();
  // }
  for (let circle of circles) {
    circle.show();
  }
  for (let ground of grounds) {
    ground.show();
  }

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
        if (index === 8) {
          // console.log(part);

          let x = map(1 - part.x, 0, 1, -1, 1);
          let y = map(part.y, 0, 1, -1, 1);

          // console.log("part " + part.x, "x " + x);
          fill(0);
          circle(...getFlipPos(part), part.z * 500);

          world.gravity.x = x;
          world.gravity.y = y;
        }
        // each part is a knuckle or section of the hand
        // we have x, y and z positions so we could also do this in 3D (WEBGL)
        // if (index === 8) {
        //   textSize(30);
        //   text(handedness, ...getFlipPos(part, 20));
        //   text(thumbFingerState, ...getFlipPos(part, 100));
        // }
        // if (index === 8) {
        //   fill("cyan");
        //   bezierHandles[`${handedness}Index`] = {
        //     x: getFlipPos(part)[0],
        //     y: getFlipPos(part)[1],
        //   };
        // } else {
        //   thumbFingerState === "closed" ? fill("magenta") : fill("yellow");
        // }
        // circle(...getFlipPos(part), part.z * 500);
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
    // capture.size(width, (capture.height / capture.width) * width);
    capture.size((capture.width / capture.height) * height, height);
  } else {
    capture.size((capture.width / capture.height) * height, height);
  }
}
