var rc5;
var ReportC5Control= Class.create();
ReportC5Control.prototype = {
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
					command: rc5.command,
					params: {
						cmd: "RptDef",
						type: "getRptSpecialColumnDef",
						id:id
					}
				};
				portalClient.sendOneRequest(trans, function(response){
					var javaData= response.data[0].result;
					rc5._drawhtml(javaData);
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
			rc5._addDom(result.columns);
			if(result.def.fmt!=undefined){
				jQuery(".layout select option[value='"+result.def.fmt+"']").attr("selected","selected");
			}
			rc5._draginit(".dim",paramClone);
			rc5._draginit(".metric",paramClone);
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
				if(rc5.columns[coln[0].dbname]!=undefined && rc5.columns[coln[1].dbname]!=undefined){
					jQuery(".coln-a").append("<div>"+ rc5.columns[coln[0].dbname].description +"<span style=display:none;>"+coln[0].dbname+"</span></div>");
					jQuery(".coln-b").append("<div>"+ rc5.columns[coln[1].dbname].description +"<span style=display:none;>"+coln[1].dbname+"</span></div>");
				}else{alert("系统内部错误");}
			}
			
			rc5._draginit(".coln-a",param);
			rc5._draginit(".coln-b",param);
			//给容器绑定ss-added事件
			jQuery(".coln-a").bind("ss-added",function(e,selected){
				var select=jQuery(selected),s_key=select.find("span").text(),s_type=rc5.columns[s_key].type;
				if(s_type=="measure"|| type.indexOf( 'component')==0){
					jQuery(".coln-a").html("");
					jQuery(".coln-a").append(select);
					rc5._draginit(".coln-a",param);
				}else{
					select.remove();
				}
			});
			jQuery(".coln-b").bind("ss-added",function(e,selected){
				var select=jQuery(selected),s_key=select.find("span").text(),s_type=rc5.columns[s_key].type;
				if(s_type=="col"||s_type=="row"){
					jQuery(".coln-b").html("");
					jQuery(".coln-b").append(select);
					rc5._draginit(".coln-b",param);
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
				rc5.columns[result[i].dbname]=result[i];
				var className = "." + e;
				jQuery(className).append("<div>"+ result[i].description +"<span style=display:none;>"+result[i].dbname+"</span></div>");
			}
		},
		_saveRptSpecialColumnDef : function(){
			var params=new Array();
			var key1=jQuery(".coln-a div span").text(),key2=jQuery(".coln-b div span").text();
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
			var trans = {
					id: 1,
					command: rc5.command,
					params: {
						cmd: "RptDef",
						type: "saveRptSpecialColumnDef",
						def:{
							fmt:jQuery(".layout select").find("option:selected").val(),
							params:params
					},
						id:rc5.id
					}
				};
				portalClient.sendOneRequest(trans, function(response){
					alert(response.data[0].message);
					rc5._load(rc5.id,rc5.command);
				});
		}
};
ReportC5Control.main = function() {
	portalClient = new PortalClient();
	//设置请求路径
	portalClient.init(null,null,"/servlets/binserv/Request");
	rc5 = new ReportC5Control();
};
jQuery(document).ready(ReportC5Control.main);