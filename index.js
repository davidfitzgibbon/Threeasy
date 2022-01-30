import * as THREE from "three";
import Scene from "./components/scene";
import Renderer from "./components/renderer";
import Camera from "./components/camera";
import Lights from "./components/lights";
import Events from "./components/events";
import Animator from "./components/animator";
import Loader from "./components/loader";

class Threeasy {
  constructor() {
    console.log(THREE);
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

export default Threeasy;
