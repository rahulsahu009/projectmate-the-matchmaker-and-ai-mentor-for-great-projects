package com.projectmate.backend.controller;

import com.projectmate.backend.model.Project;
import com.projectmate.backend.service.ProjectService;
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

    @GetMapping("/{id}/projects")
    public ResponseEntity<List<Project>> getUserProjects(@PathVariable("id") Long id) {
        return ResponseEntity.ok(projectService.getProjectsByCreatorId(id));
    }
}
