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
export default Renderer;
