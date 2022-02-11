class ThreeasyLoader {
  constructor(app, settings) {
    this.app = app;
    this.THREE = app.THREE;

    this.settings = {
      load: () => {
        // console.log("loaded");
        this.app.init();
      },
      progress: (itemURL, itemsLoaded, itemsTotal) => {
        // console.log("%loaded:", itemsLoaded / itemsTotal);
      },
      gltfExtensions: [".gltf", ".glb"],
      objExtensions: [".obj"],
      textureExtensions: [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".tga"],
      ...settings,
    };
    this.manager = new this.THREE.LoadingManager(
      () => this.settings.load(),
      (itemURL, itemsLoaded, itemsTotal) =>
        this.settings.progress(itemURL, itemsLoaded, itemsTotal)
    );
    this.setUpLoaders();
  }
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
    for (const variable in this.app.settings.preload) {
      let path = this.app.settings.preload[variable];

      // gltf
      if (this.endsWith(path, this.settings.gltfExtensions)) {
        this.GLTFLoader.load(path, (gltf) => {
          this.app[variable] = gltf.scene;
        });
      }

      // obj
      if (this.endsWith(path, this.settings.objExtensions)) {
        this.OBJLoader.load(path, (obj) => {
          this.app[variable] = obj;
        });
      }

      // texture
      if (this.endsWith(path, this.settings.textureExtensions)) {
        this.TextureLoader.load(path, (texture) => {
          this.app[variable] = texture;
          this.setUpTexture(this.app[variable]);
        });
      }
    }
  }
  endsWith(path, arr) {
    return arr.some((extension) => path.endsWith(extension));
  }
  setUpTexture(texture) {
    texture.encoding = this.THREE.sRGBEncoding;
    texture.wrapT = this.THREE.RepeatWrapping;
    texture.wrapS = this.THREE.RepeatWrapping;
  }
}
export default ThreeasyLoader;
