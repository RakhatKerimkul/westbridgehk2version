import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface LeadPayload {
  parent_name: string;
  email: string;
  whatsapp: string;
  teen_age: number;
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body: LeadPayload = await req.json();
    console.log("send-telegram invoked", { body, timestamp: new Date().toISOString() });

    const token = Deno.env.get("TG_BOT");
    const chatId = "-4974540321";

    const text = [
      "🎯 New Lead from Young CFO Weekend!",
      "",
      `👤 Parent Name: ${body.parent_name}`,
      `📧 Email: ${body.email}`,
      `📱 WhatsApp: ${body.whatsapp}`,
      `👶 Teen Age: ${body.teen_age}`,
      "",
      "#YoungCFO #NewLead",
    ].join("\n");

    // Send Telegram message in the background so the client isn't blocked
    EdgeRuntime.waitUntil((async () => {
      if (!token) {
        console.error("TG_BOT secret is not set");
        return;
      }
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout

        const tgResponse = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id: chatId, text }),
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        const tgData = await tgResponse.json().catch(() => ({}));
        if (!tgResponse.ok) {
          console.error("Telegram API error:", tgData);
        } else {
          console.log("Telegram message sent", { message_id: tgData?.result?.message_id });
        }
      } catch (error) {
        console.error("Telegram send error:", error);
      }
    })());

    // Immediate response to avoid blocking the UI
    return new Response(JSON.stringify({ queued: true }), {
      status: 202,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("send-telegram error:", error);
    return new Response(JSON.stringify({ error: error.message || "Invalid payload" }), {
      status: 400,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
