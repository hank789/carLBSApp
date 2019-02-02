<template>
	<view>
		<view class="grace-left-padding-wrap">
			<view class="grace-comment-list" style="width: 96%;padding-right:2%;" @click="login()">
				<view class="grace-comment-face">
					<image src="https://static.babaofan.com/p/personal/2018/10/1_head_20181016141602_9888.jpg" mode="widthFix"></image>
				</view>
				<view class="grace-comment-body">
					<view class="grace-comment-top" @click="login()">
						<text style="color: #0f6dd2;">点击登录</text>
					</view>
					<view class="grace-comment-date">
						<text>欢迎来到八宝饭</text>
					</view>
				</view>
				<view>
					<text class="grace-list-imgs-arrow grace-iconfont icon-arrow-right"></text>
				</view>
			</view>
			<navigator class="grace-list">
				<image src="../../../static/friend.png" class="grace-list-imgs-l" mode="widthFix"></image>
				<text class="grace-list-text">邀请好友注册 +500</text>
				<view>
					<text class="grace-list-text grace-list-mr">立即邀请</text>
					<text class="grace-list-imgs-arrow grace-iconfont icon-arrow-right"></text>
				</view>
			</navigator>
			<navigator class="grace-list">
				<image src="../../../static/fabu.png" class="grace-list-imgs-l" mode="widthFix"></image>
				<text class="grace-list-text">发布文章 +300</text>
				<view>
					<text class="grace-list-text grace-list-mr">立即发布</text>
					<text class="grace-list-imgs-arrow grace-iconfont icon-arrow-right"></text>
				</view>
			</navigator>

			<navigator class="grace-list">
				<image src="../../../static/sharef.png" class="grace-list-imgs-l" mode="widthFix"></image>
				<text class="grace-list-text">分享快讯 +80</text>
				<view>
					<text class="grace-list-text grace-list-mr">立即分享</text>
					<text class="grace-list-imgs-arrow grace-iconfont icon-arrow-right"></text>
				</view>
			</navigator>
			<navigator class="grace-list grace-noborder">
				<image src="../../../static/sharea.png" class="grace-list-imgs-l" mode="widthFix"></image>
				<text class="grace-list-text">分享文章 +80</text>
				<view>
					<text class="grace-list-text grace-list-mr">立即分享</text>
					<text class="grace-list-imgs-arrow grace-iconfont icon-arrow-right"></text>
				</view>
			</navigator>
		</view>
		<view class="grace-left-padding-wrap" style="margin-top:30upx;">
			<navigator class="grace-list">
				<image src="../../../static/myzl.png" class="grace-list-imgs-l grace-list-imgs-2" mode="widthFix"></image>
				<text class="grace-list-text">我的专栏</text>
				<text class="grace-list-imgs-arrow grace-iconfont icon-arrow-right"></text>
			</navigator>
			<navigator class="grace-list">
				<image src="../../../static/xtsz.png" class="grace-list-imgs-l grace-list-imgs-2" mode="widthFix"></image>
				<text class="grace-list-text">系统设置</text>
				<text class="grace-list-imgs-arrow grace-iconfont icon-arrow-right"></text>
			</navigator>
			<navigator class="grace-list grace-noborder">
				<image src="../../../static/lxwm.png" class="grace-list-imgs-l grace-list-imgs-2" mode="widthFix"></image>
				<text class="grace-list-text">联系我们</text>
				<text class="grace-list-imgs-arrow grace-iconfont icon-arrow-right"></text>
			</navigator>
		</view>
		<view style="width:100%; height:60upx;"></view>
	</view>
</template>
<script>
	export default {
		
		
		methods:{
			userCenter:function(){
				uni.navigateTo({
					url: 'userCenter/userCenter',
				});
			},
			login:function(){
				uni.navigateTo({
					url: '../../login/loginIndex/loginIndex'
				});
			}
		}
	}
</script>
<style>
	page {
		background: #eee;
	}

	.grace-list-imgs-2 {
		width: 32upx !important;
	}

	.grace-list-mr {
		border: 2upx solid #ff7e00;
		font-size: 20upx !important;
		border-radius: 30upx;
		color: #ff7e00 !important;
		margin-right: 10upx !important;
		padding: 0 10upx;
	}
	.icon-arrow-right{font-size: 28upx!important;color: #666666!important;}
</style>
