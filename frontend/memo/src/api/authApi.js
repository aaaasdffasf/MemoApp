// src/api/authApi.js
import api from './api';

const API_URL = '/api/auth';

export const login = (username, password) => {
  return api.post(`${API_URL}/authenticate`, { username, password });
};

export const register = (userData) => {
  return api.post(`${API_URL}/register`, userData);
};

export const getUserInfo = async () => {
  try {
    const response = await api.get(`${API_URL}/me`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch user info", error);
    throw error;
  }
};

// 리프레시 토큰을 사용해 새로운 액세스 토큰 발급
export const refreshAccessToken = async () => {
  try {
    const response = await api.post(`${API_URL}/refresh`);
    return response.data.token; // 서버에서 새로운 토큰을 반환
  } catch (error) {
    console.error("Failed to refresh access token", error);
    throw error;
  }
};

// 회원 탈퇴 API 요청
export const deleteUser = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return await api.delete('/api/user/delete', config);
};