export function extractClientIp(req: any): string | null {
  // Cloudflare IP header (most reliable for our use case)
  const cfIp = req.headers["cf-connecting-ip"];
  if (cfIp) {
    return Array.isArray(cfIp) ? cfIp[0] : cfIp;
  }

  // X-Forwarded-For can contain multiple IPs separated by comma
  // Take the first one (client IP), not the proxy IPs
  const xForwardedFor = req.headers["x-forwarded-for"];
  if (xForwardedFor) {
    const ips = Array.isArray(xForwardedFor) ? xForwardedFor[0] : xForwardedFor;
    return ips.split(",")[0].trim();
  }

  // Fallback to socket connection (used when no proxies)
  const remoteAddress = req.socket?.remoteAddress;
  if (remoteAddress) {
    // IPv6 localhost is mapped to IPv4, strip the mapping
    if (remoteAddress === "::1") {
      return "127.0.0.1";
    }
    // Remove IPv6 prefix if present (::ffff:192.168.1.1 -> 192.168.1.1)
    if (remoteAddress.startsWith("::ffff:")) {
      return remoteAddress.slice(7);
    }
    return remoteAddress;
  }

  return null;
}
