import localstorage from "./localstorage.js"
import gcoord from './gcoord.js'

function isVehicleNumber(vehicleNumber) {
    var xreg=/^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF]$)|([DF][A-HJ-NP-Z0-9][0-9]{4}$))/;
    var creg=/^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1}$/;
	var nreg=/^(([\u4e00-\u9fa5][a-zA-Z]|[\u4e00-\u9fa5]{2}\d{2}|[\u4e00-\u9fa5]{2}[a-zA-Z])[-]?|([wW][Jj][\u4e00-\u9fa5]{1}[-]?)|([a-zA-Z]{2}))([A-Za-z0-9]{5}|[DdFf][A-HJ-NP-Za-hj-np-z0-9][0-9]{4}|[0-9]{5}[DdFf])$/;
	var phonereg = /^1[3|4|5|8|9][0-9]\d{4,8}$/;
	var wreg=/^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}([A-Z]|[0-9]){7}$/;
	
	if (nreg.test(vehicleNumber)) {
		return true;
	}
	if(vehicleNumber.length == 7){
		return creg.test(vehicleNumber);
	} else if(vehicleNumber.length == 8){
		return xreg.test(vehicleNumber) || wreg.test(vehicleNumber);
	} else if(vehicleNumber.length == 11){
		return phonereg.test(vehicleNumber);
	} else {
		return nreg.test(vehicleNumber);
	}
}

//将"yyyy-mm-dd HH:MM:ss"格式的字符串，转化为一个Date对象
function parseDateStr(str) {
	var a = str.split(/[^0-9]/);
	return new Date(a[0], a[1] - 1, a[2], a[3], a[4], a[5]);
}

//时间戳 转 YY-mm-dd HH:ii:ss 
function formatDateTime(inputTime) {
	var date = new Date(inputTime);
	var y = date.getFullYear();
	var m = date.getMonth() + 1;
	m = m < 10 ? ('0' + m) : m;
	var d = date.getDate();
	d = d < 10 ? ('0' + d) : d;
	var h = date.getHours();
	h = h < 10 ? ('0' + h) : h;
	var minute = date.getMinutes();
	var second = date.getSeconds();
	minute = minute < 10 ? ('0' + minute) : minute;
	second = second < 10 ? ('0' + second) : second;
	return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
}

/**
 * 检查权限
 */
function checkPermission (type, successCallback, failCallback) {
  //#ifdef APP-PLUS
  var permissionName = ''
  switch (type) {
    case 'LOCATION':
      permissionName = 'LOCATION'
      break
    case 'NOTIFITION':
      permissionName = 'NOTIFITION'
      break
    default:
      throw new Error('checkPermission type 不支持')
  }
  var permission = plus.navigator.checkPermission(permissionName)
	console.log('permissionQueryResult type:' + type + ' , permission:' + permission)
	switch (permission) {
		case 'unsupported':
		case 'notdeny':
		case 'undetermined':
		case 'authorized':
			successCallback(permission)
			break
		case 'denied':
			failCallback(permission)
			break
		default:
			successCallback(permission)
			break
	}
  //#endif
}

/**
 * 跳转到系统位置设置信息页
 */
function toSettingSystem (type) {
  //#ifdef APP-PLUS
  let appDeviceInfo = localstorage.get('appDeviceInfo')
  var platform = appDeviceInfo.platform
  if (platform == 'ios') {
    plus.runtime.openURL('app-settings:')
  } else {
    var main = plus.android.runtimeMainActivity() // 获取activity
    var Intent = plus.android.importClass('android.content.Intent')
    var Settings = plus.android.importClass('android.provider.Settings')

    var intent = null
    switch (type) {
      case 'LOCATION':
        intent = new Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS)
        break
      case 'NOTIFITION':
        intent = new Intent(Settings.ACTION_APPLICATION_SETTINGS)
        break
      case 'Contact':
        intent = new Intent(Settings.ACTION_SETTINGS)
        break
      default:
        throw new Error('toSettingSystem type 不支持')
    }

    main.startActivity(intent)
  }
  //#endif
}

/**
 * 获取地理位置，可以指定返回格式：gcj02，bd09ll，默认返回gcj02
 * @param callback
 */
function getGeoPosition (callback, failCallback=()=>{}, returnCoordsType = 'gcj02') {
  //#ifdef APP-PLUS
  checkPermission('LOCATION',()=>{
	  var geoOptions = {enableHighAccuracy: true, geocode: true, provider: 'amap', coordsType: 'gcj02'}
	  plus.geolocation.getCurrentPosition((p) => {
		console.log(JSON.stringify(p))
		if (p.coordsType != returnCoordsType) {
			var coordsType = gcoord.GCJ02
			var toCoordsType = gcoord.GCJ02
			if (p.coordsType == 'wgs84') {
				coordsType = gcoord.WGS84
			} else if (p.coordsType == 'bd09ll') {
				coordsType = gcoord.BD09LL
			} else if (p.coordsType == 'bd09') {
				coordsType = gcoord.BD09
			} else if (p.coordsType == 'gcj02') {
				coordsType = gcoord.GCJ02
			}
			if (returnCoordsType == 'bd09ll') {
				toCoordsType = gcoord.BD09LL
			}
			var formatP = gcoord.transform([p.coords.longitude,p.coords.latitude],coordsType,toCoordsType)
			console.log(formatP)
			p.coords.longitude = formatP[0]
			p.coords.latitude = formatP[1]
			p.coordsType = returnCoordsType
		}
		callback(p)
	  },(e) => {
		console.log('获取位置信息失败: ' + JSON.stringify(e))
	  }, geoOptions)
  },()=>{
	  uni.showModal({
		title: '提示',
		content: '获取位置信息失败，请检查是否开启定位权限？',
		success: function (res) {
			if (res.confirm) {
				console.log('用户点击确定');
				toSettingSystem('LOCATION')
			} else if (res.cancel) {
				console.log('用户点击取消');
				failCallback()
			}
		}
	});
  })
  //#endif
  //#ifndef APP-PLUS
  callback({"coordsType":"wgs84","address":{"district":"浦东新区","country":"中国","street":"荷泽路","city":"上海市","streetNum":"430号1号"},"addresses":"荷泽路430号1号","coords":{"latitude":31.26735500528595,"longitude":121.5897752625137,"accuracy":30,"altitude":8.899169921875,"heading":224.6484375,"speed":0.72000002861022949,"altitudeAccuracy":32},"timestamp":1547284362540.4541})
  //#endif
}

function Rad(d){
   return d * Math.PI / 180.0;//经纬度转换成三角函数中度分表形式。
}
//计算距离，参数分别为第一点的纬度，经度；第二点的纬度，经度
function getDistance(lat1,lng1,lat2,lng2){
	var radLat1 = Rad(lat1);
	var radLat2 = Rad(lat2);
	var a = radLat1 - radLat2;
	var  b = Rad(lng1) - Rad(lng2);
	var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a/2),2) +
	Math.cos(radLat1)*Math.cos(radLat2)*Math.pow(Math.sin(b/2),2)));
	s = s *6378.137 ;// EARTH_RADIUS;
	s = Math.round(s * 10000) / 10000; //输出为公里
	//s=s.toFixed(4);
	return s;
}

function getCurrentWebview() {
	var pages = getCurrentPages();
	var page = pages[pages.length - 1];
	// #ifdef APP-PLUS
	var currentWebview = page.$getAppWebview();
	console.log(currentWebview.id);
	return currentWebview;
	// #endif
}

var g_wakelock = null;  
//允许程序后台运行，以持续获取GPS位置  
function wakeLock() {
	var appDeviceInfo = localstorage.get('appDeviceInfo')
    //Android
	if (appDeviceInfo.platform =='android' && g_wakelock === null) {
		console.log('wakeLock')
		debugger  
		var main = plus.android.runtimeMainActivity();  
		var Context = plus.android.importClass("android.content.Context");  
		var PowerManager = plus.android.importClass("android.os.PowerManager");  
		var pm = main.getSystemService(Context.POWER_SERVICE);  
		g_wakelock = pm.newWakeLock(PowerManager.PARTIAL_WAKE_LOCK, "ANY_NAME");  
		g_wakelock.acquire();  
	}
}  

//结束程序后台运行  
function releaseWakeLock () {  
    if(g_wakelock != null && g_wakelock.isHeld()) {
			console.log('releaseWakeLock')
      g_wakelock.release();  
      g_wakelock = null;  
    }  
}

//检查版本更新
function checkUpdate (that) {
	plus.runtime.getProperty(plus.runtime.appid, function(widgetInfo) {
		console.log(JSON.stringify(widgetInfo))
		localstorage.set('appWidgetInfo',widgetInfo)
		var wgtVer = widgetInfo.version
		var appInstallVersion = localstorage.get('app_install_version')
		if (!appInstallVersion || appInstallVersion < wgtVer) {
			localstorage.set('app_install_version', wgtVer)
			appInstallVersion = wgtVer
		}
		console.log('当前应用版本：' + wgtVer)
		console.log('当前安装版本：' + appInstallVersion)
		that.$ajax.get('checkUpdate',{app_uuid: plus.device.uuid + wgtVer, appid: widgetInfo.appid, appname: widgetInfo.name}).then(responseData => {
			if (responseData.code == 1000) {
			  var appVersion = responseData.data.app_version
			  if (appVersion && appInstallVersion < appVersion) {
				var packageUrl = responseData.data.package_url
				var isIosForce = responseData.data.is_ios_force
				var isAndroidForce = responseData.data.is_android_force
				var platform = uni.getSystemInfoSync().platform
				// 如果是强更
				if (isIosForce === 1 && platform=='ios') {
				  uni.showToast({
				  	title: '有新的版本升级',
				  	icon: 'none'
				  })
				  plus.runtime.openURL(responseData.data.ios_force_update_url)
				} else if (isAndroidForce === 1 && platform=='android') {
				  uni.showToast({
				  	title: '有新的版本升级',
				  	icon: 'none'
				  })
				  // market://details?id=io.dcloud.HelloMUI
				  // 'com.tencent.android.qqdownloader'
				  plus.runtime.openURL(responseData.data.android_force_update_url, function (e) {
					plus.nativeUI.confirm('很抱歉，您未安装腾讯应用宝，请安装后再更新', function (i) {
					  if (i.index === 0) {
						plus.runtime.openURL('market://details?id=com.tencent.android.qqdownloader')
					  } else if (i.index === 1) {
						plus.runtime.quit()
					  } else {
						plus.runtime.quit()
					  }
					}, inf.name, ['立即下载', '暂不下载', '取消'])
				  })
				} else if ((isIosForce === 2 && platform=='ios') || (isAndroidForce === 2 && platform=='android')) {
				  // 什么都不做
				} else {
				  localstorage.set('app_update_msg', {msg: responseData.data.update_msg})
				  // 下载升级包
				  downWgt(packageUrl, appVersion)
				}
			  }
			}
		})
	});
}

function downWgt (wgtUrl, appVersion) {
  console.log('下载安装包')
  // window.plus.nativeUI.showWaiting('有新版本更新')
  plus.downloader.createDownload(wgtUrl, {filename: '_doc/update/'}, function (d, status) {
    if (status === 200) {
      console.log('下载wgt文件成功！' + appVersion)
      installWgt(d.filename, appVersion) // 安装wgt包
    } else {
      plus.nativeUI.alert('下载更新文件失败:' + status)
    }
    plus.nativeUI.closeWaiting()
  }).start()
}

// 更新应用资源
function installWgt (path, appVersion) {
  // window.plus.nativeUI.showWaiting()
  plus.runtime.install(path, {}, function () {
    plus.nativeUI.closeWaiting()
    console.log('安装wgt文件成功！' + appVersion)
    removeFile(path)
    localstorage.set('app_install_version', appVersion)
    var updateMsg = localstorage.get('app_update_msg')
    uni.showModal({content: updateMsg.msg, title: '新版本更新', success: (e) => {
      if (e.confirm) {
        plus.runtime.restart()
      }
    }})
  }, function (e) {
    plus.nativeUI.closeWaiting()
    console.log('安装wgt文件失败[' + e.code + ']:' + e.message)
    removeFile(path)
    // plus.nativeUI.alert("失败["+e.code+"]："+e.message);
  })
}

function removeFile (path) {
  plus.io.resolveLocalFileSystemURL(path, function (entry) {
    // 可通过entry对象操作文件
    entry.remove(function (entry) {
      console.log('Remove succeeded')
    }, function (e) {
      console.log(e.message)
    })
  }, function (e) {
    console.log('Resolve file URL failed: ' + e.message)
  })
}
var dateUtils = {
	UNITS: {
		'年': 31557600000,
		'月': 2629800000,
		'天': 86400000,
		'小时': 3600000,
		'分钟': 60000,
		'秒': 1000
	},
	humanize: function (milliseconds) {
		var humanize = '';
		for (var key in this.UNITS) {
			if (milliseconds >= this.UNITS[key]) {
				humanize = Math.floor(milliseconds / this.UNITS[key]) + key + '前';
				break;
			}
		}
		return humanize || '刚刚';
	},
	format: function (dateStr) {
		var date = this.parse(dateStr)
		var diff = Date.now() - date.getTime();
		if (diff < this.UNITS['天']) {
			return this.humanize(diff);
		}
		var _format = function (number) {
			return (number < 10 ? ('0' + number) : number);
		};
		return date.getFullYear() + '/' + _format(date.getMonth() + 1) + '/' + _format(date.getDay()) + '-' +
			_format(date.getHours()) + ':' + _format(date.getMinutes());
	},
	parse: function (str) { //将"yyyy-mm-dd HH:MM:ss"格式的字符串，转化为一个Date对象
		var a = str.split(/[^0-9]/);
		return new Date(a[0], a[1] - 1, a[2], a[3], a[4], a[5]);
	}
};
	
export default{
	isVehicleNumber,
	parseDateStr,
	getGeoPosition,
	getDistance,
	formatDateTime,
	getCurrentWebview,
	wakeLock,
	releaseWakeLock,
	checkUpdate,
	dateUtils
}
