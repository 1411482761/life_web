var airviewc;

var AirViewControl = Class.create();
AirViewControl.prototype = {
	initialize : function() {
		this.sessionkey = new String();
		this.groups=new Array();
		this.map={};
		this.arr=[];
		this.javaData=null;
		this.userId=null;
		this.show_select_flag=true;
	},

	init : function(userId){
		
		//userId=894;
		
		jQuery("#loading").show();
		jQuery("#page").hide();
		
		//menu
		airviewc._initTree(userId,function(defUserId){
			airviewc.userId=defUserId;
			//下拉列表-赋值
			airviewc.loadSelect(function(response){
				var ftype=jQuery(".selectpicker_0 option:selected").val();
				var fyear=jQuery(".selectpicker_1 option:selected").val();
				var fseason=jQuery(".selectpicker_2 option:selected").val();
			//	console.info("init:defUserId:"+defUserId+",ftype："+ftype+",fyear:"+fyear+",fseason:"+fseason);
				//画第一张表格
				airviewc.loadGridSystem(defUserId,fyear,fseason,ftype);
				
				//画第二张表格
				airviewc.loadTabData(defUserId,fyear,fseason,ftype);
				
				jQuery(".first-tab-left").html(jQuery("#"+defUserId+" a:last").html());
				
				jQuery("#loading").hide();
				jQuery("#page").show();
			});
			
		});
	},
	
	/**
	 * 加载第一个表格  采用栅格系统 获取总数据
	 * @param userid	用户id
	 * @param fyear		年份
	 * @param fseason	季节
	 * @param ftype		分析类型
	 */
	loadGridSystem : function(userid,fyear,fseason,ftype){
		
		if(ftype == "type_all"){
			ftype=-1;
		}
		if(fseason == "season_all"){
			fseason=-1;
		}
		
		var trans = {
				id: 1,
				command: "com.agilecontrol.fair.MiscCmd",
				params: {
					cmd: "DynamicSql",
					sqlname: "corss_fair_analy_first_tab",
					params:[userid,userid,fyear,fseason,ftype]
				}
		};
		
		portalClient.sendOneRequest(trans,function(response){
			
			if(response.data[0].code != 0){
				alert(response.data[0].message);
			}else{
				var javaData=response.data[0].result.data;
				//console.info("**********");
				//console.info(javaData);
				if(javaData.length>0){
			
					var aa=[];
					for ( var int = 0; int < javaData[0].length; int++) {
						var data={};
						data[javaData[0][int]]=javaData[1][int];
						aa.push(data);
		        	}
									var first_tab="";
							        var mul_sm="";
							  
										var changeTextSize=0;
										for ( var i = 0; i < aa.length; i++) {
											first_tab+="<div class='visible-xs'>";
											for(var item in aa[i]){
												//亿位以上抹掉小数点
												var itemda=aa[i][item]+"";
												if(itemda.indexOf('.')>-1){
													if(itemda.split('.')[0].length>5)
														aa[i][item] = itemda.split(".")[0];
												}
												
												changeTextSize++;
												if(changeTextSize == 1 || changeTextSize == 2 || changeTextSize == 7 ){
													var md=1;
													var sm=1;
													var xs=4;
													first_tab+="<div class='col-md-"+md+" col-sm-"+sm+" col-xs-"+xs+" '><div class='row'><div class='col-xs-12 div-head'>"+item+"</div><div class='col-xs-12 div-data' id='gm-grid-textO'>"+aa[i][item]+"</div></div></div>";
												}else{
													var md=2;
													var sm=2;
													var xs=4;
													if(changeTextSize == 4 || changeTextSize == 5 || changeTextSize == 6 ){
														first_tab+="<div class='col-md-"+md+" col-sm-"+sm+" col-xs-"+xs+" '><div class='row'><div class='col-xs-12 div-head'>"+item+"</div><div class='col-xs-12 div-data' id='gm-grid-text1'>"+aa[i][item]+"</div></div></div>";
													}else{
														first_tab+="<div class='col-md-"+md+" col-sm-"+sm+" col-xs-"+xs+" '><div class='row'><div class='col-xs-12 div-head'>"+item+"</div><div class='col-xs-12 div-data' id='gm-grid-textO'>"+aa[i][item]+"</div></div></div>";
													}
												}
												
											}
											first_tab+="</div>";
										
										}
										
										if(javaData.length>0){
											mul_sm="<div class='hidden-xs'>";
											mul_sm+="<table class='table table-bordered table-condensed table-striped' id='first-table'>";
											mul_sm+="<thead><tr>";
											for ( var int = 0; int < javaData[0].length; int++) {
												mul_sm+="<th>"+javaData[0][int]+"</th>";
								        	}
											mul_sm+="</tr></thead>";
											
											mul_sm+="<tbody><tr>";
											for ( var int = 0; int < javaData[1].length; int++) {
												//亿位以上抹掉小数点
												var itemda=javaData[1][int]+"";
												
												if(int==3 || int==4 || int==5){
													if(itemda.indexOf('.')>-1){
														itemda=airviewc.fmoney(itemda,2);
														if(itemda.split('.')[0].length>6){
															javaData[1][int] = itemda.split(".")[0];
														}else{
															javaData[1][int] =itemda;
														}
													}
												}else{
													if(itemda.indexOf('.')>-1){
														if(itemda.split('.')[0].length>5)
															javaData[1][int] = itemda.split(".")[0];
													}
												}
												
												mul_sm+="<td>"+javaData[1][int]+"</td>";
								        	}
											mul_sm+="</tr></tbody>";
											
											mul_sm+="</table>";
											mul_sm+="</div>";
										}else{
											mul_sm="数据不存在!";
										}
										
									jQuery("#first-tab").html("");
									jQuery("#first-tab").append(first_tab);
									if(mul_sm != ""){
										jQuery("#first-tab").append(mul_sm);
									}
									
				}else{
					jQuery("#first-tab").html("");
					jQuery("#first-tab").append("数据不存在!");
				}
		
			}
		
		});
		
		//向后台发送请求 
		jQuery(".first-tab-right").html("<a href='#' onclick='airviewc.goRptViews("+userid+","+fyear+","+fseason+","+ftype+",-1)'><img alt='' style='padding-bottom: 5px;' src='/fair/ipad/img/view_next.png'>报表分析</a>");
		
	},
	
	/**
	 * 加载一览图详细数据表
	 * @param userid 用户id
	 * @param fyear	年份
	 * @param fseason 季节
	 * @param ftype 订货会类型
	 */
	loadTabData : function(userid,fyear,fseason,ftype){
		if(ftype == "type_all"){
			ftype=-1;
		}
		
		if(fseason == "season_all"){
			fseason=-1;
		}
			
			jQuery(".second-tab-left").show().html("详细数据");
			jQuery(".second-tab-right").show().html("(万元)");
			
			var trans = {
					id: 1,
					command: "com.agilecontrol.fair.MiscCmd",
					params: {
						cmd: "DynamicSql",
						sqlname: "corss_fair_analy_second_tab",
						params:[userid,userid,fyear,fseason,ftype]
					}
				};
			
			portalClient.sendOneRequest(trans,function(response){
			
							if(response.data[0].code != 0){
								alert(response.data[0].message);
							}else{
								var data= response.data[0].result.data;
								//console.info("loadTabData##############");
								//console.info(data);
								if(data.length>1){
									//Array.prototype.push.apply(head, javaData);  
									var tabHtml="<table class='table table-bordered table-condensed table-striped' id='second-tab'>";
					
									tabHtml+="<thead><tr>";
									for ( var i = 1; i < data[0].length; i++) {
										tabHtml+= "<th>"+data[0][i]+"</th>";
									}
									tabHtml+="</tr></thead>";
									
									tabHtml+="<tbody>";
									for ( var i = 1; i < data.length; i++) {
										tabHtml+="<tr>";
										for ( var j = 1; j < data[i].length; j++) {
											if(j==1){
												//tabHtml+="<td class='second_tab_text'><a href='#' onclick='airviewc.goRptViews("+userid+","+fyear+","+fseason+","+ftype+","+data[i][0]+")'>>>"+data[i][j]+"</a></td>";
												tabHtml+="<td class='second_tab_text'><a href='#' onclick='airviewc.goRptViews("+userid+","+fyear+","+fseason+","+ftype+","+data[i][0]+")'><img alt='' style='padding-bottom: 3px;' src='/fair/ipad/img/view_next.png'>"+data[i][j]+"</a></td>";
											}else{
												
												if(j==2){
													tabHtml+="<td class='second_tab_text'>"+data[i][j]+"</td>";
												}else if(j==3 || j==6){
													tabHtml+="<td class='second_tab_num'>"+data[i][j]+"</td>";
												}else{
													
													//亿位以上抹掉小数点
													var itemda=data[i][j]+"";
													if(itemda.indexOf('.')>-1){
														itemda=airviewc.fmoney(itemda,2);
														if(itemda.split('.')[0].length>6){
															data[i][j] = itemda.split(".")[0];
														}else{
															data[i][j] =itemda;
														}
															
													}
													
													tabHtml+="<td>"+data[i][j]+"</td>";
												}
											}
										}
										tabHtml+="</tr>";
									}
									tabHtml+="</tbody>";
							
									tabHtml+="</table>";
									
									jQuery(".table-responsive").html("");
									jQuery(".table-responsive").html(tabHtml);
									
							
									jQuery('#second-tab > thead tr').css({'background':'#e00000','color':'white','font-size':'14px'});
									jQuery('#second-tab > tbody tr').css({'background':'white','font-size':'16px',});
									jQuery('#second-tab > tbody tr:even').css({'background':'white'});
									jQuery('#second-tab > tbody tr:odd').css({'background':'rgb(253,145,145)','color':'white'});
								}else{
									//alert("详细数据为空！");
									jQuery(".table-responsive").html("");
									jQuery(".table-responsive").html("详细数据不存在！");
								}
							}
			});//data
	},
	
	//menu点击事件
	clickMenu : function(that,id,Pid){
		 
		jQuery("#loading").show();
		jQuery("#page").hide();
		
		 if(airviewc.map.hasOwnProperty(id)){
			   	var params = {
						name: "menu_users_agency",
						parameter: [["userid",id]]
				};
				
				runsql.callsql(params,function(response){
					if(response.data[0].code != 0){
						alert(response.data[0].message);
					}else{
						var javaData=response.data[0].result.data;
						var option_user=""; 
						if(javaData.length>1){
				    	   for ( var int = 0; int < javaData.length; int++) {
				    			   var data=javaData[int];
				    		  if(int == 0){
				    			  option_user+="<option value="+data.id+","+data.parent_id+">全部</option>";
				    			//  option_user+="<option value="+data.id+",-1>全部</option>";
				    		  }else{
				    			  option_user+="<option value="+data.id+","+data.parent_id+">"+data.truename+"</option>";
				    		  }
				    	   } 
				    	     jQuery(".selectpicker_user").html("");
				    		 jQuery(".general_select_u").show();
				    		 jQuery(".selectpicker_user").append(option_user);
						}else{
							console.info("javaData is null");
							jQuery(".general_select_u").hide();
							jQuery(".selectpicker_user").html("");
						}
					}
				});
		 }else{
			  jQuery(".general_select_u").hide();
			  jQuery(".selectpicker_user").html("");
		 }
		/**********************↑经销商↑**************************/
		 
		jQuery(".first-tab-left").html("");	
		var pidName="";
		if(Pid != null && Pid != 'null'){
			pidName=airviewc.loadIdName(Pid);
		}
		if(pidName!='undefined>'){
			jQuery(".first-tab-left").html(pidName+jQuery("#"+id+" a:last").html());		
		}else{
			jQuery(".first-tab-left").html(jQuery("#"+id+" a:last").html());	
		}
		
		airviewc.userId=id;
		var ftype=jQuery(".selectpicker_0 option:selected").val();
		var fyear=jQuery(".selectpicker_1 option:selected").val();
		var fseason=jQuery(".selectpicker_2 option:selected").val();
		
	//	console.info("clickMenu:userId:"+id+",ftype："+ftype+",fyear:"+fyear+",fseason:"+fseason);
		
		airviewc.loadGridSystem(id,fyear,fseason,ftype);
		airviewc.loadTabData(id,fyear,fseason,ftype);
		
		jQuery("#loading").hide();
		jQuery("#page").show();
	},
	
	loadIdName: function(id){
		var ret="";
		ret=jQuery("#"+id+" a:last").html()+">";
		var pid=jQuery("#"+id).attr("Pid");
		if(pid != null && pid != 'null' && pid!= 'undefined' && pid !=undefined){
			ret=this.loadIdName(pid)+ret;
		}
		return ret;
	},
	
	//下拉框change事件
	select : function(){
		jQuery("#loading").show();
		jQuery("#page").hide();
		
		var ftype=jQuery(".selectpicker_0 option:selected").val();
		var fyear=jQuery(".selectpicker_1 option:selected").val();
		var fseason=jQuery(".selectpicker_2 option:selected").val();
	//	console.info("select:userId:"+airviewc.userId+",ftype："+ftype+",fyear:"+fyear+",fseason:"+fseason);
		airviewc.loadGridSystem(airviewc.userId,fyear,fseason,ftype);
		airviewc.loadTabData(airviewc.userId,fyear,fseason,ftype);
		
		jQuery("#loading").hide();
		jQuery("#page").show();
	},
	
	/**
	 * 下拉列表--维度过滤  赋值
	 * @param callback  回调
	 */
	loadSelect : function(callback){
		
		airviewc._loadSelect("sqlite_fair_type",function(javaData){
			if(javaData.length>0){
				var html="<div class='form-group  col-sm-3'><label for='fair_type' class='sr-only'></label> <div class='input-group ' ><div class='input-group-addon'>订货会类型</div> <select id='fair_type' class='form-control selectpicker_0' onchange='airviewc.select();'>";
				html+="<option value='type_all' selected = 'selected'>全部</option>";
				for ( var k = 0; k < javaData.length; k++) {
						html+="<option value='"+javaData[k].id+"'>"+javaData[k].name+"</option>";
				}
				html+="</select></div></div>";
				
				jQuery("#general_select").append(html);
			}
		
			//年份  
			airviewc._loadSelect("sqlite_fair_year",function(javaData){
				var year=new Date().getFullYear();
				if(javaData.length>0){
					var html="<div class='form-group col-sm-3'><label class='sr-only'></label><div class='input-group  '><div class='input-group-addon'>年份</div> <select  class='form-control selectpicker_1' onchange='airviewc.select();'>";
					for ( var k = 0; k < javaData.length; k++) {
						if((javaData[k].name).indexOf(year)>-1){
							html+="<option value='"+javaData[k].id+"' selected = 'selected'>"+javaData[k].name+"</option>";
						}else{
							html+="<option value='"+javaData[k].id+"'>"+javaData[k].name+"</option>";
						}
					}
					html+="</select></div></div>";
					
					jQuery("#general_select").append(html);
				}
				
	
				//季度
				airviewc._loadSelect("sqlite_fair_season",function(javaData){
						if(javaData.length>0){
							var html="<div class='form-group col-sm-3'><label class='sr-only'></label><div class='input-group  '><div class='input-group-addon'>季度</div> <select class='form-control selectpicker_2' onchange='airviewc.select();'>";
							html+="<option value='season_all' selected = 'selected'>全部</option>";
							for ( var k = 0; k < javaData.length; k++) {
									html+="<option value='"+javaData[k].id+"'>"+javaData[k].name+"</option>";
							}
							html+="</select></div></div>";
							
							jQuery("#general_select").append(html);
						}
						
						callback(0);
					});
				
			});
		
		});
	},
	
	/**
	 * 获取下拉框数据
	 * @param sql_name 下拉框对应数据表
	 * @param callback  返回javaData数据
	 */
	_loadSelect : function(sql_name ,callback){
		var params = {
				type: "object",
				name: sql_name,
				parameter: []
		};
		
		runsql.callsql(params,function(response){
			if(response.data[0].code != 0){
				alert(response.data[0].message);
			}else{
				var javaData= response.data[0].result.data;
				callback(javaData);
			}
		});
	},
	
	_initTree : function(userid,callback){
		var params = {
				name: "menu_users",
				parameter: [["userid",userid]]
		};
		
		runsql.callsql(params,function(response){
			if(response.data[0].code != 0){
				alert(response.data[0].message);
			}else{
				airviewc.javaData= response.data[0].result.data;
				var javaData=airviewc.javaData;
				if(javaData.length>0){
					var menu=airviewc._firstLevel(javaData);
					jQuery("#menu").append(menu);
					airviewc.initKeyVal(javaData);
					
					airviewc._loadTree();
	
				}else{
					alert("用户组织未获取到任何数据！");
				}
		
				jQuery('nav#menu').mmenu({
					navbar:{ "title" :"晨光集团"},
				});
			
				//设置menu顶部图片
				//jQuery('.mm-title').html("").css({'background':'rgb(253,145,145)'});
				callback(javaData[0].id);
			}
		});
	},
	
	/**
	 * 遍历加载完整树
	 */
	_loadTree : function(){
		
			var count=0;
			var groups=airviewc.groups;
			
			var arrs=[];
			for ( var i = 0; i < groups.length; i++) {
			
				var group=groups[i];
				var menu=airviewc._otherLevel(airviewc.javaData,group);
				if(menu == ""){
					count++;
				}
				Array.prototype.push.apply(arrs, airviewc.arr);  
				//console.info(menu);
				jQuery("#"+group).append(menu);
			}
			if(count != groups.length){
				airviewc.groups=arrs;
				airviewc.initKeyVal(airviewc.javaData);
			
				this._loadTree();
			}

	},
	
	/**
	 * 过滤掉airviewc.groups中的重复值  存放的id
	 * @param str  单对象  
	 * @param array  airviewc.groups
	 */
	filterArray : function(str,array){
		var isnull = false; 
		if(str == "" || str == null || str == 'undefined'){ 
			isnull = true; 
		} 
		var newnum = 0; 
		var newarray = []; 
		var num = array.length; 
		if(num == 0){ 
			if(!isnull){ 
				newarray[num] = str; 
			} 
		}else{ 
			for(var m=0;m < num;m++){ 
				if(str == array[m]){ 
					break; 
				}else{ 
					newarray[newnum++] = array[m]; 
				} 
			} 
			if(!isnull){ 
				newarray[newnum++] = str; 
			} 
		} 
		airviewc.groups=newarray;
	},
	
	/**
	 * map中构造键值对
	 * @param javaData
	 */
	initKeyVal : function(javaData){
		airviewc.map={};
		for ( var j = 0; j < airviewc.groups.length; j++) {
			 //console.info(airviewc.groups[j]);
			 var obj="";
			 for ( var z = 0; z < javaData.length; z++) {
				if(airviewc.groups[j] == javaData[z].parent_id){
					obj+=javaData[z].id+",";
				}
			 }
			 if(obj.length>0){
				 obj= obj.substr(0 , obj.length-1);
			 }
			 airviewc.map[airviewc.groups[j]]=obj;
		 }
	},
	
	/**
	 * 返回指定id的对象
	 * @param javaData  后台数据
	 * @param arr  用户id
	 * @returns  单对象 or null 
	 */
	_loadObj : function(javaData,arr){
		for ( var i = 0; i < javaData.length; i++) {
			if(arr == javaData[i].id){
				return javaData[i];
			}
		}
		return null;
	},
	
	/**
	 * 返回构造树的首行数据
	 * @param javaData 后台数据
	 * @returns {String} 首level的数据
	 */
	_firstLevel : function(javaData){
		airviewc.groups=new Array();
		 var level=0;
		 if(javaData.length>0){
			 level=javaData[0].level;
		 }
		 var count=0;
		 for ( var i = 0; i < javaData.length; i++) {
			 if(javaData[i].level == level){
				 count++;
			 }
		 }
		    var menu="";
		    var num=0;
			for ( var i = 0; i < javaData.length; i++) {
				if(javaData[i].level == level){
					num++;
					if(num == 1){
						menu+="<ul>";
					}
					menu+="<li id="+javaData[i].id+"><a href='#' onclick='airviewc.clickMenu(this,"+javaData[i].id+",null);'>"+javaData[i].truename+"</a></li>";
					if(num == count){
						menu+="</ul>"; 
					}
				
					airviewc.filterArray(javaData[i].id,airviewc.groups);
				
				}
			}
			
			return menu;
	},
	
	/**
	 * 返回构造树的其他行数据
	 * @param javaData 后台数据
	 * @param group 指定父类id
	 * @returns {String}
	 */
	_otherLevel : function(javaData,group){
		airviewc.arr=[];
		var menu="";
		 if(airviewc.map.hasOwnProperty(group)){
		      
		       var arr= airviewc.map[group].split(",");
		    	   
		    	   for ( var int = 0; int < arr.length; int++) {
		    		   
		    		   var data= airviewc._loadObj(javaData,arr[int]);
		    		 //  console.info(data);
		    		   if(data != null){
		    			   if(int == 0){
		    				   menu+="<ul>"; 
		    			   }
		    			   menu+="<li id="+data.id+" Pid="+data.parent_id+"><a href='#' onclick='airviewc.clickMenu(this,"+data.id+","+data.parent_id+");'>"+data.truename+"</a></li>";
		    			   if(int == (arr.length-1)){
		    				   menu+="</ul>";
		    			   }
		    		   }
		    	   } 
		    	   airviewc.arr=arr;   
		  }
		 
		 return menu;
	},
	
	show_select_xs : function(){
		if(airviewc.show_select_flag){
			jQuery("#div_general_select").removeClass();
		}else{
			jQuery("#div_general_select").addClass("hidden-xs");
		}
		airviewc.show_select_flag=!airviewc.show_select_flag;
	},
	
	select_user : function(){
		
		var user=jQuery(".selectpicker_user option:selected").val();
		var name=jQuery(".selectpicker_user option:selected").html();
		var users=user.split(",");
		var id=users[0];
		var Pid=users[1];
		
		if(name == "全部"){
			airviewc.userId=id;
			airviewc.clickMenu(this,id,Pid);
		}else{
			jQuery(".first-tab-left").html("");	
			var pidName="";
			if(Pid != null && Pid != 'null'){
				pidName=airviewc.loadIdName(Pid);
			}
			jQuery(".first-tab-left").html(pidName+name);		
			
			airviewc.userId=id;
			var ftype=jQuery(".selectpicker_0 option:selected").val();
			var fyear=jQuery(".selectpicker_1 option:selected").val();
			var fseason=jQuery(".selectpicker_2 option:selected").val();
			
		//	console.info("select_user:userId:"+id+",ftype："+ftype+",fyear:"+fyear+",fseason:"+fseason);
			
			airviewc.loadGridSystem(id,fyear,fseason,ftype);
			airviewc.loadTabData(id,fyear,fseason,ftype);
		}
	},
	
	goRptViews : function(userid,fyear,fseason,ftype,fairid){
		//console.info("goRptViews:userId:"+userid+",ftype："+ftype+",fyear:"+fyear+",fseason:"+fseason+",fairid:"+fairid);
			var trans = {
					id: 1,
					command: "com.agilecontrol.fair.MiscCmd",
					params: {
						cmd: "setupAirView",
						params:{"userid":userid,"fyear":fyear,"fseason":fseason,"fairid":fairid}
					}
			};
			portalClient.sendOneRequest(trans,function(response){
				if(response.data[0].code != 0){
					alert(response.data[0].message);
				}else{
					window.location.replace("/fair/ipad/kpi.jsp?isback=Y&isacross=Y");
				}
			});
	},
	
	fmoney : function(s, n){
		   n = n > 0 && n <= 20 ? n : 2;   
		   s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";   
		   var l = s.split(".")[0].split("").reverse(),   
		   r = s.split(".")[1];   
		   t = "";   
		   for(var i = 0; i < l.length; i ++ )   
		   {   
		      t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");   
		   }   
		   return t.split("").reverse().join("") + "." + r;   
	}
	
};

AirViewControl.main = function() {
	portalClient = new PortalClient();
	portalClient.init(null, null, "/servlets/binserv/Fair");
	airviewc = new AirViewControl();
};
jQuery(document).ready(AirViewControl.main);
