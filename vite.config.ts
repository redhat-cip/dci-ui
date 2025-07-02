/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  build: {
    outDir: "build",
  },
  test: {
    include: ["./**/*.test.ts", "./**/*.test.tsx"],
    globals: true,
    environment: "jsdom",
    setupFiles: [path.resolve(__dirname, "src/__tests__/setupTests.ts")],
  },
});
