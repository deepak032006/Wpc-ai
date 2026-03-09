
export function getClientToken(): string {
  if (typeof document === "undefined") return "";

  const cookies = document.cookie.split("; ");

  const tokenCookie = cookies.find((c) => c.startsWith("access-token="));

  if (!tokenCookie) {
    console.warn("[getClientToken] access-token cookie not found");
    return "";
  }

  const raw = tokenCookie.slice("access-token=".length);

  let decoded: any = raw;

  try {
    decoded = decodeURIComponent(raw);
  } catch {}

 
  if (typeof decoded === "string" && decoded.startsWith("{")) {
    try {
      const parsed = JSON.parse(decoded);
      decoded =
        parsed.access ||
        parsed.token ||
        parsed.access_token ||
        parsed.key ||
        "";
    } catch {}
  }

  if (typeof decoded !== "string") {
    console.error("[getClientToken] token was not string");
    return "";
  }

  const token = decoded
    .trim()
    .replace(/^(Bearer|Token)\s*/i, "");

  if (!token) {
    console.warn("[getClientToken] token empty after cleaning");
    return "";
  }

  console.log("[getClientToken] token:", token.slice(0, 20) + "...");

  return token;
}