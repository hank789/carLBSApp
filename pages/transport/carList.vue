<template>
	<view class="uni-tab-bar">
		<scroll-view id="tab-bar" class="uni-swiper-tab" scroll-x :scroll-left="scrollLeft">
			<view v-for="(tab,index) in tabBars" :key="tab.id" class="swiper-tab-list" :style="{width: swiperWidth}" :class="tabIndex==index ? 'active' : ''"
			 :id="tab.id" :data-current="index" @click="tapTab">{{tab.name}}</view>
		</scroll-view>
		<swiper :current="tabIndex" class="swiper-box" :style="{height: swiperHeight}" :duration="300" @change="changeTab">
			<swiper-item v-for="(tab,index1) in lists" :key="index1">
				<scroll-view class="list" style="background-color: #f5f5f5;" scroll-y @scrolltolower="loadMore(index1)">
					<block v-for="item in tab.data" :key="item.id">
						<view class='my-unit' hover-class="uni-list-cell-hover" @tap.stop.prevent="go_timeline(item.id)">
						    <view class="unit-head">
						    	<text>{{item.entity_name}}</text><text class="fr color-999 uni-text-middle">最后定位{{item.modify_time}}</text>
						    </view>
						    <view class="unit-body">
								<text class="uni-ellipsis" style="width: 45%;">司机：<text>{{item.entity_owner}}</text></text>
								<text class="uni-ellipsis" style="width: 55%;" @tap.stop.prevent="take_phone(item.contact_mobile)">联系方式：<text>{{item.contact_mobile}}</text><image class='phone' src='../../static/images/options_01.png'></image></text>
								<text class="uni-ellipsis">出发地：<text>{{item.start_place}}</text></text>
								<text class="uni-ellipsis">目的地：<text>{{item.end_place}}</text></text>
						    	<text class="uni-ellipsis">最后定位地址：<text>{{item.latest_location.formatted_address}}</text></text>
								<text class="uni-ellipsis">货物：<text>{{item.entity_desc}}</text></text>
						    </view>
						    <view class="unit-foot">
						    	<text class="color-999">{{item.distance}}</text>
						    </view>
						</view>
					</block>
					<view class="uni-tab-bar-loading">
						{{tab.loadingText}}
					</view>
				</scroll-view>
			</swiper-item>
		</swiper>
		<mpvue-picker
			:themeColor="themeColor"
			ref="mpvuePicker"
			:mode="mode"
			:deepLength="deepLength"
			:pickerValueDefault="pickerValueDefault"
			@onConfirm="onConfirm"
			@onCancel="onCancel"
			:pickerValueArray="pickerValueArray"
		></mpvue-picker>
	</view>
</template>

<script>
	// https://github.com/zhetengbiji/mpvue-picker
	import mpvuePicker from '@/components/mpvue-picker/mpvuePicker.vue'
    export default {
        data() {
            return {
				scrollLeft: 0,
				refreshing: false,
				isClickChange: false,
				refreshText: "下拉可以刷新",
				tabIndex: 0,
				swiperHeight: '800upx',
				swiperWidth: '150upx',
                lists: [
					{
						data: [],
						page: 1,
						isMore: true,
						loadingText: ''
					},
					{
						data: [],
						page: 1,
						isMore: true,
						loadingText: ''
					}
				],
				isMore: true,
				searchWord: '',
				searchFilter: '',
				themeColor: '#007AFF',
				mode: '',
				deepLength: 1,
				pickerValueDefault: [0],
				pickerValueArray: [
					{
						label: '全部',
						value: 'all:'
					},
					{
						label: '在线',
						value: 'active_time:'
					},
					{
						label: '离线',
						value: 'inactive_time:'
					}
				],
				tabBars: [{
					name: '运输中',
					id: 'process'
				}, {
					name: '已完成',
					id: 'finish'
				}]
            }
        },
		components: {
			mpvuePicker
		},
		onPullDownRefresh() {
			this.lists[this.tabIndex].page = 1;
			this.getList(1);
			uni.stopPullDownRefresh();
		},
		onReachBottom() {
			
		},
        onLoad() {
			this.setStyle(0, '全部');
            this.getList(1);
			var appInfo = this.$ls.get('appDeviceInfo')
			this.swiperHeight = (appInfo.windowHeight - appInfo.statusBarHeight - 50) + 'px'
			this.swiperWidth = appInfo.windowWidth/2 + 'px'
			console.log('swiperHeight:' + this.swiperHeight)
        },
		methods: {
			go_timeline(id) {
				uni.navigateTo({
					url: '/pages/transport/timeline?id='+id
				});
			},
		    take_phone(phone) {
			    uni.makePhoneCall({
			        phoneNumber: phone
			    });
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
				let tabIndex = e.target.dataset.current;
				
				if (this.tabIndex === tabIndex) {
					return false;
				} else {
					this.tabIndex = tabIndex;
					if (this.lists[tabIndex].data.length === 0) {
						this.getList(1)
					}
					let tabBar = await this.getElSize("tab-bar"),
						tabBarScrollLeft = tabBar.scrollLeft; //点击的时候记录并设置scrollLeft
					this.scrollLeft = tabBarScrollLeft;
					this.isClickChange = true;
					this.tabIndex = tabIndex;
				}
			},
			async changeTab(e) {
				let index = e.target.current;
				this.tabIndex = index; //一旦访问data就会出问题
				if (this.lists[index].data.length === 0) {
					this.getList(1)
				}
				if (this.isClickChange) {
					this.tabIndex = index;
					this.isClickChange = false;
					return;
				}
				let tabBar = await this.getElSize("tab-bar"),
					tabBarScrollLeft = tabBar.scrollLeft;
				let width = 0;
				
				for (let i = 0; i < index; i++) {
					let result = await this.getElSize(this.tabBars[i].id);
					width += result.width;
				}
				let winWidth = uni.getSystemInfoSync().windowWidth,
					nowElement = await this.getElSize(this.tabBars[index].id),
					nowWidth = nowElement.width;
				if (width + nowWidth - tabBarScrollLeft > winWidth) {
					this.scrollLeft = width + nowWidth - winWidth;
				}
				if (width < tabBarScrollLeft) {
					this.scrollLeft = width;
				}
				this.isClickChange = false;
			},
			loadMore(e) {
				console.log('loadMore')
				if (this.lists[e].isMore) {
				  this.getList(this.lists[e].page);
				}
			},
			getList(page) {
				console.log(page)
				this.$ajax.post('car/transport/searchCar', {page: page, filter: this.searchFilter, word: this.searchWord, status: this.tabBars[this.tabIndex].id}).then(res_data => {
					if (res_data.code == 1000) {
						this.lists[this.tabIndex].page = page + 1;
						if (page === 1) {
							this.lists[this.tabIndex].data = res_data.data.data;
						} else {
							this.lists[this.tabIndex].data = this.lists[this.tabIndex].data.concat(res_data.data.data);
						}
						this.lists[this.tabIndex].loadingText = '加载更多...'
						this.lists[this.tabIndex].isMore = true
						if (!res_data.data.next_page_url) {
							this.lists[this.tabIndex].isMore = false;
							this.lists[this.tabIndex].loadingText = '没有更多了'
						}
					} else {
					    uni.showToast({
					        title: res_data.message,
					        icon: 'none'
					    });
					}
					this.refreshing = false
				})
			},
			onCancel(e) {
				console.log(e);
			},
			// 单列
			showSinglePicker() {
				this.mode = 'selector';
				this.deepLength = 1;
				this.pickerValueDefault = [0];
				this.$refs.mpvuePicker.show();
			},
			onConfirm(e) {
				console.log(e.label);
				let onlineTime = Math.ceil(new Date().getTime() / 1000) - 600
				this.searchFilter = e.value + onlineTime
				console.log(this.searchFilter)
				this.setStyle(0, e.label);
				this.getList(1)
			},
			/**
			 * 修改导航栏buttons
			 * index[number] 修改的buttons 下标索引，最右边索引为0
			 * text[string] 需要修改的text 内容
			 */
			setStyle(index, text) {
				let pages = getCurrentPages();
				let page = pages[pages.length - 1];
				if (text.length > 3) {
					text = text.substr(0, 3) + '...';
				}
				// #ifdef APP-PLUS
				let currentWebview = page.$getAppWebview();
				let titleNView = currentWebview.getStyle().titleNView;
				// 添加文字过长截取为3个字符，请根据自己业务需求更改
				titleNView.buttons[0].text = text;
				currentWebview.setStyle({
					titleNView: titleNView
				});
				// #endif
				// #ifdef H5
				// h5 临时方案
				document.getElementsByClassName('uni-btn-icon')[1].innerText = text;
				// #endif
			}
		},
		onBackPress() {
			if (this.$refs.mpvuePicker.showPicker) {
				this.$refs.mpvuePicker.pickerCancel();
				return true;
			}
		},
		onUnload() {
			if (this.$refs.mpvuePicker.showPicker) {
				this.$refs.mpvuePicker.pickerCancel();
			}
		},
		onNavigationBarButtonTap(e) {
			if (e.index === 0) {
				this.showSinglePicker();
			}
		},
		/**
		 * 当 searchInput 输入时触发
		 */
		onNavigationBarSearchInputChanged(e) {
			let text = e.text;
			if (!text) {
				return;
			} else {
				this.searchWord = text
				this.getList(1)
			}
		},
		/**
		 * 点击软键盘搜索按键触发
		 */
		onNavigationBarSearchInputConfirmed(e) {
			let text = e.text;
			this.searchWord = text
			if (!text) {
				uni.showModal({
					title: '提示',
					content: '请输入内容。',
					success: res => {
						if (res.confirm) {
						}
					}
				});
				return;
			} else {
				this.searchWord = text
				this.getList(1)
			}
		},
		onrefresh(event) {
			uni.showToast({
				title: "refresh",
				icon: "none"
			});
			this.refreshText = "正在刷新...";
			this.refreshing = true;
			this.lists[this.tabIndex].page = 1
			this.getList(1)
		},
		onpullingdown(event) {
			if (this.refreshing) {
				return;
			}
			if (Math.abs(event.pullingDistance) > Math.abs(event.viewHeight)) {
				this.refreshText = "释放立即刷新";
			} else {
				this.refreshText = "下拉可以刷新";
			}
		}
    }
</script>

<style lang='scss'>
	.uni-tab-bar-loading {
		text-align: center;
		font-size: 28upx;
		color: #999;
	}
	.fr{
		float: right;
	}
	.color-999 {
		color: #999;
	}
	.my-unit{
		margin: 20upx 0;
		background-color: #ffffff;
		font-size: 28upx;
		transform: all 1s;
		
		.unit-head{
			padding: 20upx;
			height: 80upx;
			box-sizing: border-box;
			border-bottom: 2upx solid #f5f5f5;
		}
		.unit-body{
			padding: 20upx;
			display: flex;
			flex-wrap: wrap;
			
			text{
				font-size: 28upx;
				line-height: 55upx;
			}
			.phone {
			    height: 28upx;
			    width: 28upx;
				padding-left: 20upx;
			}
		}
		.unit-foot{
			height: 88upx;
			padding: 0 20upx;
			border-top: 2upx solid #f5f5f5;
			border-bottom: none;
			line-height: 88upx;
			font-size: 28upx;
			
			.btn{
				height: 60upx;
				font-size: 28upx;
				line-height: 60upx;
				margin: 14upx 0;
			}
		}
	}
</style>
