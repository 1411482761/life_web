var rsc;
var ReportSortControl= Class.create();
ReportSortControl.prototype = {
		initialize : function() {
			this.init();
			this.command="";
		},
		init : function(){
			this.rowdbnames=new Array();
			this.coldbnames=new Array();
			this.tbname="";
			this.columns=new Hash();
			jQuery(".fields").html("<span>字段</span>");
			jQuery(".colsort").html("<span>纵轴排序</span>");
			jQuery(".rowsort").html("<span>横轴排序</span>");
		},
		_draginit : function(id,params){
			jQuery(id).shapeshift(params);
		},
		_load : function(tbname,command){
			this.init();
			this.tbname=tbname;
			this.command=command;
			var trans = {
					id: 1,
					command: rsc.command,
					params: {
						cmd: "RptDef",
						type: "getSortFields",
						name:tbname
					}
				};
				portalClient.sendOneRequest(trans, function(response){
					rsc._drawhtml(response.data[0].result);
				});
			
		},
		_drawhtml : function(result){
			rsc._addDom(result.columns,"fields");
			rsc._addDom(result.def,"sort");
			
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
			rsc._draginit(".fields",paramClone);
			rsc._draginit(".rowsort",param);
			rsc._draginit(".colsort",param);
			rsc._draginit(".trash",param);
			if(!this.isloaded){
				this.isloaded=true;
				jQuery(".rowsort").bind("ss-added",function(e,selected){
					var dom=jQuery(selected);
					var key=dom.find("span:eq(1)").text();
					var seltype=rsc.columns[key].type;
					if(seltype=="row")
						rsc._getRidSame("row",selected,param);
					else{
						dom.remove();
					}
					 rsc._draginit(".rowsort",param);
				});
				jQuery(".colsort").bind("ss-added",function(e,selected){
					var dom=jQuery(selected);
					var key=dom.find("span:eq(1)").text();
					var seltype=rsc.columns[key].type;
					if(seltype=="col"||seltype=="measure")
						rsc._getRidSame("col",selected,param);
					else{
						dom.remove();
					}
					 rsc._draginit(".colsort",param);
				});
				jQuery(".trash").bind("ss-added",function(e,selected){
					var dbname=jQuery(selected).find("span:eq(1)").text();
					var origin_container=jQuery(".ss-original-container");
					if(origin_container.hasClass("rowsort")){
						var index=rsc.rowdbnames.indexOf(dbname);
						rsc.rowdbnames.splice(index,index+1);
					}else if(origin_container.hasClass("colsort")){
						var index=rsc.coldbnames.indexOf(dbname);
						rsc.coldbnames.splice(index,index+1);
					}else{
						
					}
					var exist=jQuery(selected).attr("exist");
					if(exist=="Y"){
						rsc._saveRptSortColumnDef();
					}else{
						
					}
				});
			}
		},
		_getRidSame : function(type,selected,param){
			var dom=jQuery(selected);
			var key=dom.find("span:eq(1)").text();
			var origin_container=jQuery(".ss-original-container");
			if(origin_container.hasClass("rowsort")){
				var index=rsc.rowdbnames.indexOf(dbname);
				rsc.rowdbnames.splice(index,index+1);
			}else if(origin_container.hasClass("colsort")){
				var index=rsc.coldbnames.indexOf(dbname);
				rsc.coldbnames.splice(index,index+1);
			}
			if(type=="row"){
				if(rsc.rowdbnames.indexOf(key) != -1){
					//证明该容器已经包含该字段
					//delCopy.push(i);
					dom.remove();
				}else{
					
					rsc.rowdbnames.push(key);
				}
				
			}else{
				if(rsc.coldbnames.indexOf(key) != -1){
					//证明该容器已经包含该字段
					//delCopy.push(i);
					dom.remove();
				}else{
					rsc.coldbnames.push(key);
				}
			}
		},
		_sortField : function(obj){
			var dom =  jQuery(obj);
			var type =dom.attr("type");
			if(type=="asc"){
				dom.attr("src","/fair/ipad/grid/images/desc.png");
				dom.attr("type","desc");
			}else{
				dom.attr("src","/fair/ipad/grid/images/asc.png");
				dom.attr("type","asc");
			}
		},
		_addDom : function(result,e){
				var className = "." + e;
				//jQuery(className).html('');
				for(var i =0; i < result.length; i++){
					if(e=="fields"){
						if(result[i].type.indexOf("component")!=-1) continue;
						jQuery(className).append("<div exist='N'><span class='desc'>"+ result[i].description +"</span><span style='display:none;'>"+result[i].dbname+"</span><img alt='' src='/fair/ipad/grid/images/asc.png' onclick=rsc._sortField(this); type='asc'></div>");
						rsc.columns[result[i].dbname]=result[i];
					}else if(e=="sort"){
						if(result[i].is_row_orderby!=undefined&&result[i].is_row_orderby=="Y"){
							var type="asc";
							if(result[i].orderbytype!=undefined&&result[i].orderbytype!="") type=result[i].orderbytype;
							jQuery(".rowsort").append("<div exist='Y'><span class='desc'>"+ result[i].column_desc +"</span><span style='display:none;'>"+result[i].column_name+"</span><img alt='' src='/fair/ipad/grid/images/"+type+".png' onclick=rsc._sortField(this); type='"+type+"'></div>");
							rsc.rowdbnames.push(result[i].column_name);
						}else{
							var type="asc";
							if(result[i].orderbytype!=undefined&&result[i].orderbytype!="") type=result[i].orderbytype;
							jQuery(".colsort").append("<div exist='Y'><span class='desc'>"+ result[i].column_desc +"</span><span style='display:none;'>"+result[i].column_name+"</span><img alt='' src='/fair/ipad/grid/images/"+type+".png' onclick=rsc._sortField(this); type='"+type+"'></div>");
							rsc.coldbnames.push(result[i].column_name);
						}
					}
			}
		},
		_saveRptSortColumnDef : function(){
			var def=new Array;
			var rowlength=jQuery(".rowsort .ss-active-child").length;
			jQuery(".sort .ss-active-child").each(function(i){
				var data=rsc.columns[jQuery(this).find("span:eq(1)").text()];
				data.orderno=10*(i+1);
				if(i<rowlength) data.is_row_orderby='Y';
				else data.is_row_orderby='N';
				data.type=jQuery(this).find("img").attr("type");
				
				def.push(data);
			});
			var trans = {
					id: 1,
					command: rsc.command,
					params: {
						cmd: "RptDef",
						type: "saveRptSortColumnDef",
						name:rsc.tbname,
						def:{
							def:def
						}
					}
				};
				portalClient.sendOneRequest(trans, function(response){
					alert(response.data[0].message);
					rsc._load(rsc.tbname,rsc.command);
				});
		}
};
ReportSortControl.main = function() {
	portalClient = new PortalClient();
	//设置请求路径
	portalClient.init(null,null,"/servlets/binserv/Request");
	rsc = new ReportSortControl();
};
jQuery(document).ready(ReportSortControl.main);