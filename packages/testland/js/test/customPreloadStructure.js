console.clear();

import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import Threeasy from "threeasy";

/*
  Trophy by Casey Tumbers
  [CC-BY] (https://creativecommons.org/licenses/by/3.0/)
  via Poly Pizza (https://poly.pizza/m/6Xu7mttjodo)
*/
const app = new Threeasy(THREE, {
	preload: {
		trophy: "/models/trophy.glb",
		models: {
			trophyGLTF: "/models/trophy.glb",
			trophyOBJ: "/models/trophy.obj",
		},
		things: {
			mischief: {
				crate: "/textures/crate.gif",
			},
		},
	},
	GLTFLoader,
	OBJLoader,
});
app.scene.background = new THREE.Color("dodgerblue");

app.loader.progress = (itemURL, itemsLoaded, itemsTotal) => {
	console.log(`Loading: ${(itemsLoaded / itemsTotal) * 100}%`);
};

app.postload(() => {
	console.log("Loading: complete");
	if (app.trophy) {
		app.scene.add(app.trophy);
		app.trophy.position.y = 0.5;
		app.animator.add(() => {
			app.trophy.rotation.y += 0.01;
		});
	}

	if (app.models) {
		app.scene.add(app.models.trophyGLTF);
		app.models.trophyGLTF.position.x = 0.5;
		app.animator.add(() => {
			app.models.trophyGLTF.rotation.y += 0.01;
		});
		app.scene.add(app.models.trophyOBJ);
		app.models.trophyOBJ.position.x = -0.5;
		app.animator.add(() => {
			app.models.trophyOBJ.rotation.y -= 0.01;
		});
	}

	if (app?.things?.mischief?.crate) {
		const mat = new THREE.MeshStandardMaterial({
			map: app.things.mischief.crate,
		});
		const geo = new THREE.BoxGeometry(0.5, 0.5, 0.5);
		const mesh = new THREE.Mesh(geo, mat);

		mesh.position.y = -0.5;
		app.animator.add(() => {
			mesh.rotation.y += 0.01;
		});

		app.scene.add(mesh);
	}
});
