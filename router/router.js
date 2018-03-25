var formidable = require('formidable'); // 导入表单上传工具
var gm = require('gm'); // 导入图片处理工具
var db = require('./../models/db.js');// 导入数据库DAO层
var md5 = require('./../models/md5.js'); // 导入md5加密模块
// 显示首页
exports.showIndex = function (req, res, next) {
	res.render('index', {
        "login": req.session.login == '1' ? true : false,
        "username": req.session.login == '1' ? req.session.username : ""
    });
}
// 登陆验证
exports.dologin = function (req, res, next) {
	var form = new formidable.IncomingForm();

    form.parse(req, function(err, fields, files) {
      db.find('user', {username: fields.name, password: md5(fields.password)}, function(err, result) {
      	if (err) {
      		res.send('-2');
      	}else {
      		req.session.login = '1';// 设置session
      		req.session.username = fields.name;
      		res.redirect('/'); // 重定向到首页
      	}
      })
    });
}
// 跳转到注册页面
exports.dorigist = function (req, res, next) {
	res.render('regist');
}
// 注册用户
exports.rigist = function (req, res, next) {
	var form = new formidable.IncomingForm();

	form.parse(req, function(err, fields, files) {
		db.find('user', {username: fields.username}, function(err, result) {
			if(err) {
				res.send('-2');// -2服务器错误
				return;
			}else {
				if (result.length !== 0) {
					res.send('-1');// -1用户名被占用
				}else {
					db.insertOne('user', {
						username: fields.username,
						password: md5(fields.password) // 加密
					}, function(err, result) {
						if (err) {
							res.send('-2');
							return;
						}else {
							req.session.login = '1';
							req.session.username = fields.username;// 设置session
							res.send('1'); // 1注册成功
						}
					})
				}
			}
		})
	})
}
// 显示自己的博客
exports.showMyBlog = function (req, res, next) {
	var username = req.params.username;
	if (req.session.login !== '1') {
		res.redirect('/'); // 没有登陆不能访问
	}else {
		res.render('ownerBlog', {
        "username": req.session.login == '1' ? req.session.username : ""
    	});
	}
}
// 写博客
exports.writeBlog = function (req, res, next) {
	var username = req.params.username;
	if (req.session.login !== '1') {
		res.redirect('/'); // 没有登陆不能访问
	}else {
		res.render('writeBlog', {
        "username": req.session.login == '1' ? req.session.username : ""
    	});
	}
}
// 发布博客
exports.postBlog = function (req, res, next) {
	var form = new formidable.IncomingForm();
	form.parse(req, function (err, fields, files) {
		db.insertOne('article', fields, function(err,result) {
			if (err) {
				res.send('-2');// 服务器错误
			}else {
				res.send('1'); // 1发布成功
			}
		})
	})
}