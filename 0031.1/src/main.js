import * as THREE from "three";
import Stats from "three/addons/libs/stats.module.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { createNoise3D } from "simplex-noise";

// variables
let gridX = 30;
let gridY = 30;
let boxSize = 0.1;
let boxHeightMax = 14;
let noiseOff = 10;
let inc = 0.004;
let offset = 0;
let frameCount = 0;
const alpha = 255;

//not used in this sketch, but see the last function to see how it could be used
const colours = [
  [20, 100, 166, alpha],
  [56, 195, 255, alpha],
  [255, 235, 56],
  [195, 224, 27],
  [64, 179, 66],
  [200, 180, 180],
  [230, 230, 250],
];

const noise3D = createNoise3D();

const stats = new Stats();
document.body.appendChild(stats.dom);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);
const camera = new THREE.PerspectiveCamera(
  35,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.set(0, -4, 0);

// store the boxes
const boxes = [];

// make all the boxes
for (let y = 0; y < gridY; y++) {
  for (let x = 0; x < gridX; x++) {
    for (let z = 0; z < boxHeightMax; z++) {
      // let negX = ((gridX - 1) * boxSize) / 2 + (gridX - 1) / 2 - boxSize / 2;
      // let negY = ((gridY - 1) * boxSize) / 2 + gridY / 2;

      let negX = (boxSize * (gridX - 1)) / 2;
      let negY = (boxSize * (gridY - 1)) / 2;

      // console.log(negX, negY);

      let xPos = boxSize * x - negX;
      let yPos = boxSize * y - negY;
      let zPos = z * boxSize;

      // boxes.push({
      //   x: xPos,
      //   y: yPos,
      //   z: zPos,
      // });

      let hNoise = noise3D(
        offset,
        (xPos / 10) * noiseOff,
        (yPos / 10) * noiseOff
      );

      let zBoxes = Math.ceil(mapRange(hNoise, -1, 1, 0, 1) * boxHeightMax);
      const brite = mapRange(z, 0, boxHeightMax, 0, 1);
      // console.log(xPos, yPos, zPos);
      const geometry = new THREE.BoxGeometry(boxSize, boxSize, boxSize);
      const material = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setRGB(0.5, brite, brite),
      });

      const cube = new THREE.Mesh(geometry, material);
      cube.position.set(xPos, yPos, zPos);
      scene.add(cube);
      boxes.push(cube);
    }
  }
}

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// const geometry = new THREE.BoxGeometry(1, 1, 1);
// const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
// const cube = new THREE.Mesh(geometry, material);
// scene.add(cube);

camera.position.z = 5;

const controls = new OrbitControls(camera, renderer.domElement);

controls.target.set(0, 0, 0);
controls.update();
const clock = new THREE.Clock();

function animate() {
  // const ms = Math.floor(clock.getDelta() * 1000);
  let f = Math.floor(frameCount / 4);
  // animate
  let boxNum = 0;
  for (let y = f; y < gridY + f; y++) {
    for (let x = 0; x < gridX; x++) {
      for (let z = 0; z < boxHeightMax; z++) {
        let negX = (boxSize * (gridX - 1)) / 2;
        let negY = (boxSize * (gridY - 1)) / 2;
        let xPos = boxSize * x - negX;
        let yPos = boxSize * y - negY;
        let zPos = z * boxSize;
        let hNoise = noise3D(
          offset,
          (xPos / 10) * noiseOff,
          (yPos / 10) * noiseOff
        );
        let zBoxes = Math.ceil(mapRange(hNoise, -1, 1, 0, 1) * boxHeightMax);
        if (z > zBoxes) {
          boxes[boxNum].visible = false;
        } else {
          boxes[boxNum].visible = true;
        }
        boxNum += 1;
      }
    }
  }
  offset += inc;
  frameCount++;
  controls.update();
  renderer.render(scene, camera);
  stats.update();
}
renderer.setAnimationLoop(animate);

// map variable with range a to b, to another range c to d
function mapRange(value, a, b, c, d) {
  return ((value - a) / (b - a)) * (d - c) + c;
}
