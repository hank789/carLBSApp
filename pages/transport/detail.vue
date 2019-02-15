<template>
	<view>
		<view class='container'>
			<view class='all_ads'>
				<view class='all_ads_top'>
					<text>{{detail.deliver_district}}</text>
					<image src='../../static/images/roaddeil_01.png'></image>
					<text class='color'>{{detail.accept_districe}}</text>
				</view>
				<view class='all_ads_city'>
					<text>{{detail.deliver_province}} {{detail.deliver_city}}</text>

					<text class='city'>{{detail.accept_province}} {{detail.accept_city}}</text>
				</view>
				<view class='ditu_all' @tap.stop.prevent="go_map">
					<image src='../../static/images/ditu.png'></image>
					<view class='bg'>
					</view>
					<view class='bg_zi'>
						<view class='lc_num'>里程约
							<text>{{detail.distance}}</text></view>
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
						<text>发货</text>
					</view>
					<text class='ads_xx'>{{detail.transport_start_place}}</text>
				</view>
				<view class='ads_fa ads_shou'>
					<view class='ads_fa_left ads_shou_left'>
						<image src='../../static/images/options_03.png'></image>
						<text>收货</text>
					</view>
					<text class='ads_xx'>{{detail.transport_end_place}}</text>
				</view>
			</view>
			<view class='all_goods'>
				<text class='roaddeil_title'>行程信息</text>
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
			
			<view class='all_user all_goods'>
				<view class='all_user_top'>
					<text class='user_top_title'>行程联系人</text>
				</view>

				<view class='all_user_bottom' @tap.stop.prevent="take_phone(detail.transport_contact_phone)">
					<view class='user_bottom_left'>
						<image class='icon' src='../../static/images/home-active.png'></image>
						<text>{{detail.transport_contact_people}}</text>
						<image class='phone' src='../../static/images/options_01.png'></image>
						<text>{{detail.transport_contact_phone}}</text>
					</view>
				</view>

			</view>
			<view class='all_goods'>
				<text class='roaddeil_title huo_title'>货物信息</text>
				<view class='huowu_ul'>
					<view class='huowu_ul_li'>
						<text class='huo_color'>{{detail.transport_goods}}</text>
					</view>
				</view>
			</view>
			<view class="" style="height: 100upx;"></view>
		</view>
	</view>
</template>

<script>
export default {
    data() {
        return {
            id: '',
            detail: {}
        };
    },
    onLoad: function(option) {
        //option为object类型，会序列化上个页面传递的参数,
        this.id = option.id;
        this.get_data();
    },
    methods: {
        get_data() {
            this.$ajax
                .get('car/transport/subDetail/'+this.id)
                .then(res => {
                    console.log(JSON.stringify(res));
                    if (res.code == 1000) {
                        this.detail = res.data;
                    } else {
                        uni.showToast({
                            title: res.msg,
                            icon: 'none'
                        });
                    }
                });
        },
        take_phone(phone) {
            uni.makePhoneCall({
                phoneNumber: phone //仅为示例
            });
        },

        go_map() {
            let latitude = this.detail.destination.lat;
            let longitude = this.detail.destination.lng;
            uni.openLocation({
                latitude: latitude,
                longitude: longitude,
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
    font-size: 22upx;
}

.ads_fa_left image {
    height: 50upx;
    width: 50upx;
}

.ads_fa {
    display: flex;
    margin: 0 30upx;
    padding: 40upx 10upx;
    background: #fff;
    border-bottom: 1px solid #ececec;
    align-items: center;
}

.ads_fa .ads_xx {
    color: #a6a6a6;
    font-size: 26upx;
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

.all_goods_li .mi {
    color: #a6a6a6;
}

.all_goods_li .name {
    width: 220upx;
    display: inline-block;
}

/* 货物信息 */
.huowu_ul {
    display: flex;
    padding-top: 20upx;
}

.huowu_ul_li {
    width: 33.33%;
    text-align: center;
    display: flex;
    flex-direction: column;
    padding-bottom: 20upx;
}

.huo_color {
    color: #a6a6a6;
    font-size: 26upx;
    line-height: 50upx;
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

.user_top_title {
    color: #13bf6c;
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
}

.user_bottom_left {
    display: flex;
    align-items: center;
}

.all_user_bottom {
    display: flex;
    justify-content: space-between;
    width: 100%;
}

.all_user_bottom {
    padding: 30upx;
    box-sizing: border-box;
}
</style>
