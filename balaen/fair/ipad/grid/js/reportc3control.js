var rc3;
var ReportC3Control= Class.create();
ReportC3Control.prototype = {
		initialize : function() {
			this.id;
			this.columns=new Hash();
			this.isloaded = false;
			this.dbnames=new Array();
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
					command: rc3.command,
					params: {
						cmd: "RptDef",
						type: "getRptSpecialColumnDef",
						id:id
					}
				};
				portalClient.sendOneRequest(trans, function(response){
					var javaData= response.data[0].result;
					rc3._drawhtml(javaData);
				});
		},
		_drawhtml : function(result){
			jQuery(".dim").html("<span>字段</span>");
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
			rc3._addDom(result.columns);
			rc3._draginit(".dim",paramClone);
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
				    if(coln[0]!=undefined)
				    	jQuery(".coln-a").append("<div>"+ rc3.columns[coln[0].dbname].description +"<span style=display:none;>"+coln[0].dbname+"</span></div>");
				    if(coln[1]!=undefined)
				    	jQuery(".coln-b").append("<div>"+ rc3.columns[coln[1].dbname].description +"<span style=display:none;>"+coln[1].dbname+"</span></div>");
				    if(coln[2]!=undefined)
				    	jQuery(".coln-c").append("<div>"+ rc3.columns[coln[2].dbname].description +"<span style=display:none;>"+coln[2].dbname+"</span></div>");
				    if(coln[3]!=undefined)
				    	jQuery(".coln-d").append("<div>"+ rc3.columns[coln[3].dbname].description +"<span style=display:none;>"+coln[3].dbname+"</span></div>");
				    if(coln[4]!=undefined)
				    	jQuery(".coln-e").append("<div>"+ rc3.columns[coln[4].dbname].description +"<span style=display:none;>"+coln[4].dbname+"</span></div>");
			}
			rc3._draginit(".coln-a",param);
			rc3._draginit(".coln-b",param);
			rc3._draginit(".coln-c",param);
			rc3._draginit(".coln-d",param);
			rc3._draginit(".coln-e",param);
			if(result.def.formula!=undefined){
				jQuery(".define input").val(result.def.formula);
			}
			if(result.def.fmt!=undefined){
				jQuery(".layout select option[value='"+result.def.fmt+"']").attr("selected","selected");
			}
			if(!this.isloaded){
				this.isloaded=true;
			//给容器绑定ss-added事件
				jQuery(".coln-a").bind("ss-added",function(e,selected){
					var select=jQuery(selected);
						jQuery(".coln-a").html("");
						jQuery(".coln-a").append(select);
						rc3._draginit(".coln-a",param);
				});
				jQuery(".coln-b").bind("ss-added",function(e,selected){
					var select=jQuery(selected);
					jQuery(".coln-b").html("");
					jQuery(".coln-b").append(select);
					rc3._draginit(".coln-b",param);
				});
				jQuery(".coln-c").bind("ss-added",function(e,selected){
					var select=jQuery(selected);
					jQuery(".coln-c").html("");
					jQuery(".coln-c").append(select);
					rc3._draginit(".coln-c",param);
				});
				jQuery(".coln-d").bind("ss-added",function(e,selected){
					var select=jQuery(selected);
					jQuery(".coln-d").html("");
					jQuery(".coln-d").append(select);
					rc3._draginit(".coln-d",param);
				});
				jQuery(".coln-e").bind("ss-added",function(e,selected){
					var select=jQuery(selected);
					jQuery(".coln-e").html("");
					jQuery(".coln-e").append(select);
					rc3._draginit(".coln-e",param);
				});
			}
		},
		_addDom : function(result){
			for(var i =0; i < result.length; i++){
				if(result[i].id==this.id) continue;
				var type=result[i].type;
				if(type=="measure"||type.indexOf( 'component')==0){
					e="dim";
				}else{
					continue;
				}
				rc3.columns[result[i].dbname]=result[i];
				var className = "." + e;
				jQuery(className).append("<div exist='N'>"+ result[i].description +"<span style=display:none;>"+result[i].dbname+"</span></div>");
			}
		},
		_saveRptSpecialColumnDef : function(){
			var params=new Array();
			var key1=jQuery(".coln-a div span").text(),key2=jQuery(".coln-b div span").text(),key3=jQuery(".coln-c div span").text(),key4=jQuery(".coln-d div span").text(),key5=jQuery(".coln-e div span").text();
			params.push(this.columns[key1]);
			params.push(this.columns[key2]);
			params.push(this.columns[key3]);
			params.push(this.columns[key4]);
			params.push(this.columns[key5]);
			var formula=jQuery(".define input").val();
			var trans = {
					id: 1,
					command: rc3.command,
					params: {
						cmd: "RptDef",
						type: "saveRptSpecialColumnDef",
						def:{
							params:params,
							formula:formula,
							fmt:jQuery(".layout select").find("option:selected").val(),
					},
						id:rc3.id
					}
				};
				portalClient.sendOneRequest(trans, function(response){
					alert(response.data[0].message);
					rc3._load(rc3.id,rc3.command);
				});
		}
};
ReportC3Control.main = function() {
	portalClient = new PortalClient();
	//设置请求路径
	portalClient.init(null,null,"/servlets/binserv/Request");
	rc3 = new ReportC3Control();
};
jQuery(document).ready(ReportC3Control.main);