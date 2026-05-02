import axios, {type AxiosError, type AxiosResponse} from "axios";
//Base URL from environment variable
const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api";
//Single axios instance shared across all services - DRY principle
const httpClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type" : "application/json",
    },
    timeout: 10000, //fail request after 10 seconds instead of hanging forever
});
//Response interceptor- unwrap data or throw consistent errors
httpClient.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
        //pass structured error message from backend
        const message = 
        (error.response?.data as {message?: string})?.message ?? error.message ?? "Something went wrong";
        return Promise.reject(new Error(message));
    }
);
export default httpClient;