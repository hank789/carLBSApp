<template>
    
        <view class="grace-padding grace-bg-white grace-common-mt grace-common-border">
            <view class="grace-form">
                <form>
                    <view class="grace-items">
                        <view class="grace-label form-label">行程号</view>
						<text class="input">{{transport_number}}</text>
                    </view>
					<view class="grace-items">
					    <view class="grace-label form-label">车牌号</view>
						<text class="input">{{car_number}}</text>
					</view>
					
					<view class="grace-items">
					    <view class="grace-label form-label">目的地</view>
						<text class="input">{{transport_end_place}}</text>
					</view>
                    <view class="grace-items">
						<view class="uni-textarea">
							<text class="grace-label">{{transport_goods}}</text>
						</view>
                    </view>
					<view class="feedback-body feedback-uploader">
						<view class="uni-uploader">
							<view class="uni-uploader-head">
								<view class="uni-uploader-title" style="color: #a6a6a6;">上传货物和车辆信息</view>
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
                        <button :disabled="btnDisabled" type="primary" style="width:100%;" @tap.stop.prevent="startTransport">开始行程</button>
                    </view>
                </form>
            </view>
        </view>
    
</template>
<script>
import util from '../../lib/util.js'

export default {
    data() {
        return {
			transport_sub_id: '',
			transport_number: '',
			car_number: '',
			transport_end_place: '',
            transport_goods: '',
			imageList: [],
			btnDisabled: false
        }
    },
	onLoad: function(option) {
	    //option为object类型，会序列化上个页面传递的参数,
	    this.transport_sub_id = option.id;
	    this.get_data();
	},
	onShow() {
		
	},
    methods:{
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
		get_data() {
		    this.$ajax
		        .get('car/transport/subDetail/'+this.transport_sub_id)
		        .then(res => {
		            console.log(JSON.stringify(res));
		            if (res.code == 1000) {
		                this.transport_number = res.data.transport_number;
						this.car_number = res.data.car_number;
						
						this.transport_end_place = res.data.transport_end_place;
						this.transport_goods = res.data.transport_goods.transport_goods;
		            } else {
		                uni.showToast({
		                    title: res.message,
		                    icon: 'none'
		                });
		            }
		        });
		},
        startTransport() {
			this.btnDisabled = true
			uni.showModal({
				content: '确定开始此行程？',
				confirmText: "确定",
				cancelText: "取消",
				showCancel: true,
				success: (res) => {
					if (res.confirm) {
						console.log('用户点击确定');
						util.getGeoPosition((position) => {
							var formData = {
								transport_sub_id: this.transport_sub_id
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
									.upload_file('car/transport/start', imgs, formData, true)
									.then(res => {
										this.btnDisabled = false
										console.log(JSON.stringify(res));
										if (res.code === 1000) {
											uni.showToast({
											    title: '行程已开始',
											    icon: 'none'
											});
											this.$ajax.getUserInfo().then(res => {})
											this.$store.commit('setAlertTransportStart', true)
											uni.navigateBack({
												delta: 1
											});
										} else {
											uni.showToast({
												title: res.message,
												icon: 'none'
											})
										}
									});
							} else {
								formData.position = position
								this.$ajax.post('car/transport/start', formData, true).then(res => {
									console.log(res);
									this.btnDisabled = false
									if (res.code == 1000) {
										uni.showToast({
										    title: '行程已开始',
										    icon: 'none'
										});
										this.$ajax.getUserInfo().then(res => {})
										this.$store.commit('setAlertTransportStart', true)
										uni.navigateBack({
											delta: 1
										});
									} else {
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