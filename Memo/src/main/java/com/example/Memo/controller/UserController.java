package com.example.Memo.controller;

import com.example.Memo.dto.UserDTO;
import com.example.Memo.entity.User;
import com.example.Memo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserService userService;

    // 사용자 정보 조회
    @GetMapping("/profile")
    public ResponseEntity<UserDTO> getUserProfile(@AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails.getUsername();
        User user = userService.getUserByUsername(username);
        UserDTO userDTO = new UserDTO(user.getId(), user.getUsername(), user.getEmail(), null); // 비밀번호는 조회 시에 제공하지 않음
        return ResponseEntity.ok(userDTO);
    }

    // 사용자 정보 수정
    @PutMapping("/profile")
    public ResponseEntity<String> updateUserProfile(
            @RequestBody UserDTO userDTO
    ) {
        try {
            // 이메일과 비밀번호 업데이트
            userService.updateUserProfile(userDTO.getEmail(), userDTO.getPassword());
            return ResponseEntity.ok("프로필이 성공적으로 업데이트되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.status(400).body("프로필 업데이트에 실패했습니다.");
        }
    }
}
