new Vue({
	el: '#app',
	data () {
		return {
			mask: false,
			msg: '',
			regist_name: '',
			regist_password: '',
			regist_password02: '',
			result: ''
		}
	},
	methods: {
		showMask: function() {
			this.mask = true;
		},
		closeLoginBox: function() {
			this.mask = false;
		},
		post: function() {
			if (this.regist_password === this.regist_password02) {// 判断两次输入的密码正确与否
				this.$http.post('/regist', {username: this.regist_name, password: this.regist_password}).then(function (res) {
            	    this.result = res.data;
            	    if (this.result == '1') {
            	    	window.location = '/'; //回到首页
            	    }else if (this.result == '-1') {
            	    	this.msg = '此用户名已被注册';
            	    }else {
            	    	this.msg = '服务器错误';
            	    }
            	});
			}else {
				this.msg = '两次密码输入不同';
			}

		}
	}
})