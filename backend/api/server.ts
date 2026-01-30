// Server entry point for the backend. 
declare const require: (module: string) => any; // Allow CommonJS require in TS.
declare const process: { cwd: () => string; env: Record<string, string | undefined> }; // Provide minimal process typing.

const http = require("http"); // Node HTTP server module.
const path = require("path"); // Node path module.
const fs = require("fs"); // Node filesystem module.

const { loadEnv } = require(path.join(process.cwd(), "backend", "utils", "env")); // Load .env for local dev.
const { handleChatRequest } = require(path.join(process.cwd(), "backend", "api", "chat_handler")); // Chat handler.

loadEnv(); // Populate process.env before handling requests.

const PORT = 3001; // Local API port.

function getContentType(filePath: string): string {
  const extension = path.extname(filePath).toLowerCase();
  switch (extension) {
    case ".html":
      return "text/html; charset=utf-8";
    case ".css":
      return "text/css; charset=utf-8";
    case ".js":
      return "application/javascript; charset=utf-8";
    case ".json":
      return "application/json; charset=utf-8";
    case ".png":
      return "image/png";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".svg":
      return "image/svg+xml";
    case ".gif":
      return "image/gif";
    case ".webp":
      return "image/webp";
    default:
      return "application/octet-stream";
  }
}

function resolveStaticPath(requestPath: string): string {
  const cleanPath = requestPath.replace(/^\/+/, "");
  if (requestPath === "/") {
    return path.join(process.cwd(), "pages", "home.html");
  }
  if (requestPath.startsWith("/pages/")) {
    return path.join(process.cwd(), cleanPath);
  }
  if (/^\/[^/]+\.html$/.test(requestPath)) {
    return path.join(process.cwd(), "pages", cleanPath);
  }
  return path.join(process.cwd(), cleanPath);
}

const server = http.createServer(async (req: any, res: any) => { // Create HTTP server.
  const requestUrl = req.url || "/";
  const url = new URL(requestUrl, `http://${req.headers.host || "localhost"}`);
  const pathname = decodeURIComponent(url.pathname);

  if (pathname.startsWith("/api/")) {
    await handleChatRequest(req, res); // Handle API requests.
    return;
  }

  if (req.method !== "GET") {
    res.writeHead(405, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Method Not Allowed");
    return;
  }

  const staticPath = resolveStaticPath(pathname);
  const normalizedRoot = path.normalize(process.cwd() + path.sep);
  const normalizedPath = path.normalize(staticPath);
  if (!normalizedPath.startsWith(normalizedRoot)) {
    res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Forbidden");
    return;
  }

  if (!fs.existsSync(normalizedPath) || !fs.statSync(normalizedPath).isFile()) {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not Found");
    return;
  }

  const contentType = getContentType(normalizedPath);
  const fileContents = fs.readFileSync(normalizedPath);
  res.writeHead(200, { "Content-Type": contentType });
  res.end(fileContents);
}); 

server.listen(PORT, () => { // Start listening for requests.
  // eslint-disable-next-line no-console // Allow a simple startup log.
  console.log(`Backend chat server running on http://localhost:${PORT}`); // Log URL.
}); 
