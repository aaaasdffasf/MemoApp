package com.example.Memo.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.Memo.dto.UserDTO;
import com.example.Memo.entity.AuthRequest;
import com.example.Memo.entity.User;
import com.example.Memo.security.JwtUtil;
import com.example.Memo.service.RefreshTokenService; // 추가된 부분
import com.example.Memo.service.UserService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private RefreshTokenService refreshTokenService; // 추가된 부분

    // 회원가입 엔드포인트
    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody User user) {
        try {
            userService.registerUser(user.getUsername(), user.getPassword(), user.getEmail());
            return ResponseEntity.status(HttpStatus.CREATED).body("User registered successfully");
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // 인증 엔드포인트
    @PostMapping("/authenticate")
    public ResponseEntity<?> authenticateUser(@RequestBody AuthRequest authRequest) {
        try {
            System.out.println("[AuthController] Authenticating user: " + authRequest.getUsername());

            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(authRequest.getUsername(), authRequest.getPassword())
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String token = jwtUtil.generateToken(authentication);

            // 인증 성공 시 로그
            System.out.println("[AuthController] Authentication successful for user: " + authRequest.getUsername());

            return ResponseEntity.ok().body(Map.of(
                "username", authRequest.getUsername(),
                "token", token
            ));
        } catch (Exception e) {
            // 인증 실패 시 로그
            System.err.println("[AuthController] Authentication failed for user: " + authRequest.getUsername() + ". Reason: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
                "message", "Invalid username or password"
            ));
        }
    }

    // 현재 로그인한 사용자 정보 가져오기
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
                "message", "User is not authenticated"
            ));
        }

        // User 엔티티를 UserDTO로 변환하여 반환
        UserDTO userDTO = new UserDTO(user.getId(), user.getUsername(), user.getEmail());

        return ResponseEntity.ok().body(userDTO);
    }
    
    // 리프레시 토큰을 사용한 액세스 토큰 갱신
    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@RequestBody String refreshToken) {
        try {
            String newAccessToken = refreshTokenService.verifyAndGenerateNewAccessToken(refreshToken);
            return ResponseEntity.ok().body(Map.of(
                "accessToken", newAccessToken
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of(
                "message", "리프레시 토큰이 유효하지 않습니다."
            ));
        }
    }
}
