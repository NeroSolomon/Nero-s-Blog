var express = require('express'); // 导入express框架
var app = express();
var router = require('./router/router.js'); // 导入路由模块
var session = require('express-session'); // 导入session模块
var server = require('http').Server(app);
// 使用socket.io
var io = require('socket.io')(server);
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
//监听连接事件
io.on("connection",function(socket){
	console.log("1个客户端连接了");
});
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
// 分页展示博客
app.get('/showPage', router.showPage);
// 跳转到热门博客
app.get('/hotBlog', router.hotBlog);
// 请求所有热门博客
app.get('/getHotBlog', router.getHotBlog);
// 分页请求所有热门博客
app.get('/showHotPage', router.showHotPage);
// 跳转到我的计划页面
app.get('/myPlan', router.toMyPlan);
// 得到我的计划
app.get('/getMyPlan', router.getMyPlan);
// 存储我的计划
app.post('/savePlan', router.savePlan);
// 跳转到聊天室
app.get('/chatRoom', router.toChatRoom);
// 跳转到更新资料页面
app.get('/changeMes', router.toPersonalMes);
// 保存资料
app.post('/saveMes', router.saveMes);
// 监听3000端口
server.listen(3000);
