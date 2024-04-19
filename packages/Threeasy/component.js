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
		if (!app) throw Error("App not passed to Threeasy Component");
		if (!app.scene) throw Error("App is not Threeasy instance");
		this.app = app;
		this.app.animate(this.animate.bind(this));
	}
	animate() {
		return false;
	}
}
