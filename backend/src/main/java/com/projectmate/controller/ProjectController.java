package com.projectmate.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.projectmate.dto.ProjectDTO;
import com.projectmate.model.Project;
import com.projectmate.service.ProjectService;
import com.projectmate.service.GeminiService;
import java.util.Map;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = "*")
public class ProjectController {

    private final ProjectService projectService;
    private final GeminiService geminiService;

    public ProjectController(ProjectService projectService, GeminiService geminiService) {
        this.projectService = projectService;
        this.geminiService = geminiService;
    }

    @GetMapping
    public ResponseEntity<List<Project>> getAllProjects() {
        return ResponseEntity.ok(projectService.getAllProjects());
    }

    @PostMapping
    public ResponseEntity<Project> createProject(@RequestHeader("Authorization") String token, @RequestBody ProjectDTO dto) {
        Long userId = Long.parseLong(token.replace("Bearer token-", ""));
        return ResponseEntity.ok(projectService.createProject(userId, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id) {
        projectService.deleteProject(id);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{id}/finalize")
    public ResponseEntity<?> finalizeTeam(@PathVariable Long id, @RequestBody Map<String, String> payload, @RequestHeader("Authorization") String token) {
        Long userId = Long.parseLong(token.replace("Bearer token-", ""));
        String githubRepoUrl = payload.get("githubRepoUrl");
        
        if (githubRepoUrl == null || githubRepoUrl.trim().isEmpty() || !githubRepoUrl.contains("github.com")) {
            return ResponseEntity.badRequest().body(Map.of("message", "A valid GitHub repository URL is required."));
        }
        
        return ResponseEntity.ok(projectService.finalizeTeam(id, userId, githubRepoUrl));
    }

    @PostMapping("/enhance")
    public ResponseEntity<String> enhanceDescription(@RequestBody Map<String, String> payload) {
        String description = payload.get("description");
        if (description == null || description.isEmpty()) {
            return ResponseEntity.badRequest().body("Description is required");
        }
        return ResponseEntity.ok(geminiService.enhanceDescription(description));
    }

    @PostMapping("/{id}/auto-sync-progress")
    public ResponseEntity<?> autoSyncProgress(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(projectService.autoSyncProgress(id));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
