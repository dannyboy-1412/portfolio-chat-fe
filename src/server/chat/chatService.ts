import { randomUUID } from "crypto";
import { primaryModel } from "@/server/ai/modelRotation";
import { getDb } from "@/server/db/mongoClient";
import type { Conversation, Message, OpenAIMessage } from "@/server/chat/schemas";

const MESSAGES_COLLECTION = "danny_messages";
const CONVERSATIONS_COLLECTION = "conversations";
const MESSAGE_TTL_MINUTES = 30;

function ttlExpiry(): Date {
  return new Date(Date.now() + MESSAGE_TTL_MINUTES * 60 * 1000);
}

export async function createConversation(): Promise<Conversation> {
  const db = await getDb();
  const conversation: Conversation = {
    id: randomUUID(),
    messages: [],
    created_at: new Date(),
    model: primaryModel(),
    title: "",
  };

  await db.collection(CONVERSATIONS_COLLECTION).insertOne(conversation);
  return conversation;
}

export async function insertPersonalMessage(message: Message): Promise<void> {
  const db = await getDb();
  const document: Message = {
    ...message,
    created_at: message.created_at ?? new Date(),
    ttl: ttlExpiry(),
  };

  await db.collection(MESSAGES_COLLECTION).insertOne(document);
}

type AncestryMessage = {
  id: string;
  role: string;
  content: string;
  parent_id?: string | null;
  depth?: number;
};

type GraphLookupDoc = {
  id: string;
  role: string;
  content: string;
  parent_id?: string | null;
  ancestry?: AncestryMessage[];
};

export async function reconstructConversation(
  message: Message
): Promise<OpenAIMessage[]> {
  const current: OpenAIMessage = {
    role: message.role,
    content: message.content,
  };

  if (!message.parent_id) {
    return [current];
  }

  const db = await getDb();
  const results = await db
    .collection(MESSAGES_COLLECTION)
    .aggregate<GraphLookupDoc>([
      { $match: { id: message.parent_id } },
      {
        $graphLookup: {
          from: MESSAGES_COLLECTION,
          startWith: "$parent_id",
          connectFromField: "parent_id",
          connectToField: "id",
          as: "ancestry",
          depthField: "depth",
        },
      },
    ])
    .toArray();

  if (results.length === 0) {
    return [current];
  }

  const root = results[0];
  const ancestry = [...(root.ancestry ?? [])].sort(
    (a, b) => (b.depth ?? 0) - (a.depth ?? 0)
  );

  return [
    ...ancestry.map((msg) => ({ role: msg.role, content: msg.content })),
    { role: root.role, content: root.content },
    current,
  ];
}
