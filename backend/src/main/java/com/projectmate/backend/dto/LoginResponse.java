package com.projectmate.backend.dto;

import com.projectmate.backend.model.User;

public class LoginResponse {
    private String token;
    private User user;

    public LoginResponse(String token, User user) {
        this.token = token;
        // Don't leak passwords on the JSON boundary
        user.setPassword(null);
        this.user = user;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
}
