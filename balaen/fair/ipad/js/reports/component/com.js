/**
* CopyRright (c)2015: lifecycle
* Project: Ordering - Board
* Comments:  各组件可调用的公用方法。
* Create Date：2015-02-03
	@version: 1.0
	@author: cico
*/
var com;
var Com = Class.create();
Com.prototype = {
	
	initialize: function() {
	},
	
	format: function(element,fmt){
		if(fmt.indexOf("%") != -1){
			element = Number(element) * 100;
		}
		return Number(element).format(fmt);
	}
};
com = new Com();

/**
计算object 的属性的个数
*/
function getObjectSize(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
}
