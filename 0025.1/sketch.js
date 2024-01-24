const boxPos = 0;
const boxes = [];
const boxNum = 1000;
const front = 130;
const size = 6;
const speed = 0.5;
const back = -front;
const lowAlpha = 100;
const highAlpha = 255;
let alpha = lowAlpha;
let lightsOn = true;
const camRotation = {
  x: 30,
  y: 30,
  z: 0,
};
const camCurrent = {
  x: 30,
  y: 30,
  z: 0,
};
const lerpRate = 0.1;

const colours = [
  [255, 255, 0],
  [0, 255, 255],
  [255, 0, 255],
];
const bgCol = [220, 220, 200]
let strokeBox = false;

const fillColours = [colours, [bgCol]];
let currentFillIndex = 0;

function setup() {
  createCanvas(500, 500, WEBGL);
  ortho(-width / 2, width / 2, height / 2, -height / 2, -1000, 1000);
  angleMode(DEGREES);

  for (let i = 0; i < boxNum; i++) {
    boxes.push(randomBox());
  }
  
  blendMode(MULTIPLY)
}

function draw() {
  background(bgCol);
  // background(0);
  if (lightsOn) {
    directionalLight(255, 255, 255, 100, 100, 100);
    ambientLight(255);
  }
  orbitControl();
  updateCamPos();

  for (let i = 0; i < boxNum; i++) {
    let b = boxes[i];
    push();
    translate(b.x, b.y, b.z);
    
    fill(...b.c, b.a);
    if(strokeBox){
      stroke(0)
    } else {
      noStroke();
    }
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
    c: random(fillColours[currentFillIndex]),
    a: alpha,
  };
}

function keyPressed() {
  if (key === "ArrowUp") {
    camRotation.x += 30;
  }
  if (key === "ArrowDown") {
    camRotation.x -= 30;
  }
  if (key === "ArrowLeft") {
    camRotation.y += 30;
  }
  if (key === "ArrowRight") {
    camRotation.y -= 30;
  }
  if (key === "Enter") {
    camRotation.x = 30;
    camRotation.y = 30;
  }
  if (key === "l") {
    lightsOn = !lightsOn;
  }
  if (key === "a") {
    if (alpha === lowAlpha) {
      alpha = highAlpha;
    } else {
      alpha = lowAlpha;
    }
  }
  if (key === "c") {
    currentFillIndex = currentFillIndex < fillColours.length-1? 
      currentFillIndex + 1 : 0
    console.log(currentFillIndex)
  }
  if (key === "s") {
    strokeBox = !strokeBox;
  }
}

function updateCamPos() {
  translate(0, 0, 0);
  camCurrent.x = lerp(camCurrent.x, camRotation.x, lerpRate);
  camCurrent.y = lerp(camCurrent.y, camRotation.y, lerpRate);
  camCurrent.z = lerp(camCurrent.z, camRotation.z, lerpRate);

  rotateX(camCurrent.x);
  rotateY(camCurrent.y);
  rotateZ(camCurrent.z);
}
