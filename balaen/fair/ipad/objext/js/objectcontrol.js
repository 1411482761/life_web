var objectcontr;
var ObjectControl = Class.create();
ObjectControl.prototype = {
	initialize : function(){
		this.width = jQuery(document).width();
		this.height = jQuery(document).height();
		this.isNotPad = navigator.userAgent.indexOf('iPad') == -1;
	},
	draw : function(id){
		var params={
				cmd : "GetProductAttribute",
				id: id,
		};
		var trans={
				id : 1,
				command : "com.agilecontrol.fair.FairCmd",
				params : params
		};
		portalClient.sendOneRequest(trans, function(response){
			if(response.data[0].code != 0){
				alert(response.data[0].message);
				return;
			}
			var javaData = response.data[0].result;
			var html = "";
			for(var i = 0;i < javaData.length;i++){
				html += "<tr>" + "<td>" + javaData[i].name + "</td>" + "<td>" + javaData[i].value + "</td>" +"</tr>";
			}
			jQuery("#header").after(html);
		});
		
	},
	adaptation: function(themeStyle){
		if(objectcontr.isNotPad && objectcontr.width <  768){
			jQuery("<link rel='stylesheet' href='/fair/ipad/objext/css/common/object_adaptation.css?t="+new Date().getTime()+"' type='text/css' media='screen' title='no title' charset='utf-8'>").appendTo(jQuery("head"));
			jQuery("#container").css("width",objectcontr.width-80);
		}else{
			jQuery("<link rel='stylesheet' href='/fair/ipad/objext/css/common/object.css?t="+new Date().getTime()+"' type='text/css' media='screen' title='no title' charset='utf-8'>").appendTo(jQuery("head"));
		}
		jQuery("<link rel='stylesheet' href='/fair/ipad/objext/css/"+themeStyle+"/object.css?t="+new Date().getTime()+"' type='text/css' media='screen' title='no title' charset='utf-8'>").appendTo(jQuery("head"));
	}
};
ObjectControl.main = function() {
	portalClient = new PortalClient();
	portalClient.init(null,null,"/servlets/binserv/Fair");
	objectcontr = new ObjectControl();
};
jQuery(document).ready(ObjectControl.main);

