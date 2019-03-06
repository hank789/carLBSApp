<template>
	<view class="uni-countdown">
		<view>{{label}}</view>
		<view v-if="showDay" class="uni-countdown__number" :style="{borderColor:borderColor, color:color, background:backgroundColor}">{{d}}</view>
		<view v-if="showDay" class="uni-countdown__splitor" :style="{color:splitorColor}">天</view>
		<view class="uni-countdown__number" :style="{borderColor:borderColor, color:color, background:backgroundColor}">{{h}}</view>
		<view class="uni-countdown__splitor" :style="{color:splitorColor}">{{showColon ? ':' : '时'}}</view>
		<view class="uni-countdown__number" :style="{borderColor:borderColor, color:color, background:backgroundColor}">{{i}}</view>
		<view class="uni-countdown__splitor" :style="{color:splitorColor}">{{showColon ? ':' : '分'}}</view>
		<view class="uni-countdown__number" :style="{borderColor:borderColor, color:color, background:backgroundColor}">{{s}}</view>
		<view v-if="!showColon" class="uni-countdown__splitor" :style="{color:splitorColor}">秒</view>
	</view>
</template>
<script>
	export default {
		name: "uni-countdown",
		props: {
			label: {
				type: String,
				default: ''
			},
			showColon: {
				type: Boolean,
				default: true
			},
			backgroundColor: {
				type: String,
				default: "#FFFFFF"
			},
			borderColor: {
				type: String,
				default: "#000000"
			},
			color: {
				type: String,
				value: "#000000"
			},
			splitorColor: {
				type: String,
				default: "#000000"
			},
			day: {
				type: Number,
				default: 0
			},
			hour: {
				type: Number,
				default: 0
			},
			minute: {
				type: Number,
				default: 0
			},
			second: {
				type: Number,
				default: 0
			},
			timer: {
				type: String,
				default: ""
			}
		},
		data() {
			return {
				showDay: false,
				setTime: null,
				d: '00',
				h: '00',
				i: '00',
				s: '00',
				leftTime: 0,
				seconds: 0
			}
		},
		created: function(e) {
			if (this.timer) {
				var reg = /^([0-9]{4})-([0-9]{2})-([0-9]{2}) ([0-9]{2}):([0-9]{2}):([0-9]{2})$/;
				var res = this.timer.match(reg);
				if (res == null) {
					console.log('时间格式错误');
					return false;
				} else {
					var year = parseInt(res[1]);
					if (year < 1000) {
						console.log('时间格式错误');
						return false;
					}
					var month = parseInt(res[2]);
					var day = parseInt(res[3]);
					var h = parseInt(res[4]);
					if (h < 0 || h > 24) {
						console.log('时间格式错误');
						return false;
					}
					var i = parseInt(res[5]);
					if (i < 0 || i > 60) {
						console.log('时间格式错误');
						return false;
					}
					var s = parseInt(res[6]);
					if (s < 0 || s > 60) {
						console.log('时间格式错误');
						return false;
					}
					var leftTime = new Date(year, month - 1, day, h, i, s);
					this.seconds = (leftTime - new Date())/1000;
					console.log(this.seconds)
				}
			} else {
				this.seconds = this.toSeconds(this.day, this.hour, this.minute, this.second)	
			}
			this.countDown()
			this.setTime = setInterval(() => {
				this.seconds--
				if (this.seconds < 0) {
					this.timeUp()
					return
				}
				this.countDown()
			}, 1000)
		},
		beforeDestroy() {
			clearInterval(this.setTime)
		},
		methods: {
			toSeconds(day, hours, minutes, seconds) {
				return (day * 60 * 60 * 24) + (hours * 60 * 60) + (minutes * 60) + seconds
			},
			timeUp() {
				clearInterval(this.setTime)
				this.$emit('timeup')
			},
			countDown() {
				let seconds = this.seconds
                let [day, hour, minute, second] = [0, 0, 0, 0]
				if (seconds > 0) {
					day = Math.floor(seconds / (60 * 60 * 24))
					hour = Math.floor(seconds / (60 * 60)) - (day * 24)
					minute = Math.floor(seconds / 60) - (day * 24 * 60) - (hour * 60)
					second = Math.floor(seconds) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60)
				} else {
					this.timeUp()
				}
                if (day < 10) {
                	day = '0' + day
                }
				if (hour < 10) {
					hour = '0' + hour
				}
				if (minute < 10) {
					minute = '0' + minute
				}
				if (second < 10) {
					second = '0' + second
				}
                this.d = day
				if (this.d <= 0) {
					this.showDay = false
				} else {
					this.showDay = true
				}
				this.h = hour
				this.i = minute
				this.s = second
			}
		}
	}
</script>
<style lang="scss">
	$countdown-height:44upx;

	.uni-countdown {
		display: flex;
		padding: 2upx 0;
		flex-wrap: nowrap;
		justify-content: center;

		&__splitor {
			justify-content: center;
			line-height: $countdown-height;
			padding: 0 5upx;
		}

		&__number {
			line-height: $countdown-height;
			justify-content: center;
			height: $countdown-height;
			border-radius: $uni-border-radius-base;
			margin: 0 5upx;
			border: 1px solid #000000;
			padding: 0 10upx;
		}
	}
</style>