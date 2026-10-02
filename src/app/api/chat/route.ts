import { NextRequest, NextResponse } from "next/server";
import { buildSystemPrompt } from "@/data/pranay-knowledge";
import { generateLocalBrainResponse, ChatMessage } from "@/lib/ai/local-brain";

// In-memory rate-limiter: 25 requests per minute per IP
const ipRequestTimestamps = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 25;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = ipRequestTimestamps.get(ip) || [];
  const validTimestamps = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);

  if (validTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    ipRequestTimestamps.set(ip, validTimestamps);
    return true;
  }

  validTimestamps.push(now);
  ipRequestTimestamps.set(ip, validTimestamps);

  // Periodically clean stale entries to prevent memory leak
  if (ipRequestTimestamps.size > 1000) {
    for (const [key, times] of ipRequestTimestamps.entries()) {
      if (times.every((t) => now - t >= RATE_LIMIT_WINDOW_MS)) {
        ipRequestTimestamps.delete(key);
      }
    }
  }

  return false;
}

export async function POST(req: NextRequest) {
  try {
    // 1. IP identification for rate limiting
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        {
          error: "Rate limit reached. Please wait a moment before sending another message.",
          rateLimited: true,
        },
        { status: 429 }
      );
    }

    // 2. Parse and validate body
    let body: { messages?: ChatMessage[] };
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON request body." },
        { status: 400 }
      );
    }

    const { messages } = body;
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Messages array is required." },
        { status: 400 }
      );
    }

    const lastMessage = messages[messages.length - 1];
    if (!lastMessage || typeof lastMessage.content !== "string") {
      return NextResponse.json(
        { error: "A valid message content string is required." },
        { status: 400 }
      );
    }

    const trimmedContent = lastMessage.content.trim();

    // Empty message check
    if (trimmedContent.length === 0) {
      return NextResponse.json(
        { error: "Message cannot be empty." },
        { status: 400 }
      );
    }

    // Extremely long message protection (max 2000 chars)
    if (trimmedContent.length > 2000) {
      return NextResponse.json(
        {
          error:
            "Your message exceeds the 2,000 character limit. Please shorten your message and try again.",
        },
        { status: 400 }
      );
    }

    // 3. Upstream AI API check (OpenRouter)
    const openRouterApiKey = process.env.OPENROUTER_API_KEY;

    if (openRouterApiKey) {
      try {
        const systemPrompt = buildSystemPrompt();
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 12000); // 12s timeout

        const model =
          process.env.OPENROUTER_MODEL || "meta-llama/llama-3.3-70b-instruct:free";

        const apiResponse = await fetch(
          "https://openrouter.ai/api/v1/chat/completions",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${openRouterApiKey}`,
              "Content-Type": "application/json",
              "HTTP-Referer": "https://pranay-portfolio-alpha.vercel.app",
              "X-Title": "Ask Pranay AI",
            },
            body: JSON.stringify({
              model,
              messages: [
                { role: "system", content: systemPrompt },
                ...messages.slice(-8), // Keep last 8 turns for bounded context
              ],
              temperature: 0.6,
              max_tokens: 800,
            }),
            signal: controller.signal,
          }
        );

        clearTimeout(timeoutId);

        if (apiResponse.ok) {
          const data = await apiResponse.json();
          const reply = data.choices?.[0]?.message?.content;
          if (reply && typeof reply === "string") {
            return NextResponse.json({ reply: reply.trim() });
          }
        }
        // If upstream returned error status or empty choices, proceed to local fallback
        console.warn(
          "[Ask Pranay AI] Upstream OpenRouter returned status:",
          apiResponse.status,
          "Falling back to local brain."
        );
      } catch (err: unknown) {
        console.warn(
          "[Ask Pranay AI] Upstream AI request failed or timed out. Falling back to local brain.",
          err
        );
      }
    }

    // 4. Reliable local intelligence engine (handles Pranay facts, coding, grammar, and general queries)
    const localReply = generateLocalBrainResponse(messages);
    return NextResponse.json({ reply: localReply });
  } catch (error) {
    console.error("[Ask Pranay AI] Server error:", error);
    return NextResponse.json(
      {
        error:
          "An unexpected error occurred while processing your request. Please try again.",
      },
      { status: 500 }
    );
  }
}
