<template>
	<view>
		<view class='container'>
			<view class='all_ads'>
				<view v-if="detail.transport_status == 0" style="padding:40upx 0;">
					<uni-countdown :timer="countTimerDown" :label="'距行程开始还剩：'" :show-colon="false" color="#FFFFFF" background-color="#00B26A" border-color="#00B26A" ></uni-countdown>
				</view>
				<view v-if="detail.transport_status == 1" style="padding:40upx 0;">
					<uni-countup :timer="countTimerUp" :label="'行程已开始：'" :show-colon="false" color="#FFFFFF" background-color="#00B26A" border-color="#00B26A" ></uni-countup>
				</view>
				<view class='ditu_all' @tap.stop.prevent="go_map">
					<image src='../../static/images/ditu.png'></image>
					<view class='bg'>
					</view>
					<view class='bg_zi'>
						<view class='lc_num' v-show="distance">里程约
							<text>{{distance}}</text></view>
						<view class='button_di'>
							<text>查看地图
								<text class='iconfont icon-you'></text>
							</text>
						</view>
					</view>
				</view>
				<view class='ads_fa'>
					<view class='ads_fa_left'>
						<image src='../../static/images/options_05.png'></image>
						<text>出发地</text>
					</view>
					<text class='ads_xx'>{{detail.transport_start_place}}</text>
				</view>
				<view class='ads_fa ads_shou'>
					<view class='ads_fa_left ads_shou_left'>
						<image src='../../static/images/options_03.png'></image>
						<text>目的地</text>
					</view>
					<text class='ads_xx'>{{detail.transport_end_place}}</text>
				</view>
			</view>
			<view class='all_goods'>
				<text class='roaddeil_title font-family-medium'>行程信息</text>
				<view class='all_goods_li'>
					<text class='name'>行程号</text>
					<text class='mi'>{{detail.transport_number}}</text>
				</view>
				<view class='all_goods_li'>
					<text class='name'>车牌号</text>
					<text class='mi'>{{detail.car_number}}</text>
				</view>
				<view class='all_goods_li'>
					<text class='name'>出发时间</text>
					<text class='mi'>{{detail.transport_start_time}}</text>
				</view>
			</view>
			
			<view class='all_goods'>
				<text class='roaddeil_title huo_title'>供应商联系人</text>
				<view class='all_user_bottom' @tap.stop.prevent="take_phone(detail.transport_contact_vendor_phone)">
					<view class='user_bottom_left'>
						<image class='icon' src='../../static/images/home-active.png'></image>
						<text>{{detail.transport_contact_vendor_people}}</text>
						
						<text>{{detail.transport_contact_vendor_phone}}</text>
						<image class='phone' src='../../static/images/options_01.png'></image>
					</view>
				</view>
			</view>
			
			<view class='all_goods'>
				<text class='roaddeil_title huo_title'>目的地联系人</text>
				<view class='all_user_bottom' @tap.stop.prevent="take_phone(detail.transport_contact_phone)">
					<view class='user_bottom_left'>
						<image class='icon' src='../../static/images/home-active.png'></image>
						<text>{{detail.transport_contact_people}}</text>
						
						<text>{{detail.transport_contact_phone}}</text>
						<image class='phone' src='../../static/images/options_01.png'></image>
					</view>
				</view>
			
			</view>
			
			<view class='all_goods' style="margin-bottom: 20upx;">
				<text class='roaddeil_title huo_title'>货物信息</text>
				<view class='huowu_ul'>
					<view class='huowu_ul_li'>
						<text class='huo_color'>{{detail.transport_goods?detail.transport_goods.transport_goods:''}}</text>
					</view>
				</view>
			</view>
			<view style="height: 100upx;"></view>
			
			<view class="grace-footer">
				<view v-if="detail.transport_status == 0" class="detail-footer-btn" style="background-color: #f8f8f8;color: #000000;width: 30%;" @tap.stop.prevent='editTransport'>
					修改
				</view>
				<view v-if="detail.transport_status == 0" class="detail-footer-btn" style="background-color: #09BB07;width: 70%;" @tap.stop.prevent='startTransport'>
					<uni-icon size="18" :type="'navigate'"></uni-icon>  开始行程
				</view>
				
				<view v-if="detail.transport_status == 1" class="detail-footer-btn" style="background-color: #FF4343;width: 40%;" @tap.stop.prevent='eventReport'>事件上报</view>
				<view v-if="detail.transport_status == 1" class="detail-footer-btn" style="background-color: #09BB07;width: 60%;" @tap.stop.prevent='finishTransport'>
					<uni-icon size="18" :type="'flag'"></uni-icon> 卸货
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import util from '../../lib/util.js'
import uniCountdown from "../../components/uni-countdown.vue"
import uniCountup from "../../components/uni-countup.vue"
import uniIcon from '../../components/uni-icon.vue'
export default {
    data() {
        return {
            id: '',
			countTimerDown: '0',
			countTimerUp: '0',
            detail: {},
			btnDisabled: false
        };
    },
	components: {
		uniCountdown,
		uniCountup,
		uniIcon
	},
    onLoad: function(option) {
        //option为object类型，会序列化上个页面传递的参数,
        this.id = option.id;
    },
	onShow() {
		this.get_data();
	},
	computed: {
		distance() {
			var distance = 0
			if (this.detail.transport_goods && this.detail.transport_goods.transport_start_place_longitude && this.detail.transport_goods.transport_end_place_latitude) {
				distance = util.getDistance(this.detail.transport_goods.transport_start_place_latitude,
				this.detail.transport_goods.transport_start_place_longitude,
				this.detail.transport_goods.transport_end_place_latitude,
				this.detail.transport_goods.transport_end_place_longitude)
				distance = distance + '千米'
			}
			return distance
		}
	},
    methods: {
		editTransport() {
			uni.navigateTo({
				url: '/pages/transport/edit?id=' + this.id
			});
		},
		startTransport() {
			uni.navigateTo({
				url: '/pages/transport/start?id=' + this.id
			});
		},
		eventReport() {
			uni.navigateTo({
				url: '/pages/transport/eventReport?id=' + this.id
			});
		},
		finishTransport() {
			uni.navigateTo({
				url: '/pages/transport/xiehuo?id=' + this.id
			});
		},
        get_data() {
			console.log(this.id)
            this.$ajax
                .get('car/transport/subDetail/'+this.id)
                .then(res => {
                    console.log(JSON.stringify(res));
                    if (res.code == 1000) {
                        this.detail = res.data;
						this.countTimerDown = res.data.transport_start_time + ':00';
						if (this.detail.transport_status == 0) {
							//#ifdef APP-PLUS
							util.getGeoPosition((position) => {
								this.detail.transport_start_place = position.address.city + position.address.district + (position.address.street?position.address.street:'') + (position.address.streetNum?position.address.streetNum:'')
								this.detail.transport_goods.transport_start_place_longitude = position.coords.longitude
								this.detail.transport_goods.transport_start_place_latitude = position.coords.latitude
							})
							//#endif
						} else if (this.detail.transport_status == 1) {
							//进行中
							this.countTimerUp = res.data.transport_goods.transport_start_real_time
							console.log('456:'+this.$store.state.geoWatchId)
							console.log('789:' + this.$store.state.needAlertWhenTransportStart)
							if (this.$store.state.needAlertWhenTransportStart || this.detail.needAlertTransportEnd) {
								uni.vibrateLong({
										success: function () {
												console.log('success');
										}
								});
								this.$store.commit('setAlertTransportStart', false)
								uni.showModal({
										title: '温馨提示',
										content: '亲，别忘了行程结束后打开App，上传您的出库单并点击“行程结束”哦~',
										showCancel: false,
										success: function (res) {
												
										}
								});
							}
							if (!this.$store.state.geoWatchId || ((new Date()).getTime() - this.$store.state.lastPositionUploadTime >= 1000*160)) {
								console.log('保持屏幕常亮')
								// 保持屏幕常亮
								uni.setKeepScreenOn({
									keepScreenOn: true
								});
								this.$ajax.watchGeoPositionAndSave(this.id)
							}
						} else if (this.detail.transport_status == 2) {
							//已结束
							uni.redirectTo({
								url: '/pages/tabBar/index'
							})
						}
                    } else {
                        uni.showToast({
                            title: res.message,
                            icon: 'none'
                        });
                    }
                });
        },
        take_phone(phone) {
            uni.makePhoneCall({
                phoneNumber: phone
            });
        },
        go_map() {
            let latitude = this.detail.transport_goods.transport_end_place_latitude;
            let longitude = this.detail.transport_goods.transport_end_place_longitude;
            uni.openLocation({
                latitude: latitude,
                longitude: longitude,
				name: this.detail.transport_end_place,
                success: function() {
                    console.log('success');
                }
            });
        }
    }
};
</script>

<style>
.container {
	background-color: #F8F8F8;
    background: #f5f5f5;
}
.all_ads {
    background: #fff;
    width: 100%;
    box-sizing: border-box;
}

.all_ads_top {
    margin-top: 20upx;
    box-sizing: border-box;
    line-height: 70upx;
    color: #13bf6c;
    padding: 0 30upx;
}

.all_ads_top image {
    height: 26upx;
    width: 40upx;
    margin: 0 40upx;
}

.all_ads_top .color {
    color: #f76c8a;
}

.all_ads_city {
    color: #a6a6a6;
    font-size: 26upx;
    padding: 0 30upx;
    margin-bottom: 35upx;
}

.all_ads_city text {
    padding-right: 20upx;
}

.all_ads_city .city {
    padding-left: 70upx;
}

.ditu_all {
    width: 100%;
    height: 150upx;
    position: relative;
}

.ditu_all image {
    width: 100%;
    height: 100%;
}

.ditu_all .bg {
    position: absolute;
    top: 0;
    background: #000;
    opacity: 0.4;
    width: 100%;
    height: 100%;
    color: #fff;
}

.ditu_all .bg {
    padding: 0 30upx;
    box-sizing: border-box;
}

.button_di {
    font-size: 26upx;
    display: flex;
    justify-content: flex-end;
}

.lc_num {
    line-height: 70upx;
}

.lc_num text {
    color: #13bf6c;
    font-weight: bold;
}

.ditu_all .bg_zi {
    padding: 0 30upx;
    box-sizing: border-box;
    color: #fff;
    position: absolute;
    top: 0;
    width: 100%;
}

.ads_fa_left {
    display: flex;
    flex-direction: column;
    width: 90upx;
    align-items: center;
    padding-right: 40upx;
    color: #13bf6c;
    font-size: 24upx;
	font-weight: 500;
}

.ads_fa_left image {
    height: 50upx;
    width: 50upx;
}

.ads_fa {
    display: flex;
    padding: 16upx 30upx;
    background: #fff;
    border-bottom: 1px solid #ececec;
    align-items: center;
}

.ads_fa .ads_xx {
    color: #a6a6a6;
}

.ads_shou_left {
    color: #f76c8a;
}

.ads_shou {
    border-bottom: none;
}

/* 车辆需求 */
.roaddeil_title {
    line-height: 80upx;
    color: #13bf6c;
    margin: 0 30upx;
    display: block;
	font-weight: 500;
}

.huo_title {
    border-bottom: 1px solid #ececec;
}

.all_goods {
    background: #fff;
    width: 100%;
    box-sizing: border-box;
    margin-top: 20upx;
}

.all_goods_li {
    margin: 0 30upx;
    line-height: 80upx;
    border-top: 1px solid #ececec;
    display: flex;
    flex-direction: row;
    align-items: center;
}

.all_goods_li .name {
    width: 220upx;
    display: inline-block;
	color: #a6a6a6;
}

/* 货物信息 */
.huowu_ul {
    display: flex;
    padding-top: 20upx;
}

.huowu_ul_li {
    width: 100%;
    text-align: left;
	margin: 0 30upx;
    display: flex;
    flex-direction: column;
    padding-bottom: 20upx;
}

/* 截单 */
.freight_li_time {
    line-height: 55upx;
    display: flex;
    justify-content: center;
    font-size: 24upx;
}

.freight_li_time .time_all {
    color: #a6a6a6;
}

.freight_li_time .time_all .color {
    color: #13bf6c;
}

.all_user_top {
    display: flex;
    justify-content: space-between;
    margin: 0 30upx;
    line-height: 80upx;
    align-items: center;
    border-bottom: 1px solid #ececec;
}

.user_bottom_right image {
    height: 80upx;
    width: 80upx;
}

.user_bottom_right {
    display: flex;
    flex-direction: column;
    color: #f76c8a;
    font-size: 22upx;
    align-items: center;
}

.user_bottom_left .icon {
    height: 97upx;
    width: 97upx;
    border-radius: 50%;
    border: 1px solid #13bf6c;
}

.user_bottom_left text {
    padding: 0 20upx;
}

.user_bottom_left .phone {
    height: 50upx;
    width: 50upx;
	padding-left: 20upx;
}

.user_bottom_left {
    display: flex;
    align-items: center;
}

.all_user_bottom {
    display: flex;
    justify-content: space-between;
    width: 100%;
	padding: 16upx 30upx;
	box-sizing: border-box;
}

</style>
