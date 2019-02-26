import localstorage from "./localstorage.js"
import gcoord from './gcoord.js'

function isVehicleNumber(vehicleNumber) {
    var xreg=/^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF]$)|([DF][A-HJ-NP-Z0-9][0-9]{4}$))/;
    var creg=/^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1}$/;
	if(vehicleNumber.length == 7){
		return creg.test(vehicleNumber);
	} else if(vehicleNumber.length == 8){
		return xreg.test(vehicleNumber);
	} else{
		return false;
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
 * 获取地理位置，可以指定返回格式：gcj02，bd09ll，默认返回gcj02
 * @param callback
 */
function getGeoPosition (callback, returnCoordsType = 'gcj02') {
  //#ifdef APP-PLUS
  var geoOptions = {geocode: true, provider: 'baidu', coordsType: 'bd09ll'}
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
        g_wakelock.release();  
        g_wakelock = null;  
    }  
}  

	
export default{
	isVehicleNumber,
	parseDateStr,
	getGeoPosition,
	getDistance,
	formatDateTime,
	getCurrentWebview,
	wakeLock,
	releaseWakeLock
}
