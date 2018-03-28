new Vue({
	el: '#app',
	data () {
		return {
			msg: '',
			articles: [],
			pages: 0,
			active: 1
		}
	},
	mounted () {
		this.$nextTick(function () {
        	this.get(); // 调用get方法
      	})
	},
	methods: {
		get: function() {
			this.$http.get('/getHotBlog').then(function (res) {
				this.pages = Math.ceil(res.data.length / 10);
			});
			this.showHotPage(0);
		},
		showHotPage: function(n) {
			this.active = n + 1;
			this.articles = [];// 请求前先清空
			this.$http.get('/showHotPage?page=' + n).then(function (res) {
				for (var i = res.data.length - 1; i >= 0; i--) {
					var json ={};
					json.article= res.data[i].article;
					json.title = res.data[i].title;
					this.articles.push(json);
				}
			})
		}
	}
})