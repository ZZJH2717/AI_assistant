package com.ai.assistant.controller;

import com.ai.assistant.model.ChatRequest;
import com.ai.assistant.model.TestRequest;
import com.ai.assistant.service.AIProviderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ChatController {

    @Autowired
    private AIProviderService aiProviderService;

    @PostMapping("/chat")
    public ResponseEntity<Map<String, Object>> chat(@RequestBody ChatRequest request) {
        Map<String, Object> response = new HashMap<>();

        try {
            if (request.getMessage() == null || request.getMessage().trim().isEmpty()) {
                response.put("success", false);
                response.put("error", "消息不能为空");
                return ResponseEntity.badRequest().body(response);
            }

            if (request.getSettings() == null || request.getSettings().getApiKey() == null || request.getSettings().getApiKey().trim().isEmpty()) {
                response.put("success", false);
                response.put("error", "未配置AI模型密钥");
                return ResponseEntity.badRequest().body(response);
            }

            String aiResponse = aiProviderService.callAI(request.getMessage(), request.getHistory(), request.getSettings());

            response.put("success", true);
            response.put("response", aiResponse);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("success", false);
            response.put("error", e.getMessage() != null ? e.getMessage() : "处理请求时发生错误");
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @PostMapping("/test")
    public ResponseEntity<Map<String, Object>> testConnection(@RequestBody TestRequest request) {
        Map<String, Object> response = new HashMap<>();

        try {
            if (request.getSettings() == null || request.getSettings().getApiKey() == null || request.getSettings().getApiKey().trim().isEmpty()) {
                response.put("success", false);
                response.put("error", "未配置AI模型密钥");
                return ResponseEntity.badRequest().body(response);
            }

            // 发送一个简单的测试消息
            String testMessage = "Hello";
            aiProviderService.callAI(testMessage, request.getSettings().getHistory(), request.getSettings());

            // 如果到达这里，说明连接成功
            response.put("success", true);
            response.put("message", "连接测试成功");
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("success", false);
            response.put("error", e.getMessage() != null ? e.getMessage() : "连接测试失败");
            return ResponseEntity.internalServerError().body(response);
        }
    }
}