import Anthropic from "@anthropic-ai/sdk";

// Reads ANTHROPIC_API_KEY from the environment — set it in .env.local
const client = new Anthropic();

const SYSTEM_PROMPT =
  "You are the friendly shopping assistant for WAGGLE TAIL, an online pet supply store. " +
  "Help visitors with questions about products (food, treats, supplements, grooming, walking gear, " +
  "toys, hygiene, beds), shipping, returns, and the subscription (auto-delivery) program. " +
  "Answer in Korean unless the visitor writes in another language. Keep replies concise and warm. " +
  "If you don't know something specific about an order or account, say so and suggest contacting " +
  "고객센터 1588-0000.";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const messages: ChatMessage[] | undefined = body?.messages;

  if (!Array.isArray(messages) || messages.length === 0) {
    return new Response(JSON.stringify({ error: "messages is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const stream = client.messages.stream({
    model: "claude-opus-4-8",
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    thinking: { type: "adaptive" },
    messages,
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        controller.close();
      } catch (err) {
        controller.error(err);
      }
    },
    cancel() {
      stream.controller.abort();
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
