import { createContext, useState, useEffect, useCallback } from 'react';
import { getUserInfo, refreshAccessToken } from '../api/authApi';
import api from '../api/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Handle token expiration using useCallback to ensure stable reference
  const handleTokenExpired = useCallback(async () => {
    try {
      const newToken = await refreshAccessToken();
      if (newToken) {
        setToken(newToken);
        localStorage.setItem('token', newToken);
        return newToken; // 새로운 토큰 반환
      } else {
        throw new Error('Unable to refresh token');
      }
    } catch (error) {
      console.error('토큰 갱신 실패:', error);
      setError('토큰 갱신에 실패했습니다. 다시 로그인해주세요.');
      logout();
    }
  }, []);

  // Load user info whenever token changes
  useEffect(() => {
    const loadUserInfo = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      const decodedToken = parseJwt(token);
      if (!decodedToken) {
        console.error('Invalid token detected. Logging out.');
        logout();
        return;
      }

      const isTokenExpired = decodedToken.exp * 1000 < Date.now();
      if (isTokenExpired) {
        try {
          const newToken = await handleTokenExpired();
          if (newToken) {
            await loadUserInfoWithToken(newToken);
          }
        } catch (error) {
          console.error('Failed to refresh token', error);
        }
      } else {
        await loadUserInfoWithToken(token);
      }
    };

    const loadUserInfoWithToken = async (tokenToUse) => {
      setLoading(true);
      setError(null);
      try {
        const userInfo = await getUserInfo(`Bearer ${tokenToUse}`);
        setUser(userInfo);
      } catch (err) {
        console.error('Failed to fetch user info during login.', err);
        setError('Failed to load user info. Please login again.');
        logout();
      } finally {
        setLoading(false);
      }
    };

    loadUserInfo();
  }, [token, handleTokenExpired]);

  const login = (token) => {
    if (token) {
      localStorage.setItem('token', token);
      setToken(token);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading, error }}>
      {loading ? (
        <div>로딩 중...</div>
      ) : error ? (
        <div>{error}</div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

// JWT 파싱 함수
const parseJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  } catch (e) {
    console.error('Failed to parse JWT', e);
    return null;
  }
};

export default AuthContext;
