/**
 * 特步订单复制,ztree组件
 * @author LuChao
 */
var ocl;
var orderCopycontrol= Class.create();
orderCopycontrol.prototype = {
		initialize : function() {
			this.bFoId=0;
			this.setting1 = {
					check:{
						enable:true,
						chkStyle:"radio",
						radioType:"all"
					},
					data:{
						simpleData:{
							enable:true,
							rootPId: -1
						}
					},			
					view: {
						nameIsHTML: true
					}
			};
			this.setting2 = {
					check: {
						enable: true,
						chkboxType:{ "Y" : "s", "N" : "ps" }
					},
					data: {
						simpleData: {
							enable: true,
							rootPId: -1
						}
					},
					view: {
						nameIsHTML: true
					},
					callback: {
						onCheck: onCheck
					}
				};
		},
		init : function(id){
			this.bFoId=id;
			var request = {
					id:1,
					command: "com.agilecontrol.fair.MiscCmd",
					params: {
						cmd: "CopyOrder",
						method:"initOptions",
						param:{
							id:id
						}
					}
				};

			portalClient.sendOneRequest(request, function(response){
				//console.log(zNodes);
				hideUnitInfo();
				jQuery.fn.zTree.init(jQuery("#treeDemo1"),ocl.setting1,response.data[0].result.fromBFo);
				jQuery.fn.zTree.init(jQuery("#treeDemo2"),ocl.setting2,response.data[0].result.ToBFo);
			});
		},
		search : function(){
			var value=jQuery("#key").val();
			ocl.load(value);
		},
		load : function(value){
			var request = {
					id:1,
					command: "com.agilecontrol.fair.MiscCmd",
					params: {
						cmd: "CopyOrder",
						method:"searchOptions",
						param:{
							id:ocl.bFoId,
							value:value
						}
					}
				};

			portalClient.sendOneRequest(request, function(response){
				jQuery.fn.zTree.init(jQuery("#treeDemo2"),ocl.setting2,response.data[0].result.ToBFo);
			});
		},
		commit : function(){
			var treeObj1 = jQuery.fn.zTree.getZTreeObj("treeDemo1");
			var nodes1 = treeObj1.getCheckedNodes(true);
			
			var treeObj2 = jQuery.fn.zTree.getZTreeObj("treeDemo2");
			var nodes2 = treeObj2.getCheckedNodes(true);//executeStoredProducedure

			if(nodes1.length<1 || nodes2.length<1){
				jQuery("#state").html("没有选中的值");
				return;
			}
			jQuery("#state").html("正在处理中,请稍后。。。。");
			jQuery("#resultspan").html("");
			
			var request = {
					id:1,
					command: "com.agilecontrol.fair.MiscCmd",
					params: {
						cmd: "CopyOrder",
						method:"executeStoredProducedure",
						param:{
							fromParam:nodes1,
							toParam:nodes2
						}
					}
				};

			portalClient.sendOneRequest(request,function(response){
				jQuery("#state").html("处理完成,处理结果:");
				jQuery(response.data[0].result).each(function() {
					if(this.to.indexOf("<span",0)>0){
						jQuery("#resultspan").append(this.from+" 复制给 "+this.to.substr(0,this.to.indexOf("<span",0))+" "+this.message+"<br>");
					} else {
						jQuery("#resultspan").append(this.from+" 复制给 "+this.to+" "+this.message+"<br>");
					}
				});
				ocl.load("");
			});

		}
};
function showUnitInfo()  
{  
	 var screenWidth = jQuery(window).width();
	 var screenHeight = jQuery(window).height();      
	 jQuery("#yinying").css({"display":"","position": "fixed","background-color":"#808080","-moz-opacity": "0.5","opacity":".50","filter": "alpha(opacity=50)","width":screenWidth,"height":screenHeight}); 
	 jQuery(".spinner").css({"display":"block"});
}
function hideUnitInfo(){
	jQuery("#yinying").css("display","none");
	jQuery(".spinner").css("display","none");
}
function onCheck(e,treeId,treeNode){
	jQuery("#resultspan").html("");
	jQuery("#state").html("已选中:<br>");
	var treeObj2 = jQuery.fn.zTree.getZTreeObj("treeDemo2");
	var nodes2 = treeObj2.getCheckedNodes(true);
	jQuery(nodes2).each(function(){
		jQuery("#state").append(this.name+"<br>");
	});
	
}
orderCopycontrol.main = function() {
	portalClient = new PortalClient();
	//设置请求路径
	portalClient.init(null, null, "/servlets/binserv/Fair");
	ocl = new orderCopycontrol();
	showUnitInfo();
};
jQuery(document).ready(orderCopycontrol.main);
