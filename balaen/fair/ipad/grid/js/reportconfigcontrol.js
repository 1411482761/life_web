window.onbeforeunload = function(){
//	if(reportconfigcontrol.ischanged)
//	return "本页面要求您确认您要离开 - 您修改的数据可能不会被保存。";
};
var reportconfigcontrol;
var ReportConfigControl= Class.create();
ReportConfigControl.prototype = {
		initialize : function() {
			this.isloaded = false;
			this.command="";
			this._init();
		},
		_draginit : function(id,params){
			jQuery(id).shapeshift(params);
		},
		_init : function(){
			jQuery(".container div").html("");
			jQuery(".column").html("");
			jQuery(".target").html("");
			this.dbnames=new Array();
			this.sortfields = new Array();
			this.columns=new Hash();
			this.dbnames=new Array();
			this.fields=new Object();
			this.tbname="";
			this.buyerfilter="";
			this.pdtfilter="";
			this.ischanged=false;
		},
		_loadrightdata : function(paramDiv){
			//发请求，获取数据，添加dom元素 meta:进入纵轴/横轴 component/prjtable进入度量
			var trans = {
					id: 1,
					command: reportconfigcontrol.command,
					params: {
						cmd: "RptDef",
						type: "getRptMetaColumns"
					}
				};
				portalClient.sendOneRequest(trans, function(response){
					var javaData= response.data[0].result;
					reportconfigcontrol._drawrighthtml(javaData,paramDiv);
				});
		},
		_loadleftdata : function(name,command){
			reportconfigcontrol._init();
			this.command=command;
			reportconfigcontrol.tbname=name;
			var paramDiv = {
					selector : "div",
					colWidth : 105,
					autoHeight:false,
					maxHeight:null,
					minHeight:null,
					align:'left',
					gutterX: 5,
					paddingX:20,
					paddingY:20
				};
			//发请求，获取数据，添加dom元素 meta:进入纵轴/横轴 component/prjtable进入度量
			var trans = {
					id: 1,
					command: reportconfigcontrol.command,
					params: {
						cmd: "RptDef",
						type: "getRptDef",
						name:name
					}
			};
			portalClient.sendOneRequest(trans, function(response){
				var javaData= response.data[0].result;
				reportconfigcontrol._drawlefthtml(javaData,paramDiv);
				reportconfigcontrol._loadrightdata(paramDiv);
			});
		},
		_drawlefthtml : function(getRptDef,paramDiv){
			//发请求到后台添加已经定义的字段到纵轴 横轴 度量中request: {cmd: rptDef,type:'getRptDef',name: "category"}
			var elem = "";
			reportconfigcontrol.sortfields=getRptDef.sortfields;
			jQuery(".vertical").html("<span class='vtitle'>纵轴</span>");
			jQuery(".horizontal").html("<span class='htitle'>横轴</span>");
			jQuery(".metric").html("<span class='mtitle'>度量</span>");
			var ptype="",column;
			var col_field=new Array(),row_field=new Array(),measure_field=new Array();
			for(var i = 0; i < getRptDef.columns.length ;i++){
				column=getRptDef.columns[i];
				reportconfigcontrol.dbnames.push(column.dbname.toUpperCase());
				if(null != column.isuse && 'undefined' != column.isuse && column.isuse == 'Y')
					elem = "<div exist='Y' table_name='"+column.table_name+"'><span>"+ column.description + "</span><input type='checkbox' checked />" +"</div>";
				else
					elem = "<div exist='Y' table_name='"+column.table_name+"'><span>"+ column.description + "</span><input type='checkbox' />" +"</div>";
				if(column.type=="col"){
					ptype =".vertical";
					col_field.push(column);
				}else if(column.type=="row"){
					ptype =".horizontal";
					row_field.push(column);
				}else if(column.type=="measure"||column.type.indexOf( 'component')==0){
					ptype =".metric";
					measure_field.push(column);
				}else{
					alert("系统内部错误。不支持type:"+column.type);
				}
				if(column.table_name=='B_FUNIT'){
					this.buyerfilter=column.table_filter;
				}
				if(column.table_name=='M_PRODUCT'){
					this.pdtfilter=column.table_filter;
				}
				jQuery(ptype).append(elem);
				jQuery(ptype+" div:last").data("data",column);
				//jQuery(".vertical div").eq(i).click(function(){alert(jQuery(this).data("data").type);})
			}
			var fields={
					col:col_field,
					row:row_field,
					measure:measure_field
			};
			this.fields=fields;
			reportconfigcontrol._draginit(".vertical",paramDiv);
			reportconfigcontrol._draginit(".horizontal",paramDiv);
			reportconfigcontrol._draginit(".metric",paramDiv);
			reportconfigcontrol._draginit(".trash",paramDiv);
			this.ischanged=false;
			jQuery('.container').on("mousedown",'.ss-active-child',function () {
				jQuery(".container .ss-active-child").removeClass("selected");
				  jQuery(this).addClass("selected");
				});
//			jQuery('.container').on("click",'input',function () {
//				var dom=jQuery(this);
//				dom.parent("div").data("data").isuse=dom.is(':checked')?"Y":"N";
//			});
			
			jQuery(".container div").on("dblclick","div",function(){
			    var ischeck=jQuery(this).find("input").attr("checked")=="checked"?true:false;
				jQuery(".container .ss-active-child").find("input.updesc").blur();
				var tableName = jQuery(this).text();
				jQuery(this).html("<input type='text' class='updesc' value='"+tableName+"'/>");
				jQuery(".container .ss-active-child input.updesc").val('').focus().val(tableName).blur(function(){
					var dom=jQuery(this);
					var isuse=dom.parent("div").data("data").isuse;
					dom.parent("div").data("data").description=dom.val();
					if(isuse=="Y"||ischeck)
						dom.parent("div").html("<span>"+dom.val()+"</span><input type='checkbox' checked='checked'>");
					else
						dom.parent("div").html("<span>"+dom.val()+"</span><input type='checkbox'>");
					
						
				});
				jQuery(".container .ss-active-child input.updesc").bind("keydown",function(e){
					var key = e.which;
					if(key == 13){
						jQuery(this).blur();
					}
				});
			});
		},
		_drawrighthtml : function(result,paramDiv){
			//实例化拖动组件
			var param = {
				colWidth : 90,
				autoHeight:false,
				maxHeight:null,
				minHeight:null,
				align:'left',
				gutterX:7,
				gutterY:8,
				paddingY:20,
				paddingX:7,
				dragClone:true,
				enableTrash: false,
				enableCrossDrop:false
			};
			var spanElem = "";
			var counts = 0;
			for(var i = 0;i < result.columns.basic.length; i++){
				spanElem = "<span class='config'>"+ result.columns.basic[i].groupname +"</span>";
				jQuery(".target").append(spanElem);
				jQuery(".target span").eq(i).data("data",{columns:result.columns.basic[i].columns,type:""});
				counts++;
				var fields=result.columns.basic[i].columns;
				for(var j=0;j<fields.length;j++){
					reportconfigcontrol.columns[fields[j].dbname]=fields[j];
				}
			}
			for(var i = 0;i < result.columns.component.length; i++){
				spanElem = "<span class='config'>"+ result.columns.component[i].groupname +"</span>";
				jQuery(".target").append(spanElem);
				jQuery(".target span").eq(counts+i).data("data",{columns:result.columns.component[i].columns,type:"measure"});
				counts++;
			}
			if(result.tables!=undefined&&result.tables.length>0){
				for(var i = 0;i < result.tables.length; i++){
					spanElem = "<span class='notconfig' tname="+result.tables[i].name+">"+ result.tables[i].description +"</span>";
					jQuery(".target").append(spanElem);
					jQuery(".target span").eq(counts+i).data("data",{columns:result.tables[i].columns});
					counts++;
				}
			}
			spanElem = "<span class='recreate config' onclick=window.location.replace('/fair/ipad/grid/newtable.jsp?name="+reportconfigcontrol.tbname+"')>新建表</span>";
			jQuery(".target").append(spanElem);
			jQuery(".target span.config").click(function(){
				if(jQuery(this).hasClass("recreate") || jQuery(this).hasClass("on")){
					return;
				}else{
					jQuery(this).parent().children().removeClass("on");
					jQuery(this).addClass("on");
					jQuery(".column").html('');
					var column = jQuery(this).data("data").columns;
					
					var divElem = "";
					//添加可拖动column到.column中
					for(var i = 0; i < column.length; i++){
						var type = "";
						if("" != column[i].type && 'undefined' != column[i].type)
							type = column[i].type;
						if(column[i].tablename==undefined){
							alert("ad_sql#rptdef_reftable中"+column[i].dbname+"未配置dbname"+dbname);
							return;
						}
						divElem = "<div exist='N' table_name="+column[i].tablename+"><span>"+ column[i].description +"</span><input type='checkbox' checked/>"+"</div>";
						jQuery(".column").append(divElem);
						//此处设置data.flag="column"，是为了方便下面拖动的判断
						jQuery(".column div").eq(i).data("data",{description:column[i].description,dbname:column[i].dbname.toUpperCase() ,type:type,flag:"column"});
						/*jQuery(".column div").eq(i).click(function(){
							alert(jQuery(this).data("data").description);
						});*/
					}
					
					reportconfigcontrol._draginit(".column",param);
					
					
				}
			});
			jQuery(".target span.notconfig").click(function(){
					jQuery(this).parent().children().removeClass("on");
					jQuery(this).addClass("on");
					jQuery(".column").html('');
					var table_name=jQuery(this).attr("tname");
					var trans = {
							id: 1,
							command: reportconfigcontrol.command,
							params: {
								cmd: "RptDef",
								type: "getTableDef",
								name:table_name
							}
					};
					portalClient.sendOneRequest(trans, function(response){
						var javaData= response.data[0].result;
						var column=javaData.columns;
						//添加可拖动column到.column中
						var j=0;
						for(var i = 0; i < column.length; i++){
							var divElem = "";
							var type = "";
							if("" != column[i].type && 'undefined' != column[i].type)
								type = column[i].type;
							if(type=="measure"){
								divElem = "<div exist='N' table_name="+table_name+"><span>"+ column[i].description +"</span><input type='checkbox' checked/>"+"</div>";
								jQuery(".column").append(divElem);
								//此处设置data.flag="column"，是为了方便下面拖动的判断
								jQuery(".column div").eq(j).data("data",{description:column[i].description,dbname:column[i].dbname.toUpperCase() ,type:type,flag:"column"});
								j++;
							}
							
							/*jQuery(".column div").eq(i).click(function(){
							alert(jQuery(this).data("data").description);
						});*/
						}
						reportconfigcontrol._draginit(".column",param);
					});
			});
			jQuery(".target span").eq(0).trigger("click");
			
			//给容器(vertical/horizontal/metric)绑定  ss-added事件
			//jQuery(".vertical").bind("ss-arranged",function(){alert("aaa")});
			//jQuery(".vertical").bind("ss-added",function(){reportconfigcontrol._add("vertical",paramDiv)});
			//jQuery(".horizontal").bind("ss-added",function(){reportconfigcontrol._add("horizontal",paramDiv)});
			
			//jQuery(".metric").bind("ss-added",function(newData){reportconfigcontrol._add("metric",paramDiv);});
			
			if(!this.isloaded){
				this.isloaded=true;
				jQuery(".vertical").bind("ss-added",function(e,selected){reportconfigcontrol._add(e,selected,"vertical",paramDiv);}).bind("ss-arranged",function(){ reportconfigcontrol.ischanged=true;});
				jQuery(".horizontal").bind("ss-added",function(e,selected){reportconfigcontrol._add(e,selected,"horizontal",paramDiv);}).bind("ss-arranged",function(){ reportconfigcontrol.ischanged=true;});
				jQuery(".metric").bind("ss-added",function(e,selected){reportconfigcontrol._add(e,selected,"metric",paramDiv);}).bind("ss-arranged",function(){ reportconfigcontrol.ischanged=true;});
				jQuery(".trash").bind("ss-added",function(e,selected){
				var dbname=jQuery(selected).data("data").dbname;
				var index=reportconfigcontrol.dbnames.indexOf(dbname);
				reportconfigcontrol.dbnames.splice(index,index+1);
				var exist=jQuery(selected).attr("exist");
				jQuery(selected).remove();
				if(exist=="Y"){
					reportconfigcontrol._deleteColumn(dbname);
				}else{
				
				}
			});
			
			}
			//jQuery(".container > div")
		},
		_deleteColumn : function(dbname){
			var trans = {
					id: 1,
					command: reportconfigcontrol.command,
					params: {
						cmd: "RptDef",
						type: "delReportcolumn",
						field:dbname,
						name:reportconfigcontrol.tbname
					}
				};
				portalClient.sendOneRequest(trans, function(response){
				if(response.data[0].code==-1)
				alert(response.data[0].message);
				reportconfigcontrol._loadleftdata(reportconfigcontrol.tbname,reportconfigcontrol.command);
				});
		},
		_add : function(e,selected,name,paramDiv){
			var className = "."+name;
			var classNameDiv = className + " div";
			var flag = false;
			var data = {};
			var dbname = [];//验证dbname是否重复变量
			var delDiv = [];// 存放拖到纵轴下标，但是属于度量的column
			var origin_container=jQuery(".ss-original-container");
			if("" != jQuery(selected).data("data").flag && jQuery(selected).data("data").flag != 'undefined' && 'column' == jQuery(selected).data("data").flag){
				//证明是从column容器中拖过来的
				flag = true;
				data = JSON.parse(JSON.stringify( jQuery(selected).data("data") ));
			}
			var dom=jQuery(selected);
			if(className == '.vertical' || className == '.horizontal'){
				var type=dom.data("data").type;
				if("" == type || type== 'undefined' || 'col' == type || 'row' == type || 'dimension' == type){
					//判断是否有相同，有相同，则
					//alert(i);
					reportconfigcontrol._ssremoveCopy(origin_container,className,true,dom);
				}else{
					// 不属于该容器 删除
					jQuery(".metric").append(dom);
					//alert(jQuery(".metric div:last").data("data").description);
					for(var j = 0; j < jQuery(".metric div").length-1; j++){
						if(jQuery(".metric div").eq(j).data("data").dbname == jQuery(".metric div:last").data("data").dbname){
							jQuery(".metric div:last").remove();
						}
					}
					reportconfigcontrol._draginit(".metric",paramDiv);
					//delDiv.push(i);
				}
			}else if(className == '.metric'){
				if(dom.data("data").type == 'measure'){
					reportconfigcontrol._ssremoveCopy(origin_container,className,false,dom);
				}else if(dom.data("data").type.indexOf( 'component')==0){}else{
					if(origin_container.hasClass("vertical")||origin_container.hasClass("horizontal")){
						origin_container.append(dom);
						reportconfigcontrol._draginit(".vertical",paramDiv);
						reportconfigcontrol._draginit(".horizontal",paramDiv);
					}else{
						dom.remove();
					}
					// 不属于该容器 删除
				}
			}
			
			if(flag) reportconfigcontrol._addData(data);
			reportconfigcontrol._draginit(className,paramDiv);
		},
		_ssremoveCopy : function(origin_container,current,is_dimension,dom){
			var dbname=dom.data("data").dbname;
			if(is_dimension&&(undefined == dom.data("data").flag || dom.data("data").flag == "")){
				var data=dom.data("data");
				dom.remove();
				jQuery(current).append(dom);
				dom.data("data",data);
//				reportconfigcontrol._draginit(".vertical",paramDiv);
//				reportconfigcontrol._draginit(".horizontal",paramDiv);
			}else{
				if(reportconfigcontrol.dbnames.indexOf(dbname) != -1){
					//证明该容器已经包含该字段
					//delCopy.push(i);
					dom.remove();
				}else{
					dom.data("data").flag = "";
					reportconfigcontrol.dbnames.push(dbname);
				}
			}
		},
		_addData : function(data){
			//bug，如果从column中拖过来，column中的set的data值也会拖过来，但是原column中的div没有data值，所有这里要将原来column中set原来的data
			if(jQuery(".ss-original-container div").length > 0){
				for(var i = 0;i < jQuery(".ss-original-container div").length; i++){
					if(null == jQuery(".ss-original-container div").eq(i).data("data") || 'undefined' == jQuery(".ss-original-container div").eq(i).data("data")){
						jQuery(".ss-original-container div").eq(i).data("data",data);
					}
				}
			}
		},
		_checkChanged : function(){
			var colength=jQuery(".vertical div").length;
			var rowlength=jQuery(".horizontal div").length;
			var measurelength=jQuery(".metric div").length;
			var fields=this.fields;
			var flag=false;
			if(colength!=fields.col.length||rowlength!=fields.row.length||measurelength!=fields.measure.length){flag=true;}
			if(!flag){
				var length=jQuery(".container  div.ss-active-child").length;
				for(var i=0;i<length;i++){
					if(i<colength){
						var dom=jQuery(".vertical div.ss-active-child:eq("+i+")");
						var data=dom.data("data");
						var isuse=dom.find("input").is(':checked')?"Y":"N";
					if(data.dbname!=fields.col[i].dbname||isuse!=fields.col[i].isuse){flag=true;break;}
					}else if(i<(rowlength+colength) &&i>=colength&&rowlength>0){
						var dom=jQuery(".horizontal div.ss-active-child:eq("+(i-colength)+")");
						var data=dom.data("data");
						var isuse=dom.find("input").is(':checked')?"Y":"N";
						if(data.dbname!=fields.row[i-colength].dbname||isuse!=fields.row[i-colength].isuse){flag=true;break;}
					}else{ 
						if(measurelength>0){
							var dom=jQuery(".metric div.ss-active-child:eq("+(i-colength-rowlength)+")");
							var data=dom.data("data");
							var isuse=dom.find("input").is(':checked')?"Y":"N";
							if(data.dbname!=fields.measure[i-colength-rowlength].dbname||isuse!=fields.measure[i-colength-rowlength].isuse){flag=true;break;}
						}
					}
				}
			}
			return flag;
		},
		_saveRptDef : function(){
			jQuery("#rpt-loading").show();
			var def=new Array;
			var colength=jQuery(".vertical div").length;
			var rowlength=jQuery(".horizontal div").length;
			var can_save=true;
			jQuery(".container  div.ss-active-child").each(function(i){
				var data=jQuery(this).data("data");
				if(i<colength){
					data.type="col";
				}else if(i<(rowlength+colength) &&i>=colength){
					if(reportconfigcontrol.columns[data.dbname].can_be_row!=undefined&&reportconfigcontrol.columns[data.dbname].can_be_row=="N"){
						alert(data.description+"不能为横轴");
						can_save=false;
						return;
					}
					data.type="row";
				}
				data.table_name=jQuery(this).attr("table_name");
				data.orderno=(i+1)*10;
				data.isuse=jQuery(this).find("input").is(':checked')?"Y":"N";
				def.push(data);
			});
			if(can_save){
				var trans = {
						id: 1,
						command: reportconfigcontrol.command,
						params: {
							cmd: "RptDef",
							type: "saveRptDef",
							def:{
								columns:def
							},
							sortfields:reportconfigcontrol.sortfields,
							buyerfilter:reportconfigcontrol.buyerfilter,
							pdtfilter:reportconfigcontrol.pdtfilter,
							name:reportconfigcontrol.tbname
						}
				};
				portalClient.sendOneRequest(trans, function(response){
					alert(response.data[0].message);
					jQuery("#rpt-loading").hide();
					reportconfigcontrol._loadleftdata(reportconfigcontrol.tbname,reportconfigcontrol.command);
				});
			}
		},
		_setcolumns : function(){
			var selected=jQuery(".selected");
			if(selected.length==0){
				alert("请选择一个字段");
				return;
			}
			if( reportconfigcontrol._checkChanged()){
				alert("当前页面已被修改，请先点击保存按钮。");
				return;
			}
			if(selected.data("data").type=="col" || selected.data("data").type=="row"){
				window.location.replace('/fair/ipad/grid/bindmeasure.jsp?id='+selected.data("data").id+"&tbname="+this.tbname+"&name="+selected.data("data").description+"&type="+selected.data("data").type);
			}else if(selected.data("data").type=="measure"){
				window.location.replace('/fair/ipad/grid/measuredef.jsp?id='+selected.data("data").id+"&tbname="+this.tbname+"&name="+selected.data("data").description+"&dbname="+selected.data("data").dbname);
			}else if(selected.data("data").type.indexOf( 'component1')==0){
				window.location.replace('/fair/ipad/grid/component1.jsp?id='+selected.data("data").id+"&tbname="+this.tbname+"&name="+selected.data("data").description);
			}else if(selected.data("data").type.indexOf( 'component2')==0){
				window.location.replace('/fair/ipad/grid/component2.jsp?id='+selected.data("data").id+"&tbname="+this.tbname+"&name="+selected.data("data").description);
			}else if(selected.data("data").type.indexOf( 'component3')==0){
				window.location.replace('/fair/ipad/grid/component3.jsp?id='+selected.data("data").id+"&tbname="+this.tbname+"&name="+selected.data("data").description);
			}else if(selected.data("data").type.indexOf( 'component4')==0){
				window.location.replace('/fair/ipad/grid/component4.jsp?id='+selected.data("data").id+"&tbname="+this.tbname+"&name="+selected.data("data").description);
			}else if(selected.data("data").type.indexOf( 'component5')==0){
				window.location.replace('/fair/ipad/grid/component5.jsp?id='+selected.data("data").id+"&tbname="+this.tbname+"&name="+selected.data("data").description);
			}else if(selected.data("data").type.indexOf( 'component6')==0){
				window.location.replace('/fair/ipad/grid/component6.jsp?id='+selected.data("data").id+"&tbname="+this.tbname+"&name="+selected.data("data").description);
			}else if(selected.data("data").type.indexOf( 'component7')==0){
				window.location.replace('/fair/ipad/grid/component7.jsp?id='+selected.data("data").id+"&tbname="+this.tbname+"&name="+selected.data("data").description);
			}else{
				alert("此功能不支持type:"+selected.data("data").type);
			}
		}
};
ReportConfigControl.main = function() {
	portalClient = new PortalClient();
	//设置请求路径
	portalClient.init(null,null,"/servlets/binserv/Request");
	reportconfigcontrol = new ReportConfigControl();
};
jQuery(document).ready(ReportConfigControl.main);