package com.projectmate.backend.controller;

import com.projectmate.backend.dto.JwtResponse;
import com.projectmate.backend.dto.LoginRequest;
import com.projectmate.backend.model.User;
import com.projectmate.backend.security.JwtUtils;
import com.projectmate.backend.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private JwtUtils jwtUtils;

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody User user) {
        User registeredUser = authService.register(user);
        return new ResponseEntity<>(registeredUser, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<JwtResponse> login(@RequestBody LoginRequest loginRequest) {
        User user = authService.login(loginRequest);
        if (user != null) {
            String token = jwtUtils.generateJwtToken(user.getEmail(), user.getId());
            return ResponseEntity.ok(new JwtResponse(token, user.getId(), user.getName(), user.getEmail(), user.getRole()));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }
}
