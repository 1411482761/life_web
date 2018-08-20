var selectFair;
var selectFairControl = Class.create();
selectFairControl.prototype = {
		
	/**
	 * Description : to define parameter
	 * @type private
	 * */
	initialize : function() {
		
	},
	load : function(userid){
		var ad_sql = "getboardfair";
		var params = {"userid":userid};
		runsql.queryObject(ad_sql,params,function(response){
			 var javaData = response.data[0].result;
			 if(javaData.length == 0){
				 alert('无可用订货会');
				 return;
			 }
			 var str = "";
			 for(var i = 0;i < javaData.length;i++){
				 var url = "/fair/ipad/rankBoard.jsp?fairid="+javaData[i].fairid + "&fairname=" + javaData[i].fairname;
				 str += "<div class='fairlist' onclick='window.location.replace(\""+url+"\")'>";
				 str += javaData[i].fairname;
				 str += "</div>";
			 }
			 jQuery("#container").html(str);
		});
	},
	
};
selectFairControl.main = function(){
	portalClient = new PortalClient();
	portalClient.init(null,null,"/servlets/binserv/Fair");
	selectFair=new selectFairControl();
};
jQuery(document).ready(selectFairControl.main);