import customAxios from "./customAxios";
import { COMPLETIONS, DOWNLOAD_RESUME_URL, TELEGRAM_MESSAGE } from "./endpoints";
import config from "@/shared/config";

export interface Message {
    id: string;
    content: string;
    role: string;
    parent_id?: string | null;
}

export interface TelegramMessage {
    user_message: string;
    assistant_message: string;
}



export const getCompletions = async (data: Message) => {
    try {
        const response = await fetch(config.API_URL + COMPLETIONS, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'text/event-stream',
            },
            body: JSON.stringify(data),
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        if (!response.body) {
            throw new Error('ReadableStream not supported');
        }

        const reader = response.body.getReader();
        
        return reader;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const downloadResume = async () => {
    try {
        const response = await customAxios.get(DOWNLOAD_RESUME_URL, {
            responseType: 'arraybuffer'
        });
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const sendTelegramMessage = async (data: TelegramMessage) => {
    try {
        const headers = {
            'Content-Type': 'application/json',
        }
        const response = await customAxios.post(TELEGRAM_MESSAGE, data, { headers });
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }

}

