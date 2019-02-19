import store from '../store'
import ls from './localstorage.js'
// 接口地址
let base_url = store.state.baseApiUrl;

function get(url, data = {}) {
	return new Promise(function(resolve, reject) {
		uni.request({
			url: base_url + url,
			header: {
				'content-type': 'application/json',
				'Authorization': 'bearer ' + ls.get('token')
			},
			data: data,
			method: 'GET',
			dataType: 'json',
			responseType: 'text',
			success: function(res) {
				if (res.data.code == 1002 || res.data.code == 1001) {
					uni.showToast({
						title: '您的登陆已过期',
						icon: 'none'
					})
					uni.navigateTo({
						url: '/pages/login/login'
					});
				} else {
					resolve(res.data)
				}
			},
			fail: function(err) {
				uni.showToast({
					title: '网络不给力',
					icon: 'none'
				})
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
				'Authorization': 'bearer ' + ls.get('token')
			},
			url: base_url + url,
			data: data,
			method: 'POST',
			dataType: 'json',
			responseType: 'text',
			success: function(res) {
				if (res.data.code == 1002 || res.data.code == 1001) {
					uni.showToast({
						title: '您的登陆已过期',
						icon: 'none'
					})
					uni.navigateTo({
						url: '/pages/login/login'
					});
				} else {
					resolve(res.data)
				}
			},
			fail: function(err) {
				uni.showToast({
					title: '网络不给力',
					icon: 'none'
				})
				reject(err)
			},
			complete: function() {

			}
		})
	})
}

function upload_file(url, files, formData=[]) {
	console.log(base_url + url)
	console.log(files)
	console.log(formData)
	return new Promise(function(resolve, reject) {
		uni.uploadFile({
			header: {
				'Authorization': 'bearer ' + ls.get('token')
			},
			url: base_url + url,
			formData: formData,
			files: files,
			success: function(res) {
				if (res.data.code == 1002 || res.data.code == 1001) {
					uni.showToast({
						title: '您的登陆已过期',
						icon: 'none'
					})
					uni.navigateTo({
						url: '/pages/login/login'
					});
				} else {
					resolve(res.data)
				}
			},
			fail: function(err) {
				uni.showToast({
					title: '网络不给力',
					icon: 'none'
				})
				reject(err)
			},
			complete: function() {
	
			}
		})
	})
}

function watchGeoPositionAndSave(sub_id, minLength = 12, geocode=false) {
	var wid = ls.get('geoWatchId')
	//#ifdef APP-PLUS
	if (wid) {
		stopWatchGeoPosition(wid)
	}
	wid = plus.geolocation.watchPosition((p) => {
		let date = new Date()
		p.timestamp = date.getTime()
		console.log(JSON.stringify(p))
		let positions = ls.get('geoPositions')
		console.log(positions.length)
		if (positions) {
			let lastPosition = positions[positions.length-1]
			console.log(JSON.stringify(lastPosition))
			if ((lastPosition.coords.latitude != p.coords.latitude && lastPosition.coords.longitude != p.coords.longitude) || (p.timestamp-lastPosition.timestamp)>=250000) {
				positions.push(p)
			}
		} else {
			positions = [p]
		}
		ls.set('geoPositions',positions)
		if (positions.length >= minLength) {
			uploadPositions(sub_id, positions)
		}
	},(e) => {
	  console.log('监听位置信息失败: ' + JSON.stringify(e))
	}, {geocode: geocode, provider: 'baidu', coordsType: 'gcj02', maximumAge: 5000})
	ls.set('geoWatchId',wid)
	//#endif
}

function stopWatchGeoPosition(wid='', sub_id='') {
	if (!wid) {
		wid = ls.get('geoWatchId')
	}
	plus.geolocation.clearWatch(wid)
	ls.remove('geoWatchId')
	if(sub_id) {
		let positions = ls.get('geoPositions')
		uploadPositions(sub_id, positions)
	}
}

function uploadPositions(sub_id, positions) {
	while(positions.length >= 1000) {
		post('car/location/saveBatch',{transport_sub_id: sub_id, position_list: positions.splice(0,1000)}).then(res => {
			console.log(JSON.stringify(res));
			if (res.code == 1000) {
				
			} else {
				uni.showToast({
					title: res.msg,
					icon: 'none'
				});
			}
		})
	}
	if (positions.length > 0) {
		post('car/location/saveBatch',{transport_sub_id: sub_id, position_list: positions}).then(res => {
			console.log(JSON.stringify(res));
			if (res.code == 1000) {
			    ls.remove('geoPositions')
			} else {
			    uni.showToast({
			        title: res.msg,
			        icon: 'none'
			    });
			}
		})
	} else {
		ls.remove('geoPositions')
	}
}

export default {
	get,
	post,
	watchGeoPositionAndSave,
	stopWatchGeoPosition,
	upload_file
}
