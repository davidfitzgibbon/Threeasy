class ThreeasyLoader {
	constructor(app, settings) {
		this.app = app;
		this.THREE = app.THREE;

		this.settings = {
			load: () => {
				this.app.init();
			},
			gltfExtensions: [".gltf", ".glb"],
			objExtensions: [".obj"],
			textureExtensions: [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".tga"],
			...settings,
		};
		this.manager = new this.THREE.LoadingManager(
			() => this.settings.load(),
			(itemURL, itemsLoaded, itemsTotal) =>
				this.progress(itemURL, itemsLoaded, itemsTotal)
		);
		this.setUpLoaders();
	}
	/**
	 * Use to add progress to a loading indicator
	 * @param {string} itemURL - name of asset being loaded
	 * @param {number} itemsLoaded - amount of assets loaded
	 * @param {number} itemsTotal - total assets to load
	 * @example
	 * app.loader.progress = (itemURL, itemsLoaded, itemsTotal) =>{
	 * 	console.log(`${(itemsLoaded / itemsTotal)*100}%`);
	 * }
	 */
	progress(itemURL, itemsLoaded, itemsTotal) {}
	setUpLoaders() {
		this.TextureLoader = false;
		this.GLTFLoader = false;
		this.OBJLoader = false;

		if (this.app.settings.GLTFLoader) {
			this.GLTFLoader = new this.app.settings.GLTFLoader(this.manager);
		}
		if (this.app.settings.OBJLoader) {
			this.OBJLoader = new this.app.settings.OBJLoader(this.manager);
		}

		this.TextureLoader = new this.THREE.TextureLoader(this.manager);
	}
	load() {
		this.handleNesting(this.app.settings.preload);
	}
	handleNesting(assets, root = this.app) {
		for (let key in assets) {
			if (assets.hasOwnProperty(key)) {
				const asset = assets[key];
				if (typeof asset == "string") {
					this.handleAsset(root, key, asset);
				} else {
					this.handleNesting(asset, (root[key] = {}));
				}
			}
		}
	}
	handleAsset(root, variable, path) {
		// gltf
		if (this.endsWith(path, this.settings.gltfExtensions)) {
			this.handleGLTF(root, variable, path);
		}

		// obj
		if (this.endsWith(path, this.settings.objExtensions)) {
			this.handleOBJ(root, variable, path);
		}

		// texture
		if (this.endsWith(path, this.settings.textureExtensions)) {
			this.handleTexture(root, variable, path);
		}
	}
	handleGLTF(root, variable, path) {
		if (this.GLTFLoader) {
			this.GLTFLoader.load(path, (gltf) => {
				root[variable] = gltf.scene;
			});
		} else {
			console.warn(
				`ThreeasyLoader: GLTFLoader is not defined trying to load: ${path}`
			);
		}
	}
	handleOBJ(root, variable, path) {
		if (this.OBJLoader) {
			this.OBJLoader.load(path, (obj) => {
				root[variable] = obj;
			});
		} else {
			console.warn(
				`ThreeasyLoader: OBJLoader is not defined trying to load: ${path}`
			);
		}
	}
	handleTexture(root, variable, path) {
		this.TextureLoader.load(path, (texture) => {
			root[variable] = texture;
			this.setUpTexture(root[variable]);
		});
	}
	endsWith(path, arr) {
		return arr.some((extension) => path.endsWith(extension));
	}
	setUpTexture(texture) {
		texture.colorSpace = this.THREE.SRGBColorSpace;
		texture.wrapT = this.THREE.RepeatWrapping;
		texture.wrapS = this.THREE.RepeatWrapping;
	}
}
export default ThreeasyLoader;
