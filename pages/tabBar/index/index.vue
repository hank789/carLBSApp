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
		},
		mounted() {

		},
		onLoad() {
			let that = this;
			if (this.$ls.get('token')) {
				this.$ajax.get('profile/info').then(res => {
					console.log(res)
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
	
</style>
