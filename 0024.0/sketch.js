let boxPos = 0;

let boxes = [];
let boxNum = 1000;
let front = 200;
let size = 3;
let speed = 2.5;
let back = -front;
let colours = [
  "yellow",
  "cyan",
  "tomato",
  "hotpink",
  "magenta",
  "white",
  "black",
  "gray",
  "dodgerBlue",
  "greenyellow"
];

function setup() {
  createCanvas(540, 540, WEBGL);
  ortho(-width / 2, width / 2, height / 2, -height / 2, -1000, 1000);
  angleMode(DEGREES);

  for (let i = 0; i < boxNum; i++) {
    boxes.push(randomBox());
  }
}

function draw() {
  background(220, 220, 200);
  directionalLight(255,255,255, 100, 100, 100);
ambientLight(255);
  orbitControl();
  // normalMaterial();
  translate(0, 0, 500);
  rotateX(30);
  rotateY(30);
  for (let i = 0; i < boxNum; i++) {
    let b = boxes[i];
    push();
    translate(b.x, b.y, b.z);
    noStroke();
    fill(b.c);
    box(b.w, b.h, b.d);

    b.z -= speed;
    if (b.z < back) {
      // b.z= front
      boxes[i] = randomBox(front);
    }
    pop();
  }
}

function randomBox(z) {
  return {
    w: ceil(random(size)) * 10,
    h: ceil(random(size)) * 10,
    d: ceil(random(size)) * 10,
    x: random(-width / 2 + width / 4, width / 2 - width / 4),
    y: random(-width / 2 + width / 4, width / 2 - width / 4),
    z: z || random(-front, front),
    c: random(colours),
  };
}
