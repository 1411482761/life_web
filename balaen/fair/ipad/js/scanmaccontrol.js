/**

* CopyRright (c)2014: lifecycle
* Project: 预算系统
* Comments: 二维码验证
* Create Date：2014-05-13
* 
* @version: 1.0
* @since: portal5.0
* @author: LP
* 
* @modified-date: 2014-06-13
* @modifier: cico
* @information: fix the bug.
* 
* @modified-date: 2014-06-14
* @modifier: cico
* @information: fix the bug.
*/
var scanmac;
var ScanMac = Class.create();
ScanMac.prototype = {
	/**
	 * Description : 申明、部分初始化全局变量。
	 * 
	 * @type private
	 * 
	 * */
	initialize : function() {
		this.param01 = "03";
		jQuery("#sv").change(function(){
			scanmac.macValidate(this);
		}).focus();
	},
	validate : function() {
		alert("OK,login.");
	},
	setParam01: function(p1){
		this.param01 = p1;
	},
	getParam01: function(){
		return this.param01;
	},
	sync : function(){
		var params = {cmd:"lockDevice", name: "hsy", sex: "female", bf_cnt: 10, gf: ['mzd','sdl'], isarray: "N"};
		var trans={id:1, command:"com.agilecontrol.fair.FairCmd",params:params};
		portalClient.sendOneRequest(trans, function(response){
			if(response.data[0].code != 0){//后台异常情况
				alert(response.data[0].message);
			}else{
				var javaData= response.data[0].result;
				var bf = javaData.bf;
				var div = jQuery("#login02");
				for ( var int = 0; int < bf.length; int++) {
					var v = div.html();
					div.html(v + "<br/>" + Object.toJSON(bf[int]));
				}
			}
		});
	},
	pp : function(){
		/* 1. Object.toJSON(object)*/
		var o = {name: "hsy", sex: "female"};
		alert(Object.toJSON(o));
		eval("alert(scanmac.getParam01());");
		
		/* 2.Hash 算法优化的时候可以考虑HASH*/
		var hash = new Hash();
		var i = 0;
		hash["hsy"] = i++;
		hash["cico"] = i++;
		hash["cico"] = i++;
		hash["zyf"] = i++;
		hash["yy"] = i++;
		hash["zyf"] = i++;
		hash["zyf"] = i++;
		hash["gutt"] = i++;
		hash["hsy"] = i++;
		
		alert(Object.toJSON(hash));
	},
	macValidate: function(DOM){
		var input = jQuery(DOM);
		var s = input.val();
		if(s.indexOf("id=")>=0) s = s.substring(s.indexOf("id=") + 3);
		if(s!=""){
			var urlparam = window.location.search;//获取地址栏"?"后所有字符串
			var isadmin = urlparam.substring(1)=="Y"?"Y":"N";
			var params = {cmd:"lockDeviceByQRCode", macaddr:s, isAdmin:isadmin};
			var trans={id:1, command:"com.agilecontrol.fair.FairCmd",params:params};
			jQuery("#loading").fadeIn();
			portalClient.sendOneRequest(trans, function(response){
				jQuery("#loading").fadeOut();
				var resultData = response.data[0];
				jQuery("#result").html(resultData.message);
				if(response.data[0].code != 0){//后台异常情况
					jQuery(".status").hide();
				}else{
					var javaData= resultData.result;
					//alert(Object.toJSON(javaData));
					jQuery(".status").show();
					jQuery("#macaddr").html(javaData.macaddr);
					jQuery("#islocked").html(javaData.islocked);
					input.val("");
					input.focus();
				}
			});
		}
	}
};
ScanMac.main = function() {
	scanmac = new ScanMac();
	portalClient = new PortalClient();
	portalClient.init(null,null,"/servlets/binserv/Request");
};
jQuery(document).ready(ScanMac.main);
//var win = jQuery(window);
//[以下功能无效]对于loading图片绑定ajax请求开始和交互结束的事件
jQuery("#loading").bind("ajaxStart",function(){
	alert(jQuery("#macaddr").html());
	//把div里面的内容清空
	jQuery("#macaddr").empty();
	jQuery("#islocked").empty();
	//整个页面中任意ajax交互开始前，function中的内容会被执行
	jQuery(this).fadeIn();
}).bind("ajaxStop",function(){
	//整个页面中任意ajax交互结束后，function中的内容会被执行	
	jQuery(this).fadeOut();
});