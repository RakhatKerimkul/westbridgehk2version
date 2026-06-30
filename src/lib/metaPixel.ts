// Lightweight, safe wrapper around the Meta Pixel (fbq) global.
//
// The base pixel snippet lives in index.html <head> and is responsible for
// `fbq('init', ...)` and `fbq('track', 'PageView')`. This helper is only for
// firing additional conversion events (Lead, Contact, …) from app code.
//
// It is intentionally defensive: if the pixel is blocked by an ad blocker,
// still loading, or otherwise unavailable, calls are silently ignored so they
// never throw or produce console errors.

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export function trackMetaEvent(
  eventName: string,
  params?: Record<string, unknown>
): void {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    if (params) {
      window.fbq("track", eventName, params);
    } else {
      window.fbq("track", eventName);
    }
  }
}
