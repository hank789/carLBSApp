<template>
    
        <view class="grace-padding grace-bg-white grace-common-mt grace-common-border">
            <view class="grace-form">
                <form>
                    <view class="grace-items">
                        <view class="grace-label form-label">行程号</view>
                        <input type="text" class="input" v-model="transport_number" @blur="blurTransportNumber" placeholder="由管理员提供"></input>
                    </view>
					<view class="grace-items" @tap.stop.prevent="showKey">
					    <view class="grace-label form-label">车牌号</view>
						<tki-float-keyboard ref="keyb" mode="car" type="0" title="车牌号" @del="carNumberDel" @val="carNumberVal" @show="carNumberShow" @hide="carNumberHide"></tki-float-keyboard>
					    <input type="text" class="input" disabled v-model.trim="car_number" placeholder="本次行程的车辆车牌号码"></input>
					</view>
					<view class="grace-items">
					    <view class="grace-label form-label">出发日期</view>
						<picker mode="date" :value="transport_start_date" :start="startDate" :end="endDate" @change="bindDateChange">
							<view class="uni-input">{{transport_start_date}}</view>
						</picker>
					</view>
					<view class="grace-items">
					    <view class="grace-label form-label">出发时间</view>
						<picker mode="time" :value="transport_start_time" @change="bindTimeChange">
							<view class="uni-input">{{transport_start_time}}</view>
						</picker>
					</view>
					<view class="grace-items" @tap.stop.prevent="chooseLocation">
					    <view class="grace-label form-label">目的地</view>
					    <input type="text" disabled class="input" v-model.trim="transport_end_place" placeholder="本次行程的目的地"></input>
					</view>
                    <view class="grace-items grace-noborder">
                        
						<view class="uni-textarea">
							<textarea style="height: 460upx;" maxlength=-1 v-model.trim="transport_goods" placeholder="本次行程运输的货物描述" />
						</view>
                        
                    </view>
                    <view style="padding:22upx 0;">
                        <button @tap.stop.prevent="formSubmit" :disabled="btnDisabled" type="primary" style="width:100%;">提交修改</button>
                    </view>
                </form>
            </view>
        </view>
    
</template>
<script>
import util from '../../lib/util.js'
import tkiFloatKeyboard from "@/components/tki-float-keyboard/tki-float-keyboard.vue"

export default {
    data() {
		const currentDate = this.getDate({
			format: true
		});
		const currentTime = this.getDate('time');
        return {
			id: '',
			transport_sub_id: '',
			transport_number: '',
			transport_number_ok: false,
			car_number: '',
			transport_start_date: currentDate,
			transport_start_time: currentTime,
			transport_end_place: '',
            transport_goods: '',
			transport_end_place_longitude: '',
			transport_end_place_latitude: '',
			transport_end_place_coordsType: '',
			btnDisabled: false
        }
    },
	onLoad: function(option) {
	    //option为object类型，会序列化上个页面传递的参数,
	    this.id = option.id;
	    this.get_data();
	},
	computed: {
		startDate() {
			return this.getDate('start');
		},
		endDate() {
			return this.getDate('end');
		}
	},
	components: {
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
		bindDateChange: function(e) {
			this.transport_start_date = e.target.value
		},
		bindTimeChange: function(e) {
			this.transport_start_time = e.target.value
		},
		get_data() {
		    this.$ajax
		        .get('car/transport/subDetail/'+this.id)
		        .then(res => {
		            console.log(JSON.stringify(res));
		            if (res.code == 1000) {
		                this.transport_number = res.data.transport_number;
						this.transport_number_ok = true;
						this.car_number = res.data.car_number;
						let transport_start_date  = res.data.transport_start_time.split(' ');
						this.transport_start_date = transport_start_date[0]
						this.transport_start_time = transport_start_date[1]
						this.transport_end_place = res.data.transport_end_place;
						this.transport_goods = res.data.transport_goods.transport_goods;
						this.transport_sub_id = res.data.id
		            } else {
		                uni.showToast({
		                    title: res.message,
		                    icon: 'none'
		                });
		            }
		        });
		},
		getDate(type) {
			const date = new Date();
		
			let year = date.getFullYear();
			let month = date.getMonth() + 1;
			let day = date.getDate();
		
			if (type === 'start') {
				year = year - 60;
			} else if (type === 'end') {
				year = year + 2;
			} else if (type === 'time') {
				return date.getHours() + ':' + date.getMinutes();
			}
			month = month > 9 ? month : '0' + month;;
			day = day > 9 ? day : '0' + day;
		
			return `${year}-${month}-${day}`;
		},
        formSubmit : function(e){
            console.log('formSubmit');
			if (!this.transport_number_ok || this.transport_number.length < 9) {
				uni.showToast({title:"行程号有误", icon:"none"});
				return;
			}
			if (!util.isVehicleNumber(this.car_number)) {
				uni.showToast({title:"车牌号有误", icon:"none"});
				return;
			}
			if (!this.transport_end_place) {
				uni.showToast({title:"目的地有误", icon:"none"});
				return;
			}
			if (!this.transport_start_date) {
				uni.showToast({title:"出发日期有误", icon:"none"});
				return;
			}
			if (!this.transport_start_time) {
				uni.showToast({title:"出发时间有误", icon:"none"});
				return;
			}
			if (!this.transport_goods) {
				uni.showToast({title:"请填写本次运输的货物", icon:"none"});
				return;
			}
			this.btnDisabled = true
			util.getGeoPosition((position) => {
				this.$ajax.post('car/transport/update',{
					transport_sub_id: this.transport_sub_id,
					transport_number: this.transport_number,
					car_number: this.car_number,
					transport_start_time: this.transport_start_date + ' ' + this.transport_start_time,
					transport_goods: this.transport_goods,
					transport_start_place: position.address.city + position.address.district + (position.address.street?position.address.street:'') + (position.address.streetNum?position.address.streetNum:''),
					transport_start_place_longitude: position.coords.longitude,
					transport_start_place_latitude: position.coords.latitude,
					transport_start_place_coordsType: position.coordsType,
					transport_end_place: this.transport_end_place,
					transport_end_place_longitude: this.transport_end_place_longitude,
					transport_end_place_latitude: this.transport_end_place_latitude,
					transport_end_place_coordsType: this.transport_end_place_coordsType
				}, true).then(res => {
					console.log(res);
					this.btnDisabled = false
					if (res.code == 1000) {
						uni.showToast({
							title: '行程修改成功',
							icon: 'none'
						})
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
			},()=>{this.btnDisabled = false})
        },
		blurTransportNumber() {
			console.log(this.transport_number)
			if (!this.transport_number) return;
			this.$ajax.post('car/transport/detail',{transport_number: this.transport_number}).then(res => {
				console.log(res)
				if (res.code == 1000) {
					this.transport_goods = res.data.transport_goods.transport_goods;
					let transport_start_date  = res.data.transport_start_time.split(' ');
					this.transport_start_date = transport_start_date[0]
					this.transport_start_time = transport_start_date[1]
					this.transport_end_place = res.data.transport_end_place
					this.transport_number_ok = true;
					this.transport_end_place_latitude = res.data.transport_goods.transport_end_place_latitude
					this.transport_end_place_longitude = res.data.transport_goods.transport_end_place_longitude
					this.transport_end_place_coordsType = res.data.transport_goods.transport_end_place_coordsType
				} else {
					this.transport_number_ok = false;
					uni.showToast({
						title: res.message,
						icon: 'none'
					})
				}
			})
		}
    }
}
</script>