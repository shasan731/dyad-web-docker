import path from "node:path";
import os from "node:os";
import { IS_TEST_BUILD } from "../ipc/utils/test_utils";

const DEFAULT_LINUX_DATA_PATH = "/mnt/data/dyad-data";

function isServerless(): boolean {
  return Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
}

function getDefaultUserDataPath(): string {
  if (IS_TEST_BUILD) {
    return path.resolve("./userData");
  }
  if (isServerless()) {
    return path.join(os.tmpdir(), "dyad-userData");
  }
  if (process.platform === "linux") {
    return DEFAULT_LINUX_DATA_PATH;
  }
  return path.resolve("./userData");
}

/**
 * Gets the base dyad-apps directory path (without a specific app subdirectory)
 */
export function getDyadAppsBaseDirectory(): string {
  if (process.env.DYAD_APPS_PATH) {
    return process.env.DYAD_APPS_PATH;
  }
  if (process.env.DYAD_DATA_PATH) {
    return path.join(process.env.DYAD_DATA_PATH, "dyad-apps");
  }
  if (IS_TEST_BUILD || isServerless() || process.platform === "linux") {
    return path.join(getUserDataPath(), "dyad-apps");
  }
  return path.join(os.homedir(), "dyad-apps");
}

export function getDyadAppPath(appPath: string): string {
  // If appPath is already absolute, use it as-is
  if (path.isAbsolute(appPath)) {
    return appPath;
  }
  // Otherwise, use the default base path
  return path.join(getDyadAppsBaseDirectory(), appPath);
}

export function getTypeScriptCachePath(): string {
  return path.join(getUserDataPath(), "typescript-cache");
}

/**
 * Gets the user data path for the current runtime.
 * Prefers DYAD_USER_DATA_PATH, then DYAD_DATA_PATH.
 * Falls back to /tmp in serverless, /mnt/data/dyad-data on Linux,
 * and finally to ./userData in local environments.
 */

export function getUserDataPath(): string {
  if (process.env.DYAD_USER_DATA_PATH) {
    return process.env.DYAD_USER_DATA_PATH;
  }
  if (process.env.DYAD_DATA_PATH) {
    return process.env.DYAD_DATA_PATH;
  }
  return getDefaultUserDataPath();
}
