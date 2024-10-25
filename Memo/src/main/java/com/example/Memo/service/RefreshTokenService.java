package com.example.Memo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.Memo.security.JwtUtil;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;

@Service
public class RefreshTokenService {

    @Autowired
    private JwtUtil jwtUtils;

    public String verifyAndGenerateNewAccessToken(String refreshToken) throws Exception {
        try {
            // 리프레시 토큰 검증
            Claims claims = jwtUtils.getClaimsFromToken(refreshToken);
            if (claims.get("type", String.class).equals("refresh")) {
                // 리프레시 토큰이 유효하다면 새로운 액세스 토큰을 생성
                String username = claims.getSubject();
                return jwtUtils.generateAccessToken(username);
            } else {
                throw new Exception("유효하지 않은 리프레시 토큰 타입입니다.");
            }
        } catch (ExpiredJwtException e) {
            throw new Exception("리프레시 토큰이 만료되었습니다.");
        } catch (Exception e) {
            throw new Exception("리프레시 토큰 검증 실패");
        }
    }
}
