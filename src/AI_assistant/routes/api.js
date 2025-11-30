const express = require('express');
const router = express.Router();
const { Configuration, OpenAIApi } = require('openai');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Anthropic = require('@anthropic-ai/sdk');
const { ZhipuAI } = require('@zhipuai/sdk'); // 添加智普AI SDK

// 存储对话历史（在实际应用中应使用数据库）
const conversationStore = new Map();

// 处理聊天请求
router.post('/chat', async (req, res) => {
    try {
        const { message, history, settings } = req.body;
        
        if (!message) {
            return res.status(400).json({
                success: false,
                error: '消息不能为空'
            });
        }

        if (!settings || !settings.apiKey) {
            return res.status(400).json({
                success: false,
                error: '未配置AI模型密钥'
            });
        }

        let aiResponse;

        // 根据提供商调用不同的AI API
        switch (settings.provider) {
            case 'openai':
                aiResponse = await callOpenAI(message, history, settings);
                break;
            case 'anthropic':
                aiResponse = await callAnthropic(message, history, settings);
                break;
            case 'google':
                aiResponse = await callGoogleAI(message, history, settings);
                break;
            case 'zhipu':
                aiResponse = await callZhipuAI(message, history, settings);
                break;
            case 'custom':
                aiResponse = await callCustomAPI(message, history, settings);
                break;
            default:
                return res.status(400).json({
                    success: false,
                    error: '不支持的AI服务提供商'
                });
        }

        res.json({
            success: true,
            response: aiResponse
        });

    } catch (error) {
        console.error('聊天API错误:', error);
        res.status(500).json({
            success: false,
            error: error.message || '处理请求时发生错误'
        });
    }
});

// 测试连接
router.post('/test', async (req, res) => {
    try {
        const { settings } = req.body;
        
        if (!settings || !settings.apiKey) {
            return res.status(400).json({
                success: false,
                error: '未配置AI模型密钥'
            });
        }

        // 发送一个简单的测试消息
        const testMessage = 'Hello';
        
        switch (settings.provider) {
            case 'openai':
                await callOpenAI(testMessage, [], settings, true);
                break;
            case 'anthropic':
                await callAnthropic(testMessage, [], settings, true);
                break;
            case 'google':
                await callGoogleAI(testMessage, [], settings, true);
                break;
            case 'zhipu':
                await callZhipuAI(testMessage, [], settings, true);
                break;
            case 'custom':
                await callCustomAPI(testMessage, [], settings, true);
                break;
            default:
                return res.status(400).json({
                    success: false,
                    error: '不支持的AI服务提供商'
                });
        }

        // 如果到达这里，说明连接成功
        res.json({
            success: true,
            message: '连接测试成功'
        });

    } catch (error) {
        console.error('连接测试错误:', error);
        res.status(500).json({
            success: false,
            error: error.message || '连接测试失败'
        });
    }
});

// 调用OpenAI API
async function callOpenAI(message, history, settings, isTest = false) {
    try {
        const configuration = new Configuration({
            apiKey: settings.apiKey,
        });
        
        const openai = new OpenAIApi(configuration);

        // 构建消息历史
        const messages = [
            { role: 'system', content: '你是一个有用的AI助手。请用中文回答用户的问题。' },
            ...history.map(msg => ({
                role: msg.role === 'user' ? 'user' : 'assistant',
                content: msg.content
            })),
            { role: 'user', content: message }
        ];
        
        const response = await openai.createChatCompletion({
            model: settings.model || 'gpt-3.5-turbo',
            messages: messages,
            max_tokens: 1000,
            temperature: 0.7,
        });

        return response.data.choices[0].message.content;
    } catch (error) {
        if (error.response) {
            throw new Error(`OpenAI API错误: ${error.response.status} - ${error.response.data.error?.message || '未知错误'}`);
        } else {
            throw new Error(`OpenAI连接错误: ${error.message}`);
        }
    }
}

// 调用Anthropic API
async function callAnthropic(message, history, settings, isTest = false) {
    try {
        const anthropic = new Anthropic({
            apiKey: settings.apiKey,
        });

        // 构建消息历史
        let conversationHistory = [];
        history.forEach(msg => {
            if (msg.role === 'user') {
                conversationHistory.push({role: "user", content: msg.content});
            } else {
                conversationHistory.push({role: "assistant", content: msg.content});
            }
        });
        
        conversationHistory.push({role: "user", content: message});
        
        const response = await anthropic.messages.create({
            model: settings.model || 'claude-2.1',
            messages: conversationHistory,
            max_tokens: 1000,
            temperature: 0.7,
        });

        return response.content[0].text;
    } catch (error) {
        throw new Error(`Anthropic API错误: ${error.message}`);
    }
}

// 调用Google AI API
async function callGoogleAI(message, history, settings, isTest = false) {
    try {
        const genAI = new GoogleGenerativeAI(settings.apiKey);
        const model = genAI.getGenerativeModel({ model: settings.model || "gemini-pro" });

        // 构建消息历史
        let conversationHistory = '';
        history.forEach(msg => {
            conversationHistory += `${msg.role === 'user' ? '用户' : '助手'}: ${msg.content}\n`;
        });
        
        const prompt = `以下是对话历史：
        ${conversationHistory}
        用户: ${message}
        助手:`;
        
        const result = await model.generateContent(prompt);
        const response = await result.response;

        return response.text();
    } catch (error) {
        throw new Error(`Google AI API错误: ${error.message}`);
    }
}

// 调用自定义API
async function callCustomAPI(message, history, settings, isTest = false) {
    try {
        // 构建消息历史
        const messages = [
            { role: 'system', content: '你是一个有用的AI助手。请用中文回答用户的问题。' },
            ...history.map(msg => ({
                role: msg.role === 'user' ? 'user' : 'assistant',
                content: msg.content
            })),
            { role: 'user', content: message }
        ];
        
        const response = await fetch(settings.apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${settings.apiKey}`
            },
            body: JSON.stringify({
                model: settings.model,
                messages: messages,
                max_tokens: 1000,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            throw new Error(`自定义API错误: ${response.status} - ${response.statusText}`);
        }
        
        const data = await response.json();

        // 假设响应结构与OpenAI兼容
        return data.choices[0].message.content;
    } catch (error) {
        throw new Error(`自定义API连接错误: ${error.message}`);
    }
}

// 调用智普AI API
async function callZhipuAI(message, history, settings, isTest = false) {
    try {
        const zhipu = new ZhipuAI({
            apiKey: settings.apiKey,
        });

        // 构建消息历史
        const messages = [
            { role: 'system', content: '你是一个有用的AI助手。请用中文回答用户的问题。' },
            ...history.map(msg => ({
                role: msg.role === 'user' ? 'user' : 'assistant',
                content: msg.content
            })),
            { role: 'user', content: message }
        ];
        
        const response = await zhipu.chat.completions.create({
            model: settings.model || 'glm-4-flash',
            messages: messages,
            max_tokens: 1000,
            temperature: 0.7,
        });

        return response.choices[0].message.content;
    } catch (error) {
        throw new Error(`智普AI API错误: ${error.message}`);
    }
}

module.exports = router;