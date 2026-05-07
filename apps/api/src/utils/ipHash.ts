import crypto from "crypto";

export function hashIP(ip: string, salt: string): string {
  return crypto.createHash("sha256").update(`${ip}${salt}`).digest("hex");
}

export function extractClientIP(req: any, trustProxy: boolean = true): string {
  if (trustProxy) {
    return (
      (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
      (req.headers["x-real-ip"] as string) ||
      req.socket.remoteAddress ||
      "unknown"
    );
  }
  return req.socket.remoteAddress || "unknown";
}
