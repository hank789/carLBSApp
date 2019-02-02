<template>
    <view>
        <swiper :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval" :duration="duration">
            <swiper-item v-for="item in itemList" :key="item">
                <text>{{item}}</text>
            </swiper-item>
        </swiper>
        <button @tap="changeIndicatorDots"> indicator-dots </button>
        <button @tap="changeAutoplay"> autoplay </button>
        <slider @change="intervalChange" show-value min="500" max="2000" /> interval
        <slider @change="durationChange" show-value min="1000" max="10000" /> duration
    </view>
</template>
<script>
	import mediaList from '@../../../components/tab-nvue/newlist.vue';
	import uniLoadMore from '@../../../components/uni-load-more.vue';
	//import graceFullLoading from "../../../graceUI/components/graceFullLoading.vue";
	export default {
		data() {
			return {
				itemList: [
					'item1',
					'item2',
					'item3'
				],
				indicatorDots: false,
				autoplay: false,
				interval: 5000,
				duration: 1000
			}
		},
		methods: {
			changeIndicatorDots: function (e) {
				this.indicatorDots = !this.indicatorDots
			},
			changeAutoplay: function (e) {
				this.autoplay = !this.autoplay
			},
			intervalChange: function (e) {
				this.interval = e.detail.value
			},
			durationChange: function (e) {
				this.duration = e.detail.value
			}
		}
	}
</script>

<style>
	.refresh {
		align-self: flex-start;
	}

	..swiper-tab-list {
		font-size: 32upx !important;
		font-weight: bold !important;
	}
</style>
