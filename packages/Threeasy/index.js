import ThreeasyAnimator from "./components/animator";
import ThreeasyLoader from "./components/loader";
import ThreeasyPostLoader from "./components/postLoader";
import ThreeasyInteractions from "./components/interactions";
import ThreeasyComponent from "./component";

/**
 * Threeasy class
 * @class Threeasy
 */
export default class Threeasy {
	/**
	 *
	 * @param {THREE} THREE
	 * @param {boolean} settings.light - Whether to add a light to the scene.
	 * @param {any} settings.preload - An object defining texture, .glb or .GLTF files to preload.
	 * @param {GLTFLoader} settings.GLTFLoader - A ThreeJS GLTFLoader, if loading .glb or .gltf.
	 * @param {any} models - An object containing models that have loaded.
	 * @param {object} textures - An object containing textures that have loaded.
	 */
	constructor(THREE, settings) {
		this.settings = {
			light: true,
			alpha: false,
			interactions: false,
			domElement: document.body,
			...settings,
		};

		if (!this.settings.domElement) {
			throw new Error("Threeasy: settings.domElement not found.");
		}

		this.THREE = THREE;
		this.setSize();
		// ANIMATOR
		this.animator = new ThreeasyAnimator(this);
		// SCENE
		this.scene = new THREE.Scene();

		// CAMERA
		this.camera = new THREE.PerspectiveCamera(
			75,
			this.sizes.w / this.sizes.h,
			1,
			200
		);
		this.camera.position.x = 0;
		this.camera.position.y = 0;
		this.camera.position.z = 2;
		this.scene.add(this.camera);

		// RENDERER
		this.renderer = new THREE.WebGLRenderer({
			antialias: true,
			alpha: this.settings.alpha,
		});
		this.renderer.setSize(this.sizes.w, this.sizes.h);
		this.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
		this.renderer.shadowMap.enabled = true;
		this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

		// INTERACTIONS
		this.mouse = {
			x: null,
			y: null,
		};
		this.interactions = new ThreeasyInteractions(this);

		// LOADER
		this.models = {};
		this.textures = {};
		this.loader = new ThreeasyLoader(this);
		// POSTLOADER
		this.postLoader = new ThreeasyPostLoader(this);
		// LIGHT
		if (this.settings.light) {
			this.light = new THREE.AmbientLight(0xffffff, 1);
			this.scene.add(this.light);
		}
		// CLOCK
		this.clock = new THREE.Clock();
		this.clock.start();
		// RESIZE
		this.settings.domElement.appendChild(this.renderer.domElement);
		window.addEventListener("resize", () => this.resize());
		this.resizeObserver = new ResizeObserver((entries) => this.resize());
		this.resizeObserver.observe(this.settings.domElement);

		// PRELOAD
		this.preload();
	}
	setSize() {
		let dims = this.settings.domElement.getBoundingClientRect();
		if (this.settings.domElement === document.body) {
			dims = {
				width: window.innerWidth,
				height: window.innerHeight,
			};
		}
		this.sizes = {
			w: dims.width,
			h: dims.height,
		};
	}
	preload() {
		if (this.settings.preload) {
			this.loader.load();
		} else {
			this.init();
		}
	}
	/**
	 *
	 * @param {function} fn
	 * @returns {void}
	 */
	postload(fn) {
		this.postLoader.add(fn);
	}

	/**
	 * @type {function} - A function to replace the default ThreeJS render function. EG for post processing
	 * @returns {void}
	 */
	render() {
		this.renderer.render(this.scene, this.camera);
	}

	/**
	 *
	 * @param {function} fn
	 * @returns {void}
	 */
	animate(fn) {
		this.animator.add(fn);
	}
	init() {
		this.postLoader.load();
		this.animator.animate();
	}

	/**
	 * @type {function} resize - A function to replace the default Threeasy resize function.
	 * @returns {void}
	 */
	resize() {
		console.log("resizing");
		this.setSize();

		this.camera.aspect = this.sizes.w / this.sizes.h;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(this.sizes.w, this.sizes.h);
		this.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
	}
	onWindowResize() {
		console.log("onWindowResize");
		this.resize();
	}
}
