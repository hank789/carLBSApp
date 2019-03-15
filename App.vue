<script>
	import util from './lib/util.js'
	export default {
		onLaunch: function () {
			console.log('App Launch');
			this.$ls.set('appDeviceInfo',uni.getSystemInfoSync())
			//#ifdef APP-PLUS
			/* 5+环境锁定屏幕方向 */
			plus.screen.lockOrientation('portrait-primary'); //锁定
			/* 5+环境升级提示 */
			util.checkUpdate(this)
			//#endif
		},
		onShow: function () {
			console.log('App Show')
			this.$store.commit('setAppHide', false)
			this.$ls.remove('geoPositionsUploading')
			util.releaseWakeLock()
			if (this.$ls.get('token')) {
				var user = this.$store.state.user
				let geoWatchId = this.$store.state.geoWatchId
				console.log('geoWatchId: '+geoWatchId)
				if (user && user.transport_sub_status == 1 && !geoWatchId) {
					console.log('App Show and watch position')
					this.$ajax.watchGeoPositionAndSave(user.transport_sub_id)
				}
			}
		},
		onHide: function () {
			console.log('App Hide')
			this.$store.commit('setAppHide', true)
			var user = this.$store.state.user
			if (user && user.transport_sub_status == 1) {
				console.log('App Hide and wakeLock:' + user.transport_sub_id)
				this.$ajax.watchGeoPositionAndSave(user.transport_sub_id)
				util.wakeLock()
			}
		}
	}
</script>
<style>
	/* uni.css - 通用组件、模板样式库，可以当作一套ui库应用 */
	@import "./common/uni.css";
	@import "./graceUI/graceUI.css";
	
	map {
		width: 100%;
	}
	.form-label {
		color: #a6a6a6;
	}
	.close-view {
		text-align: center;
		line-height: 44upx;
		height: 48upx;
		width: 48upx;
		border-radius: 50%;
		background: #ff5053;
		color: #ffffff;
		position: absolute;
		top: -12upx;
		right: -8upx;
		font-size: 40upx;
	}
</style>