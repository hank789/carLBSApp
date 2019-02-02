<template>
	<view style="background: #FFFFFF;overflow: hidden;">
		<view class="">
			<image src="../../../static/loginbj.jpg" mode="widthFix" style="width: 100%;"></image>
		</view>
		<view class="" style="overflow: hidden;">
			<image src="../../../static/loginLogo.png" mode="widthFix" style="position: absolute;top: 120upx;width: 270upx;height: 89upx;left: 50%;transform: translate(-50%, -50%);"></image>
		</view>
		<view class="" style="position: absolute;top: 260upx;left:5%;width: 90%;box-shadow:0 0 0.16rem rgba(7, 138, 255, 0.5);background: #FFFFFF;border-radius: 16upx;padding: 60upx 0">
			<view class="titleName">手机登陆</view>
			<view class="content">
				<view class="grace-form" style="margin-top:50upx;width: 90%;">
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
						<view class="memo noCount">验证即可登录，未注册用户将根据手机号自动创建账号</view>
						<button form-type='submit' type='primary' style='background:#076cD4; margin-top:20px;border-radius: 88upx;'>
							登录
						</button>
					</form>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		methods: {

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

	/* 	.color-tag {
		width: 50upx;
		height: 50upx;
	} */

	/* 	page{width:750upx; min-height:100%; background: linear-gradient(45deg,#5a3694 0,#13bdce 33%,#0094d9 66%,#6fc7b5 100%);
	  background-size: 400%; background-position:0 100%; animation: gradient 20s ease-in-out infinite;} */
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
