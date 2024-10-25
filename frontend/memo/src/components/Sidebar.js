// Sidebar.js 컴포넌트 생성 (새로운 파일로 추가)
// components/Sidebar.js
import React from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate 훅 추가
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, Tooltip, Typography } from '@mui/material';
import NoteIcon from '@mui/icons-material/Note';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

// Sidebar.js
const Sidebar = ({ onLogout, onSearchToggle }) => { // onSearchToggle prop 추가
  const navigate = useNavigate(); // useNavigate 훅 사용

  const menuItems = [
    { text: '메모', icon: <NoteIcon />, action: () => navigate('/') },
    { text: '검색', icon: <SearchIcon />, action: onSearchToggle }, // 검색 클릭 시 onSearchToggle 호출
    { text: '내 정보', icon: <PersonIcon />, action: () => navigate('/profile') }, // 내 정보 클릭 시 UserProfilePage로 이동
    { text: '설정', icon: <SettingsIcon />, action: () => navigate('/setting') },
    { text: '로그아웃', icon: <ExitToAppIcon />, action: onLogout },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 100,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 100,
          boxSizing: 'border-box',
          backgroundColor: '#283593', // 진한 파란색으로 배경 설정
          color: '#fff',
        },
      }}
    >
      <List>
        {menuItems.map((item, index) => (
          <Tooltip key={index} title={item.text} placement="right">
            <ListItem disablePadding>
              <ListItemButton
                onClick={item.action}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: 2,
                  '&:hover': {
                    backgroundColor: '#3949ab', // 더 진한 파란색으로 호버 효과
                  },
                }}
              >
                <ListItemIcon sx={{ color: '#fff', minWidth: 'unset' }}>{item.icon}</ListItemIcon>
                <Typography variant="caption" sx={{ color: '#fff', marginTop: 1 }}>
                  {item.text}
                </Typography>
              </ListItemButton>
            </ListItem>
          </Tooltip>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
