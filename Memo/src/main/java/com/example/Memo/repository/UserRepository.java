package com.example.Memo.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.Memo.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {
    // 사용자 이름으로 사용자를 찾는 메서드 정의
    Optional<User> findByUsername(String username);

    // 사용자 이름으로 사용자의 존재 여부를 확인하는 메서드 정의
    boolean existsByUsername(String username);
}
