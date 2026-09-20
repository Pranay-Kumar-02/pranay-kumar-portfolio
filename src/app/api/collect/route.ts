import { UMAMI_ORIGIN } from "@/lib/umami";

const OWN = new Set([
  "localhost",
  "127.0.0.1",
]);

const ok = () => new Response(null, { status: 204 });

export async function POST(req: Request) {
  let host: string;
  try {
    const raw = await req.text();
    if (raw.length > 512) return ok();
    host = String(JSON.parse(raw)?.host ?? "")
      .toLowerCase()
      .slice(0, 253);
  } catch {
    return ok();
  }

  if (!/^[a-z0-9.-]+\.[a-z]{2,}$/.test(host)) return ok();
  if (OWN.has(host)) return ok();

  // Origin is browser-set, so it corroborates the reported host
  const origin = req.headers.get("origin") ?? "";
  console.log(`[analytics] host=${host} origin=${origin}`);

  const websiteId = process.env.UMAMI_DEPLOY_SITE_ID;
  if (websiteId && UMAMI_ORIGIN) {
    try {
      await fetch(`${UMAMI_ORIGIN}/api/send`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "user-agent": req.headers.get("user-agent") ?? "collect",
        },
        body: JSON.stringify({
          type: "event",
          payload: {
            website: websiteId,
            hostname: host,
            url: "/",
            name: "deploy",
          },
        }),
      });
    } catch {
      /* best-effort */
    }
  }

  return ok();
}
