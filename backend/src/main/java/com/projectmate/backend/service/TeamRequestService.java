package com.projectmate.backend.service;

import com.projectmate.backend.model.TeamRequest;
import com.projectmate.backend.repository.TeamRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TeamRequestService {

    @Autowired
    private TeamRequestRepository teamRequestRepository;

    public List<TeamRequest> getRequestsByUserId(Long userId) {
        return teamRequestRepository.findByUserId(userId);
    }
}
