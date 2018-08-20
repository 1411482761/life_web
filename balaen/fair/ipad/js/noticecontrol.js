
var nc;
var NoticeControl = Class.create();
NoticeControl.prototype = {
	initialize : function() {
		this.width = jQuery(document).width();
		this.height = jQuery(document).height();
		this.isNotPad = navigator.userAgent.indexOf('iPad') == -1;
	},
	
	onLoad : function(from) {
		this.trans = {
			id: 1,
			command: "com.agilecontrol.fair.FairCmd",
			params: {
				cmd: "GetOldMessages",
				from:from
			}
		};
		portalClient.sendOneRequest(this.trans, function(response){
			var data=response.data[0].result;
			var javaData;
			if(data.notice==undefined) 
				javaData = data;
			else
				javaData = data.notice;
			nc.drawHtml(javaData);
			
			jQuery("<script language='javascript' src='/fair/ipad/js/locale/locale_"+ data.locale +".js' charset='utf-8'></script>").appendTo(jQuery("head"));
			
			jQuery("#title").html(VIEWS_LOCALE.about.title);
		});
	},
	drawHtml : function(javaData){
		var html="";
		if(javaData!=undefined&&javaData.length>0){
			html="<ul id='noticelist'>";
			for(var i=0;i<javaData.length;i++){
					html+="<li><div class='users'><div class='uimg'></div><div class='uname'>"+javaData[i][0]+"</div></div><div class='contents'><div class='title'>"+javaData[i][1]+"</div><div class='msg'>"+javaData[i][2]+"</div></div><div class='datetime'>"+javaData[i][3]+"</div></li>";
			}
			html+="<li style='height:20px;'></li></ul>";
		}else{
			html="<div id='nomsg'>"+VIEWS_LOCALE.about.nomsg+"</div>";
		}
		jQuery(html).appendTo("#message");
	},
	adaptation: function(){
		if(nc.isNotPad && nc.width <  768){
			var temp_width = nc.width - 80;
			var width = temp_width + "px";
			
			jQuery("<link rel='stylesheet' href='/fair/ipad/css/common/notice_adaptation.css?t="+new Date().getTime()+"' type='text/css' media='screen' title='no title' charset='utf-8'>").appendTo(jQuery("head"));
			jQuery("body").css("width",nc.width);
			jQuery("#message").css("width",nc.width);
			jQuery(".users").css("width",width);
			jQuery("#noticelist").css("width",width);
			jQuery("#back").show();
			jQuery("#container").css("width",nc.width);
		}else{
			jQuery("<link rel='stylesheet' href='/fair/ipad/css/common/notice.css?t="+new Date().getTime()+"' type='text/css' media='screen' title='no title' charset='utf-8'>").appendTo(jQuery("head"));
			jQuery("#back").hide();
		}
	}
};
NoticeControl.main = function() {
	portalClient = new PortalClient();
	portalClient.init(null, null, "/servlets/binserv/Fair");
	nc = new NoticeControl();
	nc.adaptation();
};
jQuery(document).ready(NoticeControl.main);
