import axios from "axios";

const api = axios.create({
    // baseURL: "http://localhost:3000",
    baseURL: "https://taskmanager-re9u.onrender.com",
    withCredentials: true // allow cookies if backend sets them
});

// automatically attach token from localStorage if available
api.interceptors.request.use(config => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
