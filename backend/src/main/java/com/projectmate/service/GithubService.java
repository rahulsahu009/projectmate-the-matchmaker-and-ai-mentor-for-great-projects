package com.projectmate.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class GithubService {

    private static final String GITHUB_API_URL = "https://api.github.com/repos/%s/%s/commits?per_page=15";
    private static final String GITHUB_API_SINGLE_COMMIT_URL = "https://api.github.com/repos/%s/%s/commits?per_page=1";

    public String fetchLatestCommitSha(String githubUrl) {
        if (githubUrl == null || githubUrl.isEmpty()) return null;
        Pattern pattern = Pattern.compile("github\\.com/([^/]+)/([^/]+)");
        Matcher matcher = pattern.matcher(githubUrl);
        if (!matcher.find()) return null;
        String owner = matcher.group(1);
        String repo = matcher.group(2).replaceAll("\\.git$", "");
        String apiUrl = String.format(GITHUB_API_SINGLE_COMMIT_URL, owner, repo);
        try {
            RestTemplate restTemplate = new RestTemplate();
            @SuppressWarnings("rawtypes")
            ResponseEntity<List> response = restTemplate.getForEntity(apiUrl, List.class);
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null && !response.getBody().isEmpty()) {
                @SuppressWarnings("unchecked")
                Map<String, Object> latestCommit = (Map<String, Object>) response.getBody().get(0);
                return (String) latestCommit.get("sha");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public List<String> fetchLastCommits(String githubUrl) {
        List<String> commitMessages = new ArrayList<>();
        
        if (githubUrl == null || githubUrl.isEmpty()) {
            return commitMessages;
        }

        // Example URL: https://github.com/owner/repo
        Pattern pattern = Pattern.compile("github\\.com/([^/]+)/([^/]+)");
        Matcher matcher = pattern.matcher(githubUrl);
        
        if (!matcher.find()) {
            throw new RuntimeException("Invalid GitHub URL format");
        }

        String owner = matcher.group(1);
        String repo = matcher.group(2).replaceAll("\\.git$", "");

        String apiUrl = String.format(GITHUB_API_URL, owner, repo);

        try {
            RestTemplate restTemplate = new RestTemplate();
            @SuppressWarnings("rawtypes")
            ResponseEntity<List> response = restTemplate.getForEntity(apiUrl, List.class);
            
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                @SuppressWarnings("unchecked")
                List<Map<String, Object>> commits = (List<Map<String, Object>>) response.getBody();
                if (commits != null) {
                    for (Map<String, Object> commitItem : commits) {
                        @SuppressWarnings("unchecked")
                        Map<String, Object> commitData = (Map<String, Object>) commitItem.get("commit");
                        if (commitData != null && commitData.containsKey("message")) {
                            commitMessages.add(commitData.get("message").toString());
                        }
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to fetch commits from GitHub: " + e.getMessage());
        }

        return commitMessages;
    }
}
