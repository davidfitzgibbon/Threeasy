class ThreeasyScene {
  constructor(sketch) {
    this.sketch = sketch;
    this.THREE = this.sketch.THREE;

    this.scene = new this.THREE.Scene();
    this.scene.background = new this.THREE.Color(0xffffff);

    return this.scene;
  }
}

class ThreeasyRenderer {
  constructor(sketch) {
    this.sketch = sketch;
    this.THREE = this.sketch.THREE;

    this.renderer = new this.THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(this.sketch.sizes.width, this.sketch.sizes.height);
    this.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = this.THREE.PCFSoftShadowMap;
    this.renderer.physicallyCorrectLights = true;
    this.renderer.outputEncoding = this.THREE.sRGBEncoding;
    this.renderer.toneMapping = this.THREE.ACESFilmicToneMapping;

    this.renderer.update = this.update.bind(this.sketch);

    return this.renderer;
  }
  update() {
    this.renderer.render(this.scene, this.camera);
  }
}

class ThreeasyCamera {
  constructor(sketch) {
    this.sketch = sketch;
    this.THREE = this.sketch.THREE;

    this.camera = new this.THREE.PerspectiveCamera(
      75,
      this.sketch.sizes.width / this.sketch.sizes.height,
      1,
      200
    );
    this.camera.position.x = 0;
    this.camera.position.y = 0;
    this.camera.position.z = 2;
    this.sketch.scene.add(this.camera);

    return this.camera;
  }
}

class ThreeasyLights {
  constructor(sketch, settings) {
    this.sketch = sketch;
    this.THREE = this.sketch.THREE;

    this.ambient();
  }
  ambient() {
    let ambLight = new this.THREE.AmbientLight(0xffffff, 0.7, 100);
    this.sketch.scene.add(ambLight);
  }
  directional() {
    let dirLight = new this.THREE.DirectionalLight(0xffffff, 1, 100);
    dirLight.position.set(-3, 5, -3);
    this.sketch.scene.add(dirLight);
  }
}

class ThreeasyEvents {
  constructor(sketch, settings) {
    this.sketch = sketch;
    this.THREE = this.sketch.THREE;
    this.settings = { ...settings };

    this.addEvents();
  }
  addEvents() {
    window.addEventListener("resize", this.onWindowResize.bind(this), false);
  }
  onWindowResize() {
    this.sketch.sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    this.sketch.camera.aspect =
      this.sketch.sizes.width / this.sketch.sizes.height;
    this.sketch.camera.updateProjectionMatrix();
    this.sketch.renderer.setSize(
      this.sketch.sizes.width,
      this.sketch.sizes.height
    );
    this.sketch.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
  }
}

class ThreeasyAnimator {
  constructor(sketch, settings) {
    this.sketch = sketch;
    this.THREE = this.sketch.THREE;
    this.settings = { ...settings };

    this.tasks = [];
  }
  add(fn) {
    this.tasks.push(fn);
  }
  animate() {
    requestAnimationFrame(this.animate.bind(this));

    this.tasks.forEach((task) => task());

    this.sketch.renderer.update();
  }
}

class ThreeasyLoader {
  constructor(sketch, settings) {
    this.sketch = sketch;
    this.THREE = sketch.THREE;

    this.settings = {
      load: () => {
        // console.log("loaded");
        this.sketch.init();
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

    if (this.sketch.settings.GLTFLoader) {
      this.GLTFLoader = new this.sketch.settings.GLTFLoader(this.manager);
    }
    if (this.sketch.settings.OBJLoader) {
      this.OBJLoader = new this.sketch.settings.OBJLoader(this.manager);
    }

    this.TextureLoader = new this.THREE.TextureLoader(this.manager);
  }
  load() {
    for (const variable in this.sketch.settings.preload) {
      let path = this.sketch.settings.preload[variable];
      const isGltf = this.settings.gltfExtensions.some((extension) => {
        return path.endsWith(extension);
      });
      if (isGltf) {
        // console.log("glff");
        this.GLTFLoader.load(path, (gltf) => {
          this.sketch[variable] = gltf.scene;
        });
      } else {
        const isObj = this.settings.objExtensions.some((extension) =>
          path.endsWith(extension)
        );
        if (isObj) {
          // console.log("obj");
          this.OBJLoader.load(path, (obj) => {
            console.log(obj);
            this.sketch[variable] = obj;
          });
        } else {
          const isTexture = this.settings.textureExtensions.some((extension) =>
            path.endsWith(extension)
          );
          if (isTexture) {
            // console.log("texture");
            this.TextureLoader.load(path, (texture) => {
              this.sketch[variable] = texture;
              this.setUpModel(this.sketch[variable]);
            });
          }
        }
      }
    }
  }
  setUpTexture(texture) {
    THREE.sRGBEncoding;
    THREE.RepeatWrapping;
    THREE.RepeatWrapping;
  }
}

class Threeasy {
  constructor(THREE, settings) {
    this.settings = {
      ...settings,
    };

    this.THREE = THREE;
    this.animator = new ThreeasyAnimator(this);
    this.sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
    this.scene = new ThreeasyScene(this);
    this.renderer = new ThreeasyRenderer(this);
    this.camera = new ThreeasyCamera(this);
    this.lights = new ThreeasyLights(this);
    this.events = new ThreeasyEvents(this);
    this.loader = new ThreeasyLoader(this);
    this.clock = new THREE.Clock();
    this.clock.start();
    this.postLoadFn = false;

    document.body.appendChild(this.renderer.domElement);

    this.preload();
  }
  preload() {
    // console.log("preload");
    if (this.settings.preload) {
      this.loader.load();
    } else {
      this.init();
    }
  }
  init() {
    if (this.settings.controls) ;
    if (this.postLoadFn) {
      this.postLoadFn();
    }
    this.animator.animate();
  }
  postLoad(fn) {
    this.postLoadFn = fn.bind(this);
  }
}

export { Threeasy as default };
