<template>
	<view style="background: #FFFFFF;overflow: hidden;">
		<view class="">
			<image src="../../static/images/loginbj.jpg" mode="widthFix" style="width: 100%;"></image>
		</view>
		<view class="" style="overflow: hidden;">
			<image src="../../static/images/location.png" mode="widthFix" style="position: absolute;top: 120upx;width: 270upx;height: 89upx;left: 50%;transform: translate(-50%, -50%);"></image>
		</view>
		<view class="" style="position: absolute;top: 260upx;left:5%;width: 90%;box-shadow:0 0 0.16rem rgba(7, 138, 255, 0.5);background: #FFFFFF;border-radius: 16upx;padding: 60upx 0">
			<view class="titleName">手机登陆</view>
			<view class="content">
				<view class="grace-form" style="margin-top:50upx;width: 90%;">
					<form @submit="submitLogin">
						<view class="grace-items grace-items-wbg" style="border-bottom: 1px solid #F1F1F1!important;border-radius: 0;">
							<input type="number" focus=true class="input" v-model.trim="phone" placeholder="请输入手机号" style="margin-left: 0;line-height: 40upx;"></input>
						</view>
						<view class="grace-space-between" style="margin-top:28upx;border-bottom: 2upx solid #f1f1f1;">
							<view class="grace-items grace-items-wbg" style="width:66%;">
								<input type="number" class="input" :focus="yzmFocus" v-model.trim="yzm" placeholder="请输入验证码" style="margin-left: 0;"></input>
							</view>
							<view style="width: 36%;">
								<button class="thisBtn" @tap.stop.prevent="entryYzm">{{get_msg_btn}}</button>
							</view>
						</view>
						<view class="memo noCount">验证即可登录，未注册用户将根据手机号自动创建账号</view>
						<button :disabled="btnDisabled" form-type='submit' type='primary' style='background:#076cD4; margin-top:20px;border-radius: 88upx;'>
							登录
						</button>
					</form>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'
	export default {
		data() {
			return {
			  phone: '',
			  yzm: '',
			  get_msg_btn: '获取验证码',
			  can_send_msg: true,
			  btnDisabled: false,
			  yzmFocus: false
			}
		},
		created() {
			console.log(this.$ls.get('token'))
			if (this.$ls.get('token')) {
				uni.redirectTo({
					url: '/pages/tabBar/index',
				})
			}
		},
		methods: {
			...mapMutations(['setUser', 'setToken']),
			entryYzm() {
				let phone = this.phone;
				if (!this.can_send_msg) {
					return
				}
				if (!phone) {
					uni.showToast({
						title: "请输入手机号",
						icon: "none"
					})
					return;
				}
				this.$ajax.post('auth/sendPhoneCode',{mobile: phone, type: 'login'}).then(res => {
					console.log(res)
					if (res.code == 1000) {
						uni.showToast({
							title: "验证码发送成功",
						});
						this.can_send_msg = false;
						this.get_msg_btn = 59;
						this.yzmFocus = true;
						let timer = setInterval(() => {
							this.get_msg_btn--;
							if (this.get_msg_btn == 0) {
								this.get_msg_btn = "获取验证码";
								this.can_send_msg = true;
								clearInterval(timer)
							}
						}, 1000)
					} else {
						uni.showToast({
							title: res.message,
							icon: 'none'
						})
					}
				})
			},
			submitLogin() {
				let params = {
					mobile: this.phone,
					phoneCode: this.yzm
				}
				console.log(params);
				if (!this.phone) {
					uni.showToast({
						title: '请填写手机号',
						icon: 'none'
					})
					return;
				}
				if (!this.yzm) {
					uni.showToast({
						title: '请填写验证码',
						icon: 'none'
					})
					return;
				}
				this.btnDisabled = true
				this.$ajax.post('auth/login', params).then(res => {
					console.log(res);
					this.btnDisabled = false
					if(res.code==1000){
						this.setUser(res.data)
						this.setToken(res.data.token)
						this.$ls.set('token',res.data.token)
						if (!res.data.name) {
							uni.reLaunch({
								url: '/pages/login/updateInfo'
							})
						} else {
							uni.reLaunch({
								url: '/pages/tabBar/index'
							})
						}
					}else{
						uni.showToast({
							title:res.message,
							icon:'none'
						})
					}
				})
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

	.thisBtn {
		background: #FFFFFF;
		color: #076cD4;
		font-size: 14px;
		width: 100%;
		height: 80upx;
		line-height: 80upx;
	}

	.input {
		margin-left: 0 ! !important;
		color: #333333;
	}

	.memo {
		color: #999999;
		font-size: 22upx;
		text-align: left;
	}

	.registeText {
		color: #076cD4;
		margin-left: 10upx;
	}

	.noCount {
		text-align: center;
		margin-top: 20upx;
	}

	.titleName {
		text-align: center;
	}

	.titleName {
		color: #076DD4;
		font-size: 36upx;
		font-weight: bold;
	}
</style>
