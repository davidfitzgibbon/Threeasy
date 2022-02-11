import ThreeasyAnimator from "./components/animator";
import ThreeasyLoader from "./components/loader";
import ThreeasyPostLoader from "./components/postLoader";
import ThreeasyComponent from "./component";

// 16.6
export default class Threeasy {
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
