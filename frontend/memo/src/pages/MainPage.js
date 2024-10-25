import React, { useState, useEffect, useCallback, useContext } from 'react';
import {
  Box, Grid, Button, Typography, CircularProgress, Avatar,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getMemos } from '../api/memoApi';
import Sidebar from '../components/Sidebar';
import MemoCard from '../components/MemoCard';
import MemoSearch from '../components/MemoSearch';  // MemoSearch 컴포넌트 가져오기

const MainPage = () => {
  const [memos, setMemos] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // 검색어 상태 추가
  const [isSearchOpen, setIsSearchOpen] = useState(false); // 검색창 열림 상태 추가
  const navigate = useNavigate();
  const { user, token, logout, loading } = useContext(AuthContext);

  const fetchMemos = useCallback(async () => {
    try {
      const fetchedMemos = await getMemos(token);
      setMemos(fetchedMemos);
    } catch (error) {
      console.error('메모를 가져오는 중 오류 발생:', error);
      alert('메모를 가져오는 중 오류가 발생했습니다.');
    }
  }, [token]);

  useEffect(() => {
    if (!loading) {
      if (token) {
        fetchMemos();
      } else {
        navigate('/login');
      }
    }
  }, [token, loading, navigate, fetchMemos]);

  const handleAddMemo = () => {
    navigate('/memo');
  };

  const handleDeleteSuccess = (deletedId) => {
    setMemos((prevMemos) => prevMemos.filter((memo) => memo.id !== deletedId));
  };

  const handleEditSuccess = (updatedMemo) => {
    setMemos((prevMemos) =>
      prevMemos.map((memo) =>
        memo.id === updatedMemo.id ? updatedMemo : memo
      )
    );
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSearchToggle = () => {
    setIsSearchOpen(!isSearchOpen); // 검색창 열고 닫는 상태 변경
  };

  // 검색어에 따른 필터링된 메모들
  const filteredMemos = memos.filter((memo) =>
    memo.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex' }}>
      {/* 사이드바 */}
      <Sidebar onLogout={handleLogout} onSearchToggle={handleSearchToggle} />

      {/* 메모 리스트 */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h4">Memo App</Typography>

        {user ? (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              padding: 2,
              border: '1px solid #ccc',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              backgroundColor: '#f9f9f9',
              marginBottom: 3,
            }}
          >
            <Avatar
              src="/path-to-profile-picture" // 사용자 프로필 사진 경로
              alt={user.username}
              sx={{
                width: 80,
                height: 80,
                marginRight: 2,
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
              }}
            />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333', marginBottom: 1 }}>
                {user.username}
              </Typography>
              <Typography variant="body2" sx={{ color: '#666' }}>
                {user.email}
              </Typography>
            </Box>
          </Box>
        ) : (
          <Typography>Please log in to see your information.</Typography>
        )}

        {isSearchOpen && ( // 검색창이 열렸을 때만 MemoSearch 컴포넌트 표시
          <MemoSearch searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        )}

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{ marginBottom: 2 }}
          onClick={handleAddMemo}
        >
          새 메모 추가
        </Button>

        {filteredMemos.length > 0 ? (
          <Grid container spacing={2}>
            {filteredMemos.map((memo) => (
              <Grid item xs={12} sm={6} md={4} key={memo.id}>
                <MemoCard
                  memo={memo}
                  token={token}
                  onDeleteSuccess={handleDeleteSuccess}
                  onUpdateSuccess={handleEditSuccess} // 수정 성공 시 호출될 함수 전달
                />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography>메모가 없습니다. 새 메모를 추가하세요!</Typography>
        )}
      </Box>
    </Box>
  );
};

export default MainPage;
