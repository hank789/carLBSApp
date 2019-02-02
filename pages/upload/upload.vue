<template>
	<view>
		<view class="uni-textarea">
			<textarea @blur="bindTextAreaBlur"  placeholder="占位符字体是红色的" style="width: 92%;padding: 18upx 4%;"/>
		</view>
		<view class="grace-add-file">
			<view class="grace-add-btn" @tap="addImg" v-if="btnImg" style="">
				<view>+</view>
				<view>添加照片</view>
			</view>
			<view class="garce-items" v-for="(item, index) in imgLists">
				<image :src="item" mode="widthFix" :data-src="item" @tap="previewImage"></image>
				<view class="grace-close" @tap="removeImg" :id="'grace-items-img-'+index" style="bottom: 20upx;"></view>
			</view>
		</view>
	</view>
</template>
<script>
	var maxNum = 9,
		_self;
	export default {
		data: {
			imgLists: [],
			btnImg: true
		},
		onLoad: function() {
			_self = this;
		},
		methods: {
			addImg: function() {
				var num = maxNum - _self.imgLists.length;
				if (num < 1) {
					return false;
				}
				uni.chooseImage({
					count: num,
					sizeType: ['compressed'],
					success: function(res) {
						_self.imgLists = _self.imgLists.concat(res.tempFilePaths);
						console.log(_self.imgLists);
						if (_self.imgLists.length >= maxNum) {
							_self.btnImg = false;
						}
					}
				});
			},
			removeImg: function(e) {
				var index = e.currentTarget.id.replace('grace-items-img-', '');
				_self.imgLists.splice(index, 1);
				_self.imgLists = _self.imgLists;
				if (_self.imgLists.length < maxNum) {
					_self.btnImg = true;
				}
			},
			bindButtonTap: function() {
				this.focus = true
			},
			bindTextAreaBlur: function(e) {
				console.log(e.detail.value)
			},
			bindFormSubmit: function(e) {
				console.log(e.detail.value.textarea)
			},
			previewImage: function(e) {
				var current = e.target.dataset.src;
				console.log(current);
				uni.previewImage({
					current: current,
					urls: this.imgLists
				})
			}
		}
	}
</script>
<style></style>
