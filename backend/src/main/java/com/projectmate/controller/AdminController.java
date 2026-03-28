package com.projectmate.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.projectmate.model.User;
import com.projectmate.repository.ProjectRepository;
import com.projectmate.repository.TeamMessageRepository;
import com.projectmate.repository.UserRepository;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final TeamMessageRepository teamMessageRepository;

    public AdminController(UserRepository userRepository, ProjectRepository projectRepository, TeamMessageRepository teamMessageRepository) {
        this.userRepository = userRepository;
        this.projectRepository = projectRepository;
        this.teamMessageRepository = teamMessageRepository;
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Long>> getAdminStats() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("users", userRepository.count());
        stats.put("projects", projectRepository.count());
        stats.put("activeChats", teamMessageRepository.count());
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @GetMapping("/projects")
    public ResponseEntity<List<com.projectmate.model.Project>> getAllProjects() {
        return ResponseEntity.ok(projectRepository.findAll());
    }

    @org.springframework.web.bind.annotation.PatchMapping("/projects/{id}/status")
    public ResponseEntity<?> updateProjectStatus(@org.springframework.web.bind.annotation.PathVariable Long id, @org.springframework.web.bind.annotation.RequestParam boolean active) {
        com.projectmate.model.Project project = projectRepository.findById(id).orElseThrow(() -> new RuntimeException("Project not found"));
        project.setActive(active);
        projectRepository.save(project);
        return ResponseEntity.ok(project);
    }

    @org.springframework.web.bind.annotation.PatchMapping("/users/{id}/status")
    public ResponseEntity<?> updateUserStatus(@org.springframework.web.bind.annotation.PathVariable Long id, @org.springframework.web.bind.annotation.RequestParam boolean active) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        if (user.getRole() == com.projectmate.model.Role.ADMIN) {
            return ResponseEntity.badRequest().body("Cannot modify administrator status.");
        }
        user.setActive(active);
        userRepository.save(user);
        return ResponseEntity.ok(user);
    }
}
