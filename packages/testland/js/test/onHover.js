import * as THREE from "three";
import Threeasy from "threeasy";

window.app = new Threeasy(THREE, {
	interactions: true,
});

const box = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(box, material);

let cubePos = 0;
app.animator.add(() => {
	if (!cube.hovered) {
		cubePos += 0.01;
		cube.position.x = Math.sin(cubePos);
		cube.position.y = Math.cos(cubePos);
	}
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
