class ThreeasyAnimator {
  constructor(app) {
    this.app = app;
    this.tasks = [];
  }
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
        // console.log("loaded");
        this.app.init();
      },
      progress: (itemURL, itemsLoaded, itemsTotal) => {
        // console.log("%loaded:", itemsLoaded / itemsTotal);
      },
      gltfExtensions: [".gltf", ".glb"],
      objExtensions: [".obj"],
      textureExtensions: [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".tga"],
      ...settings,
    };
    this.manager = new this.THREE.LoadingManager(
      () => this.settings.load(),
      (itemURL, itemsLoaded, itemsTotal) =>
        this.settings.progress(itemURL, itemsLoaded, itemsTotal)
    );
    this.setUpLoaders();
  }
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
    for (const variable in this.app.settings.preload) {
      let path = this.app.settings.preload[variable];

      // gltf
      if (this.endsWith(path, this.settings.gltfExtensions)) {
        if (this.GLTFLoader) {
          this.GLTFLoader.load(path, (gltf) => {
            this.app[variable] = gltf.scene;
          });
        } else {
          console.warn(
            `ThreeasyLoader: GLTFLoader is not defined trying to load: ${path}`
          );
        }
      }

      // obj
      if (this.endsWith(path, this.settings.objExtensions)) {
        if (this.OBJLoader) {
          this.OBJLoader.load(path, (obj) => {
            this.app[variable] = obj;
          });
        } else {
          console.warn(
            `ThreeasyLoader: OBJLoader is not defined trying to load: ${path}`
          );
        }
      }

      // texture
      if (this.endsWith(path, this.settings.textureExtensions)) {
        this.TextureLoader.load(path, (texture) => {
          this.app[variable] = texture;
          this.setUpTexture(this.app[variable]);
        });
      }
    }
  }
  endsWith(path, arr) {
    return arr.some((extension) => path.endsWith(extension));
  }
  setUpTexture(texture) {
    texture.encoding = this.THREE.sRGBEncoding;
    texture.wrapT = this.THREE.RepeatWrapping;
    texture.wrapS = this.THREE.RepeatWrapping;
  }
}

class ThreeasyPostLoader {
  constructor(app) {
    this.app = app;
    this.tasks = [];
  }
  add(fn) {
    this.tasks.push(fn);
  }
  load() {
    this.tasks.forEach((task) => task());
  }
}

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
					item.fn(event);
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
						hoverItem.fns.enter(event);
					}
				}
				if (!isCurrentlyHovered && wasPreviouslyHovered) {
					hoverItem.el.hovered = false;
					if (hoverItem.fns.leave) {
						hoverItem.fns.leave(event);
					}
				}
			});
		}
	}
	onClick(el, fn) {
		this.clicks.push({ el, fn });
	}
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
			...settings,
		};

		console.log(this.settings);

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
		this.renderer.physicallyCorrectLights = true;
		this.renderer.outputEncoding = THREE.sRGBEncoding;
		this.renderer.toneMapping = THREE.ACESFilmicToneMapping;

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
		document.body.appendChild(this.renderer.domElement);
		window.addEventListener("resize", this.onWindowResize.bind(this), false);
		// PRELOAD
		this.preload();
	}
	setSize() {
		this.sizes = {
			w: window.innerWidth,
			h: window.innerHeight,
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
		this.setSize();

		this.camera.aspect = this.sizes.w / this.sizes.h;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(this.sizes.w, this.sizes.h);
		this.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
	}
	onWindowResize() {
		this.resize();
	}
}

export { Threeasy as default };
