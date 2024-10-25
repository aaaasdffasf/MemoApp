package com.example.Memo.controller;

import com.example.Memo.entity.Memo;
import com.example.Memo.repository.MemoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/api/files")
public class FileController {

    @Autowired
    private MemoRepository memoRepository;

    @PostMapping("/upload/{id}")
    public ResponseEntity<String> uploadFileWithId(@RequestParam("file") MultipartFile file, @PathVariable("id") Long id) {
        try {
            // 파일 저장
            String uploadDirectory = System.getProperty("user.dir") + "/uploads";
            File uploadDir = new File(uploadDirectory);
            if (!uploadDir.exists()) {
                uploadDir.mkdir();
            }

            String filePath = uploadDirectory + "/" + file.getOriginalFilename();
            file.transferTo(new File(filePath));

            // 파일 경로를 Memo 엔티티에 설정
            Memo memo = memoRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("메모를 찾을 수 없습니다. ID: " + id));
            memo.setFilePath(filePath); // 여기서 오류가 없어야 합니다.

            // 변경사항 저장
            memoRepository.save(memo);

            return ResponseEntity.ok("File uploaded successfully with id: " + id);
        } catch (IOException e) {
            return ResponseEntity.status(500).body("File upload failed with id: " + id);
        }
    }

    @GetMapping("/download/{filename}")
    public ResponseEntity<Resource> downloadFile(@PathVariable("filename") String filename) {
        try {
            // 파일 경로 지정 - 경로에 있는 공백을 인코딩
            Path filePath = Paths.get("uploads", filename).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() && resource.isReadable()) {
                String encodedFileName = java.net.URLEncoder.encode(resource.getFilename(), "UTF-8").replaceAll("\\+", "%20");
                return ResponseEntity.ok()
                        .contentType(MediaType.APPLICATION_OCTET_STREAM)
                        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + encodedFileName + "\"")
                        .body(resource);
            } else {
                return ResponseEntity.status(404).body(null);
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }


}
