var cpa;
copyPdtAreas = Class.create();
copyPdtAreas.prototype = {
	initialize: function() {
		this.array=[]
	},
	init : function(){
		var request = {
				id:1,
				command: "com.agilecontrol.fair.MiscCmd",
				params: {
					cmd: "CopyPdtArea",
					method : "init",
					param : {}
				}
			};

		portalClient.sendOneRequest(request, function(response){
			if (response.data[0].code == 0) {
				jQuery(response.data[0].result.only).each(function() {
					jQuery("#onlyList").append("<li><input type='radio' name='payMethod' onclick='cpa.onlyclick();' value='"+this.id+"'/><span>"+this.name+"</span></li>");
				});
				jQuery(response.data[0].result.multi).each(function() {
					jQuery("#mutliList").append("<li><input type='checkbox' name='payMethod1' onclick='cpa.mutliclick("+this.id+");' value='"+this.id+"'/><span>"+this.name+"</span></li>");
				});
			} else {
				alert("查询失败！\n错误信息：" + response.data[0].message);
			}
		});
	},
	selectAll : function() {
		if (jQuery("#selectAll").is(':checked')) {
			jQuery("input[name='payMethod1']").each(function(){this.checked=true;}); 
			this.judgeCheckbox();
			this.judgeRadio();
		} else {
			jQuery("input[name=payMethod1]").removeAttr("checked");
			jQuery("#toIdspan").html("");
		}
	},
	judgeCheckbox : function(){
		var array=[];
		jQuery('input[name="payMethod1"]:checked').each(function(){
			array.push(jQuery(this).next('span').html());
			sessionStorage.setItem(jQuery(this).val(),jQuery(this).next('span').html());
		});
		jQuery("#toIdspan").html(""+array);
		jQuery('#resultspan').html("");
	},
	judgeRadio : function(){
		var fromname=jQuery('input[name="payMethod"]:checked').next().text();
		if(fromname!=""){
			jQuery("#fromIdspan").html("将会把  "+fromname+" 复制给以下目标用户:");
		} else {
			jQuery("#fromIdspan").html("未选择已圈款用户");
		}
	},
	onlyclick : function(){
		var fromname=jQuery('input[name="payMethod"]:checked ').next().text();
		jQuery("#fromIdspan").html("将会把  "+fromname+" 复制给以下目标用户:");
		sessionStorage.setItem("fromId",fromname);
		this.judgeCheckbox();
	},
	mutliclick : function(){
		this.judgeRadio();
		this.judgeCheckbox();
	},
	start : function(){
		jQuery('#fromIdspan').html("");
		jQuery('#toIdspan').html("");
		jQuery('#resultspan').html("loading...");
		var fromId = jQuery('input[name="payMethod"]:checked ').val(); 
		var toIds =[];
		jQuery('input[name="payMethod1"]:checked').each(function(){
			toIds.push(jQuery(this).val());
		}); 
		if(fromId!=null && toIds.length>0){
			var request = {
					id:1,
					command: "com.agilecontrol.fair.MiscCmd",
					params: {
						cmd: "CopyPdtArea",
						method : "start",
						param : {
							fromId:fromId,
							toIds:toIds
						}
					}
				};

			portalClient.sendOneRequest(request, function(response){
				var data=response.data[0];
				if(data.code==0){
					var details = response.data[0].result.details;
					jQuery('#resultspan').html("");
					var fromname=sessionStorage.getItem("fromId");
					jQuery(details).each(function() {
						var toname=sessionStorage.getItem(this.toId);
						jQuery('#resultspan').append(fromname+"==>"+toname+" : "+(this.code==1?"成功":"失败")+" : "+this.message+"<br><br>");
					});
				}
				jQuery("#onlyList").html("");
				jQuery("#mutliList").html("");
				cpa.init();
			});
		} else {
			jQuery('#resultspan').html("无法开始,值为空");
		}
	}
};
copyPdtAreas.main = function() {
	portalClient = new PortalClient();
	portalClient.init(null,null,"/servlets/binserv/Fair");
	cpa=new copyPdtAreas();
	cpa.init();
};
jQuery(document).ready(copyPdtAreas.main);
