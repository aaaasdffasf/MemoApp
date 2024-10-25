// 필요한 import 추가
import axios from 'axios';
import api from './api';

// API URL 설정
const MEMO_API_URL = '/api/memos';
const API_BASE_URL = '/api/files';

// 전체 메모를 가져오는 함수
export const getMemos = async () => {
  try {
    const response = await api.get(MEMO_API_URL, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch memos", error);
    throw error;
  }
};

// 새 메모 추가 함수
export const addMemo = async (newMemo) => {
  try {
    const response = await api.post(MEMO_API_URL, newMemo, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Failed to add memo", error);
    throw error;
  }
};

// 메모 삭제 함수
export const deleteMemo = async (memoId) => {
  try {
    await api.delete(`${MEMO_API_URL}/${memoId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
  } catch (error) {
    console.error("Failed to delete memo", error);
    throw error;
  }
};

// 메모 업데이트 함수
export const updateMemo = async (memoId, updatedData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${MEMO_API_URL}/${memoId}`, updatedData, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error("Failed to update memo:", error);
    throw error;
  }
};

// 파일 다운로드 함수
export const downloadFile = async (filename) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/download/${filename}`, {
      headers: { 'Authorization': `Bearer ${token}` },
      responseType: 'blob', // 파일을 블롭 데이터로 받음
    });

    if (response.status === 200) {
      // Blob을 URL로 변환
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename); // 다운로드할 파일명 지정

      // 링크를 body에 추가하고 클릭한 후 제거
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // URL을 해제하여 메모리 누수 방지
      window.URL.revokeObjectURL(url);
    } else {
      console.warn(`파일 다운로드 중 오류가 발생했습니다. 상태 코드: ${response.status}`);
    }
  } catch (error) {
    console.error("Failed to download file", error);
    
  }
};
