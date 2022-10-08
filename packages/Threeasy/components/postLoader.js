class ThreeasyPostLoader {
  constructor(app) {
    this.app = app;
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
