package com.projectmate.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.projectmate.model.TeamMessage;
import com.projectmate.repository.TeamMessageRepository;

@RestController
@RequestMapping("/api/team-messages")
@CrossOrigin(origins = "*")
public class TeamMessageController {

    private final TeamMessageRepository teamMessageRepository;

    public TeamMessageController(TeamMessageRepository teamMessageRepository) {
        this.teamMessageRepository = teamMessageRepository;
    }

    @GetMapping("/{projectId}/{roomType}")
    public ResponseEntity<List<TeamMessage>> getMessagesByProjectIdAndRoomType(@PathVariable Long projectId, @PathVariable String roomType) {
        return ResponseEntity.ok(teamMessageRepository.findByProjectIdAndRoomTypeOrderByTimestampAsc(projectId, roomType));
    }
}
