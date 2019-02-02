<template>
	<view>
		
		<view class="grace-left-padding-wrap">
			<navigator class="grace-list">
				<text class="grace-list-text">用户账号</text>
				<view>
					<text class="grace-list-text grace-list-mr">刘美丽</text>
					<text class="grace-list-imgs-arrow grace-iconfont icon-arrow-right"></text>
				</view>
			</navigator>
			<navigator class="grace-list">
				<text class="grace-list-text">头像</text>
				<view>
					<image src="../../../../static/imgs/logo.png" class="grace-list-imgs-l" mode="widthFix"></image>
					<text class="grace-list-imgs-arrow grace-iconfont icon-arrow-right"></text>
				</view>
			</navigator>
			
		</view>
		<view class="grace-left-padding-wrap" style="margin-top:30upx;">
	
			<navigator class="grace-list">
				<text class="grace-list-text">昵称（专栏名）</text>
				<view>
					<text class="grace-list-text grace-list-mr">八宝匿名</text>
					<text class="grace-list-imgs-arrow grace-iconfont icon-arrow-right"></text>
				</view>
			</navigator>
			<navigator class="grace-list">
				<text class="grace-list-text">修改密码</text>
				<view>
					<text class="grace-list-imgs-arrow grace-iconfont icon-arrow-right"></text>
				</view>
			</navigator>
			<navigator class="grace-list">
				<text class="grace-list-text">手机号</text>
				<view>
					<text class="grace-list-text grace-list-mr">1375925***</text>
					<text class="grace-list-imgs-arrow grace-iconfont icon-arrow-right"></text>
				</view>
			</navigator>
			<navigator class="grace-list">
				<text class="grace-list-text">邮箱</text>
				<view>
					<text class="grace-list-text grace-list-mr">1375925***@qq.com</text>
					<text class="grace-list-imgs-arrow grace-iconfont icon-arrow-right"></text>
				</view>
			</navigator>
			
		</view>


		<view style="width:100%; margin-top:30upx;">
			<button style="width:100%; background:#FFFFFF; border:0;">退出登录</button>
		</view>
		<view style="width:100%; height:60upx;"></view>
	</view>
</template>
<script>
export default {}
</script>
<style>
page{background:#eee;}
.grace-list-mr{color: #999!important;font-size: 24upx!important;}
</style>