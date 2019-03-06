<template>
	<view class="page">
		<view class="feedback-title"><text>事件类型</text></view>
		<view class="feedback-body">
			<picker
				@change="bindEventTypeChange"
				:value="eventTypeIndex"
				range-key="value"
				:range="msgContents"
			>
				<view class="uni-input">{{ msgContents[eventTypeIndex].value }}</view>
			</picker>
		</view>
		<view class="feedback-title"><text>事件地点</text></view>
		<view class="feedback-body" @tap.stop.prevent="chooseLocation">
			<input type="text" disabled class="feedback-input" v-model.trim="sendDate.event_place" placeholder="事件发生地"></input>
		</view>
		<view class="feedback-title">
			<button type="default" @tap="startRecognize">
				<uni-icon size="18" :type="'mic'"></uni-icon>
				语音输入
			</button>
		</view>
		<view class="feedback-body" style="min-height: 180upx;">
			<textarea
				maxlength=-1
				style="height: 460upx;"
				placeholder="请详细描述事件情况..."
				v-model="sendDate.event_detail"
				class="feedback-textare"
			/>
		</view>
		<view class="feedback-title"><text>图片(选填，提供事件截图)</text></view>
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

		<button :disabled="btnDisabled" type="primary" class="feedback-submit" @tap.stop.prevent="send">提交</button>
	</view>
</template>

<script>
import uniIcon from '../../components/uni-icon.vue';
import util from '../../lib/util.js';

export default {
	data() {
		return {
			eventTypeIndex: 0,
			msgContents: [{ key: 1, value: '交通拥堵' }],
			imageList: [],
			btnDisabled: false,
			sendDate: {
				transport_sub_id: 0,
				event_type: 1,
				event_detail: '',
				event_place: '',
				event_place_latitude: '',
				event_place_longitude: '',
				event_place_coordsType: ''
			}
		};
	},
	components: {
		uniIcon
	},
	onShow() {
		
	},
	onLoad(option) {
		this.sendDate.transport_sub_id = option.id;
		this.getEventType();
		//#ifdef APP-PLUS
		let deviceInfo = {
			appid: plus.runtime.appid,
			imei: plus.device.imei, //设备标识
			p: plus.os.name === 'Android' ? 'a' : 'i', //平台类型，i表示iOS平台，a表示Android平台。
			md: plus.device.model, //设备型号
			app_version: plus.runtime.version,
			plus_version: plus.runtime.innerVersion, //基座版本号
			os: plus.os.version,
			net: '' + plus.networkinfo.getCurrentType()
		};
		this.sendDate = Object.assign(deviceInfo, this.sendDate);
		util.getGeoPosition((position) => {
			this.sendDate.event_place = position.address.city + position.address.district + (position.address.street?position.address.street:'') + (position.address.streetNum?position.address.streetNum:'')
			this.sendDate.event_place_longitude = position.coords.longitude
			this.sendDate.event_place_latitude = position.coords.latitude
			this.sendDate.event_place_coordsType = position.coordsType
		})
		//#endif
	},
	methods: {
		chooseLocation: function () {
			uni.chooseLocation({
				success: (res) => {
					console.log(JSON.stringify(res))
					this.sendDate.event_place = res.name + res.address
					this.sendDate.event_place_latitude = res.latitude
					this.sendDate.event_place_longitude = res.longitude
					this.sendDate.event_place_coordsType = 'gcj02'
				}
			})
		},
		getEventType() {
			this.$ajax.get('car/transport/getEventType').then(res => {
				console.log(JSON.stringify(res));
				if (res.code == 1000) {
					this.msgContents = res.data;
				} else {
					uni.showToast({
						title: res.message,
						icon: 'none'
					});
				}
			});
		},
		startRecognize: function() {
			var options = {};
			var that = this;
			options.engine = 'iFly';
			plus.speech.startRecognize(
				options,
				function(s) {
					console.log(s);
					that.sendDate.event_detail += s;
				},
				function(e) {
					console.log('语音识别失败：' + e.message);
				}
			);
		},
		bindEventTypeChange: function(e) {
			console.log('picker发送选择改变，携带值为：' + e.target.value);
			this.eventTypeIndex = e.target.value;
		},
		close(e) {
			this.imageList.splice(e, 1);
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
		send() {
			//发送反馈
			this.sendDate.event_type = this.msgContents[this.eventTypeIndex].key;

			console.log(JSON.stringify(this.sendDate));
			let imgs = this.imageList.map((value, index) => {
				return {
					name: 'image' + index,
					uri: value
				};
			});
			this.btnDisabled = true
			util.getGeoPosition(position => {
				if (this.imageList.length > 0) {
					this.sendDate.position = JSON.stringify(position);
					this.$ajax
						.upload_file('car/transport/eventReport', imgs, this.sendDate, true)
						.then(res => {
							this.btnDisabled = false
							console.log(JSON.stringify(res))
							console.log(res.code)
							if (res.code == 1000) {
								console.log('事件提交成功')
								uni.showToast({
									title: '事件提交成功!'
								});
								this.imageList = [];
								this.sendDate.event_detail = '';
								uni.redirectTo({
									url: '/pages/transport/detail?id=' + this.sendDate.transport_sub_id
								});
							}
						});
				} else {
					this.sendDate.position = position;
					this.$ajax
						.post('car/transport/eventReport', this.sendDate, true)
						.then(res => {
							this.btnDisabled = false
							console.log(JSON.stringify(res));
							if (res.code === 1000) {
								uni.showToast({
									title: '事件提交成功!'
								});
								this.imageList = [];
								this.sendDate.event_detail = '';
								uni.redirectTo({
									url: '/pages/transport/detail?id=' + this.sendDate.transport_sub_id
								});
							}
						});
				}
			});
		}
	}
};
</script>

<style>
page {
	background-color: #efeff4;
}

.input-view {
	font-size: 28upx;
}
.close-view {
	text-align: center;
	line-height: 14px;
	height: 16px;
	width: 16px;
	border-radius: 50%;
	background: #ff5053;
	color: #ffffff;
	position: absolute;
	top: -6px;
	right: -4px;
	font-size: 12px;
}
</style>
