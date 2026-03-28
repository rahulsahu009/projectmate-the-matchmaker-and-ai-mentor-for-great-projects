package com.projectmate.dto;

import com.projectmate.model.User;
import lombok.Data;

@Data
public class UserProfileDTO {
    private User user;
    private long projectsJoined;
    private long projectsCompleted;
}
