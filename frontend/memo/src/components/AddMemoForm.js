// AddMemoForm.js

import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper, Divider } from '@mui/material';
import axios from 'axios';
import ReactQuill from 'react-quill'; // Quill 에디터 추가
import 'react-quill/dist/quill.snow.css'; // Quill의 기본 스타일 추가

const AddMemoForm = ({ onMemoAdded }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState(''); // 이제 content는 Quill 에디터에서 입력받습니다.
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // JWT 토큰 가져오기 (localStorage에서 가져온다고 가정)
    const token = localStorage.getItem('token'); // 이 부분은 토큰이 저장된 위치에 따라 다를 수 있습니다.

    try {
      // 1. 메모 추가 요청
      const newMemo = { title, content };
      const memoResponse = await axios.post('/api/memos', newMemo, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const memoId = memoResponse.data.id;

      // 2. 파일 업로드 요청 (메모와 연관)
      if (selectedFile) {
        const formData = new FormData();
        formData.append('file', selectedFile);

        await axios.post(`/api/files/upload/${memoId}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      // 메모 추가 후 상태 초기화 및 콜백 호출
      onMemoAdded();
      setTitle('');
      setContent('');
      setSelectedFile(null);
      setError('');
    } catch (error) {
      console.error('메모 추가 중 오류 발생:', error);
      setError('메모 추가 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  return (
    <Paper
      component="form"
      onSubmit={handleSubmit}
      elevation={3}
      sx={{
        p: 3,
        borderRadius: 3,
        backgroundColor: '#fafafa',
        maxWidth: 600,
        mx: 'auto',
        my: 4,
      }}
    >
      <Typography variant="h5" sx={{ mb: 2, textAlign: 'center', fontWeight: 'bold', color: '#333' }}>
        메모 추가
      </Typography>
      <Divider sx={{ mb: 3 }} />
      <TextField
        label="제목"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
        sx={{ mb: 3 }}
        required
        variant="outlined"
      />
      {/* Quill 에디터 추가 */}
      <ReactQuill
        value={content}
        onChange={setContent}
        theme="snow"
        placeholder="내용을 입력하세요..."
        style={{ marginBottom: '24px', height: '200px' }}
      />
      <Button
        variant="outlined"
        component="label"
        fullWidth
        sx={{
          mb: 2,
          p: 1,
          borderColor: '#6b5b5b',
          color: '#6b5b5b',
          textTransform: 'none',
          '&:hover': {
            backgroundColor: '#f1f1f1',
          },
        }}
      >
        파일 선택
        <input type="file" hidden onChange={handleFileChange} />
      </Button>
      {selectedFile && (
        <Typography variant="body2" sx={{ mb: 2, color: '#555' }}>
          선택된 파일: {selectedFile.name}
        </Typography>
      )}
      <Button
        type="submit"
        variant="contained"
        fullWidth
        sx={{
          mt: 1,
          p: 1.5,
          backgroundColor: '#6b5b5b',
          '&:hover': {
            backgroundColor: '#555151',
          },
          textTransform: 'none',
          fontWeight: 'bold',
        }}
        disabled={!title || !content}
      >
        메모 추가
      </Button>
      {error && (
        <Box sx={{ color: 'red', mt: 3, textAlign: 'center' }}>
          {error}
        </Box>
      )}
    </Paper>
  );
};

export default AddMemoForm;
