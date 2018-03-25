new Vue({
	el: '#app',
	data () {
		return {
			title: '',
			article: '',
			status: false
		}
	},
	methods: {
		post: function () {
			var username = document.getElementById('username').innerHTML;
			this.$http.post('/postBlog', {
				username: username,
				title: this.title,
				article: this.article
			}).then(function(res) {
				if (res.data == '1') {
					this.status = true;
				}
			})
		}
	}
})