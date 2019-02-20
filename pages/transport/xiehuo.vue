<template>
    
        <view class="grace-padding grace-bg-white grace-common-mt grace-common-border">
            <view class="grace-form">
                <form>
                    <view class="grace-items">
                        <view class="grace-label">行程号</view>
						<text class="input">{{transport_number}}</text>
                    </view>
					<view class="grace-items">
					    <view class="grace-label">车牌号</view>
					    <input type="text" class="input" v-model.trim="car_number" placeholder="本次行程的车辆车牌号码"></input>
					</view>
					
					<view class="grace-items">
					    <view class="grace-label">联系人</view>
					    <text class="input">{{transport_contact_people}}</text>
					</view>
					
					<view class="grace-items" @tap.stop.prevent="take_phone()">
					    <view class="grace-label">联系电话</view>
					    <text class="input">{{transport_contact_phone}}</text>
					</view>
					
					<view class="grace-items">
					    <view class="grace-label">目的地</view>
					    <input type="text" class="input" @focus="chooseLocation" v-model.trim="transport_end_place" placeholder="本次行程的目的地"></input>
					</view>
                    <view class="grace-items grace-noborder">
						<view class="uni-textarea">
							<textarea style="height: 460upx;" maxlength=-1 v-model.trim="transport_goods" placeholder="本次行程运输的货物描述" />
						</view>
                    </view>
					<view class="feedback-title"><text>验收单(选填,提供验收截图,总大小10M以下)</text></view>
					<view class="feedback-body feedback-uploader">
						<view class="uni-uploader">
							<view class="uni-uploader-head">
								<view class="uni-uploader-title">点击预览图片</view>
								<view class="uni-uploader-info">{{ imageList.length }}/8</view>
							</view>
							<view class="uni-uploader-body">
								<view class="uni-uploader__files">
									<block v-for="(image, index) in imageList" :key="index">
										<view class="uni-uploader__file" style="position: relative;">
											<image
												class="uni-uploader__img"
												:src="image"
												@tap="previewImage"
											></image>
											<view class="close-view" @click="close(index)">x</view>
										</view>
									</block>
									<view class="uni-uploader__input-box" v-show="imageList.length < 8">
										<view class="uni-uploader__input" @tap="chooseImg"></view>
									</view>
								</view>
							</view>
						</view>
					</view>
                    <view style="padding:22upx 0;">
                        <button type="primary" style="width:100%;" @tap.stop.prevent="transPortXiehuoEnd(2)">中途卸货</button>
                    </view>
					<view style="padding:22upx 0;">
						<button type="warn" style="width:100%;" @tap.stop.prevent="transPortXiehuoEnd(1)">行程结束</button>
					</view>
                </form>
            </view>
        </view>
    
</template>
<script>
import util from '../../lib/util.js'
import uniIcon from '../../components/uni-icon.vue'
export default {
    data() {
        return {
			transport_sub_id: '',
			transport_number: '',
			transport_number_ok: false,
			car_number: '',
			transport_end_place: '',
            transport_goods: '',
			transport_end_place_longitude: '',
			transport_end_place_latitude: '',
			transport_contact_people: '',
			transport_contact_phone: '',
			imageList: []
        }
    },
	onLoad: function(option) {
	    //option为object类型，会序列化上个页面传递的参数,
	    this.transport_sub_id = option.id;
	    this.get_data();
	},
	components: {
		uniIcon
	},
    methods:{
		chooseLocation: function () {
			uni.chooseLocation({
				success: (res) => {
					this.transport_end_place = res.address,
					this.transport_end_place_latitude = res.latitude
					this.transport_end_place_longitude = res.longitude
				}
			})
		},
		take_phone() {
		    uni.makePhoneCall({
		        phoneNumber: this.transport_contact_phone
		    });
		},
		get_data() {
		    this.$ajax
		        .get('car/transport/subDetail/'+this.transport_sub_id)
		        .then(res => {
		            console.log(JSON.stringify(res));
		            if (res.code == 1000) {
		                this.transport_number = res.data.transport_number;
						this.transport_number_ok = true;
						this.car_number = res.data.car_number;
						
						this.transport_end_place = res.data.transport_end_place;
						this.transport_goods = res.data.transport_goods.transport_goods;
						this.transport_contact_phone = res.data.transport_contact_phone
						this.transport_contact_people = res.data.transport_contact_people
						//#ifdef APP-PLUS
						util.getGeoPosition((position) => {
							this.transport_end_place = position.address.city + position.address.district + position.address.street + position.address.streetNum
							this.transport_end_place_longitude = position.coords.longitude
							this.transport_end_place_latitude = position.coords.latitude
						})
						//#endif
		            } else {
		                uni.showToast({
		                    title: res.msg,
		                    icon: 'none'
		                });
		            }
		        });
		},
        transPortXiehuoEnd(type=1) {
            console.log('transPortXiehuoEnd:' + type);
			
			if (!util.isVehicleNumber(this.car_number)) {
				uni.showToast({title:"车牌号有误", icon:"none"});
				return;
			}
			if (!this.transport_end_place) {
				uni.showToast({title:"目的地有误", icon:"none"});
				return;
			}
			
			if (!this.transport_goods) {
				uni.showToast({title:"请填写本次运输的货物", icon:"none"});
				return;
			}
			var xiehuo_type = '行程结束'
			var redirectUrl = '/pages/tabBar/index'
			if (type == 2) {
				xiehuo_type = '中途卸货'
				redirectUrl = '/pages/transport/detail?id=' + this.transport_sub_id
			}
			uni.showModal({
				content: '确定' + xiehuo_type +'？',
				confirmText: "确定",
				cancelText: "取消",
				showCancel: true,
				success: (res) => {
					if (res.confirm) {
						console.log('用户点击确定');
						util.getGeoPosition((position) => {
							var formData = {
								transport_sub_id: this.transport_sub_id,
								xiehuo_type: type,
								car_number: this.car_number,
								transport_goods: this.transport_goods,
								transport_end_place: this.transport_end_place,
								transport_end_place_longitude: this.transport_end_place_longitude,
								transport_end_place_latitude: this.transport_end_place_latitude,
							}
							if (this.imageList.length > 0) {
								let imgs = this.imageList.map((value, index) => {
									return {
										name: 'image' + index,
										uri: value
									};
								});
								formData.position = JSON.stringify(position)
								this.$ajax
									.upload_file('car/transport/finish', imgs, formData, true)
									.then(res => {
										console.log(JSON.stringify(res));
										if (res.code === 1000) {
											uni.showToast({
												title: '卸货成功!'
											});
											this.imageList = [];
											if (type == 1) {
												this.$ajax.stopWatchGeoPosition('', this.transport_sub_id)
											}
											uni.redirectTo({
												url: redirectUrl
											});
										}
									});
							} else {
								formData.position = position
								this.$ajax.post('car/transport/finish', formData, true).then(res => {
									console.log(res);
									if (res.code == 1000) {
										uni.showToast({
											title: '卸货成功',
											icon: 'none'
										})
										if (type == 1) {
											this.$ajax.stopWatchGeoPosition('', this.transport_sub_id)
										}
										uni.redirectTo({
											url: redirectUrl
										});
									} else {
										this.transport_number_ok = false;
										uni.showToast({
											title: res.message,
											icon: 'none'
										})
									}
								})
							}
						})
						
					} else if (res.cancel) {
						console.log('用户点击取消');
					}
				}
			});
        }
    }
}
</script>