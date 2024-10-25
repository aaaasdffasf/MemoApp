package com.example.Memo.service;

import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.stereotype.Service;

import com.example.Memo.entity.Memo;
import com.example.Memo.entity.User;
import com.example.Memo.repository.MemoRepository;

@Service
public class MemoService {

    private final MemoRepository memoRepository;

    public MemoService(MemoRepository memoRepository) {
        this.memoRepository = memoRepository;
    }

    public Memo findById(Long id) {
        // 기존에 MemoNotFoundException을 사용하던 부분을 NoSuchElementException으로 대체
        return memoRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Memo not found with id: " + id));
    }

    public List<Memo> findByUser(User user) {
        return memoRepository.findByUser(user);
    }

    public List<Memo> getAllMemos() {
        return memoRepository.findAll();
    }

    public Memo saveMemo(Memo memo) {
        return memoRepository.save(memo);
    }

    public List<Memo> searchMemos(String keyword) {
        return memoRepository.findByTitleContainingOrContentContaining(keyword, keyword);
    }

    public List<Memo> searchMemosByUserAndKeyword(User user, String keyword) {
        return memoRepository.findByUserAndTitleContainingOrContentContaining(user, keyword, keyword);
    }

    public void deleteMemo(Long id) {
        Memo memo = memoRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Memo not found with id: " + id));
        memoRepository.delete(memo);
    }


    // 메모의 소유자인지 확인하는 메서드 추가
    public boolean isOwner(Long memoId, String username) {
        Memo memo = memoRepository.findById(memoId)
                .orElseThrow(() -> new NoSuchElementException("Memo not found with id: " + memoId));
        return memo.getUser().getUsername().equals(username);
    }
}
