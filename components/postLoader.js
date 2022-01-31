class ThreeasyPostLoader {
  constructor(sketch) {
    this.sketch = sketch;
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
