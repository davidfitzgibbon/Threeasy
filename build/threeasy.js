class ThreeasyAnimator {
  constructor(sketch) {
    this.sketch = sketch;
    this.tasks = [];
  }
  add(fn) {
    this.tasks.push(fn);
  }
  animate() {
    requestAnimationFrame(this.animate.bind(this));
    this.tasks.forEach((task) => task());
    this.sketch.renderer.render(this.sketch.scene, this.sketch.camera);
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
              this.setUpTexture(this.sketch[variable]);
            });
          }
        }
      }
    }
  }
  setUpTexture(texture) {
    this.THREE.sRGBEncoding;
    this.THREE.RepeatWrapping;
    this.THREE.RepeatWrapping;
  }
}

class ThreeasyPostLoader {
  constructor(sketch) {
    this.sketch = sketch;
    this.tasks = [];
  }
  add(fn) {
    this.tasks.push(fn);
  }
  load() {
    this.tasks.forEach((task) => task());
  }
}

// 16.6
class Threeasy {
  constructor(THREE, settings) {
    this.settings = {
      light: true,
      ...settings,
    };

    this.THREE = THREE;
    this.setSize();
    // ANIMATOR
    this.animator = new ThreeasyAnimator(this);
    // SCENE
    this.scene = new THREE.Scene();
    // RENDERER
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(this.sizes.w, this.sizes.h);
    this.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.physicallyCorrectLights = true;
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
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
    // LOADER
    this.loader = new ThreeasyLoader(this);
    // POSTLOADER
    this.postLoader = new ThreeasyPostLoader(this);
    // LIGHT
    if (this.settings.light) {
      this.light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
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
  init() {
    this.postLoader.load();
    this.animator.animate();
  }
  onWindowResize() {
    this.setSize();

    this.camera.aspect = this.sizes.w / this.sizes.h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.sizes.w, this.sizes.h);
    this.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
  }
}

export { Threeasy as default };
