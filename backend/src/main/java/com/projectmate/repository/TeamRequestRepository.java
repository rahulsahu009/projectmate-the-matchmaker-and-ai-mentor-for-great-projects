package com.projectmate.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.projectmate.model.Project;
import com.projectmate.model.TeamRequest;

public interface TeamRequestRepository extends JpaRepository<TeamRequest, Long> {
    List<TeamRequest> findByProject(Project project);
    List<TeamRequest> findByProjectId(Long projectId);
    List<TeamRequest> findByRequesterId(Long requesterId);
}
