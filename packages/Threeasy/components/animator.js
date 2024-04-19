/**
 * ThreeasyAnimator class
 * @class ThreeasyAnimator
 */
class ThreeasyAnimator {
	/**
	 *  Takes an instance of Threeasy
	 * @param {Threeasy} app
	 */
	constructor(app) {
		this.app = app;
		this.tasks = [];
	}
	/**
	 * Adds a function to the animation loop
	 * @example
	 * app.animator.add(()=>{
	 *  // do something
	 * })
	 * @param {function} fn
	 */
	add(fn) {
		this.tasks.push(fn);
	}
	animate() {
		requestAnimationFrame(this.animate.bind(this));
		this.tasks.forEach((task) => task());
		this.app.render();
	}
}
export default ThreeasyAnimator;
