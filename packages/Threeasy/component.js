/**
 * Threeasy Component class
 * @class ThreeasyComponent
 * @param animate {function} - A function that will be called on every animationFrame.
 */
export default class ThreeasyComponent {
	/**
	 *
	 * @param {Threeasy} app
	 */
	constructor(app) {
		this.app = app;
		this.app.animate(this.animate.bind(this));
	}
	animate() {
		return false;
	}
}
