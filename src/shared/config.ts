const isDevelopment = process.env.NODE_ENV === 'development';

const config = {
    API_URL: isDevelopment 
        ? "http://localhost:8000/api/v1"
        : process.env.NEXT_PUBLIC_LAMBDA_URL,
}

export default config;

    