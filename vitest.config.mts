import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    include: ["./**/*.test.ts", "./**/*.test.tsx"],
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/__tests__/setupTests.ts",
  },
});
