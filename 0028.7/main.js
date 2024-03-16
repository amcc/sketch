import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { SVGRenderer } from "three/addons/renderers/SVGRenderer";

import { createNoise3D } from "simplex-noise";
import { keylistener } from "./components/keyboardInput";
import { lerp } from "./components/utils";

import Stats from "three/examples/jsm/libs/stats.module";

const showStats = false;

if (showStats) {
  var stats = new Stats();
  stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
  document.body.appendChild(stats.dom);
}

const noise3D = createNoise3D();

// wireframes from here:
// https://hofk.de/main/discourse.threejs/2020/EdgesGeometry-InstancedMesh/EdgesGeometry-InstancedMesh.html

// have a look at this:
// https://hofk.de/main/discourse.threejs/2020/FatLineEdges/FatLineEdges.html

// https://discourse.threejs.org/t/how-to-render-geometry-edges/5745/7
// https://jsfiddle.net/prisoner849/kmau6591/

// https://threejs.org/docs/index.html#manual/en/introduction/Creating-a-scene

const lerpAlpha = 0.02;

let camRotation = {
  x: THREE.MathUtils.degToRad(30),
  y: THREE.MathUtils.degToRad(30),
  z: 0,
};

const gridSize = 10;
let offset = 0;
const offsetInc = -0.001;
let tileSize;
const noiseDimension = 0.032;
const cutOffVal = 0.5;

const boxSize = 0.5;

const xMultiplier = 1;
const yMultiplier = 1;
const zMultiplier = 1;

const xGridSize = Math.floor(gridSize * xMultiplier);
const yGridSize = Math.floor(gridSize * yMultiplier);
const zGridSize = Math.floor(gridSize * zMultiplier);

let boxes = [];

var scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);

let width = window.innerWidth;
let height = window.innerHeight;

// PARENT
const parent = new THREE.Object3D();
parent.position.set(0, 0, 0);
scene.add(parent);
// CAMERA
// var camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
const camera = new THREE.OrthographicCamera(
  width / -2,
  width / 2,
  height / 2,
  height / -2,
  1,
  1000
);
camera.zoom = 100;

camera.lookAt(scene.position);

// add camera to keylistener
keylistener(parent, camRotation);
scene.add(camera);

// camera.rotateX = 2;
// camera.rotateY = camRotation.y;
// camera.rotateZ = camRotation.z;

// var renderer = new THREE.WebGLRenderer();
var renderer = new THREE.WebGLRenderer({
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
const app = document.getElementById("app");
app.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

camera.position.z = 10;
camera.updateProjectionMatrix();

// lights
const light = new THREE.AmbientLight(0xffffff); // soft white light
scene.add(light);

const pointLight1 = new THREE.PointLight(0xffff99, 1000, 10);
pointLight1.position.set(0, 3, 4);
scene.add(pointLight1);

// const pointLight2 = new THREE.PointLight(0x4444ff, 1000, 10);
// pointLight2.position.set(1, 4, 4);
// scene.add(pointLight2);

// const pointLight3 = new THREE.PointLight(0xffff00, 100, 10);
// pointLight3.position.set(0, 0, 0);
// scene.add(pointLight3);

// const pointLight4 = new THREE.PointLight(0xff0000, 10, 10);
// pointLight4.position.set(0.1, -0.3, 0);
// scene.add(pointLight4);

//materials
const basicMaterial = new THREE.MeshBasicMaterial({
  color: 0xffffff,
});

const lambertMaterial = new THREE.MeshPhongMaterial({
  color: "#ffffff",
  shininess: 100,
});

const glassMaterial = new THREE.MeshPhysicalMaterial({
  metalness: 0.4,
  roughness: 0.5,
  envMapIntensity: 0.1,
  clearcoat: 1,
  transparent: true,
  // transmission: .95,
  opacity: 0.1,
  reflectivity: 0.2,
  // refractionRatio: 0.985,
  ior: 0.9,
  side: THREE.BackSide,
});
// create a cube setting the geometry and material
let geometry = new THREE.BoxGeometry(boxSize, boxSize, boxSize);

// from here
// https://hofk.de/main/discourse.threejs/2020/EdgesGeometry-InstancedMesh/EdgesGeometry-InstancedMesh.html
var boxEdges = new THREE.EdgesGeometry(
  new THREE.BoxGeometry(boxSize, boxSize, boxSize)
);

var instMat = new THREE.LineBasicMaterial({
  color: 0x000000,
  onBeforeCompile: (shader) => {
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
  },
});

for (let x = 0; x < xGridSize; x++) {
  boxes[x] = [];
  for (let y = 0; y < yGridSize; y++) {
    boxes[x][y] = [];
    for (let z = 0; z < zGridSize; z++) {
      var instLines = new THREE.LineSegments(boxEdges, instMat);
      // let material = new THREE.MeshBasicMaterial({
      //   color: Math.random() * 0xffffff,
      // });
      // let cube = new THREE.Mesh(geometry, glassMaterial);
      // let cube = new THREE.Mesh(geometry, lambertMaterial);

      let off = (boxSize * (gridSize - 1)) / 2;
      instLines.position.set(
        x * boxSize - off * xMultiplier,
        y * boxSize - off * yMultiplier,
        z * boxSize - off * zMultiplier
      );
      parent.add(instLines);
      boxes[x][y][z] = instLines;

      // cube.position.set(
      //   x * boxSize - off * 3,
      //   y * boxSize - off,
      //   z * boxSize - off
      // );
      // scene.add(cube);
      // boxes[x][y][z] = cube;
    }
  }
}

function animate() {
  if (showStats) stats.begin();
  requestAnimationFrame(animate);

  //rotate parent
  parent.rotation.x = lerp(parent.rotation.x, camRotation.x, lerpAlpha);
  parent.rotation.y = lerp(parent.rotation.y, camRotation.y, lerpAlpha);
  parent.rotation.z = lerp(parent.rotation.z, camRotation.z, lerpAlpha);

  // animate the cube
  // cube.rotation.x += 0.01;
  // cube.rotation.y += 0.01;

  for (let x = 0; x < gridSize * xMultiplier; x++) {
    for (let y = 0; y < gridSize * yMultiplier; y++) {
      for (let z = 0; z < gridSize * zMultiplier; z++) {
        // rotate box
        // boxes[x][y][z].rotation.x = noiseValue(x, y, z) * angleScaler;
        // boxes[x][y][z].rotation.y = noiseValue(x, y, z) * angleScaler;

        // hide box if below cutOffVal
        if (
          noiseValue(x, y, z) < cutOffVal &&
          noiseValue(x, y, z) > -cutOffVal
        ) {
          boxes[x][y][z].visible = false;
        } else {
          boxes[x][y][z].visible = true;
        }
        // boxes[x][y][z].position.z += 0.01;
      }
    }
  }
  offset += offsetInc;
  controls.update();

  // render it out 60 times a second
  renderer.render(scene, camera);
  if (showStats) stats.end();
}
animate();

function noiseValue(x, y, z) {
  let xVal = (x + 1) * noiseDimension + offset;
  let yVal = (y + 1) * noiseDimension + offset;
  let zVal = (z + 1) * noiseDimension + offset;
  return noise3D(xVal, yVal, zVal);
}
