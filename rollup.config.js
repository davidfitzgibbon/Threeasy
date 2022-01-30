import { terser } from "rollup-plugin-terser";
import execute from "rollup-plugin-execute";

export default {
  input: "index.js",
  output: [
    { file: "./build/threeasy.js", format: "cjs" },
    { file: "./build/threeasy.min.js", format: "esm", plugins: [terser()] },
    {
      file: "./build/threeasy.esm.js",
      format: "esm",
      plugins: [execute(["npm run push"])],
    },
  ],
};
