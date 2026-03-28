package com.projectmate.backend.service;

import com.projectmate.backend.model.Project;
import com.projectmate.backend.model.User;
import com.projectmate.backend.repository.ProjectRepository;
import com.projectmate.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProjectService {
    
    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    public Project getProjectById(Long id) {
        return projectRepository.findById(id).orElse(null);
    }

    public Project createProject(Project project) {
        // Associate with existing user if creator is passed with id
        if (project.getCreator() != null && project.getCreator().getId() != null) {
            Optional<User> creatorOpt = userRepository.findById(project.getCreator().getId());
            creatorOpt.ifPresent(project::setCreator);
        }
        return projectRepository.save(project);
    }

    public List<Project> getProjectsByCreatorId(Long creatorId) {
        return projectRepository.findByCreatorId(creatorId);
    }
}
