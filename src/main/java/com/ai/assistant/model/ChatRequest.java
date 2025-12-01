package com.ai.assistant.model;

import java.util.List;

public class ChatRequest {
    private String message;
    private List<Message> history;
    private AISettings settings;

    // Getters and Setters
    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public List<Message> getHistory() {
        return history;
    }

    public void setHistory(List<Message> history) {
        this.history = history;
    }

    public AISettings getSettings() {
        return settings;
    }

    public void setSettings(AISettings settings) {
        this.settings = settings;
    }
}