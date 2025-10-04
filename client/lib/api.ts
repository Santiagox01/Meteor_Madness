import { NEO_BROWSE_SAMPLE } from "@/lib/samples";

const DEFAULT_TIMEOUT = 7000;

async function withTimeout(resource: RequestInfo | URL, options: RequestInit & { timeoutMs?: number } = {}) {
  const { timeoutMs = DEFAULT_TIMEOUT, ...rest } = options;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(resource, { ...rest, signal: controller.signal });
  } finally {
    clearTimeout(timeoutId);
  }
}

async function requestJson<T>(url: string, fallback: T, options?: RequestInit & { timeoutMs?: number }) {
  try {
    const response = await withTimeout(url, { ...options });
    if (!response?.ok) {
      return fallback;
    }
    return (await response.json()) as T;
  } catch (error) {
    console.warn(`[api] Falling back to cached data for ${url}`, error);
    return fallback;
  }
}

export async function fetchNeoBrowse(page = 0, size = 20) {
  const fallback = NEO_BROWSE_SAMPLE as any;
  const searchParams = new URLSearchParams({ page: String(page), size: String(size) });
  return requestJson(`/api/neo/browse?${searchParams.toString()}`, fallback);
}

export async function fetchNeoById(id: string) {
  if (!id) return null as any;
  return requestJson(`/api/neo/${encodeURIComponent(id)}`, null as any);
}

export async function fetchElevation(lat: number, lon: number) {
  return requestJson(`/api/usgs/elevation?lat=${lat}&lon=${lon}`, null as any);
}
