class ThreeasyAnimator {
  constructor(app) {
    this.app = app;
    this.tasks = [];
  }
  add(fn) {
    this.tasks.push(fn);
  }
  animate() {
    requestAnimationFrame(this.animate.bind(this));
    this.tasks.forEach((task) => task());
    this.app.renderer.render(this.app.scene, this.app.camera);
  }
}
export default ThreeasyAnimator;
