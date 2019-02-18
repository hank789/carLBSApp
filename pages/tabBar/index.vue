<template>
	<view>
		<view style="padding:22upx 0;">
		    <button type="primary" style="width:100%;" @tap.stop.prevent="addTransport">添加行程</button>
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	
	export default {
		computed: mapState(['hasLogin', 'userName']),
		data() {
			return {
				position: {
					coords:{
						latitude: 39.909,
						longitude: 116.39742
					}
				},
				covers: [{
					latitude: 39.909,
					longitude: 116.39742,
					iconPath: '../../../static/location.png'
				}]
			}
		},
		created() {
			
		},
	 
		onShow() {
			
		},
		methods: {
			addTransport() {
				uni.navigateTo({
					url: '/pages/transport/add'
				});
			}
		},
		mounted() {
			//#ifdef APP-PLUS
			plus.geolocation.getCurrentPosition((p) => {
				this.position = p
				this.covers.push({
					latitude: this.position.coords.latitude,
					longitude: this.position.coords.longitude,
					iconPath: '../../../static/location.png'
				})
				console.log(JSON.stringify(this.position))
			},(e) => {
			  console.log('获取位置信息失败: ' + JSON.stringify(e))
			  if (failCallback) {
				failCallback(e.message)
			  }
			}, {geocode: true, provider: 'baidu', coordsType: 'gcj02'})
			//#endif
		},
		onLoad() {
			let that = this;
			if (this.$ls.get('token')) {
				this.$ajax.get('profile/info').then(res => {
					if (!res.data.name) {
						uni.redirectTo({
							url: '/pages/login/updateInfo'
						});
					} else if (res.data.transport_sub_id) {
						uni.redirectTo({
							url: '/pages/transport/detail?id=' + res.data.transport_sub_id
						});
					}
				})
			} else {
				uni.navigateTo({
					url: '/pages/login/login'
				});
			}
			console.log("onLoad")	
		}
	}
</script>

<style>
	
</style>
