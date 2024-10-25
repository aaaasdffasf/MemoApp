import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography, Container, Alert, Avatar } from '@mui/material';
import { register as apiRegister } from '../api/authApi';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'; // 아이콘 추가
import './RegisterPage.css'; // 추가적인 CSS가 필요하면 여기에 연결

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setErrorMessage('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
      return;
    }

    try {
      await apiRegister({ username, email, password });
      navigate('/login'); // 회원가입 성공 후 로그인 페이지로 이동
    } catch (error) {
      console.error("회원가입 실패", error.response ? error.response.data : error.message);
      if (error.response) {
        switch (error.response.status) {
          case 400:
            setErrorMessage("잘못된 입력입니다. 모든 필드를 올바르게 입력하세요.");
            break;
          case 409:
            setErrorMessage("이미 존재하는 사용자입니다.");
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
    <Container
      maxWidth="xs"
      sx={{
        height: '100vh', // 전체 높이를 화면에 맞춤
        display: 'flex', // 중앙 정렬을 위한 flexbox 설정
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: 3,
          border: '1px solid #ccc',
          borderRadius: 2,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', // 박스 그림자 추가
          backgroundColor: '#fff', // 배경색 추가
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
          회원가입
        </Typography>
        <form onSubmit={handleRegister} style={{ width: '100%' }}>
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
            label="이메일"
            variant="outlined"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            type="email"
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
          <TextField
            fullWidth
            label="비밀번호 확인"
            variant="outlined"
            type="password"
            margin="normal"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
            회원가입
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
          onClick={() => navigate('/login')}
          sx={{
            padding: '10px',
            borderColor: '#1976d2',
            color: '#1976d2',
            '&:hover': { backgroundColor: '#e3f2fd' },
          }}
        >
          로그인하기
        </Button>
      </Box>
    </Container>
  );
};

export default RegisterPage
