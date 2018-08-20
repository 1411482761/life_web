var rc4;
var ReportC4Control= Class.create();
ReportC4Control.prototype = {
		initialize : function() {
			this.id;
			this.columns=new Hash();
			this.command="";
		},
		_draginit : function(id,params){
			jQuery(id).shapeshift(params);
		},
		_load : function(id,command){
			this.id=id;
			this.command=command;
			var trans = {
					id: 1,
					command: rc4.command,
					params: {
						cmd: "RptDef",
						type: "getRptRankColumnDef",
						id:id
					}
				};
				portalClient.sendOneRequest(trans, function(response){
					var javaData= response.data[0].result;
					rc4._drawhtml(javaData);
				});
		},
		_drawhtml : function(result){
			jQuery(".metric").html("<span>度量</span>");
			jQuery(".coln-b").html("");
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
			rc4._addDom(result.columns);
			if(result.def.fmt!=undefined){
				jQuery(".layout select option[value='"+result.def.fmt+"']").attr("selected","selected");
			}
			rc4._draginit(".metric",paramClone);
			var param = {
				selector : "div",
				colWidth : 125,
				autoHeight:false,
				maxHeight:'38px',
				minHeight:'38px',
				align:'center',
				gutterX: 0,
				gutterY: 10,
				paddingX:0,
				paddingY:1,
				columns:1
			};
			var coln=result.def.params;
			if(coln!=undefined&&coln.length>0){
				if(rc4.columns[coln[0].dbname]!=undefined){
					jQuery(".coln-b").append("<div exist='Y'>"+ rc4.columns[coln[0].dbname].description +"<span style=display:none;>"+coln[0].dbname+"</span></div>");
				}
			}
			
			rc4._draginit(".coln-b",param);
			rc4._draginit(".trash",param);
			//给容器绑定ss-added事件
			jQuery(".coln-b").bind("ss-added",function(e,selected){
				var select=jQuery(selected);
				jQuery(".coln-b").html("");
				jQuery(".coln-b").append(select);
				rc4._draginit(".coln-b",param);
			});
			jQuery(".trash").bind("ss-added",function(e,selected){
				var dbname=jQuery(selected).find("span").text();
				var exist=jQuery(selected).attr("exist");
				jQuery(selected).remove();
				if(exist=="Y"){
					rc4._deleteColumn(dbname);
				}else{
				
				}
			});
		},
		_deleteColumn : function(dbname){
			var trans = {
					id: 1,
					command: rc4.command,
					params: {
						cmd: "RptDef",
						type: "delRankcolumn",
						id:rc4.id
					}
				};
				portalClient.sendOneRequest(trans, function(response){
				//alert(response.data[0].message);
				});
		},
		_addDom : function(result){
			for(var i =0; i < result.length; i++){
				var type=result[i].type;
				if(type=="col" || type=="row"){
					e="dim";
				}else if(type=="measure" || type.indexOf( 'component')==0){
					e="metric";
				}else{
					continue;
				}
				rc4.columns[result[i].dbname]=result[i];
				var className = "." + e;
				jQuery(className).append("<div>"+ result[i].description +"<span style=display:none;>"+result[i].dbname+"</span></div>");
			}
		},
		_saveRptSpecialColumnDef : function(){
			var params=new Array();
			var key2=jQuery(".coln-b div span").text();
			params.push(this.columns[key2]);
			var trans = {
					id: 1,
					command: rc4.command,
					params: {
						cmd: "RptDef",
						type: "saveRptSpecialColumnDef",
						def:{
							isrowbind:rc4.columns[key2].is_row_measure,
							params:params
					},
						id:rc4.id
					}
				};
				portalClient.sendOneRequest(trans, function(response){
					alert(response.data[0].message);
					rc4._load(rc4.id,rc4.command);
				});
		}
};
ReportC4Control.main = function() {
	portalClient = new PortalClient();
	//设置请求路径
	portalClient.init(null,null,"/servlets/binserv/Request");
	rc4 = new ReportC4Control();
};
jQuery(document).ready(ReportC4Control.main);