import { NextRequest, NextResponse } from "next/server";

// Upstream TTS endpoint is strictly encapsulated on the server
const FASTLLM_TTS_ENDPOINT = process.env.FASTLLM_TTS_ENDPOINT || "https://fastllm.quarkgen.ai/tts_v3";
const MAX_WORDS_ALLOWED = 70; // Enforce resource limit

export async function POST(req: NextRequest) {
  try {
    // 1. Verify internal client security token/header
    const clientAuth = req.headers.get("x-quarkgen-client");
    if (!clientAuth || !clientAuth.startsWith("v3-")) {
      return NextResponse.json(
        {
          error: "Unauthorized",
          message: "API invocation requires authorized QuarkGen client signature.",
        },
        {
          status: 401,
          headers: {
            "X-QuarkGen-Security": "Blocked-Unsigned-Request",
          },
        }
      );
    }

    const body = await req.json();
    const { input, voice = "en", voice_name = "diya", speed = 1.0 } = body;

    if (!input || typeof input !== "string" || !input.trim()) {
      return NextResponse.json(
        { error: "Please provide a valid text prompt for audio synthesis." },
        { status: 400 }
      );
    }

    // Word count calculation
    const words = input.trim().split(/\s+/).filter(Boolean);
    if (words.length > MAX_WORDS_ALLOWED) {
      return NextResponse.json(
        {
          error: `Prompt exceeds maximum computational limit of ${MAX_WORDS_ALLOWED} words (detected: ${words.length} words).`,
        },
        { status: 400 }
      );
    }

    // Speed clamping between 0.7 and 1.8
    const clampedSpeed = Math.min(1.8, Math.max(0.7, Number(speed) || 1.0));

    // Call upstream TTS API from secure server proxy
    const upstreamResponse = await fetch(FASTLLM_TTS_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "QuarkGen-Secure-Gateway/3.0",
      },
      body: JSON.stringify({
        input: input.trim(),
        voice: String(voice),
        voice_name: String(voice_name),
        speed: clampedSpeed,
      }),
    });

    if (!upstreamResponse.ok) {
      const errorText = await upstreamResponse.text();
      let errorDetail = "TTS synthesis engine encountered a temporary processing error.";
      try {
        const parsed = JSON.parse(errorText);
        // Only allow clean string details, never raw system errors
        if (typeof parsed.detail === "string" && !parsed.detail.includes("http")) {
          errorDetail = parsed.detail;
        } else if (typeof parsed.error === "string" && !parsed.error.includes("http")) {
          errorDetail = parsed.error;
        }
      } catch {
        // Fallback to sanitized message
      }

      return NextResponse.json(
        { error: errorDetail },
        { status: upstreamResponse.status }
      );
    }

    const audioBuffer = await upstreamResponse.arrayBuffer();

    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/wav",
        "Content-Length": audioBuffer.byteLength.toString(),
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "X-Content-Type-Options": "nosniff",
        "X-QuarkGen-Engine": "Enterprise-Secure-v3",
      },
    });
  } catch (error: unknown) {
    // Sanitized server error to prevent leaking server details to inspect/network
    const isDev = process.env.NODE_ENV === "development";
    if (isDev) {
      console.error("QuarkGen Server Proxy Error (internal only):", error);
    }
    return NextResponse.json(
      { error: "Internal audio processing service error. Please retry." },
      { status: 500 }
    );
  }
}

// Reject any GET requests to this route
export async function GET() {
  return NextResponse.json(
    {
      error: "Method Not Allowed",
      message: "Direct inspection or GET requests to /api/tts are disabled.",
    },
    { status: 405 }
  );
}
