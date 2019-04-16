import store from '../store'
import ls from './localstorage.js'
// 接口地址
let base_url = store.state.baseApiUrl;
let app_id = plus.runtime.appid;

let appDeviceInfo = ls.get('appDeviceInfo')

const bgAudioMannager = plus.audio.createPlayer('/static/audio/music.mp3')

function get(url, data = {}) {
	data.current_version = ls.get('app_install_version')
	data.user_device = appDeviceInfo.platform
	data.system_appid = app_id
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
					uni.reLaunch({
						url: '/pages/login/login'
					});
					reject(res.data)
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
	//console.log(data)
	data.current_version = ls.get('app_install_version')
	data.user_device = appDeviceInfo.platform
	data.system_appid = app_id
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
					uni.reLaunch({
						url: '/pages/login/login'
					});
					reject(res.data)
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
	formData.current_version = ls.get('app_install_version')
	formData.user_device = appDeviceInfo.platform
	formData.system_appid = app_id
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
				var result = res.data
				if (!result.code) {
					result = JSON.parse(result)
				}
				if (result.code == 1002 || result.code == 1001) {
					uni.showToast({
						title: '您的登陆已过期',
						icon: 'none'
					})
					uni.reLaunch({
						url: '/pages/login/login'
					});
					reject(result)
				}
				resolve(result)
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

function watchGeoPositionAndSave(sub_id, geocode=false, callback = null) {
	var userInfo = store.state.user
	var appInfo = ls.get('appDeviceInfo')
	console.log(userInfo.watch_position_limit_time)
	if (!userInfo.watch_position_limit_time) {
		userInfo.watch_position_limit_time = 10
	}
	if (!userInfo.upload_positions_limit_time) {
		userInfo.upload_positions_limit_time = 60
	}
	//#ifdef APP-PLUS
	stopWatchGeoPosition()
	var wid = setInterval(() => {
		  plus.geolocation.getCurrentPosition((p) => {
			let date = new Date()
			p.timestamp = date.getTime()
			//console.log(JSON.stringify(p))
			//console.log(userInfo.watch_position_limit_time)
			let positions = ls.get('geoPositions')
			let isAppHide = store.state.isAppHide
			if (isAppHide) {
				console.log('app hide')
				bgAudioMannager.seekTo(0)
				bgAudioMannager.play(function () {
					console.log('音乐播放成功')
				},function (e) {
					console.log('音乐播放失败')
				})
			}
			//console.log(positions.length)
			if (positions) {
				var lastPosition = positions[positions.length-1]
				//console.log(JSON.stringify(lastPosition))
				positions.push(p)
			} else {
				positions = [p]
			}
			ls.set('geoPositions',positions)
			if (positions.length >= 1 && (p.timestamp-store.state.lastPositionUploadTime) >= 1000*userInfo.upload_positions_limit_time) {
				uploadPositions(sub_id)
			}
			if (callback) {
				callback(p)
			}
			
		},(e) => {
		  console.log('获取位置信息失败: ' + JSON.stringify(e))
		}, {enableHighAccuracy: true, geocode: geocode, provider: 'system', coordsType: 'wgs84',timeout: 60000})
	}, 1000*userInfo.watch_position_limit_time)
	store.commit('setGeoWatchId',wid)
	//#endif
}

function stopWatchGeoPosition(wid='', sub_id='') {
	if (!wid) {
		wid = store.state.geoWatchId
	}
	clearInterval(wid)
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
	store.commit('setLastPositionUploadTime',(new Date()).getTime())
	var positions = ls.get('geoPositions')
	var pLength = positions.length
	var formData = {transport_sub_id: sub_id, current_version: ls.get('app_install_version'), user_device: appDeviceInfo.platform, system_appid: app_id}
	while(positions.length >= 1000) {
		formData.position_list = positions.splice(0,1000)
		uni.request({
			header: {
				'content-type': 'application/json',
				'Authorization': 'bearer ' + ls.get('token')
			},
			url: base_url + 'car/location/saveBatch',
			data: formData,
			method: 'POST',
			dataType: 'json',
			responseType: 'text',
			success: function(res) {
				console.log(JSON.stringify(res));
				if (res.data.code == 1002 || res.data.code == 1001) {
					uni.showToast({
						title: '您的登陆已过期',
						icon: 'none'
					})
					uni.reLaunch({
						url: '/pages/login/login'
					});
					return;
				}
			},
			fail: function(err) {
				
			},
			complete: function() {
		
			}
		})
	}
	formData.position_list = positions
	uni.request({
		header: {
			'content-type': 'application/json',
			'Authorization': 'bearer ' + ls.get('token')
		},
		url: base_url + 'car/location/saveBatch',
		data: formData,
		method: 'POST',
		dataType: 'json',
		responseType: 'text',
		success: function(res) {
			//console.log(JSON.stringify(res));
			if (res.data.code == 1002 || res.data.code == 1001) {
				uni.showToast({
					title: '您的登陆已过期',
					icon: 'none'
				})
				uni.reLaunch({
					url: '/pages/login/login'
				});
				return;
			}
			if (res.data.code == 1000) {
				var newPositions = ls.get('geoPositions')
				if (newPositions.length > pLength) {
					newPositions.splice(0,pLength)
					ls.set('geoPositions',newPositions)
				} else {
					ls.remove('geoPositions')
				}
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

function getUserInfo() {
	return new Promise(function(resolve, reject) {
		uni.request({
			url: base_url + 'profile/info',
			header: {
				'content-type': 'application/json',
				'Authorization': 'bearer ' + ls.get('token')
			},
			data: {current_version: ls.get('app_install_version'), user_device: appDeviceInfo.platform, system_appid: app_id},
			method: 'GET',
			dataType: 'json',
			responseType: 'text',
			success: function(res) {
				if (res.data.code == 1002 || res.data.code == 1001) {
					store.commit('setUser','')
					ls.set('token','')
					uni.showToast({
						title: '您的登陆已过期',
						icon: 'none'
					})
					uni.reLaunch({
						url: '/pages/login/login'
					});
					reject(res.data)
				}
				store.commit('setUser',res.data.data)
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

export default {
	get,
	post,
	watchGeoPositionAndSave,
	stopWatchGeoPosition,
	upload_file,
	getUserInfo
}
