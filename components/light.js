class ThreeasyLight {
  constructor(sketch) {
    this.sketch = sketch;
    this.THREE = this.sketch.THREE;

    this.add();
  }
  add() {
    this.light = new this.THREE.HemisphereLight(0xffffbb, 0x080820, 1);
    this.sketch.scene.add(this.light);
  }
  remove() {
    this.sketch.scene.remove(this.light);
  }
}
export default ThreeasyLight;
