class ThreeasyAnimator {
  constructor(sketch) {
    this.sketch = sketch;
    this.tasks = [];
  }
  add(fn) {
    this.tasks.push(fn);
  }
  animate() {
    requestAnimationFrame(this.animate.bind(this));
    this.tasks.forEach((task) => task());
    this.sketch.renderer.render(this.sketch.scene, this.sketch.camera);
  }
}
export default ThreeasyAnimator;
