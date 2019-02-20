<template>
	<view>
		<view class="page-section page-section-gap">
                <map :style="{width: mapWidth, height: mapHeight}" :show-location="true" :latitude="position.coords.latitude" :longitude="position.coords.longitude" :markers="covers">
				</map>
        </view>
		<view class="grace-footer">
			<view class="detail-footer-btn" style="background-color: #09BB07;width: 100%;" @tap.stop.prevent='addTransport'>
				<uni-icon :type="btnIcon"></uni-icon> <text> {{btnLabel}} </text>
			</view>
		</view>
	</view>
</template>

<script>
	import uniIcon from '../../components/uni-icon.vue'
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
				btnIcon: 'navigate',
				mapHeight: '600px',
				mapWidth: '100%'
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
			uni.getSystemInfo({
				success: (res) => {
					console.log(JSON.stringify(res));
					this.mapHeight = (res.windowHeight-15) + 'px'
				}
			});
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
				})
			} else {
				uni.navigateTo({
					url: '/pages/login/login'
				});
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
			//#ifdef APP-PLUS
			plus.geolocation.getCurrentPosition((p) => {
				this.position = p
				this.covers[0] = {
					latitude: this.position.coords.latitude,
					longitude: this.position.coords.longitude,
					iconPath: '../../static/images/location.png'
				}
				console.log(JSON.stringify(this.position))
			},(e) => {
			  console.log('获取位置信息失败: ' + JSON.stringify(e))
			  if (failCallback) {
				failCallback(e.message)
			  }
			}, {geocode: true, provider: 'baidu', coordsType: 'gcj02'})
			//#endif	
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
</style>
