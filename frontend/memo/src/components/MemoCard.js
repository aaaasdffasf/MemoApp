import React, { useState } from 'react';
import {
  Card, CardContent, Typography, Box, CardActions, IconButton, Divider, TextField, Button, Paper
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import DownloadIcon from '@mui/icons-material/Download';
import { deleteMemo, updateMemo, downloadFile } from '../api/memoApi';

const MemoCard = ({ memo, token, onDeleteSuccess, onUpdateSuccess }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(memo.title);
  const [content, setContent] = useState(memo.content);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleDeleteMemo = async () => {
    setIsDeleting(true);
    try {
      await deleteMemo(memo.id, token);
      alert('메모가 성공적으로 삭제되었습니다.');
      if (onDeleteSuccess) {
        onDeleteSuccess(memo.id);
      }
    } catch (error) {
      console.error('메모 삭제 중 오류 발생:', error);
      if (error.response && error.response.status === 403) {
        alert('메모 삭제 권한이 없습니다.');
      } else {
        alert('메모 삭제 중 오류가 발생했습니다.');
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditMemo = () => {
    setIsEditing(true);
  };

  const handleUpdateMemo = async () => {
    setIsUpdating(true);
    try {
      const updatedMemo = await updateMemo(memo.id, { title, content });
      alert('메모가 성공적으로 수정되었습니다.');
      if (onUpdateSuccess) {
        onUpdateSuccess(updatedMemo);
      }
      setIsEditing(false);
    } catch (error) {
      console.error('메모 수정 중 오류 발생:', error);
      alert('메모 수정 중 오류가 발생했습니다.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setTitle(memo.title);
    setContent(memo.content);
  };

  const handleDownloadFile = async () => {
    try {
      const filename = memo.filePath.split('/').pop(); // 파일 이름 추출
      await downloadFile(filename); // 파일 다운로드 함수 호출
    } catch (error) {
      console.error('파일 다운로드 중 오류 발생:', error);
      alert('파일 다운로드 중 오류가 발생했습니다.');
    }
  };

  return (
    <Card
      sx={{
        marginBottom: 2,
        borderRadius: 3,
        boxShadow: 4,
        transition: 'transform 0.3s, box-shadow 0.3s',
        '&:hover': {
          transform: 'scale(1.02)',
          boxShadow: 6,
        },
        backgroundColor: '#f9f9f9',
      }}
    >
      {isEditing ? (
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            borderRadius: 3,
            backgroundColor: '#fdfdfd',
            maxWidth: 600,
            mx: 'auto',
            my: 4,
          }}
        >
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold', color: '#333', textAlign: 'center' }}>
            메모 수정
          </Typography>
          <Divider sx={{ mb: 3 }} />
          <TextField
            label="제목"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            variant="outlined"
            sx={{ marginBottom: 3 }}
          />
          <TextField
            label="내용"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            multiline
            rows={4}
            fullWidth
            variant="outlined"
            sx={{ marginBottom: 3 }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              onClick={handleCancelEdit}
              variant="outlined"
              color="error"
              sx={{ marginRight: 2, textTransform: 'none', fontWeight: 'bold' }}
              disabled={isUpdating}
            >
              취소
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpdateMemo}
              sx={{ textTransform: 'none', fontWeight: 'bold' }}
              disabled={isUpdating}
            >
              {isUpdating ? '업데이트 중...' : '저장'}
            </Button>
          </Box>
        </Paper>
      ) : (
        <>
          <CardContent>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#333' }}>
              {memo.title}
            </Typography>
            <Typography variant="body2" sx={{ color: '#555', mt: 1, mb: 1 }}>
              {memo.content.length > 100 ? `${memo.content.substring(0, 100)}...` : memo.content}
            </Typography>
            {memo.filePath && (
              <Typography variant="caption" sx={{ color: '#888' }}>
                첨부 파일이 있습니다.
              </Typography>
            )}
          </CardContent>
          <Divider />
          <CardActions sx={{ display: 'flex', justifyContent: 'space-between', p: 1 }}>
            <Box>
              <Typography variant="caption" sx={{ color: '#aaa' }}>
                {new Date(memo.createdAt).toLocaleDateString()}
              </Typography>
            </Box>
            <Box>
              <IconButton
                onClick={handleEditMemo}
                disabled={isDeleting}
                color="primary"
              >
                <EditIcon />
              </IconButton>
              <IconButton
                onClick={handleDeleteMemo}
                disabled={isDeleting}
                color="error"
              >
                <DeleteIcon />
              </IconButton>
              {memo.filePath && (
                <IconButton
                  onClick={handleDownloadFile}
                  disabled={isDeleting}
                  color="secondary"
                >
                  <DownloadIcon />
                </IconButton>
              )}
            </Box>
          </CardActions>
        </>
      )}
    </Card>
  );
};

export default MemoCard;
