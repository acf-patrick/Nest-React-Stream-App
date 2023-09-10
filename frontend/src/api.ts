import axios, { AxiosError } from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_ENDPOINT || "http://localhost:3002/api/v1",
});

api.interceptors.request.use(async (config) => {
  const token = localStorage.getItem("token");
  const refresh = localStorage.getItem("refresh");

  if (token && config.headers.Authorization !== `Bearer ${refresh}`) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const config = error.config!;
    const req: {
      _retry?: boolean;
    } & typeof config = config;

    if (error.response?.status === 401 && !req._retry) {
      req._retry = true;

      const refresh = localStorage.getItem("refresh");
      const res = await api.get("/auth/refresh-tokens", {
        headers: {
          Authorization: `Bearer ${refresh}`,
        },
      });
      const { accessToken, refreshToken } = res.data;

      localStorage.setItem("token", accessToken);
      localStorage.setItem("refresh", refreshToken);

      return api(req);
    }

    return Promise.reject(error);
  }
);

export default api