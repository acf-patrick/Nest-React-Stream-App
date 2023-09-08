import axios, { AxiosError } from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_ENDPOINT || "http://localhost:3002/api/v1",
});

api.interceptors.request.use(async (config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config!;
    const req: any = config;
    console.log(req.retry);
    if (error.response?.status === 401 && !req.retry) {
      req.retry = true;
      const res = await api.get("/auth/refresh-tokens");
      const { accessToken, refreshToken } = res.data;

      localStorage.setItem("token", accessToken);
      localStorage.setItem("refresh", refreshToken);

      return api(req);
    }

    return Promise.reject(error);
  }
);

export default api;
