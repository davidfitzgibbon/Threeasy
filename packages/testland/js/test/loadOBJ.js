import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import Threeasy from "threeasy";

/*
  Trophy by Casey Tumbers
  [CC-BY] (https://creativecommons.org/licenses/by/3.0/)
  via Poly Pizza (https://poly.pizza/m/6Xu7mttjodo)
*/
const app = new Threeasy(THREE, {
	preload: {
		trophy: "/models/trophy.obj",
	},
	OBJLoader,
});
app.scene.background = new THREE.Color("dodgerblue");

app.postload(() => {
	app.scene.add(app.trophy);
	app.animator.add(() => {
		app.trophy.rotation.y += 0.01;
	});
});
