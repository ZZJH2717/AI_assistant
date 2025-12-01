# AI助手微型工具

一个基于Node.js和多种AI服务（OpenAI、Anthropic Claude、Google Gemini、智普AI）的轻量级AI对话助手。

## 功能特点

- 支持多种AI服务提供商：
  - OpenAI (GPT-3.5/4系列)
  - Anthropic (Claude)
  - Google (Gemini)
  - 智普AI (GLM-4系列)
  - 自定义API端点
- 前后端分离架构
- 对话历史记录
- 对话导出功能
- 响应式设计，支持移动端

## 项目结构

```
.
├── package.json              # 项目配置和依赖
├── src/
│   └── AI_assistant/
│       ├── AI_ass_1.js       # 主应用入口
│       ├── routes/
│       │   └── api.js        # API路由处理
│       └── public/
│           └── index.html    # 前端界面
└── README.md                 # 项目说明文档
```

## 安装与运行

1. 安装依赖：
   ```
   npm install
   ```

2. 启动服务：
   ```
   npm start
   ```

   或者开发模式运行：
   ```
   npm run dev
   ```


## 配置说明

1. 启动应用后，点击右上角"设置"按钮
2. 选择AI服务提供商
3. 输入对应的API密钥
4. 选择模型（可选）
5. 点击"测试连接"验证配置
6. 保存设置后即可开始对话

## API支持

### 支持的提供商

- **OpenAI**: 需要OpenAI API密钥
- **Anthropic**: 需要Anthropic API密钥
- **Google**: 需要Google AI Studio API密钥
- **智普AI**: 需要智普AI API密钥
- **自定义API**: 可配置任意兼容OpenAI格式的API端点

### API端点

- `POST /api/chat` - 聊天接口
- `POST /api/test` - 连接测试接口

## 依赖项

- [Express.js](https://expressjs.com/) - Web应用框架
- [OpenAI Node.js SDK](https://github.com/openai/openai-node)
- [Google Generative AI SDK](https://github.com/google/generative-ai-js)
- [Anthropic SDK](https://docs.anthropic.com/claude/reference)
- [智普AI SDK](https://github.com/zhipuai/zhipuai-sdk-nodejs)

## 许可证

本项目采用MIT许可证，详情请见 [LICENSE](LICENSE) 文件。
