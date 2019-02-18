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
				resolve(res.data)
				// console.log(JSON.stringify(res))
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
				resolve(res.data)
				// console.log(JSON.stringify(res))
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

function watchGeoPositionAndSave(sub_id, geocode=false) {
	var wid = ls.get('geoWatchId')
	//#ifdef APP-PLUS
	if (wid) {
		stopWatchGeoPosition(wid)
	}
	wid = plus.geolocation.watchPosition((p) => {
		console.log(JSON.stringify(p))
		let positions = ls.get('geoPositions')
		if (positions) {
			positions.push(p)
		} else {
			positions = [p]
		}
		ls.set('geoPositions',positions)
		if (positions.length >= 12) {
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
		}
	},(e) => {
	  console.log('监听位置信息失败: ' + JSON.stringify(e))
	}, {geocode: geocode, provider: 'baidu', coordsType: 'gcj02'})
	ls.set('geoWatchId',wid)
	//#endif
}

function stopWatchGeoPosition(wid='') {
	if (!wid) {
		wid = ls.get('geoWatchId')
	}
	plus.geolocation.clearWatch(wid)
	localstorage.remove('geoWatchId')
}
export default {
	get,
	post,
	watchGeoPositionAndSave,
	stopWatchGeoPosition,
	upload_file
}
