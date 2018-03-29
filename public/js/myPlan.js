new Vue({
	el: '#app',
	data () {
		return {
			newItem: '',
			items: []
		}
	},
	mounted () {
		this.$nextTick(function () {
			this.get();
		})
	},
	beforeDestroy () {
		this.$nextTick(function () {
			this.post();
		})
	},
	methods: {
		get: function () {
			this.$http.get('/getMyPlan').then(function (res) {
				this.items = res.data ? res.data[0].plans : [];// 存在则赋值，不存在则置空
			})
		},
		addNew: function () {
			this.items.unshift({
				label: this.newItem,
				isFinished: false,
				date: new Date()
			});// 新来的排前面
			this.newItem = '';// 清除输入框
			this.$http.post('/savePlan', {items: this.items}).then(function (res) {
				console.log(res.data);
			})
		},
		toggleFinished: function (item) {
			item.isFinished = !item.isFinished;
		}
	}
})