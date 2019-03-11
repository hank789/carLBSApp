<template>
    
        <view class="grace-padding grace-bg-white grace-common-mt grace-common-border">
            <view class="grace-form">
                <form>
                    <view class="grace-items">
                        <view class="grace-label form-label">行程号</view>
						<text class="input">{{transport_number}}</text>
                    </view>
					<view class="grace-items" @tap.stop.prevent="showKey">
					    <view class="grace-label form-label">车牌号</view>
						<tki-float-keyboard ref="keyb" mode="car" type="0" title="车牌号" @del="carNumberDel" @val="carNumberVal" @show="carNumberShow" @hide="carNumberHide"></tki-float-keyboard>
					    <input type="text" disabled class="input" v-model.trim="car_number" placeholder="本次行程的车辆车牌号码"></input>
					</view>
					
					<view class="grace-items">
					    <view class="grace-label form-label">联系人</view>
					    <text class="input">{{transport_contact_people}}</text>
					</view>
					
					<view class="grace-items" @tap.stop.prevent="take_phone()">
					    <view class="grace-label form-label">联系电话</view>
					    <text class="input">{{transport_contact_phone}}</text>
					</view>
					
					<view class="grace-items" @tap.stop.prevent="chooseLocation">
					    <view class="grace-label form-label">目的地</view>
					    <input type="text" disabled class="input" v-model.trim="transport_end_place" placeholder="本次行程的目的地"></input>
					</view>
                    <view class="grace-items">
						<view class="uni-textarea">
							<textarea style="height: 460upx;" maxlength=-1 v-model.trim="transport_goods" placeholder="本次行程运输的货物描述" />
						</view>
                    </view>
					<view class="feedback-body feedback-uploader">
						<view class="uni-uploader">
							<view class="uni-uploader-head">
								<view class="uni-uploader-title" style="color: #a6a6a6;">上传验收单(选填)</view>
								<view class="uni-uploader-info">{{ imageList.length }}/8</view>
							</view>
							<view class="uni-uploader-body">
								<view class="uni-uploader__files">
									<block v-for="(image, index) in imageList" :key="index">
										<view class="uni-uploader__file" style="position: relative;">
											<image
												class="uni-uploader__img"
												:src="image"
												@tap.stop.prevent="previewImage"
											></image>
											<view class="close-view" @tap.stop.prevent="close(index)">x</view>
										</view>
									</block>
									<view class="uni-uploader__input-box" v-show="imageList.length < 8">
										<view class="uni-uploader__input" @tap.stop.prevent="chooseImg"></view>
									</view>
								</view>
							</view>
						</view>
					</view>
                    <view style="padding:22upx 0;">
                        <button :disabled="btnDisabled" type="primary" style="width:100%;" @tap.stop.prevent="transPortXiehuoEnd(2)">中途卸货</button>
                    </view>
					<view style="padding:22upx 0;">
						<button :disabled="btnDisabled" type="warn" style="width:100%;" @tap.stop.prevent="transPortXiehuoEnd(1)">行程结束</button>
					</view>
                </form>
            </view>
        </view>
    
</template>
<script>
import util from '../../lib/util.js'
import uniIcon from '../../components/uni-icon.vue'
import tkiFloatKeyboard from "@/components/tki-float-keyboard/tki-float-keyboard.vue"

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
			transport_end_place_coordsType: '',
			transport_contact_people: '',
			transport_contact_phone: '',
			imageList: [],
			btnDisabled: false
        }
    },
	onLoad: function(option) {
	    //option为object类型，会序列化上个页面传递的参数,
	    this.transport_sub_id = option.id;
	    this.get_data();
	},
	components: {
		uniIcon,
		tkiFloatKeyboard
	},
	onShow() {
		
	},
    methods:{
		// 显示键盘
		showKey(){
			this.$refs.keyb._keyShow()
		},
		// 隐藏键盘
		hideKey(){
			this.$refs.keyb._keyHide()
		},
		// 键盘退格
		carNumberDel(){
			let d = this.car_number
			this.car_number = d.substring(0,d.length-1)
		},
		// 键盘输入值
		carNumberVal(v){
			this.car_number = this.car_number + v
		},
		// 显示键盘后的回调
		carNumberShow(h){
			console.log(h)
		},
		// 隐藏键盘后的回调
		carNumberHide(){
		
		},
		chooseImg() {
			//选择图片
			uni.chooseImage({
				sourceType: ['camera', 'album'],
				sizeType: ['compressed'],
				count: 8 - this.imageList.length,
				success: res => {
					this.imageList = this.imageList.concat(res.tempFilePaths);
				}
			});
		},
		previewImage() {
			//预览图片
			uni.previewImage({
				urls: this.imageList
			});
		},
		close(e) {
			this.imageList.splice(e, 1);
		},
		chooseLocation: function () {
			uni.chooseLocation({
				success: (res) => {
					this.transport_end_place = res.name + res.address
					this.transport_end_place_latitude = res.latitude
					this.transport_end_place_longitude = res.longitude
					this.transport_end_place_coordsType = 'gcj02'
				},
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
							this.transport_end_place = position.address.city + position.address.district + (position.address.street?position.address.street:'') + (position.address.streetNum?position.address.streetNum:'')
							this.transport_end_place_longitude = position.coords.longitude
							this.transport_end_place_latitude = position.coords.latitude
							this.transport_end_place_coordsType = position.coordsType
						})
						//#endif
		            } else {
		                uni.showToast({
		                    title: res.message,
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
			this.btnDisabled = true
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
								transport_end_place_coordsType: this.transport_end_place_coordsType
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
										this.btnDisabled = false
										console.log(JSON.stringify(res));
										if (res.code === 1000) {
											uni.showToast({
												title: '卸货成功!'
											});
											this.imageList = [];
											if (type == 1) {
												this.$ajax.stopWatchGeoPosition('', this.transport_sub_id)
												this.$ajax.getUserInfo().then(res => {
													uni.reLaunch({
														url: redirectUrl
													});
												})
											} else {
												uni.navigateBack({
													delta: 1
												});
											}
											
										}
									});
							} else {
								formData.position = position
								this.$ajax.post('car/transport/finish', formData, true).then(res => {
									console.log(res);
									this.btnDisabled = false
									if (res.code == 1000) {
										uni.showToast({
											title: '卸货成功',
											icon: 'none'
										})
										if (type == 1) {
											this.$ajax.stopWatchGeoPosition('', this.transport_sub_id)
											this.$ajax.getUserInfo().then(res => {
												uni.reLaunch({
													url: redirectUrl
												});
											})
										} else {
											uni.navigateBack({
												delta: 1
											});
										}
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
						this.btnDisabled = false
						console.log('用户点击取消');
					}
				}
			});
        }
    }
}
</script>