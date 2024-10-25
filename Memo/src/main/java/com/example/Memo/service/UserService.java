package com.example.Memo.service;

import java.util.List;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.Memo.entity.User;
import com.example.Memo.repository.UserRepository;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User findByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다: " + username));
    }

    // 기존 코드에서 누락된 부분을 추가합니다.
    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found with username: " + username));
    }

    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    public User registerUser(String username, String password, String email) {
        if (existsByUsername(username)) {
            throw new IllegalStateException("Username already taken");
        }
        String encodedPassword = passwordEncoder.encode(password);
        User user = new User();
        user.setUsername(username);
        user.setPassword(encodedPassword);
        user.setEmail(email);
        user.setRoles("ROLE_USER");

        return userRepository.save(user);
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User authenticateUser(String username, String password) {
        User user = getUserByUsername(username);
        if (user == null) {
            System.err.println("[UserService] User not found: " + username);
            throw new RuntimeException("Invalid username or password");
        }

        if (passwordEncoder.matches(password, user.getPassword())) {
            System.out.println("[UserService] Password matched for user: " + username);
            return user;
        } else {
            System.err.println("[UserService] Password did not match for user: " + username);
            throw new RuntimeException("Invalid username or password");
        }
    }

    public User saveUser(User user) {
        if (user.getPassword() != null && !user.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        }
        return userRepository.save(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found with id: " + id);
        }
        userRepository.deleteById(id);
    }

    // 인증된 현재 사용자를 반환하는 메소드
    public User getCurrentUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        
        if (principal instanceof UserDetails) {
            String username = ((UserDetails) principal).getUsername();
            return userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found with username: " + username));
        } else {
            throw new IllegalStateException("User not authenticated");
        }
    }

    // 사용자 프로필 업데이트 메소드 추가
    public User updateUserProfile(String email, String password) {
        // 현재 인증된 사용자 가져오기
        User currentUser = getCurrentUser();
        
        // 이메일 업데이트
        if (email != null && !email.isEmpty()) {
            currentUser.setEmail(email);
        }

        // 비밀번호 업데이트 (비어있지 않은 경우에만)
        if (password != null && !password.isEmpty()) {
            currentUser.setPassword(passwordEncoder.encode(password));
        }

        // 변경된 사용자 정보를 저장
        return userRepository.save(currentUser);
    }
}
