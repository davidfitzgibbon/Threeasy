import * as THREE from "three";
import Threeasy from "threeasy";

const app = new Threeasy(THREE, {
	preload: {
		crate: "/textures/crate.gif",
	},
});

app.scene.background = new THREE.Color("dodgerblue");
app.camera.position.set(0, 2, 2);
app.camera.lookAt(0, 0, 0);

app.postload(() => {
	const mat = new THREE.MeshStandardMaterial({ map: app.crate });
	const geo = new THREE.BoxGeometry();

	const mesh = new THREE.Mesh(geo, mat);
	app.animator.add(() => {
		mesh.rotation.y += 0.01;
	});

	app.scene.add(mesh);
});
