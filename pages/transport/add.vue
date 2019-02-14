<template>
    
        <view class="grace-padding grace-bg-white grace-common-mt grace-common-border">
            <view class="grace-form">
                <form @submit="formSubmit">
                    <view class="grace-items">
                        <view class="grace-label">行程号</view>
                        <input type="text" class="input" v-model.trim="transport_number" @blur="blurTransportNumber" placeholder="由管理员提供"></input>
                    </view>
					<view class="grace-items">
					    <view class="grace-label">车牌号</view>
					    <input type="text" class="input" v-model.trim="car_number" placeholder="本次行程的车辆车牌号码"></input>
					</view>
					<view class="grace-items">
					    <view class="grace-label">出发日期</view>
						<picker mode="date" :value="transport_start_date" :start="startDate" :end="endDate" @change="bindDateChange">
							<view class="uni-input">{{transport_start_date}}</view>
						</picker>
					</view>
					<view class="grace-items">
					    <view class="grace-label">出发时间</view>
						<picker mode="time" :value="transport_start_time" @change="bindTimeChange">
							<view class="uni-input">{{transport_start_time}}</view>
						</picker>
					</view>
					<view class="grace-items">
					    <view class="grace-label">目的地</view>
					    <input type="text" class="input" v-model.trim="transport_end_place" placeholder="本次行程的目的地"></input>
					</view>
                    <view class="grace-items grace-noborder">
                        
						<view class="uni-textarea">
							<textarea v-model.trim="transport_goods" placeholder="本次行程运输的货物描述" auto-height />
						</view>
                        
                    </view>
                    <view style="padding:22upx 0;">
                        <button formType="submit" type="primary" style="width:100%;">提交</button>
                    </view>
                </form>
            </view>
        </view>
    
</template>
<script>
import util from '../../lib/util.js'
export default {
    data() {
		const currentDate = this.getDate({
			format: true
		});
		const currentTime = this.getDate('time');
        return {
			transport_number: '',
			transport_number_ok: false,
			car_number: '',
			transport_start_date: currentDate,
			transport_start_time: currentTime,
			transport_end_place: '',
            transport_goods: ''
        }
    },
	computed: {
		startDate() {
			return this.getDate('start');
		},
		endDate() {
			return this.getDate('end');
		}
	},
    methods:{
		bindDateChange: function(e) {
			this.transport_start_date = e.target.value
		},
		bindTimeChange: function(e) {
			this.transport_start_time = e.target.value
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
			this.$ajax.post('car/transport/add',{
				transport_number: this.transport_number,
				car_number: this.car_number,
				transport_start_time: this.transport_start_date + ' ' + this.transport_start_time,
				transport_goods: this.transport_goods,
				transport_end_place: this.transport_end_place
			}).then(res => {
				console.log(res);
				if (res.code == 1000) {
					
				} else {
					this.transport_number_ok = false;
					uni.showToast({
						title: res.message,
						icon: 'none'
					})
				}
			})
        },
		blurTransportNumber() {
			console.log(this.transport_number)
			this.$ajax.post('car/transport/detail',{transport_number: this.transport_number}).then(res => {
				console.log(res)
				if (res.code == 1000) {
					this.transport_goods = res.data.transport_goods;
					let transport_start_date  = res.data.transport_start_time.split(' ');
					this.transport_start_date = transport_start_date[0]
					this.transport_start_time = transport_start_date[1]
					this.transport_end_place = res.data.transport_end_place
					this.transport_number_ok = true;
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