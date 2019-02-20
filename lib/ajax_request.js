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
					
				}
				resolve(res.data)
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

function post(url, data, showLoading = false) {
	console.log(base_url + url)
	console.log(data)
	if (showLoading) {
		uni.showLoading({
			title: '请求中'
		});
	}
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
				}
				resolve(res.data)
			},
			fail: function(err) {
				uni.showToast({
					title: '网络不给力',
					icon: 'none'
				})
				reject(err)
			},
			complete: function() {
				uni.hideLoading()
			}
		})
	})
}

function upload_file(url, files, formData=[], showLoading = false) {
	console.log(base_url + url)
	console.log(files)
	console.log(formData)
	if (showLoading) {
		uni.showLoading({
			title: '请求中'
		});
	}
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
				}
				resolve(res.data)
			},
			fail: function(err) {
				uni.showToast({
					title: '网络不给力',
					icon: 'none'
				})
				reject(err)
			},
			complete: function() {
				uni.hideLoading()
			}
		})
	})
}

function watchGeoPositionAndSave(sub_id, geocode=false) {
	var userInfo = ls.get('user')
	//#ifdef APP-PLUS
	stopWatchGeoPosition()
	var wid = plus.geolocation.watchPosition((p) => {
		let date = new Date()
		p.timestamp = date.getTime()
		console.log(JSON.stringify(p))
		let positions = ls.get('geoPositions')
		console.log(positions.length)
		if (positions) {
			var lastPosition = positions[positions.length-1]
			console.log(JSON.stringify(lastPosition))
			if ((lastPosition.coords.latitude != p.coords.latitude && lastPosition.coords.longitude != p.coords.longitude) || (p.timestamp-lastPosition.timestamp)>=280000) {
				positions.push(p)
			}
		} else {
			positions = [p]
		}
		ls.set('geoPositions',positions)
		if (positions.length >= 1 && (p.timestamp-(lastPosition?lastPosition.timestamp:2550631895064)) >= 1000*userInfo.upload_positions_limit_time) {
			uploadPositions(sub_id)
		}
	},(e) => {
	  console.log('监听位置信息失败: ' + JSON.stringify(e))
	}, {geocode: geocode, provider: 'baidu', coordsType: 'gcj02', maximumAge: 1000*userInfo.watch_position_limit_time})
	store.commit('setGeoWatchId',wid)
	//#endif
}

function stopWatchGeoPosition(wid='', sub_id='') {
	if (!wid) {
		wid = store.state.geoWatchId
	}
	plus.geolocation.clearWatch(wid)
	store.commit('setGeoWatchId','')
	if(sub_id) {
		uploadPositions(sub_id)
	}
}

function uploadPositions(sub_id) {
	var uploadSync = ls.get('geoPositionsUploading')
	if (uploadSync) {
		console.log('uploadPositions:已阻止')
		return;
	}
	ls.set('geoPositionsUploading',1)
	var positions = ls.get('geoPositions')
	while(positions.length >= 1000) {
		uni.request({
			header: {
				'content-type': 'application/json',
				'Authorization': 'bearer ' + ls.get('token')
			},
			url: base_url + 'car/location/saveBatch',
			data: {transport_sub_id: sub_id, position_list: positions.splice(0,1000)},
			method: 'POST',
			dataType: 'json',
			responseType: 'text',
			success: function(res) {
				console.log(JSON.stringify(res));
			},
			fail: function(err) {
				
			},
			complete: function() {
		
			}
		})
	}
	uni.request({
		header: {
			'content-type': 'application/json',
			'Authorization': 'bearer ' + ls.get('token')
		},
		url: base_url + 'car/location/saveBatch',
		data: {transport_sub_id: sub_id, position_list: positions},
		method: 'POST',
		dataType: 'json',
		responseType: 'text',
		success: function(res) {
			console.log(JSON.stringify(res));
			if (res.data.code == 1000) {
				ls.remove('geoPositions')
			} else {
				uni.showToast({
					title: res.msg,
					icon: 'none'
				});
			}
		},
		fail: function(err) {
			
		},
		complete: function() {
			ls.remove('geoPositionsUploading')
		}
	})
}

export default {
	get,
	post,
	watchGeoPositionAndSave,
	stopWatchGeoPosition,
	upload_file
}
