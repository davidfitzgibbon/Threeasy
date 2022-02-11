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
    this.app.renderer.render(this.app.scene, this.app.camera);
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
        this.GLTFLoader.load(path, (gltf) => {
          this.app[variable] = gltf.scene;
        });
      }

      // obj
      if (this.endsWith(path, this.settings.objExtensions)) {
        this.OBJLoader.load(path, (obj) => {
          this.app[variable] = obj;
        });
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
    this.renderer.toneMapping = THREE.ReinhardToneMapping;
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
  postload(fn) {
    this.postLoader.add(fn);
  }
  animate(fn) {
    this.animator.add(fn);
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
