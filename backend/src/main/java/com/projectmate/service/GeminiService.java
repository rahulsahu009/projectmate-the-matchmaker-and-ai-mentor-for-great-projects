package com.projectmate.service;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class GeminiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    private static final String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=";;

    public String generateRoadmap(String description) {
        String prompt = "Create a 5-step technical roadmap for this project description. Format it as a simple bulleted list. Description: " + description;
        return callGemini(prompt);
    }

    public String enhanceDescription(String description) {
        String prompt = "Enhance the following project description into a structured format with these exact four bullet points:\n- The Objective (1 line)\n- The Tech Stack (1 line)\n- Key Features & Implementation (1-2 lines)\n- The Result/Impact (1 line)\n\nDo not include any extra introductory text. Format entirely in Markdown. Description: " + description;
        return callGemini(prompt);
    }

    public String generateDebugHint(String error) {
        String prompt = "Act as a senior tech lead. Give a short, helpful debugging hint for this error, do not give the exact code. Error: " + error;
        return callGemini(prompt);
    }

    public String analyzeProgress(String description, List<String> commits) {
        String prompt = "Analyze the project progress based on these parameters:\n" +
            "Project Description: " + description + "\n" +
            "Recent GitHub Commits: " + String.join(", ", commits) + "\n\n" +
            "Strictly return a JSON object containing the exact fields \"progressPercentage\" (an integer 0-100) and \"completedFeatures\" (a string list of features). Do not include markdown formatting like ```json or any introductory text. Just the raw JSON. Example: {\"progressPercentage\": 45, \"completedFeatures\": [\"User Login\", \"Database setup\"]}";
        return callGemini(prompt);
    }

    private String callGemini(String prompt) {
        if ("default-key-replace-me".equals(apiKey) || apiKey == null || apiKey.isEmpty()) {
            return "AI feature disabled: Please set GEMINI_API_KEY environment variable.";
        }

        try {
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("contents", Collections.singletonList(
                Collections.singletonMap("parts", Collections.singletonList(
                    Collections.singletonMap("text", prompt)
                ))
            ));

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            java.net.URI uri = java.net.URI.create(GEMINI_API_URL + apiKey);
            ResponseEntity<Map> response = restTemplate.postForEntity(
                uri, entity, Map.class
            );

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                @SuppressWarnings("unchecked")
                List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.getBody().get("candidates");
                if (candidates != null && !candidates.isEmpty()) {
                    @SuppressWarnings("unchecked")
                    Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
                    @SuppressWarnings("unchecked")
                    List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
                    return (String) parts.get(0).get("text");
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            return "AI Generation Error: " + e.getMessage();
        }
        return "No response from AI.";
    }
}
