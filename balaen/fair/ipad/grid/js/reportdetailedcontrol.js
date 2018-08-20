var reportdetailedcontrol;
var ReportDetailedControl= Class.create();
ReportDetailedControl.prototype = {
		initialize : function() {
			this.init();
			this.isloaded = false;
			this.command="";
		},
		init : function(){
			this.dbnames=new Array();
			this.columns=new Hash();
			this.id;
			this.type="";
			this.tbname="";
			jQuery(".row").html("");
			
		},
		_draginit : function(id,params){
			jQuery(id).shapeshift(params);
		},
		_load : function(id,type,tbname,command){
			this.init();
			this.type=type;
			this.id=id;
			this.tbname=tbname;
			var cmdtype=tbname;
			this.command=command;
			if(type=="row"){
				cmdtype="getRptRowColumnDef";
			}else if(type=="col"){
				cmdtype="getRptColColumnDef";
			}else{
				alert("不支持type:"+type);
			}
			var trans = {
					id: 1,
					command: reportdetailedcontrol.command,
					params: {
						cmd: "RptDef",
						type: cmdtype,
						tbname:tbname,
						id:id
					}
				};
				portalClient.sendOneRequest(trans, function(response){
					reportdetailedcontrol._drawhtml(response.data[0].result);
				});
		},
		_drawhtml : function(result){
			jQuery(".metric").html("<span>度量</span>");
			
			reportdetailedcontrol._addDom(result.measure,"metric");
			
			//for(var i =0; i < result.operation_def.length; i++){
				//if(result.operation_def[i].groupname == '行小计'){
					reportdetailedcontrol._addDom(result.sum_def,"row");
//				}else if(result.operation_def[i].groupname == '列占比'){
//					reportdetailedcontrol._addDom(result.operation_def[i].messure,"column");
//				}else{
//					reportdetailedcontrol._addDom(result.operation_def[i].messure,"amount");
//				}
			//}
			
			//实例化拖动组件
			var param = {
				selector : "div",
				colWidth : 125,
				autoHeight:false,
				maxHeight:null,
				minHeight:null,
				align:'left',
				gutterX: 20,
				paddingX:20,
				paddingY:20
			};
			jQuery(".nav li").click(function(){
				var index = jQuery(this).attr("index");
				jQuery(this).parent().children().removeClass("on");
				jQuery(this).addClass("on");
				jQuery(".nav>div:eq("+index+")").css("display","block");
				jQuery(".nav>div:not(:eq("+index+"))").css("display","none");
				if(index ==0) reportdetailedcontrol._draginit(".row",param);
				if(index ==1) reportdetailedcontrol._draginit(".column",param);
				if(index ==2) reportdetailedcontrol._draginit(".amount",param);
			});
			jQuery(".nav li:eq(0)").trigger("click");
			var paramClone = {
					selector : "div",
					colWidth : 125,
					autoHeight:false,
					maxHeight:null,
					minHeight:null,
					align:'left',
					gutterX: 20,
					paddingX:20,
					paddingY:20,
					dragClone:true,
					enableTrash: false,
					enableCrossDrop:false
				};
			reportdetailedcontrol._draginit(".metric",paramClone);
			reportdetailedcontrol._draginit(".trash",param);
			if(!this.isloaded){
				this.isloaded=true;
				jQuery(".nav .row").bind("ss-added",function(e,selected){
				var dom=jQuery(selected);
				var key=dom.find("span").text();
				if(reportdetailedcontrol.dbnames.indexOf(key) != -1){
					//证明该容器已经包含该字段
					//delCopy.push(i);
					dom.remove();
				}else{
					reportdetailedcontrol.dbnames.push(key);
				}
				 reportdetailedcontrol._draginit(".row",param);
				});
				jQuery(".trash").bind("ss-added",function(e,selected){
					var dbname=jQuery(selected).data("data").dbname;
					var index=reportdetailedcontrol.dbnames.indexOf(dbname);
					reportdetailedcontrol.dbnames.splice(index,index+1);
					var exist=jQuery(selected).attr("exist");
					if(exist=="Y"){
						reportdetailedcontrol._saveRptDimColumnDef(dbname);
					}else{
						
					}
				});
			}
		},
		/**
		 * 清空字段
		 */
		_clear : function(){
			jQuery(".nav div").html("");
			reportdetailedcontrol._saveRptDimColumnDef("");
		},
		/**
		 * 度量里的所有字段全部加入
		 */
		_joinAll : function(){
			var html=jQuery(".ss-active-child").clone();
			jQuery(".nav div").append(html);
			var param = {
					selector : "div",
					colWidth : 125,
					autoHeight:false,
					maxHeight:null,
					minHeight:null,
					align:'left',
					gutterX: 20,
					paddingX:20,
					paddingY:20
				};
			reportdetailedcontrol._draginit(".row",param);
		},
		_addDom : function(result,e){
				var className = "." + e,classNameDiv = className+" div";
				//jQuery(className).html('');
				for(var i =0; i < result.length; i++){
					if(e=="row"){
						jQuery(className).append("<div exist='Y'>"+ this.columns[result[i].dbname].description +"<span style='display:none;'>"+result[i].dbname+"</span></div>");
						jQuery(classNameDiv).eq(i).data("data",result[i]);
						this.dbnames.push(result[i].dbname);
					}else if(e=="metric"){
						jQuery(className).append("<div exist='N'>"+ result[i].description +"<span style='display:none;'>"+result[i].dbname+"</span></div>");
						jQuery(classNameDiv).eq(i).data("data",result[i]);
						this.columns[result[i].dbname]=result[i];
					}
			}
		},
		_saveRptDimColumnDef : function(dbname){
			var cmdtype="";
			if(this.type=="row"){
				cmdtype="saveRptRowColumnDef";
			}else if(this.type=="col"){
				cmdtype="saveRptColColumnDef";
			}else{
				alert("不支持type:"+type);
			}
			var def=new Array();
			jQuery(".nav .row .ss-active-child").each(function(i){
				var data=reportdetailedcontrol.columns[jQuery(this).find("span").text()];
				def.push(data);
			});
			var trans = {
					id: 1,
					command: reportdetailedcontrol.command,
					params: {
						cmd: "RptDef",
						type: cmdtype,
						name:reportdetailedcontrol.tbname,
						delname:dbname,
						def:{
							sum_def:def
						},
						id:reportdetailedcontrol.id
					}
				};
				portalClient.sendOneRequest(trans, function(response){
					alert(response.data[0].message);
					reportdetailedcontrol._load(reportdetailedcontrol.id,reportdetailedcontrol.type,reportdetailedcontrol.tbname,reportdetailedcontrol.command);
				});
		}
};
ReportDetailedControl.main = function() {
	portalClient = new PortalClient();
	//设置请求路径
	portalClient.init(null,null,"/servlets/binserv/Request");
	reportdetailedcontrol = new ReportDetailedControl();
};
jQuery(document).ready(ReportDetailedControl.main);