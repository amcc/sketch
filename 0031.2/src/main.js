import * as THREE from "three";

import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

import Stats from "three/addons/libs/stats.module.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { createNoise3D } from "simplex-noise";

// variables
let gridX = 40;
let gridY = 40;
let boxSize = 1;
let boxHeightMax = 26;
let noiseOff = boxSize * 0.4;
let travelSpeed = 0.3;
// let inc = 0.004;
let offset = 0;
let frameCount = 0;
const alpha = 255;
const camDist = 100;

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

camera.position.set(0, -14, 0);

// Add ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 10); // Color and intensity
// scene.add(ambientLight);

// Create a geometry and material for the box
const boxGeometry = new THREE.BoxGeometry(10, 10, 10);
const boxMaterial = new THREE.MeshStandardMaterial({ color: 0xffff00 });
const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
scene.add(boxMesh);

// Add directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 5); // Color and intensity
directionalLight.position.set(3, 30, 30); // Position the light
scene.add(directionalLight);

// Position the box at the position of the directional light
boxMesh.position.copy(directionalLight.position);

// store the boxes
const boxes = [];
const geometry = new THREE.BoxGeometry(boxSize, boxSize, boxSize);
const material = new THREE.MeshStandardMaterial({
  color: new THREE.Color().setRGB(0.5, 0.5, 0.5),
  emissive: 0x333300,
  metalness: 0.1, // Low metalness for a non-metallic look
  roughness: 0.4, // Medium roughness for a slightly shiny surface
});
const instancedMesh = new THREE.InstancedMesh(
  geometry,
  material,
  gridX * gridY * boxHeightMax
);

let i = 0;
// save the position of the boxes

const positions = [];

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

      // const cube = new THREE.Mesh(geometry, material);
      // cube.position.set(xPos, yPos, zPos);
      // scene.add(cube);
      // boxes.push(cube);

      const position = new THREE.Vector3(xPos, yPos, zPos);
      positions.push(position);

      const matrix = new THREE.Matrix4();
      matrix.setPosition(position);
      instancedMesh.setMatrixAt(i, matrix);
      instancedMesh.setColorAt(i, new THREE.Color().setRGB(0.4, brite, brite));

      i++;
    }
  }
}

scene.add(instancedMesh);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// const geometry = new THREE.BoxGeometry(1, 1, 1);
// const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
// const cube = new THREE.Mesh(geometry, material);
// scene.add(cube);

camera.position.z = camDist;
camera.position.y = -camDist;
scene.rotation.z = -Math.PI / 4;

const controls = new OrbitControls(camera, renderer.domElement);

controls.target.set(0, 0, 0);
controls.update();
const clock = new THREE.Clock();

// Set up post-processing
const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

const bloomPass = new UnrealBloomPass(new THREE.Vector2(1, 1), 1.5, 0.4, 0.85);
composer.addPass(bloomPass);

function animate() {
  scene.rotation.z += 0.001;
  const t = Math.floor(clock.getElapsedTime() * 100 * travelSpeed);
  let f = Math.floor(frameCount / 5);
  // console.log(f, ms);
  // animate
  let i = 0;
  for (let y = t; y < gridY + t; y++) {
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

        // console.log(i);
        const matrix = new THREE.Matrix4();
        matrix.setPosition(positions[i]);

        if (z > zBoxes) {
          // boxes[boxNum].visible = false;
          matrix.scale(new THREE.Vector3(0, 0, 0)); // Hide the instance
        } else {
          // boxes[boxNum].visible = true;
          matrix.scale(new THREE.Vector3(1, 1, 1)); // Show the instance
        }
        instancedMesh.setMatrixAt(i, matrix);
        i += 1;
      }
    }
  }
  // offset += inc;
  frameCount++;
  controls.update();
  instancedMesh.instanceMatrix.needsUpdate = true;
  // renderer.render(scene, camera);
  composer.render();
  stats.update();
}
renderer.setAnimationLoop(animate);

// map variable with range a to b, to another range c to d
function mapRange(value, a, b, c, d) {
  return ((value - a) / (b - a)) * (d - c) + c;
}
