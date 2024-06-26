/**
 * ThreeasyAnimator class
 * @class ThreeasyAnimator
 */
class ThreeasyAnimator {
	/**
	 *  Takes an instance of Threeasy
	 * @param {Threeasy} app
	 */
	constructor(app) {
		this.app = app;
		this.tasks = [];
	}
	/**
	 * Adds a function to the animation loop
	 * @example
	 * app.animator.add(()=>{
	 *  // do something
	 * })
	 * @param {function} fn
	 */
	add(fn) {
		this.tasks.push(fn);
	}
	animate() {
		requestAnimationFrame(this.animate.bind(this));
		this.tasks.forEach((task) => task());
		this.app.render();
	}
}

class ThreeasyLoader {
	constructor(app, settings) {
		this.app = app;
		this.THREE = app.THREE;

		this.settings = {
			load: () => {
				this.app.init();
			},
			gltfExtensions: [".gltf", ".glb"],
			objExtensions: [".obj"],
			textureExtensions: [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".tga"],
			...settings,
		};
		this.manager = new this.THREE.LoadingManager(
			() => this.settings.load(),
			(itemURL, itemsLoaded, itemsTotal) =>
				this.progress(itemURL, itemsLoaded, itemsTotal)
		);
		this.setUpLoaders();
	}
	/**
	 * Use to add progress to a loading indicator
	 * @param {string} itemURL - name of asset being loaded
	 * @param {number} itemsLoaded - amount of assets loaded
	 * @param {number} itemsTotal - total assets to load
	 * @example
	 * app.loader.progress = (itemURL, itemsLoaded, itemsTotal) =>{
	 * 	console.log(`${(itemsLoaded / itemsTotal)*100}%`);
	 * }
	 */
	progress(itemURL, itemsLoaded, itemsTotal) {}
	setUpLoaders() {
		this.TextureLoader = false;
		this.GLTFLoader = false;
		this.OBJLoader = false;

		if (this.app.settings.GLTFLoader) {
			this.GLTFLoader = new this.app.settings.GLTFLoader(this.manager);
		}
		if (this.app.settings.OBJLoader) {
			this.OBJLoader = new this.app.settings.OBJLoader(this.manager);
		}

		this.TextureLoader = new this.THREE.TextureLoader(this.manager);
	}
	load() {
		this.handleNesting(this.app.settings.preload);
	}
	handleNesting(assets, root = this.app) {
		for (let key in assets) {
			if (assets.hasOwnProperty(key)) {
				const asset = assets[key];
				if (typeof asset == "string") {
					this.handleAsset(root, key, asset);
				} else {
					this.handleNesting(asset, (root[key] = {}));
				}
			}
		}
	}
	handleAsset(root, variable, path) {
		// gltf
		if (this.endsWith(path, this.settings.gltfExtensions)) {
			this.handleGLTF(root, variable, path);
		}

		// obj
		if (this.endsWith(path, this.settings.objExtensions)) {
			this.handleOBJ(root, variable, path);
		}

		// texture
		if (this.endsWith(path, this.settings.textureExtensions)) {
			this.handleTexture(root, variable, path);
		}
	}
	handleGLTF(root, variable, path) {
		if (this.GLTFLoader) {
			this.GLTFLoader.load(path, (gltf) => {
				root[variable] = gltf.scene;
			});
		} else {
			console.warn(
				`ThreeasyLoader: GLTFLoader is not defined trying to load: ${path}`
			);
		}
	}
	handleOBJ(root, variable, path) {
		if (this.OBJLoader) {
			this.OBJLoader.load(path, (obj) => {
				root[variable] = obj;
			});
		} else {
			console.warn(
				`ThreeasyLoader: OBJLoader is not defined trying to load: ${path}`
			);
		}
	}
	handleTexture(root, variable, path) {
		this.TextureLoader.load(path, (texture) => {
			root[variable] = texture;
			this.setUpTexture(root[variable]);
		});
	}
	endsWith(path, arr) {
		return arr.some((extension) => path.endsWith(extension));
	}
	setUpTexture(texture) {
		texture.colorSpace = this.THREE.SRGBColorSpace;
		texture.wrapT = this.THREE.RepeatWrapping;
		texture.wrapS = this.THREE.RepeatWrapping;
	}
}

class ThreeasyPostLoader {
	constructor(app) {
		this.app = app;
		this.tasks = [];
	}
	/**
	 * Saves an array of functions to run when all assets are loaded
	 * @example
	 * app.postLoader(()=>{
	 *  app.loadingAnimation.end();
	 * })
	 * @param {function} fn - a function to run after all assets have loaded
	 */
	add(fn) {
		this.tasks.push(fn);
	}
	load() {
		this.tasks.forEach((task) => task());
	}
}

/**
 * ThreeasyInteractions class
 * @class ThreeasyInteractions
 */

class ThreeasyInteractions {
	constructor(app) {
		this.app = app;
		this.clicks = [];
		this.hovers = [];

		if (this.app.settings.interactions) {
			this.raycaster = new app.THREE.Raycaster();
			this.pointer = new app.THREE.Vector2();
			this.app.mouse = this.pointer;
			this.interactions();
		}
	}
	noInteractions = () => {
		return this.clicks.length == 0 && this.hovers.length == 0;
	};
	interactions() {
		this.app.animator.add(() => {
			if (this.noInteractions()) return;
			this.raycaster.setFromCamera(this.pointer, this.app.camera);

			this.intersects = [];
			this.intersects = this.raycaster.intersectObjects(
				this.app.scene.children
			);
		});

		this.app.renderer.domElement.addEventListener("mousemove", (event) => {
			if (this.noInteractions()) return;
			this.calculatePosition(event);
			this.calculateIntersects("mouseMove", event);
		});
		this.app.renderer.domElement.addEventListener("click", (event) => {
			if (this.noInteractions()) return;
			this.calculatePosition(event);
			this.calculateIntersects("click", event);
		});
		this.app.renderer.domElement.addEventListener("mouseup", (event) => {
			if (this.noInteractions()) return;
			this.calculatePosition(event);
			this.calculateIntersects("mouseup", event);
		});
	}
	calculatePosition() {
		this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
		this.pointer.y = -((event.clientY / window.innerHeight) * 2 - 1);
	}
	calculateIntersects(interactionType, event) {
		let intersectUUIDs = [];
		for (let i = 0; i < this.intersects.length; i++) {
			const el = this.intersects[i];
			intersectUUIDs.push(el.object.uuid);

			// CLICK
			if (interactionType == "click") {
				const item = this.clicks.find((item) => el.object.uuid == item.el.uuid);
				if (item) {
					item.fn(event, el);
				}
			}
		}
		if (interactionType == "mouseMove") {
			// HOVERS
			this.hovers.forEach((hoverItem) => {
				const isCurrentlyHovered =
					intersectUUIDs.indexOf(hoverItem.el.uuid) > -1;

				const wasPreviouslyHovered = hoverItem.el.hovered;
				if (isCurrentlyHovered && !wasPreviouslyHovered) {
					hoverItem.el.hovered = true;
					if (hoverItem.fns.enter) {
						hoverItem.fns.enter(event, hoverItem.el);
					}
				}
				if (!isCurrentlyHovered && wasPreviouslyHovered) {
					hoverItem.el.hovered = false;
					if (hoverItem.fns.leave) {
						hoverItem.fns.leave(event, hoverItem.el);
					}
				}
			});
		}
	}
	/**
	 * Pass an object and function to fire when it's clicked
	 * @example
	 * app.interactions.onClick(mesh,
	 * 	(event, element) => {
	 * 		// do something
	 * 	}
	 * );
	 * @param {Object3D} el
	 * @param {function} fn
	 */
	onClick(el, fn) {
		this.clicks.push({ el, fn });
	}

	/**
	 * Pass an object and function to fire when it's clicked
	 * @example
	 * app.interactions.onHover(mesh, {
	 * 	enter: (event, element) => {
	 * 		// do something
	 * 	},
	 * 	leave: (event, element) => {
	 * 		// do something
	 * 	},
	 * });
	 * @param {Object3D} el
	 * @param {object} fns - an object with an enter and leave function
	 */
	onHover(el, fns) {
		el.hovered = false;
		this.hovers.push({ el, fns });
	}
}

/**
 * Threeasy class
 * @class Threeasy
 */
class Threeasy {
	/**
	 *
	 * @param {THREE} THREE
	 * @param {object} settings - settings for your app
	 * @example
	 * {
	 * 	light: false,
	 * 	preload: {
	 * 		models: {
	 * 			car: 'path/to/car.glb'
	 * 		},
	 * 		textures: {
	 * 			crate: 'path/to/crate.jpg',
	 * 			barrel: 'path/to/barrel.jpg',
	 * 		}
	 * 	},
	 * 	GLTFLoader
	 * @param {boolean} settings.light - Whether to add a light to the scene.
	 * @param {object} settings.preload - An object defining texture, .glb or .GLTF files to preload. Can be any shape of object containing other objects
	 * @param {GLTFLoader} settings.GLTFLoader - A ThreeJS GLTFLoader, if loading .glb or .gltf.
	 * @param {OBJLoader} settings.OBJLoader - A ThreeJS OBJLoader, if loading .obj.
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
		this.renderer.domElement.style.maxWidth = "100%";
		window.addEventListener("resize", () => this.resize());
		this.resizeObserver = new ResizeObserver((entries) => this.resize());
		this.resizeObserver.observe(this.settings.domElement);

		// PRELOAD
		this.preload();
	}
	setSize() {
		if (this.settings.domElement === document.body) {
			this.sizes = {
				w: window.innerWidth,
				h: window.innerHeight,
			};
		} else {
			this.sizes = {
				w: this.settings.domElement.clientWidth,
				h: this.settings.domElement.clientHeight,
			};
		}
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
		this.setSize();

		this.camera.aspect = this.sizes.w / this.sizes.h;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(this.sizes.w, this.sizes.h);
		this.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
	}
}

export { Threeasy as default };
