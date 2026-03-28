package com.projectmate.backend.service;

import com.projectmate.backend.dto.LoginRequest;
import com.projectmate.backend.model.User;
import com.projectmate.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    public User register(User user) {
        // Simple mock registration without password hashing for hackathon MVP
        return userRepository.save(user);
    }

    public User login(LoginRequest loginRequest) {
        Optional<User> userOpt = userRepository.findByEmail(loginRequest.getEmail());
        if (userOpt.isPresent() && userOpt.get().getPassword().equals(loginRequest.getPassword())) {
            return userOpt.get();
        }
        return null;
    }
}
