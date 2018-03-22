var formidable = require('formidable'); // 导入表单上传工具
var gm = require('gm'); // 导入图片处理工具
var db = require('./../models/db.js');// 导入数据库DAO层
var md5 = require('./../models/md5.js'); // 导入md5加密模块

exports.showIndex = function (req, res, next) {
	console.log(req.session.login);
	res.render('index', {
        "login": req.session.login == '1' ? true : false,
        "username": req.session.login == '1' ? req.session.username : "",
    });
}

exports.dologin = function (req, res, next) {
	var form = new formidable.IncomingForm();

    form.parse(req, function(err, fields, files) {
      console.log(fields);
      res.send('ok');
    });
}

exports.dorigist = function (req, res, next) {
	res.render('regist');
}

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