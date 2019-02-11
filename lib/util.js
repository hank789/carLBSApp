function query_url(k){
    var str = window.location.href;
    if(str.search(k)>0){
        var arr = str.split("?");
        var res_arr = arr[1].split("&");
        var res = {};
        for(var i = 0; i < res_arr.length; i++) {
            var item = res_arr[i].split("=");
            res[item[0]] = item[1];
        }
        return res[k];
    }
}
// 秒数转时分秒
function formatSeconds(value) {
  var secondTime = parseInt(value);// 秒
  var minuteTime = 0;// 分
  var hourTime = 0;// 小时
  if(secondTime > 60) {//如果秒数大于60，将秒数转换成整数
    //获取分钟，除以60取整数，得到整数分钟
    minuteTime = parseInt(secondTime / 60);
    //获取秒数，秒数取佘，得到整数秒数
    secondTime = parseInt(secondTime % 60);
    //如果分钟大于60，将分钟转换成小时
    if(minuteTime > 60) {
      //获取小时，获取分钟除以60，得到整数小时
      hourTime = parseInt(minuteTime / 60);
      //获取小时后取佘的分，获取分钟除以60取佘的分
      minuteTime = parseInt(minuteTime % 60);
    }
  }
  var result = "" + parseInt(secondTime) + "秒";

  if(minuteTime > 0) {
    result = "" + parseInt(minuteTime) + "分" + result;
  }
  if(hourTime > 0) {
    result = "" + parseInt(hourTime) + "小时" + result;
  }
  return {
		result:result,
		h:parseInt(hourTime),
		m:parseInt(minuteTime),
		s:parseInt(secondTime),
	};
}


	/*
	 时间戳格式化
	 * */
	var date_format=function(sec) {
		var d = new Date(sec);
		var year = d.getFullYear();
		var month = d.getMonth();
		if(month < 10) {
			month = "0" + month
		};
		var day = d.getDate();
		if(day < 10) {
			day = "0" + day
		};
		var h = d.getHours();
		if(h < 10) {
			h = "0" + h
		};
		var m = d.getMinutes();
		if(m < 10) {
			m = "0" + m
		};
		var s = d.getSeconds();
		if(s < 10) {
			s = "0" + s
		};
		var res = year + "-" + month + "-" + day + "  " + h + ":" + m + ":" + s
		return res;
	}
export default{
    query_url,
    formatSeconds,
    date_format
}
