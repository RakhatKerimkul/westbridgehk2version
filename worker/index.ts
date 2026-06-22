/**
 * Cloudflare Worker entry point.
 *
 * Serves the built SPA (via the ASSETS binding) for every request EXCEPT
 * `POST /api/send-lead`, which forwards a website lead to a Telegram group
 * using the bot token + chat id stored as Cloudflare secrets. The token never
 * reaches the browser.
 *
 * Secrets (set with `wrangler secret put <NAME>` or in the Cloudflare dashboard):
 *   TG_BOT      - Telegram bot token from @BotFather
 *   TG_CHAT_ID  - target chat id (e.g. a group id like -5305711523)
 */

interface Env {
  ASSETS: { fetch: (request: Request) => Promise<Response> };
  TG_BOT?: string;
  TG_CHAT_ID?: string;
}

interface LeadPayload {
  parent_name?: string;
  email?: string;
  whatsapp?: string;
  teen_age?: number | string;
  source?: string;
}

async function handleLead(request: Request, env: Env): Promise<Response> {
  let body: LeadPayload;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const token = env.TG_BOT;
  const chatId = env.TG_CHAT_ID;
  if (!token || !chatId) {
    console.error("TG_BOT or TG_CHAT_ID secret is not set");
    return Response.json({ error: "Server not configured" }, { status: 500 });
  }

  const text = [
    "🎯 New WestBridge Lead!",
    body.source ? `📋 Source: ${body.source}` : "",
    "",
    `👤 Parent Name: ${body.parent_name ?? "-"}`,
    `📧 Email: ${body.email ?? "-"}`,
    `📱 WhatsApp: ${body.whatsapp ?? "-"}`,
    `👶 Student Age: ${body.teen_age ?? "-"}`,
    "",
    "#WestBridge #NewLead",
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const tgResponse = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text }),
    });

    const tgData: any = await tgResponse.json().catch(() => ({}));
    if (!tgResponse.ok) {
      console.error("Telegram API error:", tgData);
      return Response.json({ error: "Telegram send failed", detail: tgData }, { status: 502 });
    }
    return Response.json({ ok: true, message_id: tgData?.result?.message_id });
  } catch (error) {
    console.error("Telegram send error:", error);
    return Response.json({ error: "Telegram request failed" }, { status: 502 });
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/send-lead") {
      if (request.method !== "POST") {
        return new Response("Method Not Allowed", { status: 405 });
      }
      return handleLead(request, env);
    }

    // Everything else: serve the static SPA (includes single-page-app fallback).
    return env.ASSETS.fetch(request);
  },
};
