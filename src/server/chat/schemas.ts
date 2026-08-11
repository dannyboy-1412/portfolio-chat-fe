import { z } from "zod";

export const openAIMessageSchema = z.object({
  role: z.string(),
  content: z.string(),
});

export const messageSchema = openAIMessageSchema.extend({
  id: z.string().optional().nullable(),
  created_at: z.coerce.date().optional(),
  ttl: z.coerce.date().optional().nullable(),
  parent_id: z.string().optional().nullable(),
});

export const conversationSchema = z.object({
  id: z.string(),
  messages: z.array(messageSchema).default([]),
  created_at: z.coerce.date().optional(),
  model: z.string().default("gpt-4o-mini"),
  title: z.string().default(""),
});

export type OpenAIMessage = z.infer<typeof openAIMessageSchema>;
export type Message = z.infer<typeof messageSchema>;
export type Conversation = z.infer<typeof conversationSchema>;
