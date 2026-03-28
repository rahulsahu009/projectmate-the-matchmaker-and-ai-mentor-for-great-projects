package com.projectmate.backend.controller;

import com.projectmate.backend.model.Project;
import com.projectmate.backend.model.TeamRequest;
import com.projectmate.backend.service.ProjectService;
import com.projectmate.backend.service.TeamRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private ProjectService projectService;
    
    @Autowired
    private TeamRequestService teamRequestService;

    @GetMapping("/{id}/projects")
    public ResponseEntity<List<Project>> getUserProjects(@PathVariable("id") Long id) {
        return ResponseEntity.ok(projectService.getProjectsByCreatorId(id));
    }

    @GetMapping("/{id}/requests")
    public ResponseEntity<List<TeamRequest>> getUserRequests(@PathVariable("id") Long id) {
        return ResponseEntity.ok(teamRequestService.getRequestsByUserId(id));
    }
}
