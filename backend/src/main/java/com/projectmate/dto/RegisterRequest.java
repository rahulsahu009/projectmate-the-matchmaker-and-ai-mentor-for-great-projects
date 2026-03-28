package com.projectmate.dto;

import com.projectmate.model.Role;

import lombok.Data;

@Data
public class RegisterRequest {
    private String name;
    private String email;
    private String password;
    private Role role;
    private String skills;
    private String githubLink;
}
