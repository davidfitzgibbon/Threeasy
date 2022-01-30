class ThreeasyLoader {
  constructor(sketch, settings) {
    this.sketch = sketch;
    this.THREE = sketch.THREE;

    this.settings = {
      load: () => {
        // console.log("loaded");
        this.sketch.init();
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

    if (this.sketch.settings.GLTFLoader) {
      this.GLTFLoader = new this.sketch.settings.GLTFLoader(this.manager);
    }
    if (this.sketch.settings.OBJLoader) {
      this.OBJLoader = new this.sketch.settings.OBJLoader(this.manager);
    }

    this.TextureLoader = new this.THREE.TextureLoader(this.manager);
  }
  load() {
    for (const variable in this.sketch.settings.preload) {
      let path = this.sketch.settings.preload[variable];
      const isGltf = this.settings.gltfExtensions.some((extension) => {
        return path.endsWith(extension);
      });
      if (isGltf) {
        // console.log("glff");
        this.GLTFLoader.load(path, (gltf) => {
          this.sketch[variable] = gltf.scene;
        });
      } else {
        const isObj = this.settings.objExtensions.some((extension) =>
          path.endsWith(extension)
        );
        if (isObj) {
          // console.log("obj");
          this.OBJLoader.load(path, (obj) => {
            console.log(obj);
            this.sketch[variable] = obj;
          });
        } else {
          const isTexture = this.settings.textureExtensions.some((extension) =>
            path.endsWith(extension)
          );
          if (isTexture) {
            // console.log("texture");
            this.TextureLoader.load(path, (texture) => {
              this.sketch[variable] = texture;
              this.setUpModel(this.sketch[variable]);
            });
          } else {
            // console.log(`unknown asset type: ${path}`);
          }
        }
      }
    }
  }
  setUpTexture(texture) {
    texture = THREE.sRGBEncoding;
    texture = THREE.RepeatWrapping;
    texture = THREE.RepeatWrapping;
  }
}
export default ThreeasyLoader;
