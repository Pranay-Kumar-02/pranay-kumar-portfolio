import { EmailTemplate } from "@/components/email-template";
import { config } from "@/data/config";
import { Resend } from "resend";
import { z } from "zod";

const rateLimit = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 1000;

function cleanupRateLimits(now: number) {
  if (rateLimit.size > 500) {
    for (const [key, entry] of rateLimit.entries()) {
      if (now > entry.resetAt) {
        rateLimit.delete(key);
      }
    }
  }
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  cleanupRateLimits(now);

  const entry = rateLimit.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT_MAX;
}

const Email = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters.")
    .max(100, "Full name cannot exceed 100 characters."),
  email: z
    .string()
    .trim()
    .email({ message: "A valid email address is required." })
    .max(255, "Email address cannot exceed 255 characters."),
  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters.")
    .max(5000, "Message cannot exceed 5,000 characters."),
});

export async function POST(req: Request) {
  try {
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded
      ? forwarded.split(",")[0].trim()
      : req.headers.get("x-real-ip") || "unknown";

    if (isRateLimited(ip)) {
      return Response.json(
        { error: "Too many requests. Please wait a moment before sending another message." },
        { status: 429 }
      );
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return Response.json(
        { error: "Invalid JSON request body." },
        { status: 400 }
      );
    }

    const {
      success: zodSuccess,
      data: zodData,
      error: zodError,
    } = Email.safeParse(body);

    if (!zodSuccess) {
      return Response.json(
        { error: zodError?.issues?.[0]?.message || "Invalid input data." },
        { status: 400 }
      );
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      if (process.env.NODE_ENV === "production") {
        console.error("[send/route] RESEND_API_KEY is not configured in production.");
        return Response.json(
          { error: "Email service is temporarily unavailable. Please email directly." },
          { status: 503 }
        );
      }
      console.warn("[send/route] RESEND_API_KEY is not configured.");
      return Response.json(
        { message: "Message received (Local development mode - email service not configured)." },
        { status: 200 }
      );
    }

    const resend = new Resend(apiKey);
    const recipientEmail = process.env.RESEND_TO_EMAIL || config.email;
    const fromAddress = process.env.RESEND_FROM_EMAIL || "Portfolio <onboarding@resend.dev>";

    const { data: resendData, error: resendError } = await resend.emails.send({
      from: fromAddress,
      to: [recipientEmail],
      replyTo: zodData.email,
      subject: `New message from ${zodData.fullName}`,
      react: EmailTemplate({
        fullName: zodData.fullName,
        email: zodData.email,
        message: zodData.message,
      }) as React.ReactElement,
    });

    if (resendError) {
      console.error("[send/route] Resend service error:", resendError);
      return Response.json({ error: "Failed to deliver message via email service." }, { status: 502 });
    }

    return Response.json({ success: true, data: resendData });
  } catch (err) {
    console.error("[send/route] Internal error:", err);
    return Response.json(
      { error: "An unexpected error occurred. Please try again later." },
      { status: 500 }
    );
  }
}
