import axios from "axios";

let axiosInstance = axios.create();
const ACCESS_TOKEN = "b337fa90-b472-4ad2-8b76-dfe4496b92ae";
const BOARD_ID = "9206728921179133997";

axiosInstance.defaults.baseURL = "https://dev-game-services.objectiveed.com/boards/" + BOARD_ID;

// Apply interceptor to request to attach JWT token
axiosInstance.interceptors.request.use(
    (config) => {
        // Add authorization header to all requests
        config.headers["Access-Token"] = ACCESS_TOKEN;
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;
