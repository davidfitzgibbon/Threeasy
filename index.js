import ThreeasyScene from "./components/scene";
import ThreeasyRenderer from "./components/renderer";
import ThreeasyCamera from "./components/camera";
import ThreeasyLights from "./components/light";
import ThreeasyEvents from "./components/events";
import ThreeasyAnimator from "./components/animator";
import ThreeasyLoader from "./components/loader";
import ThreeasyPostLoader from "./components/postLoader";

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
    this.light = new ThreeasyLights(this);
    this.events = new ThreeasyEvents(this);
    this.loader = new ThreeasyLoader(this);
    this.postLoader = new ThreeasyPostLoader(this);
    this.clock = new THREE.Clock();
    this.clock.start();

    document.body.appendChild(this.renderer.domElement);

    this.preload();
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
}
