package com.projectmate.controller;

import java.time.LocalDateTime;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;

import com.projectmate.model.TeamMessage;
import com.projectmate.repository.TeamMessageRepository;
import com.projectmate.service.GeminiService;

@Controller
@CrossOrigin(origins = "*")
public class ChatController {

    private final TeamMessageRepository teamMessageRepository;
    private final GeminiService geminiService;
    private final SimpMessagingTemplate messagingTemplate;

    public ChatController(TeamMessageRepository teamMessageRepository, GeminiService geminiService, SimpMessagingTemplate messagingTemplate) {
        this.teamMessageRepository = teamMessageRepository;
        this.geminiService = geminiService;
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/chat/{projectId}/{roomType}")
    public void sendMessage(@DestinationVariable Long projectId, @DestinationVariable String roomType, @Payload TeamMessage message) {
        message.setProjectId(projectId);
        message.setRoomType(roomType);
        message.setTimestamp(LocalDateTime.now());
        TeamMessage savedMessage = teamMessageRepository.save(message);

        messagingTemplate.convertAndSend("/topic/chat/" + projectId + "/" + roomType, savedMessage);

        if ("AI".equalsIgnoreCase(roomType)) {
            String hint = geminiService.generateDebugHint(message.getContent());

            TeamMessage aiResponse = new TeamMessage();
            aiResponse.setProjectId(projectId);
            aiResponse.setRoomType("AI");
            aiResponse.setSenderId(-1L);
            aiResponse.setSenderName("AI Tech Lead");
            aiResponse.setContent(hint);
            aiResponse.setTimestamp(LocalDateTime.now());
            TeamMessage savedAiMessage = teamMessageRepository.save(aiResponse);

            messagingTemplate.convertAndSend("/topic/chat/" + projectId + "/AI", savedAiMessage);
        }
    }
}
