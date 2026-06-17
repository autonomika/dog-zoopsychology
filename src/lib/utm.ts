export const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

export type UtmParams = Partial<Record<(typeof UTM_KEYS)[number], string>>;

const STORAGE_KEY = "zoopsy_utm";

export function captureUtmFromSearch(search: string): UtmParams | null {
  const params = new URLSearchParams(search);
  const utm: UtmParams = {};
  let found = false;

  for (const key of UTM_KEYS) {
    const value = params.get(key)?.trim();
    if (value) {
      utm[key] = value;
      found = true;
    }
  }

  return found ? utm : null;
}

export function getStoredUtm(): UtmParams {
  if (typeof window === "undefined") return {};
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as UtmParams;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function saveUtm(utm: UtmParams) {
  if (typeof window === "undefined" || Object.keys(utm).length === 0) return;
  sessionStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ ...getStoredUtm(), ...utm, capturedAt: String(Date.now()) }),
  );
}

export function captureUtmFromUrl() {
  if (typeof window === "undefined") return;
  const fresh = captureUtmFromSearch(window.location.search);
  if (fresh) saveUtm(fresh);
}

export function appendUtmToUrl(url: string): string {
  const utm = getStoredUtm();
  if (Object.keys(utm).length === 0) return url;

  const target = new URL(url, window.location.origin);
  for (const key of UTM_KEYS) {
    const value = utm[key];
    if (value && !target.searchParams.has(key)) {
      target.searchParams.set(key, value);
    }
  }
  return `${target.pathname}${target.search}${target.hash}`;
}

export function utmForApi(): UtmParams {
  const utm = getStoredUtm();
  const payload: UtmParams = {};
  for (const key of UTM_KEYS) {
    const value = utm[key];
    if (value) payload[key] = value;
  }
  return payload;
}
