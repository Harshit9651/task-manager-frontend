import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";

import {
  clearAuth,
  getAccessToken,
  setAccessToken,
} from "../../utils/storage";


const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 30000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});


let isRefreshing = false;

let failedQueue: {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}[] = [];



const processQueue = (
  error: unknown,
  token: string | null = null
): void => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token!);
    }
  });

  failedQueue = [];
};


api.interceptors.request.use(
  (
    config: InternalAxiosRequestConfig
  ): InternalAxiosRequestConfig => {
    const token = getAccessToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },

  (error: AxiosError) => Promise.reject(error)
);


const saveNewAccessToken = (token: string): void => {
  setAccessToken(token);
};

const logoutUser = (): void => {
  clearAuth();

  window.location.href = "/";
};



api.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest: any = error.config;


    if (!error.response) {
      return Promise.reject(error);
    }

 
    if (originalRequest?.url?.includes("/auth/refresh")) {
      logoutUser();
      return Promise.reject(error);
    }

 
    if (
      error.response.status !== 401 ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

  
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (token: string) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          },

          reject,
        });
      });
    }

    isRefreshing = true;

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/refresh`,
        {},
        {
          withCredentials: true,
        }
      );

      const accessToken =
        response.data.data.accessToken;

      saveNewAccessToken(accessToken);

      processQueue(null, accessToken);

      originalRequest.headers.Authorization =
        `Bearer ${accessToken}`;

      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError);

      logoutUser();

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);


export default api;