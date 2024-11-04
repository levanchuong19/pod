import axios from "axios";
const api = axios.create({
    baseURL: "http://localhost:5088/api/v1/",
});

api.interceptors.request.use(
    async (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
     (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; 

            try {
                const refreshToken = localStorage.getItem("refreshToken");
                const response = await axios.post("http://localhost:5088/api/v1/authentication/token/refresh", {
                    refreshToken,
                });
                const newAccessToken = response.data.accessToken;
                localStorage.setItem("accessToken", newAccessToken);
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                console.error("Refresh token failed", refreshError);

            }
        }
        return Promise.reject(error);
    }
  );
   api.interceptors.request.use(
    function (config){
      const token = localStorage.getItem("accessToken");
      config.headers.Authorization = `Bearer ${token}`;
      return config;
    }
    
  , function (error) {
    // Do something with request error
    return Promise.reject(error);
  },
);

export default api;
