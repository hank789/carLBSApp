const pre_name = 'carlbs_';
export default {
	set: function(k, v) {
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
		if (window && window.localStorage) {
			window.localStorage.setItem(pre_name + k, v)

		} else {
			try {
				uni.setStorageSync(pre_name + k, v);
			} catch (e) {
				console.log(e)
			}
		}

	},
	get: function(k) {
		let str;
		if (window && window.localStorage) {
			str = window.localStorage.getItem(pre_name + k)
		} else {
			try {
				str = uni.getStorageSync(pre_name + k);
			} catch (e) {
				console.log(e)
			}
		}
		try {
			str = JSON.parse(str);
			return str
		} catch (e) {
			return str
		}
	},
	get_key_list(){
		return uni.getStorageInfoSync();
	}
}
