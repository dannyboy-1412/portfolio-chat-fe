import { COMPLETIONS } from "./endpoints";
import config from "@/shared/config";

export interface Message {
  id: string;
  content: string;
  role: string;
  parent_id?: string | null;
}

export const getCompletions = async (data: Message) => {
  try {
    const response = await fetch(config.API_URL + COMPLETIONS, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "text/event-stream",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    if (!response.body) {
      throw new Error("ReadableStream not supported");
    }

    return response.body.getReader();
  } catch (error) {
    console.error(error);
    throw error;
  }
};
