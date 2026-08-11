import { NextResponse } from "next/server";
import { createConversation } from "@/server/chat/chatService";

export const runtime = "nodejs";

export async function POST() {
  try {
    const conversation = await createConversation();
    return NextResponse.json(conversation);
  } catch (error) {
    console.error("Failed to create conversation:", error);
    return NextResponse.json(
      { detail: "Failed to create conversation" },
      { status: 500 }
    );
  }
}
