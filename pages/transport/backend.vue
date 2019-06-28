<template>
	<view v-if="src">
		<web-view :src="src"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				src: ''
			}
		},
		computed: {
			
		},
		methods: {
			getMessage(e) {
				var data = e.detail.data
				if (data.length >= 1) {
					this.position = Object.assign(this.position,data[data.length-1])
					console.log(this.position.lat)
					if(this.position.lat) {
						this.$store.commit('setChoosePosition',this.position)
						console.log(this.$store.state.choosePosition.lat)
					}
				}
			}
		},
		onLoad() {
			console.log("backend onLoad")
			var token = this.$ls.get('token')
			this.src = 'https://www.jszioe.com?app_token=' + token
		},
		onShow() {
			console.log('backend show')
		}
	}
</script>
