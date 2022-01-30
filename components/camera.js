class Camera {
  constructor(sketch) {
    this.sketch = sketch;
    this.THREE = this.sketch.THREE;

    this.camera = new this.THREE.PerspectiveCamera(
      75,
      this.sketch.sizes.width / this.sketch.sizes.height,
      1,
      200
    );
    this.camera.position.x = 0;
    this.camera.position.y = 0;
    this.camera.position.z = 2;
    this.sketch.scene.add(this.camera);

    return this.camera;
  }
}
export default Camera;
