/**

* CopyRright (c)2013: lifecycle

* Project: Ordering - Board

* Comments:  to config the rpt.

* Create Date锛�013-05-09
	@version: 1.0
	@since: portal5.0 jQuery1.7.1 prototype1.5.1.2 jquery-ui-1.8
	@author: chengzhenlong
*/

var mc;
var ModelControl = Class.create();
ModelControl.prototype = {
	/**
	 * Description : to define parameter
	 * 
	 * @type private
	 * */
	initialize : function() {
		/* 第一次加载页面，返回模板数据 */
		this.javaData = [
		                ["model001","基础模板1"],
		                ["model002","基础模板2"],
		                ["model003","基础模板3"]
		                ];
	},
	
	initmc : function() {
		/* 第二步动态导入css和js文件*/
		for ( var i = 0; i < this.javaData.length; i++) {
			jQuery("<script type='text/javascript' src='/fair/ipad/rptdef/js/model/"+ this.javaData[i][0] +".js' charset='utf-8'></script>").appendTo(jQuery("head"));
			jQuery("<link type='text/css'  rel='StyleSheet' href='/fair/ipad/rptdef/css/model/"+ this.javaData[i][0] +".css' charset='utf-8'></link>").appendTo(jQuery("head"));
			jQuery("#switchmodel").append("<option value='"+this.javaData[i][0]+"'>"+this.javaData[i][1]+"</option>");
		}
	},
	
	/*自动选取第一个模板为初始化页面*/
	activeModel : function() {
		/*清空当前模板html并重新加载*/
		jQuery("#real_models").html("");
		var modelactive = jQuery("#switchmodel").val()+"c.init();";//model001 + c.init() = model001c.init();
		eval(modelactive);
	},
	
	saveAll : function() {
		
	}
};
mc = new ModelControl();