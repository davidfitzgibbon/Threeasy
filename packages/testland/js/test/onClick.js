import * as THREE from "three";
import Threeasy from "threeasy";

window.app = new Threeasy(THREE, {
	interactions: true,
});

const box = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(box, material);

const colors = [0x00ff00, 0xff0000, 0x0000ff];

let cubePos = 0;
let color = 0;
app.animator.add(() => {
	cubePos += 0.01;
	cube.position.x = Math.sin(cubePos);
	cube.position.y = Math.cos(cubePos);
});
app.interactions.onClick(cube, (event, element) => {
	color = (color + 1) % colors.length;
	cube.material.color = new THREE.Color(colors[color]);
	console.log(event);
	console.log(element);
});
app.scene.add(cube);
