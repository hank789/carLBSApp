<template>
	<view style="background: #fff;" class="uni-tab-bar">
		hello
	</view>
</template>
<script>

	export default {
		data() {
			return {
				timer: null,
				showDown: false,
				toView: 'changeId1',
				textScroll: 10,
				scrollLeft: 0,
				isClickChange: false,
				tabIndex: 1,
				newsitems: [],
				tabBars: [],
				classid: 0,
				newstime: 0,
				lilenght: 0,
				loadingText: {
					contentdown: "上拉加载",
					contentrefresh: "正在加载...",
					contentnomore: "没有更多数据了"
				}
			}
		},
		onLoad: function() {
			uni.showLoading({
				title: "加载中..."
			});

// 			plus.runtime.getProperty(plus.runtime.appid, function(inf) {
// 				// 当前版本
// 				var wgtVersion = inf.version;
// 				console.log(wgtVersion);
// 			});
			uni.request({
				url: 'https://www.babaofan.com/mobile/mix/getAllBar',
				method: 'GET',
				data: {},
				success: res => {
					//console.log(res.data);
					this.tabBars = res.data.data;

					console.log(this.tabBars);
				},
				fail: () => {},
				complete: () => {}
			});
			uni.request({
				url: 'https://www.babaofan.com/mobile/mix/getMixData',
				method: 'GET',
				data: {},
				success: res => {
					this.loadingText.contentdown = "上拉加载";
					//console.log(res);
					this.newsitems = res.data.data;
					console.log(this.newsitems);
					uni.hideLoading();
				},
				fail: () => {},
				complete: () => {}
			});
		},
		//下拉刷新
		onPullDownRefresh() {
			this.bar_path = this.tabBars[this.tabIndex].bar_path;
			console.log(this.bar_path);
			this.newstime = this.newsitems[this.tabIndex][0].time;
			console.log(this.newstime);
			uni.request({
				url: 'https://www.babaofan.com/mobile/mix/refreshDown?bar_path=' + this.bar_path + '&newstime=' + this.newstime,
				method: 'GET',
				data: {},
				success: res => {
					uni.stopPullDownRefresh();
					if (res.data.code == 1) {
						console.log(res.data.data);
						for (var i = 0; i < res.data.data.length; i++) {
							// this.newsitems[this.tabIndex].pop();
							this.newsitems[this.tabIndex].splice(i, 0, res.data.data[i]);
							console.log(i);
						}
						console.log(this.newsitems);
					}
					if (res.data.code == 300) {
						uni.showToast({
							title: "已是最新",
							icon: "none"
						});
					}
				},
				fail: () => {

				},
				complete: () => {}
			});
		},
		methods: {
			scrollToTop: function(e) {
				console.log(e.detail.scrollTop);
				if (e.detail.scrollTop == 0) {
					console.log('已到顶部');
					uni.showToast({
						title: "已是到顶部",
						icon: "none"
					});
				}
			},
			refreshDown: function() {
				this.showDown = true;
				uni.showLoading({
					title: "加载中..."
				});
				if (this.toView == 'changeId2') {
					this.toView = 'changeId1';
					console.log('回执成功1');
				} else {
					this.toView = 'changeId2';
					console.log('回执成功2');
				}
				// this.toView = 'changeId2';
				this.bar_path = this.tabBars[this.tabIndex].bar_path;
				this.newstime = this.newsitems[this.tabIndex][0].time;
				uni.request({
					url: 'https://www.babaofan.com/mobile/mix/refreshDown?bar_path=' + this.bar_path + '&newstime=' + this.newstime,
					method: 'GET',
					data: {},
					success: res => {
						if (res.data.code == 1) {
							console.log(res.data.data);
							for (var i = 0; i < res.data.data.length; i++) {
								this.newsitems[this.tabIndex].splice(i, 0, res.data.data[i]);
								console.log(i);
							}
						}
						this.timer = setInterval(() => {
							if (this.timer) {
								clearInterval(this.timer);
								this.timer = null;
							}
							this.showDown = false;
							uni.hideLoading();
							if (res.data.code == 300) {
								uni.showToast({
									title: "已是最新内容",
									icon: "none"
								});

							}
						}, 2000);
					},
					fail: () => {},
					complete: () => {}
				});
			},
			goDetail(e) {
				//console.log(e);
				if (e.express == 4) {
					uni.navigateTo({
						url: '/pages/tabBar/index/videoDetail/videoDetail?data=' + e.mix_id
					})
				} else if (e.express == 3) {
					uni.navigateTo({
						url: '/pages/tabBar/index/detail/flashDetail?data=' + e.mix_id
					})
				} else {
					uni.navigateTo({
						url: '/pages/tabBar/index/detail/detail?data=' + e.mix_id
					})
				}

			},
			//上拉加载
			loadMore(e) {
				this.newsitems[e].loadingType = 1;
				this.lilenght = this.newsitems[e].length - 1;
				var aa = this.lilenght;
				//console.log(this.lilenght);
				//this.bar_path = this.newsitems[e][this.lilenght].tbname;
				this.bar_path = this.tabBars[e].bar_path
				console.log(this.bar_path);
				this.newstime = this.newsitems[e][this.lilenght].time;
				setTimeout(() => {
					this.addData(e);
				}, 1000);
			},
			addData(e) {
				uni.request({
					url: 'https://www.babaofan.com/mobile/mix/loadPull?bar_path=' + this.bar_path + '&newstime=' + this.newstime,
					method: 'GET',
					data: {},
					success: res => {

						if (res.data.code == 1) {
							for (let i = 0; i < res.data.data.length; i++) {
								this.newsitems[e].push(res.data.data[i]);
							}
						}
					}
				});
				this.newsitems[e].loadingType = 1;
			},
			async changeTab(e) {
				//debugger;
				let index = e.target.current;
				if (this.isClickChange) {
					this.tabIndex = index;
					//console.log(this.tabIndex);
					this.isClickChange = false;
					return;
				}
				let tabBar = await this.getElSize("tab-bar"),
					tabBarScrollLeft = tabBar.scrollLeft;
				let width = 0;
				for (let i = 0; i < index; i++) {
					let result = await this.getElSize(this.tabBars[i].bar_path);
					console.log(result);
					width += result.width;
				}
				//console.log(this.tabBars[index]);
				let winWidth = uni.getSystemInfoSync().windowWidth,
					nowElement = await this.getElSize(this.tabBars[index].bar_path),
					nowWidth = nowElement.width;
				if (width + nowWidth - tabBarScrollLeft > winWidth) {
					this.scrollLeft = width + nowWidth - winWidth;

				}
				if (width < tabBarScrollLeft) {
					this.scrollLeft = width;
				}
				this.isClickChange = false;
				this.tabIndex = index; //一旦访问data就会出问题
			},
			getElSize(id) { //得到元素的size
				return new Promise((res, rej) => {
					uni.createSelectorQuery().select("#" + id).fields({
						size: true,
						scrollOffset: true
					}, (data) => {
						res(data);
					}).exec();
				})
			},
			async tapTab(e) { //点击tab-bar
				if (this.tabIndex === e.target.dataset.current) {
					return false;
				} else {
					let tabBar = await this.getElSize("tab-bar"),
						tabBarScrollLeft = tabBar.scrollLeft; //点击的时候记录并设置scrollLeft
					this.scrollLeft = tabBarScrollLeft;
					this.isClickChange = true;
					this.tabIndex = e.target.dataset.current
				}
			},

		}
	}
</script>

<style>
	.refresh {
		align-self: flex-start;
	}

	.down-cantainer {
		height: 100%;
		width: 100%;
		background: rgba(255, 255, 255, 0);
		color: #fff;
		position: fixed;
		z-index: 9999;
	}

	.swiper-tab-list {
		font-size: 32upx !important;
		font-weight: bold !important;
	}

	.changeid {
		height: 1upx;
		background: #fff;
	}
</style>
