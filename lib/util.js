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

/**
 * 获取地理位置
 * @param callback
 */
function getGeoPosition (callback) {
  //#ifdef APP-PLUS
  plus.geolocation.getCurrentPosition((p) => {
	console.log(JSON.stringify(p))
	callback(p)
  },(e) => {
    console.log('获取位置信息失败: ' + JSON.stringify(e))
  }, {geocode: true, provider: 'baidu', coordsType: 'gcj02'})
  //#endif
  //#ifndef APP-PLUS
  callback({"coordsType":"wgs84","address":{"district":"浦东新区","country":"中国","street":"荷泽路","city":"上海市","streetNum":"430号1号"},"addresses":"荷泽路430号1号","coords":{"latitude":31.26735500528595,"longitude":121.5897752625137,"accuracy":30,"altitude":8.899169921875,"heading":224.6484375,"speed":0.72000002861022949,"altitudeAccuracy":32},"timestamp":1547284362540.4541})
  //#endif
}

//实时监听位置变化
function watchGeoPosition (callback, geocode = true) {
	//#ifdef APP-PLUS
	plus.geolocation.watchPosition((p) => {
		console.log(JSON.stringify(p))
		callback(p)
	},(e) => {
	  console.log('监听位置信息失败: ' + JSON.stringify(e))
	}, {geocode: geocode, provider: 'baidu', coordsType: 'gcj02'})
	//#endif
	//#ifndef APP-PLUS
	callback({"coordsType":"wgs84","address":{"district":"浦东新区","country":"中国","street":"荷泽路","city":"上海市","streetNum":"430号1号"},"addresses":"荷泽路430号1号","coords":{"latitude":31.26735500528595,"longitude":121.5897752625137,"accuracy":30,"altitude":8.899169921875,"heading":224.6484375,"speed":0.72000002861022949,"altitudeAccuracy":32},"timestamp":1547284362540.4541})
	//#endif
}

function Rad(d){
   return d * Math.PI / 180.0;//经纬度转换成三角函数中度分表形式。
}
//计算距离，参数分别为第一点的纬度，经度；第二点的纬度，经度
function GetDistance(lat1,lng1,lat2,lng2){
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
	
export default{
	isVehicleNumber,
	parseDateStr,
	getGeoPosition,
	watchGeoPosition,
	GetDistance
}
