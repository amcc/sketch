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

function setup() {
  canvas = createCanvas(540, 960);
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

  for (let i = 0; i < 400; i++) {
    circles.push(
      new Circle(random(width), random(height), random(20) + 3, 0, 255)
    );
  }
  for (let i = 0; i < 3; i++) {
    circles.push(
      new Circle(random(width), random(height), random(160) + 30, 255, 255)
    );
  }
}

let count = 0;

function draw() {
  background(255);
  if (frameCount % 137 === 0) {
    let xG = random(2) - 1;
    world.gravity.x = xG;
  }
  if (frameCount % 100 === 0) {
    let yG = random(2) - 1;
    world.gravity.y = yG;
  }
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
}
