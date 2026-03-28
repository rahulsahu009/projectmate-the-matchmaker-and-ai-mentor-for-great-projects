package com.projectmate.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.projectmate.model.User;
import com.projectmate.repository.UserRepository;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    private final UserRepository userRepository;
    private final com.projectmate.repository.ProjectRepository projectRepository;
    private final com.projectmate.repository.TeamRequestRepository teamRequestRepository;

    public UserController(UserRepository userRepository, com.projectmate.repository.ProjectRepository projectRepository, com.projectmate.repository.TeamRequestRepository teamRequestRepository) {
        this.userRepository = userRepository;
        this.projectRepository = projectRepository;
        this.teamRequestRepository = teamRequestRepository;
    }

    @GetMapping("/{id}")
    public ResponseEntity<com.projectmate.model.User> getUserById(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/profile")
    public ResponseEntity<com.projectmate.dto.UserProfileDTO> getUserProfile(@PathVariable Long id) {
        return userRepository.findById(id).map(user -> {
            com.projectmate.dto.UserProfileDTO dto = new com.projectmate.dto.UserProfileDTO();
            dto.setUser(user);

            long createdProjects = projectRepository.findByCreatedById(id).size();
            long joinedProjects = teamRequestRepository.findByRequesterId(id).stream()
                    .filter(req -> req.getStatus() == com.projectmate.model.TeamRequestStatus.ACCEPTED)
                    .count();
            dto.setProjectsJoined(createdProjects + joinedProjects);

            long completedCreated = projectRepository.findByCreatedById(id).stream()
                    .filter(p -> p.isCompleted()).count();
            long completedJoined = teamRequestRepository.findByRequesterId(id).stream()
                    .filter(req -> req.getStatus() == com.projectmate.model.TeamRequestStatus.ACCEPTED && req.getProject().isCompleted())
                    .count();
            dto.setProjectsCompleted(completedCreated + completedJoined);

            return ResponseEntity.ok(dto);
        }).orElse(ResponseEntity.notFound().build());
    }
}
