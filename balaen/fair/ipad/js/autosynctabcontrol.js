var astc;
autosynctabControl = Class.create();
// define constructor
autosynctabControl.prototype = {
		initialize: function() {
			//this methond will be called when class initialized

		},
		init:function(index,flag){
			jQuery("#title1 b").html(VIEWS_LOCALE.ast.title1);
			jQuery("#step1 span").append("<input type='button' id='imp' value='"+VIEWS_LOCALE.ast.imp+"'onclick='javascript:astc.load(\"imp\","+index+","+flag+")'/> " );
			jQuery("#step2 span").append("<input type='button' id='mapping' value='"+VIEWS_LOCALE.ast.mapping+"'onclick='javascript:astc.load(\"mapping\","+index+","+flag+")'/> " );
			jQuery("#step3 span").append("<input type='button' id='exp' value='"+VIEWS_LOCALE.ast.exp+"'onclick='javascript:astc.load(\"exp\","+index+","+flag+")'/> " );
			
		},
		load:function(action,index,flag){
			jQuery("input").attr("disabled", true);
			jQuery("#"+action).removeAttr("disabled");
			
			jQuery("#result").show();
			jQuery("#result").text(VIEWS_LOCALE.ast[action]+"中...");
			var request = {
					id:1,
					command: "com.agilecontrol.fair.MiscCmd",
					params: {
						cmd: "AutoSyncTab",
						action:action,
						index:index,
						flag:flag
					}
				};

			portalClient.sendOneRequest(request, function(response){
				    var data=response.data[0];
					if(data.code==0){
						if(action=="imp"){
							jQuery("#mapping").removeAttr("disabled");
						}
						else if(action=="mapping"){						
							jQuery("input").removeAttr("disabled");
							jQuery("#mapping").attr("disabled", true);
						}
						else if(action=="exp"){
							jQuery("#imp").removeAttr("disabled");
							jQuery("#exp").attr("disabled", true);
						}
						jQuery("#result").text(VIEWS_LOCALE.ast[action]+VIEWS_LOCALE.ast.success);
						jQuery("#result").append("<br><br>"+VIEWS_LOCALE.ast.prompt[action]);		
					}
					else if(data.code==-1){
						if(action=="exp"){
							jQuery("#imp").attr("disabled", true);
							jQuery("#mapping").attr("disabled", true);
							jQuery("#exp").removeAttr("disabled");
						}
						jQuery("#result").text(data.result.errorMessage);
					}
					else if(data.code==-2){
						if(action=="exp"){
							jQuery("#imp").attr("disabled", true);
							jQuery("#mapping").attr("disabled", true);
							jQuery("#exp").removeAttr("disabled");
						}
						jQuery("#result").empty();
						jQuery("#result").append(VIEWS_LOCALE.ast.error+"<a href='"+data.result.errorUrl+"' download='"+data.result.errorUrl+"'>"+VIEWS_LOCALE.ast.download+"</a><br>");
						jQuery("#result").append(data.result.errorMessage);
					}
					else{
						jQuery("#result").text(data.message);
					}
			});
			
		}
};
autosynctabControl.main = function () {
	portalClient = new PortalClient();
	portalClient.init(null, null, "/servlets/binserv/Fair");
	astc=new autosynctabControl();
};
jQuery(document).ready(autosynctabControl.main);