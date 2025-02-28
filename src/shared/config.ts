const isDevelopment = process.env.NODE_ENV === 'development';

export default {
    API_URL: isDevelopment 
        ? "http://localhost:8000/api/v1"
        : process.env.NEXT_PUBLIC_LAMBDA_URL,
}   

    