var express = require('express'); // 导入express框架
var app = express();
var router = require('./router/router.js'); // 导入路由模块
var session = require('express-session'); // 导入session模块

//使用session
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));

// 设置模板引擎
app.set('view engine', 'ejs');

// 设置静态路由
app.use(express.static('./public'));

// 当路由为'/'时
app.get('/', router.showIndex);
// 登录
app.post('/dologin', router.dologin);
// 跳转到注册页面
app.get('/doregist', router.dorigist);
// 注册用户
app.post('/regist', router.rigist);
// 跳转到我的博客
app.get('/showMyBlog/:username', router.showMyBlog);
// 写博客
app.get('/writeBlog/:username', router.writeBlog);
// 发布博客
app.post('/postBlog', router.postBlog);
// 展示自己所有的博客
app.get('/getBlog', router.getBlog);

// 监听3000端口
app.listen(3000);