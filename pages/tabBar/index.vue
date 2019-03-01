<template>
	<view>
		<view class="uni-common-mt">
			<view v-if="showMap">
				<map :style="{height: mapHeight}" show-location="true" @callouttap="getCurrentPosition" :latitude="position.coords.latitude" :longitude="position.coords.longitude" :markers="covers"></map>
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
	import gcoord from '../../lib/gcoord.js'
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
					iconPath: '../../static/images/location.png',
				}],
				mapLabel: {
					content: '当前位置'
				},
				mapCallout: {
					content: '您的当前位置'
				},
				mapControls: [
					
				],
				btnLabel: '添加行程',
				btnIcon: 'plus',
				mapHeight: '600upx',
				mapWidth: '100%',
				showMap: false,
				isWatched: false
			}
		},
		components: {
			uniIcon
		},
		computed: {
			
		},
		methods: {
			getCurrentPosition() {
				util.getGeoPosition((p) => {
					this.position = p
					this.covers[0] = {
						latitude: this.position.coords.latitude,
						longitude: this.position.coords.longitude,
						iconPath: '../../static/images/location.png',
						callout: this.mapCallout,
						label: this.mapLabel
					}
					console.log(JSON.stringify(this.position))
				})
			},
			addTransport() {
				if (this.btnIcon == 'info') {
					uni.navigateTo({
						url: '/pages/transport/detail?id=' + this.transport_sub_id
					});
				} else {
					uni.navigateTo({
						url: '/pages/transport/add'
					});
				}
			},
			watchPosition() {
				if (this.transport_sub_id) {
					this.$ajax.watchGeoPositionAndSave(this.transport_sub_id,false,(p) => {
						if (p.coordsType != 'gcj02') {
							var coordsType = gcoord.GCJ02
							var toCoordsType = gcoord.GCJ02
							if (p.coordsType == 'wgs84') {
								coordsType = gcoord.WGS84
							} else if (p.coordsType == 'bd09ll') {
								coordsType = gcoord.BD09LL
							} else if (p.coordsType == 'bd09') {
								coordsType = gcoord.BD09
							} else if (p.coordsType == 'gcj02') {
								coordsType = gcoord.GCJ02
							}
							
							var formatP = gcoord.transform([p.coords.longitude,p.coords.latitude],coordsType,toCoordsType)
							console.log(formatP)
							p.coords.longitude = formatP[0]
							p.coords.latitude = formatP[1]
							p.coordsType = 'gcj02'
						}
						this.position = p
						this.covers[0] = {
							latitude: this.position.coords.latitude,
							longitude: this.position.coords.longitude,
							iconPath: '../../static/images/location.png',
							callout: this.mapCallout,
							label: this.mapLabel
						}
					})
					this.isWatched = true
				}
			}
		},
		onLoad() {
			var appInfo = this.$ls.get('appDeviceInfo')
			console.log(JSON.stringify(appInfo));
			this.mapHeight = (appInfo.windowHeight - appInfo.statusBarHeight - 90) + 'px'
			console.log('mapHeight:' + this.mapHeight)
			this.mapWidth = appInfo.windowWidth + 'px'
			
			if (this.$ls.get('token')) {
				this.$ajax.getUserInfo().then(res => {
					this.transport_sub_id = res.data.transport_sub_id
					if (!res.data.name) {
						uni.redirectTo({
							url: '/pages/login/updateInfo'
						});
					} else if (this.transport_sub_id) {
						if (res.data.transport_sub_status == 1) {
							console.log('tabBar index onLoad and watch position')
							// 保持屏幕常亮
							uni.setKeepScreenOn({
								keepScreenOn: true
							});
							this.watchPosition()
						}
						uni.navigateTo({
							url: '/pages/transport/detail?id=' + res.data.transport_sub_id
						});
						this.showMap = true
					} else {
						this.showMap = true
					}
				})
			} else {
				uni.redirectTo({
					url: '/pages/login/login'
				});
			}
			console.log("tabBar index onLoad")
		},
		onShow() {
			console.log('tabBar index show')
			var user = this.$store.state.user
			if (user && user.transport_sub_id) {
				this.btnLabel = '查看行程'
				this.btnIcon = 'info'
				if (!this.isWatched && user.transport_sub_status == 1) {
					console.log('tabBar index show and watch position')
					this.watchPosition()
				}
			}
			if (!this.transport_sub_id) {
				this.getCurrentPosition()
			}
		}
	}
</script>