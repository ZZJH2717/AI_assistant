package com.ai.assistant.service;

import com.ai.assistant.model.AISettings;
import com.ai.assistant.model.Message;
import com.theokanning.openai.completion.chat.ChatCompletionRequest;
import com.theokanning.openai.completion.chat.ChatMessage;
import com.theokanning.openai.completion.chat.ChatMessageRole;
import com.theokanning.openai.service.OpenAiService;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;

@Service
public class AIProviderServiceImpl implements AIProviderService {

    @Override
    public String callAI(String message, List<Message> history, AISettings settings) throws Exception {
        switch (settings.getProvider()) {
            case "openai":
                return callOpenAI(message, history, settings);
            case "anthropic":
            case "google":
            case "zhipu":
            case "custom":
            default:
                throw new IllegalArgumentException("不支持的AI服务提供商: " + settings.getProvider());
        }
    }

    private String callOpenAI(String message, List<Message> history, AISettings settings) throws Exception {
        try {
            OpenAiService openAiService = new OpenAiService(settings.getApiKey(), Duration.ofSeconds(60));

            // 构建消息历史
            List<ChatMessage> chatMessages = new ArrayList<>();
            chatMessages.add(new ChatMessage(ChatMessageRole.SYSTEM.value(), "你是一个有用的AI助手。请用中文回答用户的问题。"));

            if (history != null) {
                for (Message msg : history) {
                    if ("user".equals(msg.getRole())) {
                        chatMessages.add(new ChatMessage(ChatMessageRole.USER.value(), msg.getContent()));
                    } else {
                        chatMessages.add(new ChatMessage(ChatMessageRole.ASSISTANT.value(), msg.getContent()));
                    }
                }
            }

            chatMessages.add(new ChatMessage(ChatMessageRole.USER.value(), message));

            ChatCompletionRequest chatCompletionRequest = ChatCompletionRequest.builder()
                    .model(settings.getModel() != null ? settings.getModel() : "gpt-3.5-turbo")
                    .messages(chatMessages)
                    .maxTokens(1000)
                    .temperature(0.7)
                    .build();

            return openAiService.createChatCompletion(chatCompletionRequest).getChoices().get(0).getMessage().getContent();
        } catch (Exception e) {
            throw new Exception("OpenAI API错误: " + e.getMessage());
        }
    }
}