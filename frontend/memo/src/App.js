import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UserProfilePage from './pages/UserProfilePage';
import Setting from './pages/Setting';
import MemoPage from './pages/MemoPage';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import { AuthProvider } from './context/AuthContext'; // AuthProvider 추가
import axios from 'axios';
import './App.css';

// Axios 기본 설정
axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:8080'; // 환경 변수 또는 기본 값으로 설정

function App() {
  return (
    <AuthProvider> {/* AuthProvider로 전체 앱을 감싸기 */}
      <ThemeProvider theme={theme}>
        <Router>
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/profile" element={<UserProfilePage />} />
            <Route path="/memo" element={<MemoPage />} />
            <Route path="/setting" element={<Setting />} />
          </Routes>
        </Router>
        <div className="bird-image" /> {/* 새 이미지가 고정되는 요소 */}
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
