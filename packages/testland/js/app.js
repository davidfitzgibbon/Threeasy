import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { LuminosityShader } from "three/examples/jsm/shaders/LuminosityShader.js";
import { SobelOperatorShader } from "three/examples/jsm/shaders/SobelOperatorShader.js";

import Threeasy from "threeasy";

window.app = new Threeasy(THREE, { interactions: true });

const box = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(box, material);

let cubePos = 0;
app.animator.add(() => {
	// cube.rotation.y += 0.01;
	if (!cube.hovered) {
		cubePos += 0.01;
		cube.position.x = Math.sin(cubePos);
		cube.position.y = Math.cos(cubePos);
	}
});
app.interactions.onClick(cube, (event, element) => {
	cube.material.color = new THREE.Color(0x0000ff);
	console.log(event);
	console.log(element);
});
app.interactions.onHover(cube, {
	enter: (event, element) => {
		console.log("hovered cube");
		cube.material.color = new THREE.Color(0xff00ff);

		console.log(event);
		console.log(element);
	},
	leave: (event, element) => {
		console.log("UNhovered cube");
		cube.material.color = new THREE.Color(0xffff00);

		console.log(event);
		console.log(element);
	},
});
app.scene.add(cube);

// import fragment from "./fragment.js";
// import vertex from "./vertex.js";

// const racecarFile = "https://assets.codepen.io/5946/f1.glb";

// const app = new Threeasy(THREE, {
//   preload: {
//     car: racecarFile,
//     other: "./test.obj",
//   },
//   GLTFLoader,
// });

// let composer, effectSobel;

// function resetColors(obj) {
//   var greyMaterial = new THREE.MeshStandardMaterial();
//   if (obj.children.length) {
//     obj.children.map((child) => (child = resetColors(child)));
//   } else {
//     if (obj.type == "Mesh") {
//       obj.material = greyMaterial;
//     }
//   }
//   return obj;
// }

// app.camera.position.set(0, 0, 5);
// new OrbitControls(app.camera, app.renderer.domElement);

// const light1 = new THREE.AmbientLight(0xffffff, 0.7);
// app.scene.add(light1);

// const light = new THREE.DirectionalLight(0xffffff, 1);
// light.position.set(-3, 5, -3); //default; light shining from top
// app.scene.add(light);

// // RACECAR
// app.postload(() => {
//   var countX = 8,
//     countY = 4,
//     distX = 1.3,
//     distY = 1.5;

//   var model = resetColors(app.models.car);

//   for (let x = 0; x <= countX; x++) {
//     for (let y = 0; y <= countY; y++) {
//       let racecar = model.clone();
//       racecar.scale.set(0.005, 0.005, 0.005);
//       racecar.rotateY(Math.PI / 2);
//       racecar.position.x = -(countX * distX) / 2 + distX * x - 0.2;
//       racecar.position.y = -(countY * distY) / 2 + distY * y;
//       app.scene.add(racecar);
//     }
//   }

//   // postprocessing

//   composer = new EffectComposer(app.renderer);
//   var renderPass = new RenderPass(app.scene, app.camera);
//   composer.addPass(renderPass);

//   // color to grayscale conversion

//   var effectGrayScale = new ShaderPass(LuminosityShader);
//   composer.addPass(effectGrayScale);

//   // you might want to use a gaussian blur filter before
//   // the next pass to improve the result of the Sobel operator

//   // Sobel operator
//   effectSobel = new ShaderPass(SobelOperatorShader);
//   effectSobel.uniforms["resolution"].value.x =
//     window.innerWidth * window.devicePixelRatio;
//   effectSobel.uniforms["resolution"].value.y =
//     window.innerHeight * window.devicePixelRatio;
//   composer.addPass(effectSobel);

//   let colorFlipShader = {
//     uniforms: {
//       tDiffuse: { value: null },
//       amount: { value: 1.0 },
//     },
//     vertexShader: vertex,
//     fragmentShader: fragment,
//   };
//   let shader = new ShaderPass(colorFlipShader);
//   composer.addPass(shader);

//   app.render = () => composer.render();

//   app.resize = () => {
//     app.camera.aspect = window.innerWidth / window.innerHeight;
//     app.camera.updateProjectionMatrix();
//     app.renderer.setSize(window.innerWidth, window.innerHeight);
//     composer.setSize(window.innerWidth, window.innerHeight);
//     effectSobel.uniforms["resolution"].value.x =
//       window.innerWidth * window.devicePixelRatio;
//     effectSobel.uniforms["resolution"].value.y =
//       window.innerHeight * window.devicePixelRatio;
//   };
// });
