new Vue({
	el: '#app',
	data () {
		return {
			msg: ''
		}
	},
	mounted () {
		this.$nextTick(function () {
          this.get(); // 调用get方法
      	})
	},
	method: {
		get: function() {

		}
	}
})