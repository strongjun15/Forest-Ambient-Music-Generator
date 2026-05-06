import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import Replicate from "npm:replicate@1.0.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey, X-Replicate-Token",
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function getReplicateToken(req: Request): string | null {
  return (
    req.headers.get("X-Replicate-Token") ||
    Deno.env.get("REPLICATE_API_TOKEN") ||
    null
  );
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const apiToken = getReplicateToken(req);
    if (!apiToken) {
      return jsonResponse({ error: "REPLICATE_API_TOKEN is not configured" }, 500);
    }

    const replicate = new Replicate({ auth: apiToken });
    const url = new URL(req.url);
    const path = url.pathname.replace("/generate-music", "");

    // POST / — Create a new prediction (non-blocking)
    if (req.method === "POST" && (path === "" || path === "/")) {
      const { prompt } = await req.json();

      if (!prompt || typeof prompt !== "string") {
        return jsonResponse({ error: "A valid prompt string is required" }, 400);
      }

      const prediction = await replicate.predictions.create({
        version: "671ac645ce5e552cc63a54a2bbff63fcf798043055d2dac5fc9e36a837eedcfb",
        input: {
          prompt: prompt,
          model_version: "stereo-large",
          output_format: "mp3",
          duration: 30,
        },
      });

      return jsonResponse({
        id: prediction.id,
        status: prediction.status,
      });
    }

    // GET /status?id=xxx — Poll prediction status
    if (req.method === "GET" && path === "/status") {
      const predictionId = url.searchParams.get("id");

      if (!predictionId) {
        return jsonResponse({ error: "Prediction ID is required" }, 400);
      }

      const prediction = await replicate.predictions.get(predictionId);

      return jsonResponse({
        id: prediction.id,
        status: prediction.status,
        output: prediction.output ?? null,
        error: prediction.error ?? null,
      });
    }

    return jsonResponse({ error: "Not found" }, 404);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return jsonResponse({ error: message }, 500);
  }
});
