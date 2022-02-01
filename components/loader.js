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
      const isGltf = this.settings.gltfExtensions.some((extension) => {
        return path.endsWith(extension);
      });
      if (isGltf) {
        // console.log("glff");
        this.GLTFLoader.load(path, (gltf) => {
          this.app[variable] = gltf.scene;
        });
      } else {
        const isObj = this.settings.objExtensions.some((extension) =>
          path.endsWith(extension)
        );
        if (isObj) {
          // console.log("obj");
          this.OBJLoader.load(path, (obj) => {
            console.log(obj);
            this.app[variable] = obj;
          });
        } else {
          const isTexture = this.settings.textureExtensions.some((extension) =>
            path.endsWith(extension)
          );
          if (isTexture) {
            // console.log("texture");
            this.TextureLoader.load(path, (texture) => {
              this.app[variable] = texture;
              this.setUpTexture(this.app[variable]);
            });
          } else {
            // console.log(`unknown asset type: ${path}`);
          }
        }
      }
    }
  }
  setUpTexture(texture) {
    texture = this.THREE.sRGBEncoding;
    texture = this.THREE.RepeatWrapping;
    texture = this.THREE.RepeatWrapping;
  }
}
export default ThreeasyLoader;
