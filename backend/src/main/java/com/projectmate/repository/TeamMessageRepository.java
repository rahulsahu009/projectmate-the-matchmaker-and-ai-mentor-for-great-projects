package com.projectmate.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.projectmate.model.TeamMessage;

public interface TeamMessageRepository extends JpaRepository<TeamMessage, Long> {
    List<TeamMessage> findByProjectIdOrderByTimestampAsc(Long projectId);
    List<TeamMessage> findByProjectIdAndRoomTypeOrderByTimestampAsc(Long projectId, String roomType);
}
