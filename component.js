export default class ThreeasyComponent {
  constructor(app) {
    this.app = app;
    this.app.animator.add(this.animation.bind(this));
  }
  animation() {
    return false;
  }
}
