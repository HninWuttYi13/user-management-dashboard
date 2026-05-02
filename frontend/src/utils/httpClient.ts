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
//Shape of backend error response
interface BackendErrorResponse {
    success: boolean;
    message: string;
    error?: Array<{path: string; message: string}> | null;
   
    
    
}
//Response interceptor- unwrap data or throw consistent errors
httpClient.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
        const data = error.response?.data as BackendErrorResponse | undefined;
        let message = "Something went wrong";
        if(data) {
            //if backend returns field-level errors -join them
            //e.g-"body.username: Username must be at least 3 characters"
            if(Array.isArray(data.error) && data.error.length > 0) {
                message = data.error
                .map((e)=> e.message)
                .join(", ")
            }
        } else {
            //fall back to top-level message
            message = data.message ?? message;
        }
        return Promise.reject(new Error(message));
    }
);
export default httpClient;