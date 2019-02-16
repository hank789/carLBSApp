const pre_name = 'carlbs_';
export default {
	set: function(k, v, sync = true) {
		if (typeof v == 'object') {
			if (v == null) {
				v = ""
			} else {
				v = JSON.stringify(v);
			}

		} else if (typeof v == 'number') {
			v = v + "";
		} else if (typeof v == 'boolean') {
			v = v + "";
		} else if (typeof v == 'undefined') {
			alert("数据值-->undefined")
		}
		try {
			if (sync) {
				uni.setStorageSync(pre_name + k, v);
			} else {
				uni.setStorage({
					key: pre_name + k,
					data: v,
					success: function () {
						console.log('setStorage success');
					},
					fail: function() {
						console.log('setStorage fail');
					}
				});
			}
		} catch (e) {
			console.log(e)
			if (window && window.localStorage) {
				window.localStorage.setItem(pre_name + k, v)
			}
		}

	},
	get: function(k) {
		let str;
		try {
			str = uni.getStorageSync(pre_name + k);
		} catch (e) {
			console.log(e)
			if (window && window.localStorage) {
				str = window.localStorage.getItem(pre_name + k)
			}
		}
		try {
			str = JSON.parse(str);
			return str
		} catch (e) {
			return str
		}
	},
	remove: function(k, sync=true) {
		try {
			if (sync) {
				uni.removeStorageSync(pre_name + k)	
			} else {
				uni.removeStorage({
					key: pre_name + k,
					success: function (res) {
						console.log('removeStorage success');
					},
					fail() {
						console.log('removeStorage fail');
					}
				});
			}
		} catch (e) {
			console.log(e)
			if (window && window.localStorage) {
				str = window.localStorage.remove(pre_name + k)
			}
		}
	},
	get_key_list(){
		return uni.getStorageInfoSync();
	}
}
