package com.example.Memo.controller;

import java.security.Principal;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import jakarta.transaction.Transactional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.Memo.dto.MemoDTO;
import com.example.Memo.entity.Memo;
import com.example.Memo.entity.User;
import com.example.Memo.service.MemoService;
import com.example.Memo.service.UserService;

@RestController
@RequestMapping("/api/memos")
public class MemoController {

    private final MemoService memoService;
    private final UserService userService;

    public MemoController(MemoService memoService, UserService userService) {
        this.memoService = memoService;
        this.userService = userService;
    }

    // 과제사용자의 메모 목록 조회
    @GetMapping
    public ResponseEntity<?> getUserMemos(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("\ub85c\uadf8\uc778\uc774 \ud544\uc694\ud569\ub2c8\ub2e4.");
        }

        String username = principal.getName();
        User user = userService.findByUsername(username);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("\uc0ac\uc6a9\uc790\ub97c \ucc3e\uc744 \uc218 \uc5c6\uc2b5\ub2c8\ub2e4.");
        }
        List<Memo> memos = memoService.findByUser(user);
        return ResponseEntity.ok(memos);
    }

    // 특정 키워드로 메모 검색
    @GetMapping("/search")
    public ResponseEntity<?> searchMemos(@RequestParam String keyword, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("\ub85c\uadf8\uc778\uc774 \ud544\uc694\ud569\ub2c8\ub2e4.");
        }

        String username = principal.getName();
        User user = userService.findByUsername(username);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("\uc0ac\uc6a9\uc790\ub97c \ucc3e\uc744 \uc218 \uc5c6\uc2b5\ub2c8\ub2e4.");
        }
        List<Memo> memos = memoService.searchMemosByUserAndKeyword(user, keyword);
        return ResponseEntity.ok(memos);
    }

    // 메모 생성
    @PostMapping
    public ResponseEntity<?> createMemo(@RequestBody MemoDTO memoDTO, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("\ub85c\uadf8\uc778\uc774 \ud544\uc694\ud569\ub2c8\ub2e4.");
        }

        String username = principal.getName();
        User user = userService.findByUsername(username);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("\uc0ac\uc6a9\uc790\ub97c \ucc3e\uc744 \uc218 \uc5c6\uc2b5\ub2c8\ub2e4.");
        }

        // Memo 객체 생성 및 설정
        Memo memo = new Memo();
        memo.setTitle(memoDTO.getTitle());
        memo.setContent(memoDTO.getContent());
        memo.setUser(user);  // 메모에 사용자 설정

        Memo createdMemo = memoService.saveMemo(memo);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdMemo); // 메모 생성 후 201 발행
    }

    // 메모 삭제
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<?> deleteMemo(@PathVariable("id") Long id, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("\ub85c\uadf8\uc778\uc774 \ud544\uc694\ud569\ub2c8\ub2e4.");
        }

        if (memoService.isOwner(id, principal.getName())) {
            memoService.deleteMemo(id);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You are not the owner of this memo");
        }
    }

    // 메모 업데이트
    @PutMapping("/{id}")
    @Transactional
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<?> updateMemo(@PathVariable("id") Long id, @RequestBody MemoDTO updatedMemoDTO, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        }

        String username = principal.getName();
        User user = userService.findByUsername(username);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("사용자를 찾을 수 없습니다.");
        }

        try {
            // Optional을 사용하지 않고 바로 Memo로 처리
            Memo existingMemo = memoService.findById(id);
            if (existingMemo == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("해당 메모를 찾을 수 없습니다.");
            }

            // 메모 소유자 확인
            if (!existingMemo.getUser().equals(user)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("접근 권한이 없습니다.");
            }

            // 메모 업데이트
            existingMemo.setTitle(updatedMemoDTO.getTitle());
            existingMemo.setContent(updatedMemoDTO.getContent());

            Memo savedMemo = memoService.saveMemo(existingMemo);
            return ResponseEntity.ok(savedMemo);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("해당 메모를 찾을 수 없습니다.");
        }
    }
}
    
