// wireframes from here:
// https://hofk.de/main/discourse.threejs/2020/EdgesGeometry-InstancedMesh/EdgesGeometry-InstancedMesh.html

// have a look at this:
// https://hofk.de/main/discourse.threejs/2020/FatLineEdges/FatLineEdges.html

// https://discourse.threejs.org/t/how-to-render-geometry-edges/5745/7
// https://jsfiddle.net/prisoner849/kmau6591/

// const wireframe = new THREE.LineBasicMaterial({
//   color: 0xffffff,
//   linewidth: 1,
// });

// var material = new THREE.ShaderMaterial({
//   uniforms: {
//     thickness: {
//       value: 1.5,
//     },
//   },
//   vertexShader: vertexShader,
//   fragmentShader: fragmentShader,
// });

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

var instLines = new THREE.LineSegments(boxEdges, instMat);

// let cube = new THREE.LineSegments(geometry, wireframe);
