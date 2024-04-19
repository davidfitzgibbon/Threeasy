import * as THREE from "three";
import ThreeasyComponent from "threeasyComponent";

export default class Box extends ThreeasyComponent {
	constructor(app) {
		super(app);
		this.mat = new THREE.MeshNormalMaterial();
		this.geo = new THREE.BoxGeometry();
		this.mesh = new THREE.Mesh(this.geo, this.mat);
		this.mesh.position.set(
			this.getRandomVal(),
			this.getRandomVal(),
			this.getRandomVal()
		);
		this.dir = {
			x: this.getRandomVal() / 500,
			y: this.getRandomVal() / 500,
		};
		this.app.scene.add(this.mesh);
	}
	getRandomVal() {
		return Math.random() * 20 - 10;
	}
	animate() {
		this.mesh.rotation.x += this.dir.x;
		this.mesh.rotation.y += this.dir.y;
	}
}
