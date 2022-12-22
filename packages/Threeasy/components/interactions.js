import * as THREE from "three";

class ThreeasyInteractions {
	constructor(app) {
		this.app = app;
		this.clicks = [];
		this.hovers = [];

		if (this.app.settings.interactions) {
			this.raycaster = new THREE.Raycaster();
			this.pointer = new THREE.Vector2();
			this.app.mouse = this.pointer;
			this.interactions();
		}
	}
	noInteractions = () => {
		return this.clicks.length == 0 && this.hovers.length == 0;
	};
	interactions() {
		this.app.animator.add(() => {
			if (this.noInteractions()) return;
			this.raycaster.setFromCamera(this.pointer, this.app.camera);

			this.intersects = [];
			this.intersects = this.raycaster.intersectObjects(
				this.app.scene.children
			);
		});

		this.app.renderer.domElement.addEventListener("mousemove", (event) => {
			if (this.noInteractions()) return;
			this.calculatePosition(event);
			this.calculateIntersects("mouseMove", event);
		});
		this.app.renderer.domElement.addEventListener("click", (event) => {
			if (this.noInteractions()) return;
			this.calculatePosition(event);
			this.calculateIntersects("click", event);
		});
		this.app.renderer.domElement.addEventListener("mouseup", (event) => {
			if (this.noInteractions()) return;
			this.calculatePosition(event);
			this.calculateIntersects("mouseup", event);
		});
	}
	calculatePosition() {
		this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
		this.pointer.y = -((event.clientY / window.innerHeight) * 2 - 1);
	}
	calculateIntersects(interactionType, event) {
		let intersectUUIDs = [];
		for (let i = 0; i < this.intersects.length; i++) {
			const el = this.intersects[i];
			intersectUUIDs.push(el.object.uuid);

			// CLICK
			if (interactionType == "click") {
				const item = this.clicks.find((item) => el.object.uuid == item.el.uuid);
				if (item) {
					item.fn(event);
				}
			}
		}
		if (interactionType == "mouseMove") {
			// HOVERS
			this.hovers.forEach((hoverItem) => {
				const isCurrentlyHovered =
					intersectUUIDs.indexOf(hoverItem.el.uuid) > -1;

				const wasPreviouslyHovered = hoverItem.el.hovered;
				if (isCurrentlyHovered && !wasPreviouslyHovered) {
					hoverItem.el.hovered = true;
					if (hoverItem.fns.enter) {
						hoverItem.fns.enter(event);
					}
				}
				if (!isCurrentlyHovered && wasPreviouslyHovered) {
					hoverItem.el.hovered = false;
					if (hoverItem.fns.leave) {
						hoverItem.fns.leave(event);
					}
				}
			});
		}
	}
	onClick(el, fn) {
		this.clicks.push({ el, fn });
		console.log(this.clicks);
	}
	onHover(el, fns) {
		el.hovered = false;
		this.hovers.push({ el, fns });
	}
}
export default ThreeasyInteractions;
