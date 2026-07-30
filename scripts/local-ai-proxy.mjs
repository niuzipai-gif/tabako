import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import { createWorker } from "../worker.js";

const PORT = Number(process.env.TABAKO_AI_PROXY_PORT || 8789);
const HOST = process.env.TABAKO_AI_PROXY_HOST || "127.0.0.1";
const DEFAULT_ALLOWED_ORIGIN = "https://niuzipai-gif.github.io";

function loadDotEnv(path = ".dev.vars") {
  try {
    const source = readFileSync(path, "utf8");
    for (const line of source.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const match = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
      if (!match) continue;
      const [, key, rawValue] = match;
      if (process.env[key]) continue;
      process.env[key] = rawValue.replace(/^["']|["']$/g, "");
    }
  } catch {
    // .dev.vars is optional. The proxy will return a safe 503 if the key is absent.
  }
}

function headersToObject(headers) {
  const result = {};
  for (const [key, value] of Object.entries(headers)) {
    if (Array.isArray(value)) {
      result[key] = value.join(", ");
    } else if (value !== undefined) {
      result[key] = value;
    }
  }
  return result;
}

function readBody(request) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    request.on("data", (chunk) => chunks.push(chunk));
    request.on("end", () => resolve(Buffer.concat(chunks)));
    request.on("error", reject);
  });
}

loadDotEnv();

const worker = createWorker();

const server = createServer(async (incoming, outgoing) => {
  try {
    const body = incoming.method === "GET" || incoming.method === "HEAD"
      ? undefined
      : await readBody(incoming);
    const request = new Request(`http://${HOST}:${PORT}${incoming.url}`, {
      method: incoming.method,
      headers: headersToObject(incoming.headers),
      body,
      duplex: body ? "half" : undefined,
    });
    const response = await worker.fetch(request, {
      MINIMAX_API_KEY: process.env.MINIMAX_API_KEY,
      ALLOWED_ORIGIN: process.env.ALLOWED_ORIGIN || DEFAULT_ALLOWED_ORIGIN,
    });

    outgoing.writeHead(response.status, Object.fromEntries(response.headers.entries()));
    if (incoming.method === "HEAD") {
      outgoing.end();
      return;
    }
    outgoing.end(Buffer.from(await response.arrayBuffer()));
  } catch {
    outgoing.writeHead(500, { "content-type": "application/json; charset=utf-8" });
    outgoing.end(JSON.stringify({ error: "本地 AI 代理异常" }));
  }
});

server.listen(PORT, HOST, () => {
  console.log(`Tabako AI proxy listening on http://${HOST}:${PORT}`);
  console.log(`Allowed origin: ${process.env.ALLOWED_ORIGIN || DEFAULT_ALLOWED_ORIGIN}`);
});
