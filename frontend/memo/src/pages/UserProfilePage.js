import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { TextField, Button, Container, Typography, Box, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const UserProfilePage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get('/api/user/profile', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        const { username, email } = response.data;
        setUsername(username);
        setEmail(email);
      } catch (error) {
        console.error('사용자 정보를 불러오는 중 오류 발생:', error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      if (password.trim()) {
        const updatedData = { password };

        await axios.put('/api/user/profile', updatedData, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });

        alert('프로필이 업데이트되었습니다.');
        navigate('/');
      } else {
        alert('변경할 비밀번호를 입력하세요.');
      }
    } catch (error) {
      console.error('프로필 업데이트 중 오류 발생:', error);
      alert('프로필 업데이트에 실패했습니다.');
    }
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* 사이드바 */}
      <Sidebar
        onLogout={() => {
          localStorage.removeItem('token');
          navigate('/login');
        }}
      />

      {/* 사용자 프로필 정보 */}
      <Container
        maxWidth="sm"
        sx={{
          flexGrow: 1,
          p: 3,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          
          borderRadius: 3,
        }}
      >
        <Card sx={{ width: '100%', boxShadow: 4, borderRadius: 3 }}>
          <CardContent>
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                내 정보
              </Typography>
              <form onSubmit={handleProfileUpdate} style={{ marginTop: 20 }}>
                <TextField
                  label="아이디"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={username}
                  disabled
                  sx={{ borderRadius: 2 }}
                />
                <TextField
                  label="이메일"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={email}
                  disabled
                  sx={{ borderRadius: 2 }}
                />
                <TextField
                  label="비밀번호 변경 (옵션)"
                  variant="outlined"
                  type="password"
                  fullWidth
                  margin="normal"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  sx={{borderRadius: 2 }}
                />
                <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 3, p: 1.5 }}>
                  업데이트 저장
                </Button>
              </form>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default UserProfilePage;
