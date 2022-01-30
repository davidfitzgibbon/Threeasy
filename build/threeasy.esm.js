class Scene {
  constructor(sketch, settings) {
    this.sketch = sketch;
    this.THREE = this.sketch.THREE;

    this.scene = new this.THREE.Scene();
    this.scene.background = new this.THREE.Color(0xffffff);

    return this.scene;
  }
}

class Renderer {
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

class Camera {
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

class Lights {
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

class Events {
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

class Animator {
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

class Loader {
  constructor(sketch, settings) {
    this.settings = {
      load: () => {
        console.log("loaded");
      },
      progress: (itemURL, itemsLoaded, itemsTotal) => {
        console.log("%loaded:", itemsLoaded / itemsTotal);
      },
      ...settings,
    };
    this.THREE = sketch.THREE;
    this.manager = new this.THREE.LoadingManager(
      () => this.settings.load(),
      (itemURL, itemsLoaded, itemsTotal) =>
        this.settings.progress(itemURL, itemsLoaded, itemsTotal)
    );
  }
}

class Threeasy {
  constructor(THREE) {
    this.THREE = THREE;
    this.animator = new Animator(this);
    this.sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
    this.scene = new Scene(this);
    this.renderer = new Renderer(this);
    this.camera = new Camera(this);
    this.lights = new Lights(this);
    this.events = new Events(this);
    this.loader = new Loader(this, {
      load: () => {
        this.addObjects();
      },
    });
    this.clock = new THREE.Clock();
    this.clock.start();

    this.init();
  }
  init() {
    //load texture
    // const textureLoader = new THREE.TextureLoader(this.loader.manager);
    // const texture = textureLoader.load('path/img.jpg');

    document.body.appendChild(this.renderer.domElement);
    this.animator.animate();
  }
}

export { Threeasy as default };
