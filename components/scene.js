class ThreeasyScene {
  constructor(sketch) {
    this.sketch = sketch;
    this.THREE = this.sketch.THREE;

    this.scene = new this.THREE.Scene();
    this.scene.background = new this.THREE.Color(0xffffff);

    return this.scene;
  }
}
export default ThreeasyScene;
