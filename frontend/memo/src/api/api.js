import axios from 'axios';
import { refreshAccessToken } from './authApi'; // 새로 작성한 refreshAccessToken API

const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터를 통해 모든 요청에 토큰을 추가
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && token !== 'null') {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터를 통해 인증 오류 처리 및 토큰 갱신 로직 추가
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // 무한 루프 방지를 위해 _retry 플래그 추가
      try {
        const newToken = await refreshAccessToken(); // 새로운 액세스 토큰 요청
        if (newToken) {
          localStorage.setItem('token', newToken);
          api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
          return api(originalRequest); // 원래의 요청을 재시도
        }
      } catch (err) {
        console.error('토큰 갱신 실패:', err);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
