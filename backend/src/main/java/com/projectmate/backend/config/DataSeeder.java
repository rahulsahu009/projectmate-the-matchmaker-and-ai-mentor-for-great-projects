package com.projectmate.backend.config;

import com.projectmate.backend.model.Project;
import com.projectmate.backend.model.User;
import com.projectmate.backend.repository.ProjectRepository;
import com.projectmate.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            System.out.println("Seeding dummy data...");
            
            User u1 = userRepository.save(new User(null, "Alice Developer", "alice@test.com", "password", "STUDENT"));
            User u2 = userRepository.save(new User(null, "Bob Designer", "bob@test.com", "password", "STUDENT"));
            User u3 = userRepository.save(new User(null, "Charlie Data", "charlie@test.com", "password", "STUDENT"));
            User u4 = userRepository.save(new User(null, "Diana DevOps", "diana@test.com", "password", "STUDENT"));
            User u5 = userRepository.save(new User(null, "Eve Security", "eve@test.com", "password", "STUDENT"));

            projectRepository.save(new Project(null, "AI Study Buddy", "An AI-powered application to help students generate quizzes from their class notes.", "React, Python, OpenAI", "OPEN", "https://github.com/spring-projects/spring-boot", u1));
            projectRepository.save(new Project(null, "Campus Ride Share", "A mobile app for students to organize secure carpooling to and from campus.", "React Native, Node.js, Maps API", "OPEN", null, u2));
            projectRepository.save(new Project(null, "Hackathon Matchmaker", "A platform to connect students based on their skills for upcoming hackathons.", "Spring Boot, React, Tailwind", "IN_PROGRESS", "https://github.com/facebook/react", u3));
            projectRepository.save(new Project(null, "Eco-Tracker", "Track and reduce personal carbon footprint through daily gamified challenges.", "Vue.js, Firebase, Cloud Functions", "OPEN", null, u4));
            projectRepository.save(new Project(null, "Crypto Portfolio UI", "A sleek dashboard for managing decentralized finance wallets.", "Next.js, Tailwind, Web3.js", "OPEN", null, u5));
            
            System.out.println("Dummy data seeding complete.");
        }
    }
}
