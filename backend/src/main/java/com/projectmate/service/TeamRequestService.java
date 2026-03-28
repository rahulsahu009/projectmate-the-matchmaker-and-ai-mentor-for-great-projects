package com.projectmate.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.projectmate.model.Project;
import com.projectmate.model.TeamRequest;
import com.projectmate.model.TeamRequestStatus;
import com.projectmate.model.User;
import com.projectmate.repository.ProjectRepository;
import com.projectmate.repository.TeamRequestRepository;
import com.projectmate.repository.UserRepository;

@Service
public class TeamRequestService {

    private final TeamRequestRepository teamRequestRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    public TeamRequestService(TeamRequestRepository teamRequestRepository, ProjectRepository projectRepository, UserRepository userRepository) {
        this.teamRequestRepository = teamRequestRepository;
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
    }

    public TeamRequest sendRequest(Long userId, Long projectId) {
        User requester = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        Project project = projectRepository.findById(projectId).orElseThrow(() -> new RuntimeException("Project not found"));

        // Check if request already exists
        List<TeamRequest> existing = teamRequestRepository.findByRequesterId(userId);
        if (existing.stream().anyMatch(req -> req.getProject().getId().equals(projectId))) {
            throw new RuntimeException("Request already sent to this project");
        }

        if (project.isTeamFinalized()) {
            throw new RuntimeException("Team is already finalized. No new requests allowed.");
        }

        TeamRequest request = new TeamRequest();
        request.setProject(project);
        request.setRequester(requester);
        request.setStatus(TeamRequestStatus.PENDING);
        return teamRequestRepository.save(request);
    }

    public List<TeamRequest> getRequestsForProject(Long projectId) {
        return teamRequestRepository.findByProjectId(projectId);
    }

    public List<TeamRequest> getRequestsForUser(Long userId) {
        return teamRequestRepository.findByRequesterId(userId);
    }

    public TeamRequest updateRequestStatus(Long requestId, Long ownerId, TeamRequestStatus status) {
        TeamRequest request = teamRequestRepository.findById(requestId)
            .orElseThrow(() -> new RuntimeException("Request not found"));

        if (!request.getProject().getCreatedBy().getId().equals(ownerId)) {
            throw new RuntimeException("Only project creator can update request status");
        }

        request.setStatus(status);
        return teamRequestRepository.save(request);
    }
}
