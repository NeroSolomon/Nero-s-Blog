var formidable = require('formidable'); // 导入表单上传工具
var gm = require('gm'); // 导入图片处理工具
var db = require('./../models/db.js');// 导入数据库DAO层
var md5 = require('./../models/md5.js'); // 导入md5加密模块
var path = require('path'); // 导入路径模块
var fs = require('fs'); // 导入fs模块
// 显示首页
exports.showIndex = function (req, res, next) {
	res.render('index', {
        "login": req.session.login == '1' ? true : false,
        "username": req.session.login == '1' ? req.session.username : "",
        'headPic': req.session.headPic ? req.session.headPic : ''
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
      		req.session.headPic = result[0].headPic ? result[0].headPic : '';// 判断是否有设置头像
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
        "username": req.session.login == '1' ? req.session.username : "",
        'headPic': req.session.headPic ? req.session.headPic : ''
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
        "username": req.session.login == '1' ? req.session.username : "",
        'headPic': req.session.headPic ? req.session.headPic : ''
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
// 得到自己的所有博客
exports.getBlog = function (req, res, next) {
	var username = req.query.username;
	db.find('article', {username: username}, function (err, result) {
		if (err) {
			res.send('-2'); // 服务器错误
		}else {
			res.send(result);
		}
	})
}
// 分页展示所有博客
exports.showPage = function (req, res, next) {
	var username = req.query.username;
	var page = parseInt(req.query.page);// 将字符串转换成整数
	db.find('article', {username: username}, {"pageamount":10,"page":page}, function(err, result) {
		if (err) {
			res.send('-2'); // 服务器错误
		}else {
			res.send(result);
		}
	})
}
// 跳转到热门博客页面
exports.hotBlog = function (req, res, next) {
	if (req.session.login !== '1') {
		res.redirect('/'); // 没有登陆不能访问
	}else {
		res.render('hotBlog', {
        "username": req.session.login == '1' ? req.session.username : "",
        'headPic': req.session.headPic ? req.session.headPic : ''
    	});
	}
}
// 请求所有热门博客
exports.getHotBlog = function (req, res, next) {
	db.find('article', {}, function (err, result) {
		if (err) {
			res.send('-2'); // 服务器错误
		}else {
			res.send(result);
		}
	})
}
// 分页请求所有热门博客
exports.showHotPage = function (req, res, next) {
	var page = parseInt(req.query.page);// 将字符串转换成整数
	db.find('article', {}, {"pageamount":10,"page":page}, function(err, result) {
		if (err) {
			res.send('-2'); // 服务器错误
		}else {
			res.send(result);
		}
	})
}
// 跳转到我的计划
exports.toMyPlan = function (req, res, next) {
	if (req.session.login !== '1') {
		res.redirect('/'); // 没有登陆不能访问
	}else {
		res.render('myPlan', {
        "username": req.session.login == '1' ? req.session.username : "",
        'headPic': req.session.headPic ? req.session.headPic : ''
    	});
	}
}
// 得到我的计划
exports.getMyPlan = function (req, res, next) {
	db.find('plans', {username: req.session.username}, function(err, result) {
		if (err) {
			res.send('-2'); // 服务器错误
		}else {
			res.send(result);
		}
	})
}
// 存储我的计划
exports.savePlan = function (req, res, next) {
	var form = new formidable.IncomingForm();
	form.parse(req, function (err, fields, files) {
		db.find('plans', {username: req.session.username}, function(err, result) {
			if (err) {
				res.send('-2'); // 服务器错误
			}else {
				if (result.length === 0) {// 还没有计划时插入一个文档
					db.insertOne('plans', {
						username: req.session.username,
						plans: fields.items
					}, function(err, result) {
						if (err) {
							res.send('-2');
						}else {
							res.send('1');
						}
					})
				}else {// 有计划时更新文档
					db.updateMany('plans', {
						username: req.session.username
					},{
						$set: {
							plans: fields.items
						}
					}, function(err, result) {
						if (err) {
							res.send('-2');
						}else {
							res.send('1');
						}
					})
				}
			}
		});
	})
}
// 跳转到聊天室
exports.toChatRoom = function (req, res, next) {
	if (req.session.login !== '1') {
		res.redirect('/'); // 没有登陆不能访问
	}else {
		res.render('chatRoom', {
        "username": req.session.login == '1' ? req.session.username : "",
        'headPic': req.session.headPic ? req.session.headPic : ''
    	});
	}
}
// 跳转到设置个人资料页
exports.toPersonalMes = function (req, res, next) {
	if (req.session.login !== '1') {
		res.redirect('/'); // 没有登陆不能访问
	}else {
		res.render('personalMes', {
        "username": req.session.login == '1' ? req.session.username : "",
        'headPic': req.session.headPic ? req.session.headPic : ''
    	});
	}
}
// 保存资料
exports.saveMes = function (req, res, next) {
	var form = new formidable.IncomingForm();
	// 设置文件上传存放地址
    form.uploadDir = './public/images';
	form.parse(req, function (err, fields, files) {
		var extname = path.extname(files.headPic.name); // 获得后缀名
		// 获得旧的路径
		var oldpath = path.normalize(__dirname + '/../' + files.headPic.path);// 这里面有包含/unploads
        // 新的路径由两个部分组成：用户名、拓展名
        var newpath = path.normalize(__dirname + '/../public/images/' + req.session.username + extname);
        // 改名
        fs.rename(oldpath, newpath, function (err) {
            if (err) {
                throw Error('改名失败');
            }
            db.updateMany('user', {
				username: req.session.username
			},{
				$set: {
					headPic: req.session.username + extname + ''
				}
			}, function(err, result) {
				if (err) {
					res.send('-2');
				}else {
					res.redirect('/'); // 回到首页
				}
			})
        });
	})
}