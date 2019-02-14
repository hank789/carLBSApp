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
	
export default{
	isVehicleNumber,
	parseDateStr
}
