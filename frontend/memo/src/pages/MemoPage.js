import React, { useEffect, useState, useContext } from 'react';
import api from '../api/api';
import { Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddMemoForm from '../components/AddMemoForm';
import { AuthContext } from '../context/AuthContext';
import MemoCard from '../components/MemoCard';

const MemoPage = () => {
  const [memos, setMemos] = useState([]); // 메모 상태를 관리하는 배열
  const navigate = useNavigate();
  const { user, token } = useContext(AuthContext); // user와 token 가져오기

  useEffect(() => {
    if (user && token && token !== 'null' && token.trim() !== '') {
      fetchMemos();
    }
  }, [user, token]); // user와 token을 의존성 배열에 추가

  const fetchMemos = async () => {
    try {
      const response = await api.get('/api/memos');
      setMemos(response.data); // 메모 상태 업데이트
    } catch (error) {
      console.error('메모 목록을 불러오는 중 오류 발생:', error);
      if (error.response && error.response.status === 401) {
        alert('로그인이 필요합니다.');
      }
    }
  };

  const handleMemoAdded = () => {
    fetchMemos(); // 메모 리스트를 갱신
    navigate('/'); // 메모 추가 후 메인 페이지로 이동
  };

  const handleEditSuccess = (updatedMemo) => {
    setMemos((prevMemos) =>
      prevMemos.map((memo) => (memo.id === updatedMemo.id ? updatedMemo : memo))
    );
  };

  return (
    <div>
      <AddMemoForm onMemoAdded={handleMemoAdded} /> {/* 메모 추가 후 handleMemoAdded 호출 */}

      <Grid container spacing={2} sx={{ marginTop: 2 }}>
        {memos.map((memo) => (
          <Grid item xs={12} sm={6} md={4} key={memo.id}>
            <MemoCard
              memo={memo}
              token={token}
              onDeleteSuccess={(deletedMemoId) => setMemos((prevMemos) => prevMemos.filter((m) => m.id !== deletedMemoId))}
              onUpdateSuccess={handleEditSuccess}
            />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default MemoPage;
