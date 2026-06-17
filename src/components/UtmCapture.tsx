"use client";

import { useEffect } from "react";
import { trackPageParams } from "@/lib/analytics";
import { captureUtmFromUrl, getStoredUtm } from "@/lib/utm";

export function UtmCapture() {
  useEffect(() => {
    captureUtmFromUrl();
    const utm = getStoredUtm();
    if (Object.keys(utm).length > 0) {
      trackPageParams(utm as Record<string, string>);
    }
  }, []);

  return null;
}
