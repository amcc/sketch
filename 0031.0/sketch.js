let gridX = 14;
let gridY = 14;
let boxSize = 20;
let boxHeightMax = 14;
let noiseOff = 0.03;
let inc = 0.004;
let offset = 0;
let alpha = 255;

//not used in this sketch, but see the last function to see how it could be used
let colours = [
  [20, 100, 166, alpha],
  [56, 195, 255, alpha],
  [255, 235, 56],
  [195, 224, 27],
  [64, 179, 66],
  [200, 180, 180],
  [230, 230, 250],
];

let boxTicker = 0;

let fps;

// use simplex noise
const noise3D = createNoise3D();

function setup() {
  let minDim = min(windowWidth, windowHeight);
  createCanvas(windowWidth, windowHeight, WEBGL);
  pixelDensity(1);
  angleMode(DEGREES);
  fps = document.getElementById("framerate");
}

function draw() {
  // fps.innerHTML = frameRate();

  orbitControl();
  ambientLight(128, 128, 128);
  directionalLight(255, 255, 255, -10, 100, -300);

  background(255);

  rotateX(-40);
  rotateY(-180);
  rotateY(20 + frameCount / 2);

  stroke(60);
  strokeWeight(0.4);
  noStroke();

  // foor this if you want it jerky
  let f = floor(frameCount / 4);

  for (let y = f; y < gridY + f; y++) {
    for (let x = 0; x < gridX; x++) {
      let gap = width / (gridX * boxSize);
      let negX = ((gridX - 1) * boxSize) / 2 + (gridX - 1) / 2 - boxSize / 2;
      let negY = ((gridY - 1) * boxSize) / 2 + gridY / 2;

      let xBlockGap = 0;
      let yBlockGap = 0;

      let xPos = boxSize * x - negX + xBlockGap;
      let yPos = boxSize * y - negY + yBlockGap;

      let hNoise = noise3D(
        offset,
        (xPos / 10) * noiseOff,
        (yPos / 10) * noiseOff
      );
      let zBoxes = ceil(map(hNoise, -1, 1, 0, 1) * boxHeightMax);

      for (let i = 0; i < zBoxes; i++) {
        let zBlockGap = 0;
        const bright = map(i, 0, zBoxes, 0, 255);
        const brite = map(i, 0, boxHeightMax, 0, 255);
        fill(findColour(i, boxHeightMax));
        push();
        fill(100, brite, brite);
        translate(xPos, -i * boxSize + zBlockGap, yPos - f * boxSize);
        box(boxSize, boxSize, boxSize);
        pop();
      }
    }
  }

  //offset += inc;
  // rotateY(frameCount)
  //noLoop();
}

function findColour(i, max) {
  let n = i / max;
  let c;
  c = colours[0];

  if (n > 0.1) c = colours[1];
  if (n > 0.3) c = colours[2];
  if (n > 0.5) c = colours[3];
  if (n > 0.65) c = colours[4];
  if (n > 0.75) c = colours[5];
  if (n > 0.85) c = colours[6];

  return c;
}

// function mouseClicked() {
//   saveCanvas("mine");
// }
