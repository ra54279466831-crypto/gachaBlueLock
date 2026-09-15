import { createHmac, timingSafeEqual } from "node:crypto";

const secret = process.env.AUTH_SECRET ?? "change-this-secret-in-production";
const encode = (value) => Buffer.from(JSON.stringify(value)).toString("base64url");
export function createToken(userId) { const payload = encode({ sub: userId, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 }); const signature = createHmac("sha256", secret).update(payload).digest("base64url"); return `${payload}.${signature}`; }
export function readToken(token) {
  const [payload, signature] = String(token ?? "").split(".");
  if (!payload || !signature) return null;
  const expected = createHmac("sha256", secret).update(payload).digest("base64url");
  if (signature.length !== expected.length || !timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;
  try { const data = JSON.parse(Buffer.from(payload, "base64url").toString()); return data.exp > Date.now() ? data : null; } catch { return null; }
}