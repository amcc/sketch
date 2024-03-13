import * as THREE from "three";

export const keylistener = (object, camRotation) =>
  document.addEventListener(
    "keydown",
    (event) => onDocumentKeyDown(event, object, camRotation),
    false
  );

function onDocumentKeyDown(event, object, camRotation) {
  var keyCode = event.which;
  console.log("keydown");

  if (!object) return;
  if (keyCode == 38) {
    // up arrow
    console.log("up arrow");
    camRotation.x += THREE.MathUtils.degToRad(30);
  }
  if (keyCode == 40) {
    console.log("down arrow");
    // object.rotation.x -= THREE.MathUtils.degToRad(30);
    camRotation.x -= THREE.MathUtils.degToRad(30);
  }
  if (keyCode == 37) {
    console.log("left arrow");
    // object.rotation.y += THREE.MathUtils.degToRad(30);
    camRotation.y += THREE.MathUtils.degToRad(30);
  }
  if (keyCode == 39) {
    console.log("right arrow");
    // object.rotation.y -= THREE.MathUtils.degToRad(30);
    camRotation.y -= THREE.MathUtils.degToRad(30);
  }
}
