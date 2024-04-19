import * as THREE from "three";
import Threeasy from "threeasy";
import Comp from "threeasy/component";

const app = new Threeasy(THREE);

const notApp = "oh no!";

class Correct extends Comp {
	constructor(app) {
		super(app);
	}
}
const correct = new Correct(app);
const correctNotApp = new Correct(notApp);
const correctForGotApp = new Correct();

class DoesntPassToSuper extends Comp {
	constructor(app) {
		super();
	}
}
const doesntPassToSuper = new DoesntPassToSuper(app);

class DoesntSuper extends Comp {
	constructor(app) {}
}
const doesntSuper = new DoesntSuper(app);

class DoesntPassApp extends Comp {
	constructor(app) {}
}
const doesntPassApp = new DoesntPassApp(app);
