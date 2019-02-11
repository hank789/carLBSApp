import store from '../store'
import ls from './localstorage.js'
// 接口地址
let base_url = store.state.baseApiUrl;
let token = ls.get('token')

function get(url, data = {}) {
	return new Promise(function(resolve, reject) {
		uni.request({
			url: base_url + url,
			header: {
				'content-type': 'application/json',
				'Authorization': 'bearer ' + token
			},
			data: data,
			method: 'GET',
			dataType: 'json',
			responseType: 'text',
			success: function(res) {
				resolve(res.data)
			},
			fail: function(err) {
				reject(err)
			},
			complete: function() {}
		})
	})
}

function post(url, data) {
	console.log(base_url + url)
	console.log(data)
	return new Promise(function(resolve, reject) {
		uni.request({
			header: {
				'content-type': 'application/json',
				'Authorization': 'bearer ' + token
			},
			url: base_url + url,
			data: data,
			method: 'POST',
			dataType: 'json',
			responseType: 'text',
			success: function(res) {
				resolve(res.data)
				// console.log(JSON.stringify(res))
			},
			fail: function(err) {
				reject(err)
			},
			complete: function() {

			}
		})
	})

}

function upload_img(num) {
	
	let up_url = base_url+'uploadImg'; //图片上传接口地址
	let up_name = "image"; //图片上传 键名
	let params = {}  //额外参数
	
	
	if(!num){
		num = 1;
	}
	// console.log("upload_img_func")
	return new Promise(function(resolve, reject) {
		uni.chooseImage({
			count:num,
			success: (chooseImageRes) => {
				let for_is_over = false; // 是否循环完毕
				let img_path=[];
				let tempFilePaths = chooseImageRes.tempFilePaths;
				let img_num = tempFilePaths.length;
				let img_now = 0;
				// console.log(JSON.stringify(tempFilePaths))
				for(let i = 0; i<tempFilePaths.length;i++){
					// console.log(i+"/"+(tempFilePaths.length-1))
					// console.log(base_url+'uploadImg');
					// console.log(tempFilePaths[i]);
					uni.showLoading({
						title:"上传中"
					})
					// console.log("上传第"+i+"个图片")
					uni.uploadFile({
						url: up_url,  
						filePath: tempFilePaths[i],
						name: up_name,
						formData: params,
						success: (res) => {
							// console.log(JSON.stringify(res))
							if(res.statusCode==200){
								uni.hideLoading()
								// console.log(res.data)
								res.data = JSON.parse(res.data)
								if(res.data.code==200){
									// console.log(111)
									// console.log(res.data.data)
									img_path.push(res.data.data);
									img_now++
									if( img_now == img_num ){
										// 当前最后一个元素
										for_is_over = true;
									}
									// console.log(for_is_over)
									// console.log("----------------------")
									if(for_is_over){
										resolve(img_path)
									}
								}else{
									console.log(222)
									uni.showToast({
										title:res.data.msg,
										icon:"none"
									})
								}
							}else{
								uni.showToast({
									title:"网络错误",
									icon:"none"
								})
							}
							
						},
						complete() {
							uni.hideLoading()
						}
					});
				}
				
			},
			fail(){
				uni.showToast({
					title:"选择图片失败",
					icon:'none'
				})
			}
		});
	})

}

export default {
	get,
	post,
	upload_img
}
