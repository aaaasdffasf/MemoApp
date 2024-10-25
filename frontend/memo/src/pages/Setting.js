import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography, Alert, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { deleteUser } from '../api/authApi'; // 탈퇴 API 가져오기
import { AuthContext } from '../context/AuthContext';
import Sidebar from '../components/Sidebar'; // Sidebar 컴포넌트 가져오기

const Setting = () => {
  const { token, logout } = useContext(AuthContext); // AuthContext에서 logout 함수 가져오기
  const [errorMessage, setErrorMessage] = useState('');
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleDeleteAccount = async () => {
    try {
      await deleteUser(token); // API 호출로 사용자 삭제
      logout(); // 로그아웃 처리
      navigate('/login'); // 로그인 페이지로 이동
    } catch (error) {
      console.error('탈퇴 실패', error);
      setErrorMessage('탈퇴 중 문제가 발생했습니다. 다시 시도해주세요.');
    }
  };

  const handleOpenDialog = () => {
    setOpen(true); // 확인 대화 상자 열기
  };

  const handleCloseDialog = () => {
    setOpen(false); // 확인 대화 상자 닫기
  };

  const handleLogout = () => {
    logout(); // 로그아웃 실행
    navigate('/login'); // 로그아웃 후 로그인 페이지로 이동
  };

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Sidebar */}
      <Sidebar onLogout={handleLogout} /> {/* Sidebar에 onLogout prop 전달 */}

      {/* 메인 콘텐츠 영역 */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h4" gutterBottom>
          계정 설정
        </Typography>

        {errorMessage && <Alert severity="error" sx={{ mt: 2 }}>{errorMessage}</Alert>}

        <Button variant="contained" color="error" sx={{ mt: 4 }} onClick={handleOpenDialog}>
          계정 탈퇴
        </Button>

        {/* 탈퇴 확인 대화 상자 */}
        <Dialog open={open} onClose={handleCloseDialog}>
          <DialogTitle>계정 탈퇴</DialogTitle>
          <DialogContent>
            <DialogContentText>
              정말로 계정을 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">취소</Button>
            <Button onClick={handleDeleteAccount} color="error">탈퇴</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default Setting;
