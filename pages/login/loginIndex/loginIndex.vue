<template>
	<view style="background: #FFFFFF;overflow: hidden;">
		<view class="">
			<image src="../../../static/loginbj.jpg" mode="widthFix" style="width: 100%;"></image>
		</view>
		<view class="" style="overflow: hidden;">
			<image src="../../../static/loginLogo.png" mode="widthFix" style="position: absolute;top: 120upx;width: 270upx;height: 89upx;left: 50%;transform: translate(-50%, -50%);"></image>
		</view>
		<view class="" style="position: absolute;top: 260upx;left:5%;width: 90%;box-shadow:0 0 0.16rem rgba(7, 138, 255, 0.5);background: #FFFFFF;border-radius: 16upx;padding: 60upx 0">
			<view class="uni-common-mt" style="border-bottom: 2upx solid #f1f1f1;">
				<uni-segmented-control :current="current" :values="items" v-on:clickItem="onClickItem" :styleType="styleType"
				 :activeColor="activeColor" style="width: 90%;margin-top: 80upx;"></uni-segmented-control>
			</view>
			<view class="content">
				<view v-show="current === 0" style="width: 90%;">
					<view class="grace-form" style="margin-top:50upx;">
						<form @submit="loginNow">
							<view class="grace-items grace-items-wbg" style="border-bottom: 1px solid #F1F1F1!important;border-radius: 0;">
								<input type="number" name="name" class="input" placeholder="请输入手机号" style="margin-left: 0;line-height: 40upx;"></input>
							</view>
							<view class="grace-space-between" style="margin-top:28upx;border-bottom: 2upx solid #f1f1f1;">
								<view class="grace-items grace-items-wbg" style="width:66%;">
									<input type="number" class="input" name="yzm" placeholder="请输入验证码" style="margin-left: 0;"></input>
								</view>
								<view style="width:34%;  paading:0;">
									<button type="primary" class="thisBtn" style="background: #FFFFFF;color: #076cD4;border: #FFFFFF;">获取验证码</button>
								</view>
							</view>
							<text class="memo">验证即可登录，未注册用户将根据手机号自动创建账号</text>
							<button form-type='submit' type='primary' style='background:#076cD4; margin-top:20px;border-radius: 88upx;'>
								登录 </text>
							</button>
							<view class="memo noCount">没有八宝饭账号？ <span class="registeText" @click="registe()">立即注册</span></view>
						</form>
					</view>
				</view>
				<view v-show="current === 1" style="width: 90%;">
					<view class="grace-form" style="margin-top:50upx;">
						<form @submit="loginNow1">
							<view class="grace-items grace-items-wbg" style="border-bottom: 1px solid #F1F1F1!important;border-radius: 0;">
								<input type="text" name="name" class="input" placeholder="请输入账号" style="margin-left: 0;"></input>
							</view>
							<view class="grace-items grace-items-wbg" style="border-bottom: 1px solid #F1F1F1!important;border-radius: 0;margin-top: 28upx;">
								<input type="password" name="password" class="input" placeholder="请输入密码" style="margin-left: 0;"></input>
							</view>
							<button form-type='submit' type='primary' style='background:#076cD4; margin-top:20px;border-radius: 88upx;'>
								登录 </text>
							</button>
							<view class="forlog"><span style="margin-right: 200upx;" @click="forget()">忘记密码</span> <span  @click="registe()">立即注册</span></view>
						</form>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import uniSegmentedControl from '../../../components/uni-segmented-control.vue';

	export default {
		data() {
			return {

				items: [
					'手机快速登录',
					'账号登录'
				],
				styles: [{
					value: 'button',
					text: '按钮',
					checked: true
				}, {
					value: 'text',
					text: '文字'
				}],
				colors: [
					'#007aff',
					'#4cd964',
					'#dd524d'
				],
				current: 0,
				activeColor: '#007aff',
				styleType: 'button'
			}
		},
		components: {
			uniSegmentedControl
		},
		methods: {
			onClickItem(index) {
				if (this.current !== index) {
					this.current = index;
				}
			},
			styleChange(evt) {
				if (this.styleType !== evt.target.value) {
					this.styleType = evt.target.value;
				}
			},
			colorChange(evt) {
				if (this.styleType !== evt.target.value) {
					this.activeColor = evt.target.value;
				}
			},
			forget:function(){
				uni.navigateTo({
					url: '../forget/forget',
				
				});
			},
			registe:function(){
				uni.navigateTo({
					url: '../registe/registe',
				
				});
			}
			
		}
	}
</script>

<style>
	.content {
		display: flex;
		justify-content: center;
		align-items: center;

		text-align: center;
	}

	.color-tag {
		width: 50upx;
		height: 50upx;
	}

	/* 	page{width:750upx; min-height:100%; background: linear-gradient(45deg,#5a3694 0,#13bdce 33%,#0094d9 66%,#6fc7b5 100%);
	  background-size: 400%; background-position:0 100%; animation: gradient 20s ease-in-out infinite;} */
	.thisBtn {
		background: #FFFFFF;
		color: #076cD4;
		font-size: 14px;
		width: 100%;
		height: 88upx;
		line-height: 88upx;
	}

	.input {
		margin-left: 0 ! !important;
		color: #333333;
	}

	uni-button:after {
		border: 0 !important;
	}

	.memo {
		color: #999999;
		font-size: 22upx;
		text-align: left;
	}

	.registeText {
		color: #076cD4;
	}

	.noCount {
		text-align: center;
		margin-top: 20upx;
	}
	.forlog{display: flex;flex-wrap: nowrap;align-items: center;color: #076cD4;justify-content: center;margin-top: 20upx;font-size: 24upx;}
</style>
