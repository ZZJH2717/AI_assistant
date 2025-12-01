package com.ai.assistant.service;

import com.ai.assistant.model.AISettings;
import com.ai.assistant.model.Message;

import java.util.List;

public interface AIProviderService {
    String callAI(String message, List<Message> history, AISettings settings) throws Exception;
}