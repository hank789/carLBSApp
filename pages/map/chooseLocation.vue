<template>
	<view>
		<web-view src="/hybrid/html/map/chooseLocation.html" @message="getMessage"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				position: {
					lng: '',
					lat: '',
					coordsType: '',
					addressName: ''
				}
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
			console.log("chooselocation onLoad")
			
		},
		onShow() {
			console.log('chooselocation show')
		}
	}
</script>
