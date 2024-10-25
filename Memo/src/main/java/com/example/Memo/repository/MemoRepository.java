package com.example.Memo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.Memo.entity.Memo;
import com.example.Memo.entity.User;

public interface MemoRepository extends JpaRepository<Memo, Long> {
    List<Memo> findByUser(User user);
    List<Memo> findByTitleContainingOrContentContaining(String titleKeyword, String contentKeyword);
    List<Memo> findByUserAndTitleContainingOrContentContaining(User user, String titleKeyword, String contentKeyword);
}
