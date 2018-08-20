function clone(myObj){  
    if(typeof(myObj) != 'object' || myObj == null) return myObj;  
    var newObj = new Object();  
    for(var i in myObj){  
      newObj[i] = clone(myObj[i]); 
    }  
    return newObj;  
}
var lc;
var LoadgridControl= Class.create();
LoadgridControl.prototype = {
		initialize : function() {
			this.text = "";
			this.isloaded = false;
			this.columns = new Hash();
			this.fields = new Hash();
			this.command="";
		},
		_draginit : function(id,params){
			jQuery(id).shapeshift(params);
		},
		init : function(command) {
			this.command=command;
			var trans = {
					id: 1,
					command: lc.command,
					params: {
						cmd: "RptDef",
						type: "getMetaColumns"
					}
				};
				portalClient.sendOneRequest(trans, function(response){
					var javaData= response.data[0].result;
					lc.receive(javaData);
				});
		},
		receive : function(result){
			jQuery("ul.nav").html("");
			jQuery(".target").html("");
			/*从后台获取result可配置数据{cmd: rptDef,type:'loadtabledef'}*/
			if(null != result.columns && result.columns != 'undefined' && null != result.columns.basic && result.columns.basic.length > 0 && null != result.columns.extend.columns && result.columns.extend.columns.length > 0){
				/*<li class="on">买手</li><li>商品</li><li>度量</li>
				<div class="secktion"><div>区域<span></span></div><div>经销商</div></div>
				*/
				for(var i = 0; i < result.columns.basic.length; i++){
					var element = "<li>"+ result.columns.basic[i].groupname +"</li>";
					if( i == 0) element = "<li class='on'>"+ result.columns.basic[i].groupname +"</li>";
					jQuery(".nav").append(element);
					element = "<div class='secktion' id='secktion"+i+"' style='display:none'>";
					if( i == 0)element = "<div class='secktion' id='secktion0' style='display:block'>";
					for(var j = 0; j < result.columns.basic[i].columns.length; j++){
						this.columns[result.columns.basic[i].columns[j].dbname]=result.columns.basic[i].columns[j];
						if(result.columns.basic[i].columns[j].type=='dimension')
							element += "<div>" + result.columns.basic[i].columns[j].description + "<span class='wd'>" + result.columns.basic[i].columns[j].dbname + "</span></div>";
						else
							element += "<div>" + result.columns.basic[i].columns[j].description + "<span class='dl' isbasic='Y'>" + result.columns.basic[i].columns[j].dbname + "</span></div>";
					}
					element += "</div>";
					jQuery(".secktions").append(element);
				}
				var element = "<li>"+ result.columns.extend.groupname +"</li>";
				jQuery(".nav").append(element);
				//度量
				element = "<div class='clone' id='clone' style='display:none'>";
				for(var i = 0; i < result.columns.extend.columns.length; i++){
					this.columns[result.columns.extend.columns[i].dbname]=result.columns.extend.columns[i];
					element += "<div dl2="+result.columns.extend.columns[i].dbname+">" + result.columns.extend.columns[i].description +"<span class='dl'>"+result.columns.extend.columns[i].dbname+"</span></div>";
				}
				element += "</div>";
				jQuery(".secktions").append(element);
			}
			var columnparam = {};
			jQuery(".nav li").each(function(i){
				jQuery(this).bind("click",function(){
					jQuery(this).parent().children("li").removeClass("on");
					jQuery(this).addClass("on");
					jQuery(".secktions").children().css("display","none");
					jQuery(".secktions").children().eq(i).css("display","block");
					//字段jquery实例化
					columnparam = {
						colWidth: 90,
						align: "left",
						autoHeight: true,
						minHeight: 42,
						maxHeight: "null",
						gutterX:30,
						//columns:1,
						gutterY:3,
						dragClone:true,
						enableTrash: false,
						enableCrossDrop:false
					};
					lc._draginit("#"+jQuery(".secktions").children().eq(i).attr("id"),columnparam);
				});
			});
			jQuery(".nav").children("li").eq(0).trigger("click");
			
			/*获取表定义*/
			var param = {};
			if(null != result.tables && result.tables.length > 0){
				for(var i = 0; i < result.tables.length; i++){
					if(result.tables[i].name.indexOf( 'Z_IDXV')==0)
					jQuery(".target").append("<span tname="+result.tables[i].name+" type='view'>"+result.tables[i].description+"</span>");
					else
					jQuery(".target").append("<span tname="+result.tables[i].name+">"+result.tables[i].description+"</span>");
				}
				jQuery(".target").append("<span class='recreate' style='border-top:0px;' t_type='table'>新建表</span>");
				jQuery(".target").append("<span class='recreate' style='border-top:0px;' t_type='view'>新建视图</span>");
			}else{
				jQuery(".target").append("<span class='recreate' t_type='table'>新建表</span>");
				jQuery(".target").append("<span class='recreate' t_type='view'>新建视图</span>");
			}
			//维度 度量-->jquery拖拽实例化
			param = {
				colWidth: 125,
				align: "left",
				autoHeight: true,
				minHeight: 42,
				gutterX:30,
				gutterY:5,
				paddingX:0,
				paddingY:0
				
				//enableCrossDrop:false
			};
			if(!this.isloaded){
				this.isloaded=true;
				jQuery('body').on("mousedown",'.ss-active-child',function () {
				  jQuery('.ss-active-child').find('input').blur();
				});
				jQuery(".target").on("click","span",function(){
					jQuery(".updatename").hide();
					if(!jQuery(this).hasClass("on")){
						jQuery(".bm").html(jQuery(this).text());
						jQuery(this).parent().children().removeClass("on");
						//var tabdef = {};
						if(!jQuery(this).hasClass("recreate")){
							
							jQuery(this).addClass("on");
							//向后抬发请求获取tabledef配置信息
							lc.fields = new Hash();
							var html = "",html1 = "";
							//tabdef = [{ dbname: "c_area_id", description: "区域1",type:"dimension" },{ dbname: "m_dim_id", description: "大类" ,type:"dimension" } ,{ dbname: "amt20141223092753531", description: "销售金额",type:"measure"  } ,{ dbname: "amt20131223092753531", description: "吊牌额",type:"measure"  } ];
							var trans = {
									id: 1,
									command: lc.command,
									params: {
										cmd: "RptDef",
										type: "getTableDef",
										name:jQuery(this).attr("tname")
									}
							};
							portalClient.sendOneRequest(trans, function(response){
								var javaData= response.data[0].result;
								var tabdef=javaData.columns;
								for(var i = 0; i < tabdef.length; i++){
									lc.columns[tabdef[i].dbname]=tabdef[i];
									lc.fields[tabdef[i].dbname]=tabdef[i];
									if(tabdef[i].type=="dimension")
										html += "<div>"+tabdef[i].description+ "<span  class='wd'>"+tabdef[i].dbname+"</span></div>";
									else if(tabdef[i].type=="measure")
										html1 += "<div>"+tabdef[i].description+ "<span class='dl'>"+tabdef[i].dbname+"</span></div>";
									else
										alert("不支持类型type="+tabdef[i].type);
								}
								jQuery("#dimension").html(html);
								jQuery("#metric").html(html1);
								lc._initdrag(param);
							});
						}else if(jQuery(this).hasClass("recreate")){
							lc.fields = new Hash();
							var type=jQuery(this).attr("t_type"),str="新建表";
							if(type=='view')str="新建视图";
							else str="新建表";
							if(type=='view')
								jQuery(".target").find(".recreate:eq(0)").before("<span class='on' tname='Z_IDXV_"+new Date().getTime()+"' type='"+type+"'>"+str+"</span>");
							else
								jQuery(".target").find(".recreate:eq(0)").before("<span class='on' tname='Z_IDX_"+new Date().getTime()+"' type='"+type+"'>"+str+"</span>");
							jQuery("#dimension").children().remove();
							jQuery("#metric").children().remove();
							
						}else{
							//新建表的逻辑
							jQuery(this).addClass("on");
							jQuery("#dimension").children().remove();
							jQuery("#metric").children().remove();
						}
						lc._initdrag(param);
						/*维度：绑定ss-added监听事件，如果拖到容器中的元素存在，则移除，如果属性为度量，则自动放入到度量容器*/
						jQuery("#dimension").bind("ss-added",function(e,selected){
							var splitvd = [];
							jQuery("#dimension div").each(function(i){
								if(!jQuery(this).find("span").hasClass("wd")){
									//如果不是维度选项，放到度量容器
									var elem = jQuery(this);
									jQuery(this).remove();
									jQuery("#metric").append(elem);
									lc._draginit("#dimension",param);
									lc._draginit("#metric",param);
									jQuery("#metric").trigger("ss-added");
								}else{
									//如果维度选项有重复，则删除重复
									if(-1 != splitvd.lastIndexOf(jQuery("#dimension div").eq(i).find("span").text())){
										if(jQuery("#dimension div").eq(i).attr("signed")!=undefined&&jQuery("#dimension div").eq(i).attr("signed")=="Y")
											jQuery(selected).remove();
										else
											jQuery("#dimension div").eq(i).remove();
										lc._draginit("#dimension",param);
									}else{
										jQuery("#dimension div").eq(i).attr("signed","Y");
										splitvd.push(jQuery("#dimension div").eq(i).find("span").text());
									}
								}
							});
						});
						/*度量：绑定ss-added监听事件，如果属性为维度，则自动放入到维度容器*/
						jQuery("#metric").bind("ss-added",function(e,selected){
							var splitvd = [];
//							jQuery("#metric div").each(function(i){
//								if(!jQuery(this).find("span").hasClass("dl")){
//									//如果不是度量选项，放到维度容器
//									var elem = jQuery(this);
//									jQuery(this).remove();
//									jQuery("#dimension").append(elem);
//									lc._draginit("#dimension",param);
//									lc._draginit("#metric",param);
//									jQuery("#dimension").trigger("ss-added");
//								}else{
//									//给span添加时间戳
//									//if(-1 != splitvd.lastIndexOf(jQuery("#metric div").eq(i).find("span").text())){
//									var that=jQuery(this);
//									if(that.find("span").attr("isbasic")!=undefined&&that.find("span").attr("isbasic")=="Y"){
//										lc._draginit("#metric",param);
//									}else{
//										if(that.attr("dl2")!="inited"){
//											var obj = clone(lc.columns[jQuery(selected).find("span").text()]);
//											var spanTXT = that.attr("dl2") + new Date().getTime();
//											obj.dbname=spanTXT;
//											jQuery("#metric div").eq(i).find("span").text(spanTXT);
//											lc.columns[spanTXT]=obj;
//											that.attr("dl2","inited");
//										}
//										lc._draginit("#metric",param);
//										
//										//}
//										splitvd.push(jQuery("#metric div").eq(i).find("span").text());
//									}
//									//splitvd.push(spanTXT)
//								}
//								
//							});
							if(!jQuery(selected).find("span").hasClass("dl")){
								//如果不是度量选项，放到维度容器
								var elem = jQuery(selected);
								jQuery(selected).remove();
								jQuery("#dimension").append(elem);
								lc._draginit("#dimension",param);
								lc._draginit("#metric",param);
								jQuery("#dimension").trigger("ss-added");
							}else{
								//给span添加时间戳
								//if(-1 != splitvd.lastIndexOf(jQuery("#metric div").eq(i).find("span").text())){
								var that=jQuery(selected);
								if(that.find("span").attr("isbasic")!=undefined&&that.find("span").attr("isbasic")=="Y"){
									lc._draginit("#metric",param);
								}else{
									if(that.attr("dl2")!="inited"){
										var obj = clone(lc.columns[jQuery(selected).find("span").text()]);
										var spanTXT = that.attr("dl2") + new Date().getTime();
										obj.dbname=spanTXT;
										jQuery(selected).find("span").text(spanTXT);
										lc.columns[spanTXT]=obj;
										that.parent("div").attr("dl2","inited");
									}
									lc._draginit("#metric",param);
									
									//}
								}
								//splitvd.push(spanTXT)
							}
						});
						
					}
				});
			//jQuery(".target span").eq(0).trigger("click");
			jQuery(".bm").bind("dblclick",function(){
				jQuery(".bm").find("input").blur();
				var tableName = jQuery(this).text();
				jQuery(this).html("<input type='text' value='"+tableName+"'/>");
				jQuery(".bm input").val('').focus().val(tableName).blur(function(){
					jQuery(".bm").html(jQuery(this).val());
					jQuery(".target span.on").text(jQuery(this).val());
				});
				jQuery(".bm input").bind("keydown",function(e){
					var key = e.which;
					if(key == 13){
						jQuery(this).blur();
					}
				});
			});
			jQuery(".trash").bind("ss-added",function(e,selected){
				var key=jQuery(selected).find("span").text();
				if(lc.fields[key]!=undefined){
					var trans = {
							id: 1,
							command: lc.command,
							params: {
								cmd: "RptDef",
								type: "delTablecolumn",
								field:key,
								tbname:jQuery(".target .on").attr("tname")
							}
						};
						portalClient.sendOneRequest(trans, function(response){
							if(response.data[0].code!=0){
								alert(response.data[0].message);
								jQuery(".target").children("span.on").removeClass("on").trigger("click");
							}else{
								lc._savetabledef();
							}
						});
				}else{
				
				}
			});
			}
			jQuery('.metric').on("click",'div',function () {
				jQuery(".updatename input").blur();
				jQuery(".metric .ss-active-child").removeClass("selected");
				  jQuery(this).addClass("selected");
				  jQuery(".updatename").show();
				  jQuery(".updatename").find("input").val(jQuery(this).find("span").text());
				}).blur(function(){
					jQuery(this).removeClass("selected");
					jQuery(".updatename").hide();
				});
			jQuery('.updatename').on("blur",'input',function () {
				var dom=jQuery(".metric .selected").find("span");
				var key=dom.text();
				var obj = lc.columns[key];
				if(obj!=undefined){
					obj.dbname=jQuery(this).val();
					lc.columns[jQuery(this).val()]=obj;
					dom.html(jQuery(this).val());
				}
				});
			jQuery(".target").children("span").eq(0).trigger("click");
			lc._draginit(".trash",{autoHeight: false,colWidth: 50});
		},
		_savetabledef : function(){
			var columns = new Array();
			jQuery("#dimension div").each(function(i){
				var key=jQuery(this).find("span").text();
				lc.columns[key].type="dimension";
				columns.push(lc.columns[key]);
			});
			jQuery("#metric div").each(function(i){
				var key=jQuery(this).find("span").text();
				lc.columns[key].type="measure";
				columns.push(lc.columns[key]);
			});
			var dom=jQuery(".target .on");
			var tname=dom.attr("tname");
			var isview=false;
			if(dom.attr("type")=="view")isview=true;
			else isview=false;
			var table={
					name:tname,
					description:dom.text(),
					columns:columns
			};
			var trans = {
					id: 1,
					command: lc.command,
					params: {
						cmd: "RptDef",
						type: "saveTableDef",
						isview:isview,
						data:table
					}
				};
				portalClient.sendOneRequest(trans, function(response){
					alert(response.data[0].message);
					lc.init();
				});
		},
		_initdrag : function(param){
			lc._draginit("#dimension",param);
			lc._modifydes("#dimension");
			
			lc._draginit("#metric",param);
			lc._modifydes("#metric");
		},
		_modifydes : function(id){
			jQuery(id).on("dblclick","div",function(){
				jQuery(".ss-active-child").find("input").blur();
				var text = "",element = jQuery(this).find("span");
				jQuery(this).contents().each(function(){
					if(this.nodeType === 3){
					text += this.wholeText;
					}
				});
				if(text != "")this.text = text;
				jQuery(this).html("<input type='text' value='"+this.text+"' />");
				jQuery(id).find("input").val('').focus().val(this.text)
				.blur(function(){
					text = jQuery(this).val();
					lc.columns[element.text()].description=text;
					jQuery(this).parent().html(text).append(element);
				});
				jQuery(id).find("input").bind("keydown",function(e){
					var key = e.which;
					if (key == 13) {
						jQuery(this).blur();
					} 
				});
			});
		}

};
LoadgridControl.main = function() {
	portalClient = new PortalClient();
	//设置请求路径
	portalClient.init(null,null,"/servlets/binserv/Request");
	lc = new LoadgridControl();
	//获取数据
	//lc.receive();
};
jQuery(document).ready(LoadgridControl.main);