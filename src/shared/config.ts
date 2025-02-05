const isDevelopment = process.env.NODE_ENV === 'development';

export default {
    API_URL: isDevelopment 
        ? "http://localhost:8000/api/v1"
        : "https://ai-chat-app-49a9z.ondigitalocean.app/api/v1",

}