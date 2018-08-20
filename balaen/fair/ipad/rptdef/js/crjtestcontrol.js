/**

* CopyRright (c)2013: lifecycle

* Project: Report Configuration.

* Comments:  to config the rpt.

* Create Date 2013-11-14
	@version: 1.0
	@since: portal5.0 jQuery1.7.1 prototype1.5.1.2
	@author: chenrujia
*/

var crjtc;
var CRJTestControl = Class.create();
CRJTestControl.prototype = {
	initialize: function(){
	},
	
	test: function(sessionkey){
		var params={cmd:"loadRankConf", testid: 3, desc: "desc0", name: "name", sessionkey: sessionkey};
		var trans={id:1, command:"com.agilecontrol.fair.FairCmd",params:params};
		portalClient.sendOneRequest(trans, function(response){
			if(response.data[0].code != 0){/* code == 0 正常的返回；其他则为出错了 */
				alert(response.data[0].message);
				if(code==3){
					alert("同步的时候请提供性别。");
				}
			}else{
				var text = response.data[0].result;/* 接口定义的返回对象。可以是array，object。 */
				jQuery('#grid').datagrid({
					data : text,
					cols : [
						{
							field : 'id', title : 'id', group : "data"
						},
						{
							field : 'name', title : 'name', group : "data" 
						},
						{
							field : "data", title : "数据", isGroup : true
						}
					]
				});
			}
		});
	}
};
CRJTestControl.main = function(){
	portalClient = new PortalClient();
	portalClient.init(null,null,"/servlets/binserv/Fair");
	crjtc = new CRJTestControl();
};
jQuery(document).ready(CRJTestControl.main);