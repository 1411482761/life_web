var bc;
var BasicrptconfigControl= Class.create();
BasicrptconfigControl.prototype = {
		initialize : function() {
			this.command="";
			this.reftables=new Object();
		},
		load : function(command){
			this.command=command;
			var trans = {
					id: 1,
					command: bc.command,
					params: {
						cmd: "RptDef",
						type: "loadBasicRpt"
					}
				};
				portalClient.sendOneRequest(trans, function(response){
					var javaData= response.data[0].result;
					bc._drawHtml(javaData);
				});
		},
		_detailconfigure : function(){
			if(this._checkchange()){
				alert("当前表已被修改,请先点击保存按钮。");
				return; 
			}
			window.location.replace('/fair/ipad/grid/basicrptcolumns.jsp?tbname='+jQuery(".db_name").val()+"&tbdesc="+jQuery(".reportname").val()+"&tbindex="+jQuery(".on").index());
		},
		_checkchange : function(){
			//if(jQuery(".on")==undefined)
			var dom=jQuery(".on").data("data");
			if(jQuery(".reportname").val()!=dom.data.groupname)return true;
			if((jQuery(".db_name").val().toUpperCase())!=dom.data.name)return true;
			if(jQuery(".on").hasClass("isnew"))return true;
		},
		_drawHtml : function(result){
			jQuery(".target").html("");
			var spanElem = "";
			var counts = 0;
			this.reftables=result;
			for(var i = 0;i < result.columns.basic.length; i++){
				spanElem = "<span class='config' onclick=bc.clickMenu(this)>"+ result.columns.basic[i].groupname +"</span>";
				jQuery(".target").append(spanElem);
				jQuery(".target span").eq(i).data("data",{data:result.columns.basic[i],type:"basic"});
				counts++;
			}
			if(result.columns.basic.length>0)jQuery("#right .button").show();
			else jQuery("#right .button").hide();
//			if(result.columns.extend!=undefined){
//				spanElem = "<span class='config' onclick=bc.clickMenu(this)>"+ result.columns.extend.groupname +"</span>";
//				jQuery(".target").append(spanElem);
//				jQuery(".target span").eq(counts).data("data",{data:result.columns.extend,type:"extend"});
//				counts++;
//			}
//			for(var i = 0;i < result.columns.component.length; i++){
//				spanElem = "<span class='config' onclick=bc.clickMenu(this)>"+ result.columns.component[i].groupname +"</span>";
//				jQuery(".target").append(spanElem);
//				jQuery(".target span").eq(counts).data("data",{data:result.columns.component[i],type:"component"});
//				counts++;
//			}
			jQuery("input.reportname").blur(function(){
				var dom=jQuery(".on");
				dom.html(jQuery(this).val());
				dom.data("data").data.groupname=jQuery(this).val();
				var index=dom.index();
				bc.reftables.columns.basic[index].groupname=jQuery(this).val();
			});
			jQuery("input.db_name").blur(function(){
				var dom=jQuery(".on");
				dom.data("data").data.name=jQuery(this).val().toUpperCase();
				var index=dom.index();
				bc.reftables.columns.basic[index].name=jQuery(this).val().toUpperCase();
			});
			jQuery(".target span").eq(0).trigger("click");
		},
		clickMenu : function(dom){
			jQuery("#tabtype").find("option:selected").prop("selected",false);
			if(jQuery(dom).hasClass("on")){
				return;
			}else{
				jQuery(dom).parent().children().removeClass("on");
				jQuery(dom).addClass("on");
				jQuery("input.reportname").val(jQuery(dom).data("data").data.groupname);
				jQuery("input.db_name").val(jQuery(dom).data("data").data.name);
				jQuery("#tabtype").find("option[value='"+jQuery(dom).data("data").type+"']").prop("selected","selected");
			}
		},
		newtable : function(){
			var spanElem = "<span class='config isnew' onclick=bc.clickMenu(this)>新建表</span>";
			jQuery(".target").append(spanElem);
			jQuery(".target span").last().data("data",{data:{groupname:"新建表",name:""},type:"basic"});
			jQuery(".target span").last().trigger("click");
			bc.reftables.columns.basic[jQuery(".on").index()]=jQuery(".target span").last().data("data");
			jQuery("input.reportname").blur();
			if(jQuery(".target span").length>0) jQuery("#right .button").show();
		},
		_checkNull : function(){
			if(jQuery(".reportname").val()=="" || jQuery(".db_name").val()=="" ){
				alert("表显示名称和表名称不能为空");
				return true;
			}else{
				return false;
			}
		},
		moveup : function(){
			var onthis=jQuery(".on");
			var prev=onthis.prev();
			onthis.insertBefore(prev);
		},
		movedown : function(){
			var onthis=jQuery(".on");
			var after=onthis.next();
			onthis.insertAfter(after);
		},
		_savetableconfig : function(isdel){
			var dom=jQuery(".target");
			var len=dom.find("span").length;
			var columns=new Array();
			for(var i=0;i<len;i++){
				columns.push(dom.find("span:eq("+i+")").data("data").data);
			}
			bc.reftables.columns.basic=columns;
			if(isdel|| !bc._checkNull()){
				var trans = {
						id: 1,
						command: bc.command,
						params: {
							cmd: "RptDef",
							type: "saveRefTable",
							data:bc.reftables
						}
				};
				portalClient.sendOneRequest(trans, function(response){
					alert(response.data[0].message);
					bc.load(bc.command);
				});
			}
			
		},
		_deletetableconfig : function(){
			var index=jQuery(".on").index();
			bc.reftables.columns.basic.splice(index,1);
			jQuery(".on").remove();
			bc._savetableconfig(true);
		}
};
BasicrptconfigControl.main = function() {
	portalClient = new PortalClient();
	//设置请求路径
	portalClient.init(null,null,"/servlets/binserv/Request");
	bc = new BasicrptconfigControl();
};
jQuery(document).ready(BasicrptconfigControl.main);