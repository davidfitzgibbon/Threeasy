console.clear();

import * as THREE from "three";

import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";

import { SobelOperatorShader } from "three/addons/shaders/SobelOperatorShader.js";

import Threeasy from "threeasy";

const racecarURL = "https://assets.codepen.io/5946/f1.glb";

function resetColors(obj) {
	const greyMaterial = new THREE.MeshStandardMaterial({ color: 0x999999 });
	obj.traverse((obj) => {
		if (obj.type == "Mesh") obj.material = greyMaterial;
	});
	return obj;
}

function sobelDimensions() {
	const dpr = window.devicePixelRatio;
	return [window.innerWidth * dpr, window.innerHeight * dpr];
}

const app = new Threeasy(THREE, {
	light: false,
	preload: {
		racecar: racecarURL,
	},
	GLTFLoader,
});
app.camera.position.z = 5;
new OrbitControls(app.camera, app.renderer.domElement);

var ambientLight = new THREE.AmbientLight(0xffffff, 0.7, 100);
app.scene.add(ambientLight);

var directionalLight = new THREE.DirectionalLight(0xffffff, 1, 100);
directionalLight.position.set(-3, 5, -3); //default; directionalLight shining from top
app.scene.add(directionalLight);

app.postload(() => {
	var countX = 8,
		countY = 4,
		distX = 1.3,
		distY = 1.5;

	var model = resetColors(app.racecar);
	model.scale.set(0.005, 0.005, 0.005);
	model.rotateY(Math.PI / 2);

	for (let x = 0; x <= countX; x++) {
		for (let y = 0; y <= countY; y++) {
			let racecar = model.clone();
			racecar.position.x = -(countX * distX) / 2 + distX * x - 0.1675;
			racecar.position.y = -(countY * distY) / 2 + distY * y;
			app.scene.add(racecar);
		}
	}

	let process = false;
	process = true;

	// postprocessing
	if (process) {
		app.composer = new EffectComposer(app.renderer);
		var renderPass = new RenderPass(app.scene, app.camera);
		app.composer.addPass(renderPass);

		// Sobel operator
		app.effectSobel = new ShaderPass(SobelOperatorShader);
		app.effectSobel.uniforms.resolution.value.set(...sobelDimensions());
		app.composer.addPass(app.effectSobel);

		let colorFlipShader = {
			uniforms: { tDiffuse: { value: null } },
			vertexShader: `
				varying vec2 vUv;

				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}
			`,
			fragmentShader: `
				uniform sampler2D tDiffuse;
				varying vec2 vUv;

				void main() {
					vec4 color = texture2D( tDiffuse, vUv );
					gl_FragColor = vec4( 1.0 - color.rgb, 1.0);
				}
			`,
		};
		let shader = new ShaderPass(colorFlipShader);
		app.composer.addPass(shader);

		window.addEventListener("resize", resizeComposer, false);

		app.render = () => app.composer.render();
	}
});

function resizeComposer() {
	app.composer.setSize(window.innerWidth, window.innerHeight);
	app.effectSobel.uniforms.resolution.value.set(...sobelDimensions());
}
