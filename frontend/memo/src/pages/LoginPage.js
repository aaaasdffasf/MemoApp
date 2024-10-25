import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography, Container, Alert, Avatar } from '@mui/material';
import AuthContext from '../context/AuthContext';
import { login as apiLogin } from '../api/authApi';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'; // 아이콘 추가
import './LoginPage.css'; // 추가적인 CSS가 필요하면 여기에 연결

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // AuthContext에서 로그인 함수 사용

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await apiLogin(username, password);
      const token = response.data.token;
      login(token); // JWT 토큰 저장 및 사용자 정보 설정
      navigate('/'); // 로그인 후 메인 페이지로 이동
    } catch (error) {
      console.error("로그인 실패", error.response ? error.response.data : error.message);
      if (error.response) {
        switch (error.response.status) {
          case 400:
            setErrorMessage("아이디 또는 비밀번호가 잘못되었습니다.");
            break;
          case 401:
            setErrorMessage("인증에 실패했습니다. 자격 증명을 확인하세요.");
            break;
          case 500:
            setErrorMessage("서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.");
            break;
          default:
            setErrorMessage("알 수 없는 오류가 발생했습니다. 관리자에게 문의하세요.");
        }
      } else {
        setErrorMessage("네트워크 오류가 발생했습니다. 인터넷 연결을 확인하세요.");
      }
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
       // 배경색 추가
      }}
    >
      <Container maxWidth="xs">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            p: 3,
            border: '1px solid #ccc',
            borderRadius: 2,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', // 박스 그림자 추가
            backgroundColor: '#fff', // 배경색
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
            로그인
          </Typography>
          <form onSubmit={handleLogin} style={{ width: '100%' }}>
            <TextField
              fullWidth
              label="아이디"
              variant="outlined"
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              sx={{ backgroundColor: '#f9f9f9', borderRadius: 1 }}
            />
            <TextField
              fullWidth
              label="비밀번호"
              variant="outlined"
              type="password"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              sx={{ backgroundColor: '#f9f9f9', borderRadius: 1 }}
            />
            <Button
              fullWidth
              variant="contained"
              type="submit"
              sx={{
                mt: 2,
                mb: 2,
                padding: '10px',
                backgroundColor: '#1976d2',
                color: '#fff',
                '&:hover': { backgroundColor: '#115293' },
              }}
            >
              로그인하기
            </Button>
          </form>

          {errorMessage && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errorMessage}
            </Alert>
          )}

          <Button
            fullWidth
            variant="outlined"
            onClick={() => navigate('/register')}
            sx={{
              padding: '10px',
              borderColor: '#1976d2',
              color: '#1976d2',
              '&:hover': { backgroundColor: '#e3f2fd' },
            }}
          >
            회원가입
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default LoginPage;
