<template>
	<view>
		<view class="uni-common-mt">
			<view v-if="showMap">
				<map :style="{height: mapHeight}" show-location="true" :latitude="position.coords.latitude" :longitude="position.coords.longitude" :markers="covers"></map>
			</view>
        </view>
		<view class="grace-footer">
			<view class="detail-footer-btn" style="background-color: #09BB07;width: 100%;" @tap.stop.prevent='addTransport'>
				<uni-icon size="18" :type="btnIcon"></uni-icon> <text> {{btnLabel}} </text>
			</view>
		</view>
	</view>
</template>

<script>
	import uniIcon from '../../components/uni-icon.vue'
	import util from '../../lib/util.js'
	import {
		mapState
	} from 'vuex';
	
	export default {
		computed: mapState(['hasLogin', 'userName']),
		data() {
			return {
				transport_sub_id: '',
				position: {
					coords:{
						latitude: 39.909,
						longitude: 116.39742
					}
				},
				covers: [{
					latitude: 39.909,
					longitude: 116.39742,
					iconPath: '../../static/images/location.png'
				}],
				btnLabel: '添加行程',
				btnIcon: 'plus',
				mapHeight: '600upx',
				mapWidth: '100%',
				showMap: false
			}
		},
		components: {
			uniIcon
		},
		computed: {
			
		},
		methods: {
			addTransport() {
				if (this.transport_sub_id) {
					uni.navigateTo({
						url: '/pages/transport/detail?id=' + this.transport_sub_id
					});
				} else {
					uni.navigateTo({
						url: '/pages/transport/add'
					});
				}
				
			}
		},
		onLoad() {
			var appInfo = this.$ls.get('appDeviceInfo')
			console.log(JSON.stringify(appInfo));
			this.mapHeight = (appInfo.windowHeight - appInfo.statusBarHeight - 90) + 'px'
			console.log('mapHeight:' + this.mapHeight)
			this.mapWidth = appInfo.windowWidth + 'px'
			
			let that = this;
			if (this.$ls.get('token')) {
				this.$ajax.get('profile/info').then(res => {
					this.$ls.set('user',res.data)
					if (!res.data.name) {
						uni.navigateTo({
							url: '/pages/login/updateInfo'
						});
					} else if (res.data.transport_sub_id) {
						uni.navigateTo({
							url: '/pages/transport/detail?id=' + res.data.transport_sub_id
						});
					}
					this.showMap = true
				})
			} else {
				uni.navigateTo({
					url: '/pages/login/login'
				});
				this.showMap = true
			}
			console.log("onLoad")
		},
		onShow() {
			var user = this.$ls.get('user')
			if (user) {
				this.transport_sub_id = user.transport_sub_id
				if (user.transport_sub_id) {
					this.btnLabel = '查看行程'
					this.btnIcon = 'info'
				}
			}
			util.getGeoPosition((p) => {
				this.position = p
				this.covers[0] = {
					latitude: this.position.coords.latitude,
					longitude: this.position.coords.longitude,
					iconPath: '../../static/images/location.png'
				}
				console.log(JSON.stringify(this.position))
			})
		}
	}
</script>

<style>
	.detail-footer-btn {
	    width: 50%;
	    height: 45px;
	    line-height: 45px;
	    font-size: 15px;
	    color: #FFF;
	    text-align: center;
	    background: #FF7900;
	}
	map {
		width: 100%;
	}
</style>
