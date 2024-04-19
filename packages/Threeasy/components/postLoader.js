class ThreeasyPostLoader {
	constructor(app) {
		this.app = app;
		this.tasks = [];
	}
	/**
	 * Saves an array of functions to run when all assets are loaded
	 * @example
	 * app.postLoader(()=>{
	 *  app.loadingAnimation.end();
	 * })
	 * @param {function} fn - a function to run after all assets have loaded
	 */
	add(fn) {
		this.tasks.push(fn);
	}
	load() {
		this.tasks.forEach((task) => task());
	}
}
export default ThreeasyPostLoader;
