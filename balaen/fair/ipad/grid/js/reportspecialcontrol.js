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
			
			if(result.def.threshhold != undefined){
				
				/*jQuery("[name = 'greater']").val(result.def.threshhold.greater);*/
				if(result.def.threshhold.greater != undefined){
					jQuery(".coln-greater").append("<div>"+ result.def.threshhold.greater.description +"<span style=display:none;>"+result.def.threshhold.greater.dbname+"</span></div>");
				}
				jQuery("[name = 'greatercolor']").val(result.def.threshhold.greaterColor);
				jQuery(".greatercolor").css("background-color",result.def.threshhold.greaterColor);
				/*jQuery("[name = 'less']").val(result.def.threshhold.less);*/
				if(result.def.threshhold.less != undefined){
					jQuery(".coln-less").append("<div>"+ result.def.threshhold.less.description +"<span style=display:none;>"+result.def.threshhold.less.dbname+"</span></div>");
				}
				jQuery("[name = 'lesscolor']").val(result.def.threshhold.lessColor);
				jQuery(".lesscolor").css("background-color",result.def.threshhold.lessColor);
				jQuery("[name = 'middlecolor']").val(result.def.threshhold.middleColor);
				jQuery(".middlecolor").css("background-color",result.def.threshhold.middleColor);
			}
			reportspecialcontrol._draginit(".coln-greater",param);
			reportspecialcontrol._draginit(".coln-less",param);
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
			jQuery(".coln-greater").bind("ss-added",function(e,selected){
				var select=jQuery(selected);
					jQuery(".coln-greater").html("");
					jQuery(".coln-greater").append(select);
					reportspecialcontrol._draginit(".coln-greater",param);
			});
			jQuery(".coln-less").bind("ss-added",function(e,selected){
				var select=jQuery(selected);
					jQuery(".coln-less").html("");
					jQuery(".coln-less").append(select);
					reportspecialcontrol._draginit(".coln-less",param);
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
		_changeColor : function(type){
			var color = jQuery("[name=" +type+ "]").val();
			jQuery("." + type).css("background-color",color);
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
			
			var greater = jQuery(".coln-greater div span").text(),less = jQuery(".coln-less div span").text();
			var threshhold = {
					greater:greater == ""?undefined:this.columns[greater],
					greaterColor:greater == ""?undefined:jQuery("[name = 'greatercolor']").val(),
					less:less == ""?undefined:this.columns[less],
					lessColor:less == ""?undefined:jQuery("[name = 'lesscolor']").val(),
					middleColor:less != "" &&greater != ""?jQuery("[name='middlecolor']").val():undefined
			};
			var trans = {
					id: 1,
					command: reportspecialcontrol.command,
					params: {
						cmd: "RptDef",
						type: "saveRptSpecialColumnDef",
						def:{
							fmt:jQuery(".layout select").find("option:selected").val(),
							params:params,
							threshhold:threshhold
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