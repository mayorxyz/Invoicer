import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const port = parseInt(process.env.PORT || "3000", 10);

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: "0.0.0.0",
    port:5100,
    strictPort: true,
    hmr: {
      port:5100,
    },
  },
});
