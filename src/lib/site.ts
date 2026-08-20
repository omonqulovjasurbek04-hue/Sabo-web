const DEFAULT_SITE_URL = "https://sabo.example.com";

export function getSiteUrl(): string {
  const env = process.env.NEXT_PUBLIC_SITE_URL;
  return env || DEFAULT_SITE_URL;
}

export function absoluteUrl(path: string): string {
  return `${getSiteUrl().replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;
}