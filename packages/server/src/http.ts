import http, { type IncomingMessage, type ServerResponse } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sirv from "sirv";
import {
  mergeSceneSnapshot,
  normalizeScenePath,
  readOrCreateSceneFile,
  writeSceneFile,
  type SceneSnapshot,
} from "@agentdraw/scene";

export type AgentDrawServerOptions = {
  host?: string;
  port?: number;
  cwd?: string;
  webDistDir?: string;
};

export type AgentDrawServer = {
  host: string;
  port: number;
  url: string;
  close: () => Promise<void>;
};

export const startAgentDrawServer = async (
  options: AgentDrawServerOptions = {},
): Promise<AgentDrawServer> => {
  const host = options.host ?? "127.0.0.1";
  const port = options.port ?? 3927;
  const cwd = options.cwd ?? process.cwd();
  const webDistDir = options.webDistDir ?? defaultWebDistDir();
  const staticHandler = sirv(webDistDir, { dev: true, single: true });

  const server = http.createServer(async (request, response) => {
    try {
      if (request.url?.startsWith("/api/")) {
        await handleApi(request, response, cwd);
        return;
      }
      staticHandler(request, response);
    } catch (error) {
      sendJson(response, 500, {
        error: error instanceof Error ? error.message : "Unexpected server error.",
      });
    }
  });

  await new Promise<void>((resolve, reject) => {
    server.once("error", reject);
    server.listen(port, host, () => {
      server.off("error", reject);
      resolve();
    });
  });

  return {
    host,
    port,
    url: `http://${host}:${port}`,
    close: () =>
      new Promise((resolve, reject) => {
        server.close((error) => (error ? reject(error) : resolve()));
      }),
  };
};

const handleApi = async (
  request: IncomingMessage,
  response: ServerResponse,
  cwd: string,
) => {
  const url = new URL(request.url ?? "/", "http://localhost");

  if (request.method === "GET" && url.pathname === "/api/scene") {
    const filePath = normalizeScenePath(url.searchParams.get("file") ?? "", cwd);
    const scene = await readOrCreateSceneFile(filePath);
    sendJson(response, 200, { filePath, scene });
    return;
  }

  if (request.method === "POST" && url.pathname === "/api/scene") {
    const body = await readJsonBody<{
      filePath?: string;
      scene?: SceneSnapshot;
    }>(request);
    const filePath = normalizeScenePath(body.filePath ?? "", cwd);
    const current = await readOrCreateSceneFile(filePath);
    const next = mergeSceneSnapshot(current, body.scene ?? {
      elements: [],
      appState: {},
      files: {},
    });
    const scene = await writeSceneFile(filePath, next);
    sendJson(response, 200, { filePath, scene });
    return;
  }

  sendJson(response, 404, { error: "Unknown API route." });
};

const readJsonBody = async <T>(request: IncomingMessage): Promise<T> => {
  const chunks: Buffer[] = [];
  for await (const chunk of request) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  if (chunks.length === 0) {
    return {} as T;
  }
  return JSON.parse(Buffer.concat(chunks).toString("utf8")) as T;
};

const sendJson = (response: ServerResponse, statusCode: number, payload: unknown) => {
  response.writeHead(statusCode, {
    "content-type": "application/json; charset=utf-8",
    "access-control-allow-origin": "*",
  });
  response.end(JSON.stringify(payload));
};

const defaultWebDistDir = () => {
  const currentDir = path.dirname(fileURLToPath(import.meta.url));
  return path.resolve(currentDir, "../../../apps/web/dist");
};
