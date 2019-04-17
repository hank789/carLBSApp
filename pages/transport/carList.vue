<template>
    <view class="page">
        <view class="uni-list">
            <block v-for="item in lists" :key="item.id">
                <view class="uni-list-cell" hover-class="uni-list-cell-hover" @tap.stop.prevent="go_timeline(item.id)">
                    <view class="uni-triplex-row">
                        <view class="uni-triplex-left">
                            <text class="uni-title uni-ellipsis">{{item.entity_name + ' ' + item.entity_owner}}</text>
                            <text class="uni-text-middle uni-ellipsis">{{item.distance}}</text>
                            <text class="uni-text-small uni-ellipsis">{{"最后定位地："+item.latest_location.formatted_address}}</text>
							<text class="uni-text-small uni-ellipsis">{{"货物："+item.entity_desc}}</text>
                        </view>
                        <view class="uni-triplex-right">
                            <text class="uni-h5">{{item.modify_time}}</text>
                        </view>
                    </view>
                </view>
            </block>
        </view>
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
	import mpvuePicker from '../../components/mpvue-picker/mpvuePicker.vue'
    export default {
        data() {
            return {
                lists: [],
				page: 1,
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
				]
            }
        },
		components: {
			mpvuePicker
		},
		onPullDownRefresh() {
			this.page = 1;
			this.getList(1);
			uni.stopPullDownRefresh();
		},
		onReachBottom() {
			if (this.isMore) {
			  this.loadList(this.page);
			}
		},
		onReady() {
			this.setStyle(0, '全部');
		},
        onLoad() {
            this.getList(1);
        },
		methods: {
			go_timeline(id) {
				uni.navigateTo({
					url: '/pages/transport/timeline?id='+id
				});
			},
			getList(page) {
				console.log(page)
				this.$ajax.post('car/transport/searchCar', {page: page, filter: this.searchFilter, word: this.searchWord}).then(res_data => {
					console.log(JSON.stringify(res_data));
					if (res_data.code == 1000) {
						this.page = page + 1;
						if (page === 1) {
							this.lists = res_data.data.data;
						} else {
							this.lists = this.lists.concat(res_data.data.data);
						}
						if (!res_data.data.next_page_url) {
							this.isMore = false;
						}
					} else {
					    uni.showToast({
					        title: res_data.message,
					        icon: 'none'
					    });
					}
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
		}
    }
</script>

<style>
</style>
