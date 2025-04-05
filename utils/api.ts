import axios from "axios";

const API = axios.create({
  baseURL: "https://budget-tracker-m7zk.onrender.com/api",
});

API.interceptors.request.use(async (config) => {
  let token = localStorage.getItem("access_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refresh = localStorage.getItem("refresh_token");

        if (!refresh) {
          console.error("No refresh token found");
          return Promise.reject(error);
        }

        const res = await axios.post("http://127.0.0.1:8000/api/token/refresh/", {
          refresh,
        });

        localStorage.setItem("access_token", res.data.access);

        // Retry the failed request
        originalRequest.headers.Authorization = `Bearer ${res.data.access}`;
        return API(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed", refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default API;
