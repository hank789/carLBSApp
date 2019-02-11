<template>
	<view>
		首页
	</view>


</template>

<script>
	import ajax from "../../../lib/ajax_request.js";
	import {
		mapState
	} from 'vuex';
	
	export default {
		computed: mapState(['hasLogin', 'userName']),
		data() {
			return {
				now_page: 'home',
				nowindex: 0,
				nav: '',
				push_address:{},
				save_address:{},
				data_chengyunren:[],
			}
		},
		created() {


		},
	 
		onShow() {
			
		},
		methods: {
			go_page(k) {
				this.nowindex = k;
				this.now_page = this.nav[k].page_name
			}

		},
		mounted() {

		},
		onLoad() {
			// console.log("index onload");

			let that = this;

			if (this.hasLogin) {
				// getuserInfoByToken
				ajax.post({
					url: 'getuserInfoByToken',
					data: {} 
				}).then(res => {
					// console.log(JSON.stringify(res));

					if (res.code != 200) {
						uni.showToast({
							title: '登陆过期,请重新登录',
							icon: 'none'
						});
						setTimeout(() => {
							uni.navigateTo({
								url: '/pages/login/login/login'
							})
						}, 1000)
					} else {

						that.$ls.set("user_info", res.data)
					}
				})
			} else {
				uni.navigateTo({
					url: '/pages/login/login/login'
				});
			}
			console.log("onLoad")	
		}
	}
</script>

<style>
	.footer {
		width: 100%;
		height: 100upx;
		position: fixed;
		left: 0;
		bottom: 0;
		background-color: #161e31;
		z-index: 10001;
		padding-top: 10upx;
	}

	.five_item .footer_item:nth-child(3) {
		position: relative;
		top: -40upx;
	}

	.five_item .footer_item:nth-child(3) .icon_view {
		width: 100upx;
		height: 100upx;

	}

	.footer_item {
		float: left;
		text-align: center;
		line-height: 34upx;
		font-size: 24upx;
		color: #fff;
	}

	.icon_view {
		width: 50upx;
		height: 50upx;
		display: inline-block;
		/* background-color: #ccc; */
	}

	.icon_view image {
		width: 100%;
		height: 100%;
	}
</style>
