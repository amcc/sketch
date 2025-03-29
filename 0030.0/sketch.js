let grid = 20;
let boxSize = 20;
let boxHeightMax = 300;
let noiseOff = 0.05
let inc = 0.004
let offset = 0;

// use simplex noise
const noise3D = createNoise3D();


function setup() {
  let minDim = min(windowWidth, windowHeight)
  createCanvas(minDim, minDim, WEBGL);

  angleMode(DEGREES);
}

function draw() {
  orbitControl();
  ambientLight(128, 128, 128);
  directionalLight(255,255,255, 0, 0, -100);
  
  background(255);

  rotateX(-50);
  rotateY(20+frameCount/10);

  noStroke();
  
  for (let y = 0; y < grid; y++) {
    for (let x = 0; x < grid; x++) {
      let gap = width/(grid*boxSize);
      let neg = ((grid-1) * boxSize) / 2 + grid/2
      let xPos = boxSize * x - neg+x;
      let yPos = boxSize * y - neg+y;
      
      let boxHeight = map(noise3D(offset, x * noiseOff, y * noiseOff), -1, 1, 0, 1) * boxHeightMax
      const bright = map(boxHeight, 0, boxHeightMax, 0, 255)
      fill(100, bright, 255, 100)
      push()
      translate(xPos, 0, yPos)
      box(boxSize, boxHeight, boxSize);
      pop()
      
      
    }
  }
  offset += inc
  // rotateY(frameCount)
  // noLoop()
}
