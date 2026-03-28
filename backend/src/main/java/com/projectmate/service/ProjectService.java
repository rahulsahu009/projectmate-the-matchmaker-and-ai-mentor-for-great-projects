package com.projectmate.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.projectmate.dto.ProjectDTO;
import com.projectmate.model.Project;
import com.projectmate.model.User;
import com.projectmate.repository.ProjectRepository;
import com.projectmate.repository.UserRepository;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final GeminiService geminiService;
    private final GithubService githubService;

    public ProjectService(ProjectRepository projectRepository, UserRepository userRepository, GeminiService geminiService, GithubService githubService) {
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
        this.geminiService = geminiService;
        this.githubService = githubService;
    }

    public List<Project> getAllProjects() {
        return projectRepository.findAll().stream()
                .filter(Project::isActive)
                .collect(java.util.stream.Collectors.toList());
    }

    public Project createProject(Long userId, ProjectDTO dto) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

        Project project = new Project();
        project.setTitle(dto.getTitle());
        project.setDescription(dto.getDescription());
        project.setRequiredSkills(dto.getRequiredSkills());
        project.setCreatedBy(user);

        // AI Roadmap generation
        String roadmap = geminiService.generateRoadmap(dto.getDescription());
        project.setAiRoadmap(roadmap);

        return projectRepository.save(project);
    }

    public void deleteProject(Long id) {
        projectRepository.deleteById(id);
    }

    public Project finalizeTeam(Long projectId, Long userId, String githubRepoUrl) {
        Project project = projectRepository.findById(projectId)
            .orElseThrow(() -> new RuntimeException("Project not found"));
        
        if (!project.getCreatedBy().getId().equals(userId)) {
            throw new RuntimeException("Only project creator can finalize the team");
        }

        project.setTeamFinalized(true);
        project.setGithubRepoUrl(githubRepoUrl);
        project.setStatus("IN_PROGRESS");
        return projectRepository.save(project);
    }

    public Project autoSyncProgress(Long projectId) {
        Project project = projectRepository.findById(projectId)
            .orElseThrow(() -> new RuntimeException("Project not found"));
            
        if (project.getGithubRepoUrl() == null || project.getGithubRepoUrl().isEmpty()) {
            return project;
        }

        String latestSha = githubService.fetchLatestCommitSha(project.getGithubRepoUrl());
        
        if (latestSha == null || latestSha.equals(project.getLastCommitSha())) {
            return project;
        }

        project.setLastCommitSha(latestSha);

        List<String> commits = githubService.fetchLastCommits(project.getGithubRepoUrl());
        
        if (commits.isEmpty()) {
            project.setAiProgressNotes("No recent commits found to analyze.");
            project.setProgressPercentage(0);
            return projectRepository.save(project);
        }

        String jsonResult = geminiService.analyzeProgress(project.getDescription(), commits);
        
        try {
            com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
            String cleanJson = jsonResult.replaceAll("(?s)```json\\s*", "").replaceAll("(?s)```\\s*", "").trim();
            com.fasterxml.jackson.databind.JsonNode root = mapper.readTree(cleanJson);
            
            if (root.has("progressPercentage")) {
                project.setProgressPercentage(root.get("progressPercentage").asInt());
            }
            if (root.has("completedFeatures")) {
                com.fasterxml.jackson.databind.JsonNode featuresNode = root.get("completedFeatures");
                if (featuresNode.isArray()) {
                    List<String> features = new java.util.ArrayList<>();
                    for (com.fasterxml.jackson.databind.JsonNode node : featuresNode) {
                        features.add("- " + node.asText());
                    }
                    project.setAiProgressNotes(String.join("\n", features));
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            System.err.println("Failed to parse AI response: " + e.getMessage() + ". Raw Response: " + jsonResult);
        }

        return projectRepository.save(project);
    }
}
