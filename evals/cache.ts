import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

const CACHE_DIR = path.resolve(process.cwd(), "evals/.cache");

function sanitizeKey(key: string): string {
  return key.replace(/[^a-zA-Z0-9_-]/g, "_");
}

function cacheFile(namespace: string, key: string): string {
  return path.join(CACHE_DIR, namespace, `${sanitizeKey(key)}.json`);
}

export async function readCache<T>(
  namespace: string,
  key: string
): Promise<T | undefined> {
  try {
    const raw = await readFile(cacheFile(namespace, key), "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return undefined;
  }
}

export async function writeCache<T>(
  namespace: string,
  key: string,
  value: T
): Promise<void> {
  const file = cacheFile(namespace, key);
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, JSON.stringify(value, null, 2), "utf-8");
}
