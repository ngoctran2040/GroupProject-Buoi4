import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000",
});

// ✅ Thêm access token vào mọi request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ✅ Tự động refresh token khi access token hết hạn
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const refreshToken = localStorage.getItem("refreshToken");

    if (error.response?.status === 401 && !originalRequest._retry && refreshToken) {
      originalRequest._retry = true;
      try {
        const res = await axios.post("http://localhost:3000/auth/refresh", {
          token: refreshToken,
        });

        const newAccessToken = res.data.accessToken;
        localStorage.setItem("token", newAccessToken);

        // Gán lại token mới và gọi lại request cũ
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return API(originalRequest);
      } catch (refreshError) {
        console.error("❌ Refresh token lỗi:", refreshError);
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default API;
