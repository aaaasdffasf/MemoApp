// MemoSearch.js
import React from 'react';
import { TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const MemoSearch = ({ searchTerm, onSearchChange }) => {
  return (
    <TextField
      variant="outlined"
      fullWidth
      placeholder="검색어를 입력하세요"
      value={searchTerm}
      onChange={(e) => onSearchChange(e.target.value)} // 검색어 변경 시 부모 컴포넌트에 전달
      sx={{
        marginBottom: 2,
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
        '& .MuiOutlinedInput-root': {
          '& fieldset': {
            borderColor: '#ccc',
          },
          '&:hover fieldset': {
            borderColor: '#888',
          },
          '&.Mui-focused fieldset': {
            borderColor: '#1976d2',
          },
        },
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon sx={{ color: '#888' }} />
          </InputAdornment>
        ),
      }}
    />
  );
};

export default MemoSearch;
