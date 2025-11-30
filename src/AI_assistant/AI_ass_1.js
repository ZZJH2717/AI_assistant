const express = require('express');
const path = require('path');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', '..', 'public')));

// API路由
app.use('/api', apiRoutes);

// 提供前端页面
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'index.html'));
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`AI助手服务器运行在 http://localhost:${PORT}`);
});