import { terser } from "rollup-plugin-terser";
import execute from "rollup-plugin-execute";

export default {
	input: "index.js",
	output: [
		{ file: "./build/threeasy.min.js", format: "esm", plugins: [terser()] },
		{
			file: "./build/threeasy.js",
			format: "esm",
		},
	],
};
