<template>
	<view>
		<view class="uni-common-mt">
			<view v-if="showMap">
				<map :style="{height: mapHeight}" scale=18 show-location @callouttap="getCurrentPosition" @markertap="getCurrentPosition" @controltap="getCurrentPosition" :latitude="position.coords.latitude" :longitude="position.coords.longitude" :markers="covers" :polyline="polylines"></map>
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
					iconPath: '../../static/images/runnigpoint.png',
				}],
				polylines: [
					{
						points: [],
						color: '#007aff',
						width: 8,
						dottedLine: false
					}
				],
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
		onNavigationBarButtonTap(e) {
			var itemList = []
			var appInfo = this.$ls.get('appDeviceInfo')
			if (this.$store.state.user.isManager) {
				if (this.$store.state.user.id == 1 && appInfo.platform == 'ios') {
					itemList = ['车辆管理', '退出登录']
				} else {
					itemList = ['行程管理', '车辆管理', '退出登录']
				}
			} else {
				itemList = ['退出登录']
			}
			uni.showActionSheet({
				title:'管理',
				itemList: itemList,
				success: (e) => {
					switch (itemList[e.tapIndex]) {
						case '行程管理':
							uni.navigateTo({
								url: '/pages/transport/backend'
							});
							break;
						case '车辆管理':
							uni.navigateTo({
								url: '/pages/transport/carList'
							});
							break;
						case '退出登录':
							uni.showModal({
								title: '提示',
								content: '确认退出当前登录？',
								success: (res) => {
									if (res.confirm) {
										console.log('用户点击确定');
										this.$ls.set('token','');
										this.$store.commit('setUser','');
										this.$ajax.stopWatchGeoPosition('',this.transport_sub_id)
										uni.reLaunch({
											url: '/pages/login/login'
										});
									} else if (res.cancel) {
										console.log('用户点击取消');
									}
								}
							});
							break;
					}
				}
			})
		},
		methods: {
			getCurrentPosition() {
				util.getGeoPosition((p) => {
					this.position = p
					this.covers[0] = {
						latitude: this.position.coords.latitude,
						longitude: this.position.coords.longitude,
						iconPath: '../../static/images/runnigpoint.png',
						callout: this.mapCallout
					}
					this.polylines[0].points.push({longitude: this.position.coords.longitude,latitude: this.position.coords.latitude})
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
							//console.log(formatP)
							p.coords.longitude = formatP[0]
							p.coords.latitude = formatP[1]
							p.coordsType = 'gcj02'
						}
						this.position = p
						this.covers[0] = {
							latitude: this.position.coords.latitude,
							longitude: this.position.coords.longitude,
							iconPath: '../../static/images/runnigpoint.png',
							callout: this.mapCallout
						}
						this.polylines[0].points.push({longitude: this.position.coords.longitude,latitude: this.position.coords.latitude})
					})
					this.isWatched = true
				}
			},
			setMapHeight() {
				var appInfo = this.$ls.get('appDeviceInfo')
				console.log(JSON.stringify(appInfo));
				this.mapHeight = (appInfo.windowHeight - appInfo.statusBarHeight - 90) + 'px'
				console.log('mapHeight:' + this.mapHeight)
				this.mapWidth = appInfo.windowWidth + 'px'
			}
		},
		onLoad() {
			this.setMapHeight()
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
				this.transport_sub_id = user.transport_sub_id
				this.btnLabel = '查看行程'
				this.btnIcon = 'info'
				this.showMap = true
				this.setMapHeight()
				if (user.transport_sub_status == 1) {
					if (!this.isWatched || ((new Date()).getTime() - this.$store.state.lastPositionUploadTime >= 1000*160)) {
						console.log('tabBar index show and watch position')
						this.watchPosition()
					}
				}
			}
			if (!this.transport_sub_id || !this.isWatched) {
				this.getCurrentPosition()
			}
		}
	}
</script>