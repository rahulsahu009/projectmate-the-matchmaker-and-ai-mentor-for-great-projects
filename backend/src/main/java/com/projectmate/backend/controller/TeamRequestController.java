package com.projectmate.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.projectmate.dto.TeamRequestDTO;
import com.projectmate.model.TeamRequest;
import com.projectmate.model.TeamRequestStatus;
import com.projectmate.service.TeamRequestService;

@RestController
@RequestMapping("/api/team-requests")
@CrossOrigin(origins = "*")
public class TeamRequestController {

    private final TeamRequestService teamRequestService;

    public TeamRequestController(TeamRequestService teamRequestService) {
        this.teamRequestService = teamRequestService;
    }

    @PostMapping
    public ResponseEntity<TeamRequest> sendRequest(@RequestHeader("Authorization") String token, @RequestBody TeamRequestDTO dto) {
        Long userId = Long.parseLong(token.replace("Bearer token-", ""));
        return ResponseEntity.ok(teamRequestService.sendRequest(userId, dto.getProjectId()));
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<TeamRequest>> getProjectRequests(@PathVariable Long projectId) {
        return ResponseEntity.ok(teamRequestService.getRequestsForProject(projectId));
    }

    @GetMapping("/user")
    public ResponseEntity<List<TeamRequest>> getUserRequests(@RequestHeader("Authorization") String token) {
        Long userId = Long.parseLong(token.replace("Bearer token-", ""));
        return ResponseEntity.ok(teamRequestService.getRequestsForUser(userId));
    }

    @PatchMapping("/{requestId}")
    public ResponseEntity<TeamRequest> updateRequestStatus(
            @RequestHeader("Authorization") String token,
            @PathVariable Long requestId,
            @RequestParam TeamRequestStatus status) {
        Long ownerId = Long.parseLong(token.replace("Bearer token-", ""));
        return ResponseEntity.ok(teamRequestService.updateRequestStatus(requestId, ownerId, status));
    }
}
