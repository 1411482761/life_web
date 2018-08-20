var ac;
var AboutControl = Class.create();
AboutControl.prototype = {
	/**
	 * Description : to define parameter
	 * options feature: the author is lipeng.
	 * @type private
	 * */
	initialize : function() {
		
	},
	load : function(){
		var extra="";
		if (navigator.userAgent.indexOf("iPad") > 0) {
			extra="";
		}else if(navigator.userAgent.indexOf("Android") > 0){
			extra="android";
		}else if(navigator.userAgent.indexOf("iPhone") > 0){}else{
			extra="android";
		}
		jQuery("<link rel='stylesheet' href='/fair/ipad/css/common/main"+extra+".css' type='text/css' media='screen' title='no title' charset='utf-8'>").appendTo("head");
		jQuery("<link rel='stylesheet' href='/fair/ipad/css/common/about"+extra+".css' type='text/css' media='screen' title='no title' charset='utf-8'>").appendTo("head");
		jQuery("<link rel='stylesheet' href='/fair/ipad/css/01/main"+extra+".css' type='text/css' media='screen' title='no title' charset='utf-8'>").appendTo("head");
		jQuery("<link rel='stylesheet' href='/fair/ipad/css/01/about"+extra+".css' type='text/css' media='screen' title='no title' charset='utf-8'>").appendTo("head");
		
		jQuery("<div id='filter'></div><div id='cominfo'></div><div id='links'><a href='/pdt/welcome.htm'>2014春季订货会使用条例，日程安排，索赔说明</a></div><div id='footer'>" +
				"<div class='hr'></div><div id='footer-left'> &copy; 2011-2012 上海贯信信息技术有限公司</div><div id='footer-right'>iPad 订货系统</div></div>").appendTo("#container");
	}
	
};
AboutControl.main = function(){
	portalClient = new PortalClient();
	portalClient.init(null,null,"/servlets/binserv/Fair");
	ac=new AboutControl();
};
jQuery(document).ready(AboutControl.main);