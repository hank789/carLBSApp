<template>
    
        <view class="grace-padding grace-bg-white grace-common-mt grace-common-border">
            <view class="grace-form">
                <form @submit="formSubmit">
                    <view class="grace-items">
                        <view class="grace-label form-label">姓名</view>
                        <input type="text" class="input" focus v-model.trim="name" placeholder="您的姓名"></input>
                    </view>
                    <view style="padding:22upx 0;">
                        <button :disabled="btnDisabled" formType="submit" type="primary" style="width:100%;">提交</button>
                    </view>
                </form>
            </view>
        </view>
    
</template>
<script>
import util from '../../lib/util.js'
export default {
    data() {
        return {
			name: '',
			btnDisabled: false
        }
    },
	
    methods:{
        formSubmit : function(e){
            console.log('formSubmit');
			if (!this.name || this.name.length < 2) {
				uni.showToast({title:"姓名有误", icon:"none"});
				return;
			}
			this.btnDisabled = true
			this.$ajax.post('profile/updateName',{
				name: this.name
			}, true).then(res => {
				console.log(res);
				this.btnDisabled = false
				if (res.code == 1000) {
					uni.reLaunch({
						url: '/pages/tabBar/index'
					})
				} else {
					uni.showToast({
						title: res.message,
						icon: 'none'
					})
				}
			})
        }
    }
}
</script>