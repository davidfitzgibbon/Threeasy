import * as THREE from "three";

import Threeasy from "threeasy";

window.app = new Threeasy(THREE);

const box = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(box, material);

let cubePos = 0;
app.animator.add(() => {
	cubePos += 0.01;
	cube.position.x = Math.sin(cubePos);
	cube.position.y = Math.cos(cubePos);
	cube.position.z = -2;
});
app.scene.add(cube);

app.resize = () => {
	app.setSize();
	app.camera.aspect = app.sizes.w / app.sizes.h;
	app.camera.updateProjectionMatrix();
	app.renderer.setSize(app.sizes.w, app.sizes.h);
	app.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));

	console.log("overwritten");
};
