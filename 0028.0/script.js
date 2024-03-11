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
let gridSize = 5;
let tileSize;
let scaler = 1.2;

const boxSize = 0.5;

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

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

camera.position.z = 5;
const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

for (let x = 0; x < gridSize; x++) {
  boxes[x] = [];
  for (let y = 0; y < gridSize; y++) {
    boxes[x][y] = [];
    for (let z = 0; z < gridSize; z++) {
      // boxes[x][y][z] = [x, y, z];
      // let col = Math.floor(
      //   noise(
      //     x / granularity + offset,
      //     y / granularity + offset,
      //     z / granularity + offset
      //   ) * 360
      // );
      // if (col < 40 || col > 150) {
      //   fill(col, 50, col, 0.6);
      //   stroke(200, 100, 40, 0.5);
      //   strokeWeight(1);
      //   push();
      //   let off = (tileSize * (gridSize - 1)) / 2;
      //   translate(x * tileSize - off, y * tileSize - off, z * tileSize - off);
      //   box(tileSize);
      //   pop();
      // }
      // create a cube setting the geometry and material
      let geometry = new THREE.BoxGeometry(boxSize, boxSize, boxSize);
      let material = new THREE.MeshBasicMaterial({
        color: Math.random() * 0xffffff,
      });
      let cube = new THREE.Mesh(geometry, material);

      let off = (boxSize * (gridSize - 1)) / 2;
      cube.position.set(
        x * boxSize - off,
        y * boxSize - off,
        z * boxSize - off
      );
      scene.add(cube);
      boxes[x][y][z] = cube;
    }
  }
}
console.log(boxes);

function animate() {
  requestAnimationFrame(animate);

  // animate the cube
  // cube.rotation.x += 0.01;
  // cube.rotation.y += 0.01;

  for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
      for (let z = 0; z < gridSize; z++) {
        boxes[x][y][z].rotation.x += 0.01;
        boxes[x][y][z].rotation.y += 0.01;
      }
    }
  }
  controls.update();

  // render it out 60 times a second
  renderer.render(scene, camera);
}
animate();
