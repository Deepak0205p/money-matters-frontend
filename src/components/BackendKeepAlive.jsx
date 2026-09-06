"use client";

import { useEffect } from "react";
import { getApiUrl } from "@/lib/apiClient";

export default function BackendKeepAlive() {
  useEffect(() => {
    const pingBackend = async () => {
      try {
        const timestamp = Date.now();
        await fetch(getApiUrl(`/api/health?t=${timestamp}`), {
          method: "GET",
          cache: "no-store",
          headers: {
            "x-keepalive-ping": "true",
          },
        });
      } catch (err) {
        console.debug("[KeepAlive] Background ping error:", err);
      }
    };

    // 1. Initial ping on load
    pingBackend();

    // 2. Continuous ping exactly every 4 minutes (240,000 ms)
    const FOUR_MINUTES = 4 * 60 * 1000;
    const interval = setInterval(pingBackend, FOUR_MINUTES);

    return () => clearInterval(interval);
  }, []);

  return null;
}
