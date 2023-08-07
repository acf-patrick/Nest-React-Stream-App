import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_ENDPOINT || "http://localhost:3002/api/v1",
});

export default api;
