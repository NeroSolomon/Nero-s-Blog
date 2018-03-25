new Vue({
	el: '#app',
	data () {
		return {
			msg: '',
			article: []
		}
	},
	mounted () {
		this.$nextTick(function () {
        	this.get(); // 调用get方法
      	})
	},
	methods: {
		get: function() {
			var username = document.getElementById('username').innerHTML;
			this.$http.get('/getBlog', {
				username: username
			}).then(function (res) {
				for (var i = res.data.length - 1; i >= 0; i--) {
					this.article.push(res.data[i].article);
					this.title.push(res.data[i].title);
				}
			})
		}
	}
})