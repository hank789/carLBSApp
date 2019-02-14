<template>
    
        <view class="grace-padding grace-bg-white grace-common-mt grace-common-border">
            <view class="grace-form">
                <form @submit="formSubmit">
                    <view class="grace-items">
                        <view class="grace-label">姓名</view>
                        <input type="text" class="input" name="name"></input>
                    </view>
                    <view class="grace-items">
                        <view class="grace-label">性别</view>
                        <view class="grace-form-r">
                            <picker @change="bindPickerChange" :value="genderIndex" :range="gender" name="gender">
                                <text>{{gender[genderIndex]}}</text>
                            </picker>
                        </view>
                    </view>
                    <view class="grace-items">
                        <view class="grace-label">出生年月</view>
                        <view class="grace-form-r">
                            <picker @change="bindDateChange" :value="dateValue" mode="date" name="bd" start="2018-01-01" end="2019-01-01">
                                <text>{{dateValue}}</text>
                            </picker>
                        </view>
                    </view>
                    <view class="grace-items">
                        <view class="grace-label">自动保存</view>
                        <view class="grace-form-r"><switch checked /></view>
                    </view>
                    <view class="grace-items">
                        <view class="grace-label">个人爱好</view>
                        <view class="grace-label-x">
                            <checkbox-group name="aihao">
                                <label><checkbox value="1"></checkbox>读书</label>
                                <label><checkbox value="2"></checkbox>运动</label>
                                <label><checkbox value="3"></checkbox>音乐</label>
                                <label><checkbox value="4"></checkbox>书法</label>
                                <label><checkbox value="5"></checkbox>旅行</label>
                                <label><checkbox value="6"></checkbox>其他</label>
                            </checkbox-group>
                        </view>
                    </view>
                    <view class="grace-items">
                        <view class="grace-label">单项选择</view>
                        <view class="grace-label-y">
                            <radio-group name="danxuan">
                                <label><radio value="1"></radio>小学</label>
                                <label><radio value="2"></radio>大学</label>
                            </radio-group>
                        </view>
                    </view>
                    <view class="grace-items grace-noborder">
                        <view class="grace-label">个人介绍</view>
                        <view class="grace-form-r">
                            <textarea placeholder="说点什么吧....." name="desc"></textarea>
                        </view>
                    </view>
                    <view style="padding:22upx 0;">
                        <button formType="submit" type="primary" style="width:100%;">提交</button>
                    </view>
                </form>
            </view>
        </view>
    
</template>
<script>
export default {
    data() {
        return {
            genderIndex: 0,
            gender : ['男', '女'],
            dateValue : "请选择"
        }
    },
    methods:{
        bindPickerChange:function(e){
            console.log(e);
            this.genderIndex = e.detail.value;
        },
        bindDateChange : function(e){
            this.dateValue = e.detail.value;
        },
        formSubmit : function(e){
            wx.showToast({title:'请观察控制台', icon:'none'});
            console.log(JSON.stringify(e.detail.value));
        }
    }
}
</script>