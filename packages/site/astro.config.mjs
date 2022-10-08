import { defineConfig } from "astro/config";

import svelte from "@astrojs/svelte"; // @ts-check
import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig(
	/** @type {import('astro').AstroUserConfig} */
	{
		// Enable the Svelte renderer to support Svelte components.
		integrations: [svelte(), mdx()],
	}
);
