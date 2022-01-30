import ThreeasyScene from "./components/scene";
import ThreeasyRenderer from "./components/renderer";
import ThreeasyCamera from "./components/camera";
import ThreeasyLights from "./components/lights";
import ThreeasyEvents from "./components/events";
import ThreeasyAnimator from "./components/animator";
import ThreeasyLoader from "./components/loader";

export default class Threeasy {
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
    if (this.settings.controls) {
    }
    if (this.postLoadFn) {
      this.postLoadFn();
    }
    this.animator.animate();
  }
  postLoad(fn) {
    this.postLoadFn = fn.bind(this);
  }
}
