// startProxy.js – helper to launch proxy.js as a worker

import { Worker } from "worker_threads";
import path from "path";
import { findAvailablePort } from "./port_utils";
import log from "@/utils/simple_logger";

const logger = log.scope("start_proxy_server");

export async function startProxy(
  targetOrigin: string,
  opts: {
    // host?: string;
    // port?: number;
    // env?: Record<string, string>;
    onStarted?: (proxyUrl: string) => void;
  } = {},
) {
  if (!/^https?:\/\//.test(targetOrigin))
    throw new Error("startProxy: targetOrigin must be absolute http/https URL");
  const minPort = Number(process.env.DYAD_PROXY_PORT_MIN || "50000");
  const maxPort = Number(process.env.DYAD_PROXY_PORT_MAX || "60000");
  const host = process.env.DYAD_PROXY_LISTEN_HOST || "localhost";
  const port = await findAvailablePort(minPort, maxPort, host);
  logger.info("Found available port", port);
  const {
    // host = "localhost",
    // env = {}, // additional env vars to pass to the worker
    onStarted,
  } = opts;

  const workerPath =
    process.env.DYAD_WEB_MODE === "true"
      ? path.resolve(process.cwd(), "worker", "proxy_server.js")
      : path.resolve(__dirname, "..", "..", "worker", "proxy_server.js");
  const worker = new Worker(workerPath, {
    workerData: {
      targetOrigin,
      port,
    },
  });

  worker.on("message", (m) => {
    logger.info("[proxy]", m);
    if (typeof m === "string" && m.startsWith("proxy-server-start url=")) {
      const url = m.substring("proxy-server-start url=".length);
      onStarted?.(url);
    }
  });
  worker.on("error", (e) => logger.error("[proxy] error:", e));
  worker.on("exit", (c) => logger.info("[proxy] exit", c));

  return worker; // let the caller keep a handle if desired
}

