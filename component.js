export default class ThreeasyComponent {
  constructor(app) {
    this.app = app;
    this.app.animate(this.animate.bind(this));
  }
  animate() {
    return false;
  }
}
