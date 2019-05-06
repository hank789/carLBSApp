<template>
	<view class="page">
		<view class="">
			<view class="uni-title uni-center">{{info.car_number}}
				<view style="font-size: 24upx; color:#ccc;">{{"状态："+info.desc}}</view>
			</view>
			<view class="grace-timeline">
				<block v-for="(item, key) in events" :key="key">
					<view class="rows">
						<view class="grace-timeline-time">
							<view>{{item.created_at_date}}</view>
							<view>{{item.created_at_time}}</view>
							<view>{{item.place}}</view>
						</view>
						<view class="grace-timeline-tips">
							<view class="grace-timeline-circular">
								
							</view>
						</view>
						<view class="grace-timeline-content">
							<view>{{item.title}}</view>
							<view>{{item.desc}}</view>
							<view class="uni-uploader__files">
								<block v-for="(image,index) in item.images" :key="index">
									<view class="uni-uploader__file">
										<image class="uni-uploader__img" :src="image" :data-src="image" @tap="previewImage"></image>
									</view>
								</block>
								
							</view>
						</view>
						<view v-if="item.bg_color != 'blue-bg'" class="grace-timeline-line"></view>
					</view>
				</block>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				id: '',
				events: [],
				info: [],
				imageList: []
			}
		},
		onLoad: function(option) {
		    //option为object类型，会序列化上个页面传递的参数,
		    this.id = option.id;
			this.get_data()
		},
		methods: {
			get_data() {
				this.$ajax
				    .get('car/transport/subTimeline/'+this.id)
				    .then(res => {
						if (res.code == 1000) {
							this.events = res.data.timeline
							this.info = res.data.info
							this.imageList = res.data.images
						} else {
							uni.showToast({
								title: res.message,
								icon: 'none'
							});
						}
					})
			},
			previewImage: function(e) {
				var current = e.target.dataset.src
				uni.previewImage({
					current: current,
					urls: this.imageList
				})
			}
		}
	}
</script>

<style>
	
</style>
