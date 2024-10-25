// UserDTO.java
package com.example.Memo.dto;

public class UserDTO {
    private Long id; // id 추가
    private String username;
    private String email;
    private String password; // 비밀번호 필드 추가

    // 기본 생성자
    public UserDTO() {}

    // 모든 필드를 포함하는 생성자
    public UserDTO(Long id, String username, String email, String password) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
    }

    // 비밀번호를 제외한 생성자 추가 (필요에 따라 사용)
    public UserDTO(Long id, String username, String email) {
        this.id = id;
        this.username = username;
        this.email = email;
    }

    // Getter 및 Setter
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
