var reportspecialcontrol;
var ReportSpecialControl= Class.create();
ReportSpecialControl.prototype = {
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
					command: reportspecialcontrol.command,
					params: {
						cmd: "RptDef",
						type: "getRptSpecialColumnDef",
						id:id
					}
				};
				portalClient.sendOneRequest(trans, function(response){
					var javaData= response.data[0].result;
					reportspecialcontrol._drawhtml(javaData);
				});
		},
		_drawhtml : function(result){
			jQuery(".dim").html("<span>维度</span>");
			jQuery(".metric").html("<span>度量</span>");
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
			reportspecialcontrol._addDom(result.columns);
			if(result.def.fmt!=undefined){
				jQuery(".layout select option[value='"+result.def.fmt+"']").attr("selected","selected");
			}
			reportspecialcontrol._draginit(".dim",paramClone);
			reportspecialcontrol._draginit(".metric",paramClone);
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
				if(coln[0]!=undefined && reportspecialcontrol.columns[coln[0].dbname]!=undefined && coln[1]!=undefined && reportspecialcontrol.columns[coln[1].dbname]!=undefined){
					jQuery(".coln-a").append("<div>"+ reportspecialcontrol.columns[coln[0].dbname].description +"<span style=display:none;>"+coln[0].dbname+"</span></div>");
					jQuery(".coln-b").append("<div>"+ reportspecialcontrol.columns[coln[1].dbname].description +"<span style=display:none;>"+coln[1].dbname+"</span></div>");
					var defineFmt = "" + reportspecialcontrol.columns[coln[1].dbname].description +"/sum("+reportspecialcontrol.columns[coln[1].dbname].description+")";
					jQuery(".define span").html(defineFmt);
				}
				if(coln[2]!=undefined&&reportspecialcontrol.columns[coln[2].dbname]!=undefined){
					jQuery(".coln-c").append("<div>"+ reportspecialcontrol.columns[coln[2].dbname].description +"<span style=display:none;>"+coln[2].dbname+"</span></div>");
				}
			}
			reportspecialcontrol._draginit(".coln-a",param);
			reportspecialcontrol._draginit(".coln-b",param);
			reportspecialcontrol._draginit(".coln-c",param);
			//给容器绑定ss-added事件
			jQuery(".coln-a").bind("ss-added",function(e,selected){
				var select=jQuery(selected),s_key=select.find("span").text(),s_type=reportspecialcontrol.columns[s_key].type;
				if(s_type=="col"){
					jQuery(".coln-a").html("");
					jQuery(".coln-a").append(select);
					reportspecialcontrol._draginit(".coln-a",param);
				}else{
					select.remove();
				}
			});
			jQuery(".coln-c").bind("ss-added",function(e,selected){
				var select=jQuery(selected),s_key=select.find("span").text(),s_type=reportspecialcontrol.columns[s_key].type;
				if(s_type=="col"){
					jQuery(".coln-c").html("");
					jQuery(".coln-c").append(select);
					reportspecialcontrol._draginit(".coln-c",param);
				}else{
					select.remove();
				}
			});
			jQuery(".coln-b").bind("ss-added",function(e,selected){
				var select=jQuery(selected),s_key=select.find("span").text(),s_type=reportspecialcontrol.columns[s_key].type;
				if(s_type=="measure" || type.indexOf( 'component')==0){
					jQuery(".coln-b").html("");
					jQuery(".coln-b").append(select);
					var defineFmt = "",key=jQuery(".coln-b div:eq(0)").find("span").text();
					if(jQuery(".coln-b div").length > 0){
						defineFmt = "" + reportspecialcontrol.columns[key].description +"/sum("+reportspecialcontrol.columns[key].description+")";
					}else{
						defineFmt = "度量/sum(度量)";
					}
					jQuery(".define span").html(defineFmt);
					reportspecialcontrol._draginit(".coln-b",param);
				}else{
					select.remove();
				}
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
				reportspecialcontrol.columns[result[i].dbname]=result[i];
				var className = "." + e;
				jQuery(className).append("<div>"+ result[i].description +"<span style=display:none;>"+result[i].dbname+"</span></div>");
			}
		},
		_saveRptSpecialColumnDef : function(){
			var params=new Array();
			var key1=jQuery(".coln-a div span").text(),key2=jQuery(".coln-b div span").text(),key3=jQuery(".coln-c div span").text();
			if(key1==""){
				alert("维度不能为空");
				return;
			}
			if(key2==""){
				alert("度量不能为空");
				return;
			}
			
			params.push(this.columns[key1]);
			params.push(this.columns[key2]);
			params.push(this.columns[key3]);
			var trans = {
					id: 1,
					command: reportspecialcontrol.command,
					params: {
						cmd: "RptDef",
						type: "saveRptSpecialColumnDef",
						def:{
							fmt:jQuery(".layout select").find("option:selected").val(),
							params:params
					},
						id:reportspecialcontrol.id
					}
				};
				portalClient.sendOneRequest(trans, function(response){
					alert(response.data[0].message);
					//reportspecialcontrol._load(reportspecialcontrol.id);
				});
		}
};
ReportSpecialControl.main = function() {
	portalClient = new PortalClient();
	//设置请求路径
	portalClient.init(null,null,"/servlets/binserv/Request");
	reportspecialcontrol = new ReportSpecialControl();
};
jQuery(document).ready(ReportSpecialControl.main);