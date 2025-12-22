import { resolve } from "node:path";
import { defineConfig } from "vite";

// Build settings for Chrome Extension MV3
// - background.ts -> background.js (ESM output, matching manifest type)
// - options.ts -> options.js
// - optionsPage.html is copied as is (explicitly specified since it's not index)

export default defineConfig({
	build: {
		outDir: "dist",
		emptyOutDir: true,
		rollupOptions: {
			input: {
				background: resolve(__dirname, "src/background.ts"),
				options: resolve(__dirname, "src/options.ts"),
			},
			output: {
				entryFileNames: (chunkInfo) => {
					if (chunkInfo.name === "background") return "background.js";
					if (chunkInfo.name === "options") return "options.js";
					return "assets/[name]-[hash].js";
				},
				chunkFileNames: "assets/[name]-[hash].js",
				assetFileNames: "assets/[name]-[hash][extname]",
			},
		},
		target: "es2022",
	},
});
