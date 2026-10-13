import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { createReadStream, cpSync, existsSync, statSync } from "node:fs";
import type { IncomingMessage, ServerResponse } from "node:http";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, type Plugin } from "vite";

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const wasmDir = path.join(rootDir, "node_modules/@mediapipe/tasks-vision/wasm");

function serveWasm(req: IncomingMessage, res: ServerResponse, next: (error?: unknown) => void): void {
  const rawUrl = req.url ?? "/";
  const pathname = rawUrl.split("?")[0] ?? "/";
  const relative = decodeURIComponent(pathname).replace(/^\/+/, "").replace(/^mediapipe\//, "");
  if (relative.length === 0 || relative.includes("..") || relative.includes("\\")) {
    next();
    return;
  }

  const filePath = path.join(wasmDir, relative);
  if (!filePath.startsWith(`${wasmDir}${path.sep}`) || !existsSync(filePath)) {
    next();
    return;
  }

  const stat = statSync(filePath);
  if (!stat.isFile()) {
    next();
    return;
  }

  if (filePath.endsWith(".wasm")) {
    res.setHeader("Content-Type", "application/wasm");
  } else if (filePath.endsWith(".js")) {
    res.setHeader("Content-Type", "text/javascript; charset=utf-8");
  }
  res.setHeader("Content-Length", stat.size);
  createReadStream(filePath).pipe(res);
}

function mediapipeWasm(): Plugin {
  return {
    name: "mediapipe-wasm",
    configureServer(server) {
      server.middlewares.use("/mediapipe", serveWasm);
    },
    configurePreviewServer(server) {
      server.middlewares.use("/mediapipe", serveWasm);
    },
    writeBundle(options) {
      if (!options.dir) return;
      cpSync(wasmDir, path.join(options.dir, "mediapipe"), { recursive: true });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), mediapipeWasm()],
  resolve: {
    alias: {
      "@": path.join(rootDir, "src"),
    },
  },
});
