class ThreeasyPostLoader {
  constructor(sketch, settings) {
    this.sketch = sketch;
    this.THREE = this.sketch.THREE;

    this.tasks = [];
  }
  add(fn) {
    this.tasks.push(fn);
  }
  load() {
    this.tasks.forEach((task) => task());
  }
}
export default ThreeasyPostLoader;
