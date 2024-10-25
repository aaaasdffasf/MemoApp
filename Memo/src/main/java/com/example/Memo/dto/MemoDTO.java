package com.example.Memo.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class MemoDTO {
    @NotNull
    @Size(min = 1, max = 255)
    private String title;

    @NotNull
    private String content;

    // Getters and Setters
    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
