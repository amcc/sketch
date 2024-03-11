import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { createNoise3D } from "simplex-noise";

import Stats from "three/examples/jsm/libs/stats.module";
var stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);

const noise3D = createNoise3D();

// wireframes from here:
// https://hofk.de/main/discourse.threejs/2020/EdgesGeometry-InstancedMesh/EdgesGeometry-InstancedMesh.html

// have a look at this:
// https://hofk.de/main/discourse.threejs/2020/FatLineEdges/FatLineEdges.html

// https://discourse.threejs.org/t/how-to-render-geometry-edges/5745/7
// https://jsfiddle.net/prisoner849/kmau6591/

// https://threejs.org/docs/index.html#manual/en/introduction/Creating-a-scene
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
let offsetInc = 0.002;
let gridSize = 10;
let tileSize;
let noiseDimension = 0.07;
let scaler = 0.2;
let angleScaler = 0.4;

const boxSize = 0.3;

let boxes = [];

var scene = new THREE.Scene();
// arguments are:
// field of view
// aspect ratio
// near, and far clipping planes
var camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// var renderer = new THREE.WebGLRenderer();
var renderer = new THREE.WebGLRenderer({
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
const app = document.getElementById("app");
app.appendChild(renderer.domElement);

camera.position.z = 5;
const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

let material = new THREE.MeshBasicMaterial({
  color: Math.random() * 0xffffff,
});
// create a cube setting the geometry and material
let geometry = new THREE.BoxGeometry(boxSize, boxSize, boxSize);

// from here
// https://hofk.de/main/discourse.threejs/2020/EdgesGeometry-InstancedMesh/EdgesGeometry-InstancedMesh.html
var boxEdges = new THREE.EdgesGeometry(
  new THREE.BoxGeometry(boxSize, boxSize, boxSize)
);

var instMat = new THREE.LineBasicMaterial({
  color: 0xffffff,
  onBeforeCompile: (shader) => {
    //console.log(shader.vertexShader);
    shader.vertexShader = `
      attribute vec3 offset;
      ${shader.vertexShader}
    `.replace(
      `#include <begin_vertex>`,
      `
      #include <begin_vertex>
      transformed += offset;
      `
    );
    //console.log(shader.vertexShader);
  },
});

for (let x = 0; x < gridSize; x++) {
  boxes[x] = [];
  for (let y = 0; y < gridSize; y++) {
    boxes[x][y] = [];
    for (let z = 0; z < gridSize; z++) {
      var instLines = new THREE.LineSegments(boxEdges, instMat);
      // let material = new THREE.MeshBasicMaterial({
      //   color: Math.random() * 0xffffff,
      // });
      // let cube = new THREE.Mesh(geometry, material);

      let off = (boxSize * (gridSize - 1)) / 2;
      instLines.position.set(
        x * boxSize - off,
        y * boxSize - off,
        z * boxSize - off
      );
      scene.add(instLines);
      boxes[x][y][z] = instLines;

      // cube.position.set(
      //   x * boxSize - off,
      //   y * boxSize - off,
      //   z * boxSize - off
      // );
      // scene.add(cube);
      // boxes[x][y][z] = cube;
    }
  }
}
console.log(boxes);

function animate() {
  stats.begin();
  requestAnimationFrame(animate);

  // animate the cube
  // cube.rotation.x += 0.01;
  // cube.rotation.y += 0.01;

  for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
      for (let z = 0; z < gridSize; z++) {
        boxes[x][y][z].rotation.x = noiseValue(x, y, z) * angleScaler;
        boxes[x][y][z].rotation.y = noiseValue(x, y, z) * angleScaler;
        // const noise3D = createNoise3D();
        // let noisy = noise3D(x, y, z);
        // console.log("noise", noisy);
        if (noiseValue(x, y, z) > 0) {
          boxes[x][y][z].visible = false;
        } else {
          boxes[x][y][z].visible = true;
        }

        // if (x === 0 && y === 0 && z === 0) console.log(noiseValue(x, y, z));
      }
    }
  }
  offset += offsetInc;
  controls.update();

  // render it out 60 times a second
  renderer.render(scene, camera);
  stats.end();
}
animate();

function noiseValue(x, y, z) {
  let xVal = (x + 1) * noiseDimension + offset;
  let yVal = (y + 1) * noiseDimension + offset;
  let zVal = (z + 1) * noiseDimension + offset;
  return noise3D(xVal, yVal, zVal);
}
