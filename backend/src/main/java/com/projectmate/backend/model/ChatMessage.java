package com.projectmate.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessage {
    private Long senderId;
    private Long projectId;
    private String content;
    private LocalDateTime timestamp;
}
