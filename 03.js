var express=require('express');
var app=express();
var server = require('http').Server(app);
// 使用socket.io
var io = require('socket.io')(server);
// 设置模板引擎
app.set('view engine', 'ejs');
// 设置静态路由
app.use(express.static('./public'));
app.get('/',function(req,res){
    res.render('index');
});
io.on('connection',function(socket){
    console.log("1个客户端连接了");
});

server.listen(3000);