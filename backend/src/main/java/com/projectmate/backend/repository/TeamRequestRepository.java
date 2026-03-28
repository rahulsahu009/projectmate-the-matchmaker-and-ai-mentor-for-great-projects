package com.projectmate.backend.repository;

import com.projectmate.backend.model.TeamRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TeamRequestRepository extends JpaRepository<TeamRequest, Long> {
}
