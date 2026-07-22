import type { NextConfig } from "next";

// React usa eval() en modo desarrollo para features de debugging (reconstruir callstacks);
// en producción NUNCA lo usa. Por eso 'unsafe-eval' se agrega SOLO en dev — el CSP de
// producción queda tan ajustado como pide ADR-0002 (ver docs/adr/0002-csp-unsafe-inline-v1.md).
const isDev = process.env.NODE_ENV === "development";
const scriptSrc = `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`;

const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  {
    key: "Content-Security-Policy",
    value: `default-src 'self'; ${scriptSrc}; style-src 'self' 'unsafe-inline'; connect-src 'self'; frame-ancestors 'none'`,
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default nextConfig;
