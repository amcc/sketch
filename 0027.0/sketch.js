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
const lerpRate = 0.02;

let offset = 0;
let gridSize = 12;
let tileSize;
let scaler = 1.2;

function setup() {
  createCanvas(500, 500, WEBGL);
  tileSize = width / gridSize;
  // colorMode(HSB, 360, 100, 100, 100);
  angleMode(DEGREES);
  // noStroke();
  ortho(
    -width * scaler,
    width * scaler,
    height * scaler,
    -height * scaler,
    -3000,
    3000
  );
}

function draw() {
  background(0);
  // orbitControl();
  let granularity = 20;
  // directionalLight(255, 255, 255, 100, 100, 100);

  // directionalLight(255, 255, 255, -300, 100, 100);
  // ambientLight(160);

  updateCamPos();

  for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
      for (let z = 0; z < gridSize; z++) {
        // fill(Math.floor(noise(x / granularity, y / granularity , z / granularity) * 255), 30);
        let col = Math.floor(
          noise(
            x / granularity + offset,
            y / granularity + offset,
            z / granularity + offset
          ) * 360
        );
        if (col < 40 || col > 150) {
          // fill(col, 50, col, 0.6);
          fill(0, 100, 100, 40);
          noFill();
          stroke(255, 100);
          strokeWeight(2);
          push();
          let off = (tileSize * (gridSize - 1)) / 2;
          translate(x * tileSize - off, y * tileSize - off, z * tileSize - off);
          box(tileSize);
          pop();
        }
      }
    }
  }
  offset += 0.004;
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

function keyPressed() {
  actionSelect(key);
}

function mouseReleased() {
  // saveSketch();
}

function actionSelect(key) {
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
  // if (key === "l") {
  //   lightsOn = !lightsOn;
  // }
  // if (key === "a") {
  //   if (alpha === lowAlpha) {
  //     alpha = highAlpha;
  //   } else {
  //     alpha = lowAlpha;
  //   }
  // }
  // if (key === "c") {
  //   currentFillIndex =
  //     currentFillIndex < fillColours.length - 1 ? currentFillIndex + 1 : 0;
  //   // console.log(currentFillIndex);
  // }
  // if (key === "o") {
  //   strokeBox = !strokeBox;
  // }
  // if (key === "s") {
  //   saveSketch(true);
  // }
}

function saveSketch(force = false) {
  if (
    (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) ||
    force
  ) {
    const time = new Date().getTime();
    saveCanvas("ortho amcc - " + time, "jpg");
  }
}
