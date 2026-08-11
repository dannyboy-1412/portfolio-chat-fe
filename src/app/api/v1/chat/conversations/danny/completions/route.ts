import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import {
  insertPersonalMessage,
  reconstructConversation,
} from "@/server/chat/chatService";
import { messageSchema } from "@/server/chat/schemas";
import { generateCompletion } from "@/server/ai/completionService";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = messageSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { detail: "Invalid message payload", issues: parsed.error.issues },
        { status: 400 }
      );
    }

    const message = parsed.data;
    await insertPersonalMessage(message);

    const messages = await reconstructConversation(message);
    const stream = await generateCompletion(messages);
    const assistantMessageId = randomUUID();
    const encoder = new TextEncoder();

    const readable = new ReadableStream({
      async start(controller) {
        let fullResponse = "";

        try {
          controller.enqueue(
            encoder.encode(
              `metadata/&\ndata: ${JSON.stringify({ assistant_message_id: assistantMessageId })}/&\n\n`
            )
          );

          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
              fullResponse += content;
              controller.enqueue(
                encoder.encode(
                  `message/&\ndata: ${JSON.stringify({ content })}/&\n\n`
                )
              );
            }
          }

          controller.enqueue(encoder.encode("[DONE]/&\n\n"));

          await insertPersonalMessage({
            id: assistantMessageId,
            role: "assistant",
            content: fullResponse,
            parent_id: message.id ?? null,
          });
        } catch (error) {
          console.error("Error while streaming completion:", error);
          controller.error(error);
          return;
        }

        controller.close();
      },
    });

    return new Response(readable, {
      status: 200,
      headers: {
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no",
        "Content-Type": "text/event-stream",
      },
    });
  } catch (error) {
    console.error("Error generating completion:", error);
    return NextResponse.json(
      { detail: "Internal Server Error" },
      { status: 500 }
    );
  }
}
