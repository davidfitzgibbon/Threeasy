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
export default ThreeasyLights;
