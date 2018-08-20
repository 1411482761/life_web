var overviewc;

var OverViewControl = Class.create();
OverViewControl.prototype = {
	initialize : function() {
		this.sessionkey = new String();
		this.groups=new Array();
		this.map={};
		this.arr=[];
		this.javaData=null;
		this.userId=null;
		this.show_select_flag=true;
		this.count=0;
	},

	init : function(userId){
		//userId=894;
		
		jQuery("#loading").show();
		jQuery("#page").hide();
		
		//menu
		overviewc._initTree(userId,function(defUserId){
			//用defUserId 数据构造
			overviewc.userId=defUserId;
			
			//下拉列表-赋值
			overviewc.loadSelect(function(response){
				var ftype=jQuery(".selectpicker_0 option:selected").val();
				var fyear=jQuery(".selectpicker_1 option:selected").val();
				var fseason=jQuery(".selectpicker_2 option:selected").val();
			//	console.info("init:defUserId:"+defUserId+",ftype："+ftype+",fyear:"+fyear+",fseason:"+fseason);
				//画第一张表格
				overviewc.loadGridSystem(defUserId,fyear,fseason,ftype);
				
				//画第二张表格
				overviewc.loadTabData(defUserId,fyear,fseason,ftype);
				
				jQuery(".first-tab-left").html(jQuery("#"+defUserId+" a:last").html());
				jQuery(".first-tab-right").html("(万元)");
				
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
		var tabHeadName="";
		var tabname="";
	/*	if(ftype == "myself"){
			tabHeadName= "fair_rank_me1_head";
			tabname = "fair_rank_me1";
		}else if(ftype == "all"){
			tabHeadName= "fair_rank_all1_head";
			tabname = "fair_rank_all1";
		}*/
		if(ftype == "myself"){
			tabHeadName= "fair_rank_me1_head";
		}else if(ftype == "all"){
			tabHeadName= "fair_rank_all1_head";
		}
		
		
		if(ftype == "myself" && fseason=="season_all"){
			tabname = "fair_rank_seaAll_me1";
		}else if(ftype == "all" && fseason=="season_all"){
			tabname = "fair_rank_seaAll_all1";
		}else if(ftype == "myself" && fseason !="season_all"){
			tabname = "fair_rank_me1";
		}else if(ftype == "all" && fseason !="season_all"){
			tabname = "fair_rank_all1";
		}
	//	console.info("loadGridSystem--tabname:"+tabname);
		var params = {
				type: "array",
				name: tabHeadName,
				parameter: []
			};
		runsql.callsql(params,function(response){
			var param="";
			if(fseason=="season_all"){
				param=[["userid",userid],["fyear",fyear]];
			}else{
				param=[["userid",userid],["fyear",fyear],["fseason",fseason]];
			}
			if(response.data[0].code != 0){
				alert(response.data[0].message);
			}else{
				var head=response.data[0].result.data;
				if(head.length>0){
					var params_ = {
							type: "array",
							name: tabname,
							parameter: param
						};
						
					//	console.info("loadGridSystem:"+tabname+","+userid+","+fyear+","+fseason);
						
							runsql.callsql(params_,function(response){
								if(response.data[0].code != 0){
									alert(response.data[0].message);
								}else{
									var javaData= response.data[0].result.data;
									var aa=[];
							        
									if(javaData.length>0){
							      
							        	for ( var int = 0; int < head[0].length; int++) {
											var data={};
											data[head[0][int]]=javaData[0][int];
											aa.push(data);
							        	}
										
									}

									var first_tab="";
							        var mul_sm="";
							    	//单场
									if(ftype == "myself"){
									    var md=3;
										var sm=3;
										var xs=6;
										if(javaData.length>0){
											for ( var i = 0; i < aa.length; i++) {
												
												for(var item in aa[i]){
													//亿位以上抹掉小数点
													var itemda=aa[i][item]+"";
													if(itemda.indexOf('.')>-1){
														if(itemda.split(".")[0].length>5)
														  aa[i][item] = itemda.split(".")[0];
													}
													first_tab+="<div class='col-md-"+md+" col-sm-"+sm+" col-xs-"+xs+" '><div class='row'><div class='col-xs-12  div-head-single'>"+item+"</div><div class='col-xs-12  div-data-single'><span id='gm-grid-text'>"+aa[i][item]+"</span></div></div></div>";
												}
											}
										}else{
											first_tab="数据不存在！";
										}
										
									}//多场
									else if(ftype == "all"){
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
												//if(changeTextSize == 1 || changeTextSize == 7){
												if(changeTextSize == 4 || changeTextSize == 5 || changeTextSize == 6 ){
													var md=1;
													var sm=1;
													var xs=4;
													//if(changeTextSize == 1 ){
														first_tab+="<div class='col-md-"+md+" col-sm-"+sm+" col-xs-"+xs+" '><div class='row'><div class='col-xs-12 div-head'>"+item+"</div><div class='col-xs-12 div-data gm-grid-text1' id='gm-grid-text0'>"+aa[i][item]+"</div></div></div>";
													/*}else{
														first_tab+="<div class='col-md-"+md+" col-sm-"+sm+" col-xs-"+xs+" '><div class='row'><div class='col-xs-12 div-head '>"+item+"</div><div class='col-xs-12 div-data' >"+aa[i][item]+"</div></div></div>";
													}*/
												}else{
													var md=2;
													var sm=2;
													var xs=4;
													first_tab+="<div class='col-md-"+md+" col-sm-"+sm+" col-xs-"+xs+" '><div class='row'><div class='col-xs-12 div-head'>"+item+"</div><div class='col-xs-12 div-data' id='gm-grid-textO'>"+aa[i][item]+"</div></div></div>";
												}
												
											}
											first_tab+="</div>";
										
										}
										
										if(javaData.length>0){
											mul_sm="<div class='hidden-xs'>";
											mul_sm+="<table class='table table-bordered table-condensed table-striped' id='first-table'>";
											mul_sm+="<thead><tr>";
											for ( var int = 0; int < head[0].length; int++) {
												mul_sm+="<th>"+head[0][int]+"</th>";
								        	}
											mul_sm+="</tr></thead>";
											
											mul_sm+="<tbody><tr>";
											for ( var int = 0; int < javaData[0].length; int++) {
												//亿位以上抹掉小数点
												var itemda=javaData[0][int]+"";
												if(itemda.indexOf('.')>-1){
													if(itemda.split('.')[0].length>5)
														javaData[0][int] = itemda.split(".")[0];
												}
												
												mul_sm+="<td>"+javaData[0][int]+"</td>";
								        	}
											mul_sm+="</tr></tbody>";
											
											mul_sm+="</table>";
											mul_sm+="</div>";
										}else{
											mul_sm="数据不存在!";
										}
										
									}
									jQuery("#first-tab").html("");
									jQuery("#first-tab").append(first_tab);
									if(mul_sm != ""){
										jQuery("#first-tab").append(mul_sm);
									}
									
								}
							});
				}else{
					alert("表头无数据！");
				}
		
			}
		
		});

	},
	
	/**
	 * 加载一览图详细数据表
	 * @param userid 用户id
	 * @param fyear	年份
	 * @param fseason 季节
	 * @param ftype 订货会类型
	 */
	loadTabData : function(userid,fyear,fseason,ftype){
		if(ftype == "myself"){
			//tabname = "fair_rank_me2";
			jQuery(".second-tab-left").hide();
			jQuery(".second-tab-right").hide();
			jQuery(".table-responsive").hide();
			
		}else if(ftype == "all"){
			
			jQuery(".second-tab-left").show().html("详细数据");
			jQuery(".second-tab-right").show().html("(万元)");
			jQuery(".table-responsive").show();
			
			var params = {
					type: "array",
					name: "fair_rank_all2_head",
					parameter: []
			};
			
			runsql.callsql(params,function(response){
				var tabname="";
				if(fseason=="season_all"){
					tabname = "fair_rank_seaAll_all2";
				}else if(fseason !="season_all"){
					tabname = "fair_rank_all2";
				}
				
				var param="";
				if(fseason=="season_all"){
					param=[["userid",userid],["fyear",fyear]];
				}else{
					param=[["userid",userid],["fyear",fyear],["fseason",fseason]];
				}
				
				if(response.data[0].code != 0){
					alert(response.data[0].message);
				}else{
					var head=response.data[0].result.data;
					if(head.length>0){
						var params_ = {
								type: "array",
								name: tabname,
								parameter: param
						};
						
					//	console.info("loadTabData:"+tabname+","+userid+","+fyear+","+fseason);	
						
						runsql.callsql(params_,function(response){
							if(response.data[0].code != 0){
								alert(response.data[0].message);
							}else{
								var javaData= response.data[0].result.data;
							//	console.info("##############");
							//	console.info(javaData);
								if(javaData.length>0){
									Array.prototype.push.apply(head, javaData);  
									var data=head;
									var tabHtml="<table class='table table-bordered table-condensed table-striped' id='second-tab'>";
					
									tabHtml+="<thead><tr>";
									for ( var i = 0; i < data[0].length; i++) {
										tabHtml+= "<th>"+data[0][i]+"</th>";
									}
									tabHtml+="</tr></thead>";
									
									tabHtml+="<tbody>";
									for ( var i = 1; i < data.length; i++) {
										tabHtml+="<tr>";
										for ( var j = 0; j < data[i].length; j++) {
											
											//亿位以上抹掉小数点
											var itemda=data[i][j]+"";
											if(itemda.indexOf('.')>-1){
												if(itemda.split('.')[0].length>5)
													data[i][j] = itemda.split(".")[0];
											}
											
											tabHtml+="<td>"+data[i][j]+"</td>";
										}
										tabHtml+="</tr>";
									}
									tabHtml+="</tbody>";
							
									tabHtml+="</table>";
									
									//console.info(tabHtml);
									jQuery(".table-responsive").html("");
									jQuery(".table-responsive").html(tabHtml);
									
							
									jQuery('#second-tab > thead tr').css({'background':'#e00000','color':'white','font-size':'14px'});
									jQuery('#second-tab > tbody tr').css({'background':'white','font-size':'16px',});
									jQuery('#second-tab > tbody tr:even').css({'background':'white'});
									jQuery('#second-tab > tbody tr:odd').css({'background':'rgb(253,145,145)','color':'white'});
									jQuery('#second-tab > tbody tr:last').css({'background':'#e00000','color':'white'});
								}else{
									//alert("详细数据为空！");
									jQuery(".table-responsive").html("");
									jQuery(".table-responsive").html("详细数据不存在！");
								}
							}
						});//data
					}
					
				}
				
			});//head
		}
		
	},
	
	//menu点击事件
	clickMenu : function(that,id,Pid){
		 
		jQuery("#loading").show();
		jQuery("#page").hide();
		
		 if(overviewc.map.hasOwnProperty(id)){
			   	var params = {
						name: "menu_users_agency",
						parameter: [["userid",id]]
				};
				
				runsql.callsql(params,function(response){
					if(response.data[0].code != 0){
						alert(response.data[0].message);
					}else{
						/*overviewc.javaData= response.data[0].result.data;
						var javaData=overviewc.javaData;*/
						var javaData=response.data[0].result.data;
						var option_user=""; 
						if(javaData.length>1){
				    	   for ( var int = 0; int < javaData.length; int++) {
				    			   var data=javaData[int];
				    		  if(int == 0){
				    			  option_user+="<option value="+data.id+","+data.parent_id+">---请选择---</option>";
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
			pidName=overviewc.loadIdName(Pid);
		}
		if(pidName!='undefined->'){
			jQuery(".first-tab-left").html(pidName+jQuery("#"+id+" a:last").html());		
		}else{
			jQuery(".first-tab-left").html(jQuery("#"+id+" a:last").html());	
		}		
		
		overviewc.userId=id;
		var ftype=jQuery(".selectpicker_0 option:selected").val();
		var fyear=jQuery(".selectpicker_1 option:selected").val();
		var fseason=jQuery(".selectpicker_2 option:selected").val();
		overviewc.loadGridSystem(id,fyear,fseason,ftype);
		overviewc.loadTabData(id,fyear,fseason,ftype);
		
		jQuery("#loading").hide();
		jQuery("#page").show();
	},
	
	loadIdName: function(id){
		var ret="";
		ret=jQuery("#"+id+" a:last").html()+"->";
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
	
		overviewc.loadGridSystem(overviewc.userId,fyear,fseason,ftype);
		overviewc.loadTabData(overviewc.userId,fyear,fseason,ftype);
		
		jQuery("#loading").hide();
		jQuery("#page").show();
	},
	
	/**
	 * 下拉列表--维度过滤  赋值
	 * @param callback  回调
	 */
	loadSelect : function(callback){

		//分析类型 <div class='form-group col-sm-offset-2 col-sm-4'>   <div class='form-group col-sm-3'>
		var html="<div class='form-group  col-sm-3'><label for='fair_type' class='sr-only'></label> <div class='input-group ' ><div class='input-group-addon'>分析类型</div> <select id='fair_type' class='form-control selectpicker_0' onchange='overviewc.select();'>";
		html+="<option value='myself'>我自己</option><option value='all'>所辖下属</option>";
		html+="</select></div></div>";
		jQuery("#general_select").append(html);
		
		//年份  
		overviewc._loadSelect("sqlite_fair_year",function(javaData){
			var year=new Date().getFullYear();
			if(javaData.length>0){
				var html="<div class='form-group col-sm-3'><label class='sr-only'></label><div class='input-group  '><div class='input-group-addon'>年份</div> <select  class='form-control selectpicker_1' onchange='overviewc.select();'>";
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
			overviewc._loadSelect("sqlite_fair_season",function(javaData){
					if(javaData.length>0){
						var html="<div class='form-group col-sm-3'><label class='sr-only'></label><div class='input-group  '><div class='input-group-addon'>季度</div> <select class='form-control selectpicker_2' onchange='overviewc.select();'>";
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
				overviewc.javaData= response.data[0].result.data;
				var javaData=overviewc.javaData;
				if(javaData.length>0){
					var menu=overviewc._firstLevel(javaData);
					jQuery("#menu").append(menu);
					overviewc.initKeyVal(javaData);
					
					overviewc.count=0;
					overviewc._loadTree();
	
				}else{
					alert("用户组织未获取到任何数据！");
				}
		
				jQuery('nav#menu').mmenu({
					 // options
					navbar:{ "title" :"晨光集团"},
				},{
					// configuration
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
		overviewc.count++;
		
	//	if(overviewc.count < 2){
			var count=0;
			var groups=overviewc.groups;
			
			var arrs=[];
			for ( var i = 0; i < groups.length; i++) {
			
				var group=groups[i];
				var menu=overviewc._otherLevel(overviewc.javaData,group);
				if(menu == ""){
					count++;
				}
				Array.prototype.push.apply(arrs, overviewc.arr);  
				//console.info(menu);
				jQuery("#"+group).append(menu);
			}
			
			if(count != groups.length){
				overviewc.groups=arrs;
				overviewc.initKeyVal(overviewc.javaData);
			
				this._loadTree();
			}
	//	}

		
	},
	
	/**
	 * 过滤掉overviewc.groups中的重复值  存放的id
	 * @param str  单对象  
	 * @param array  overviewc.groups
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
		overviewc.groups=newarray;
	},
	
	/**
	 * map中构造键值对
	 * @param javaData
	 */
	initKeyVal : function(javaData){
		overviewc.map={};
		for ( var j = 0; j < overviewc.groups.length; j++) {
			 //console.info(overviewc.groups[j]);
			 var obj="";
			 for ( var z = 0; z < javaData.length; z++) {
				if(overviewc.groups[j] == javaData[z].parent_id){
					obj+=javaData[z].id+",";
				}
			 }
			 if(obj.length>0){
				 obj= obj.substr(0 , obj.length-1);
			 }
			 overviewc.map[overviewc.groups[j]]=obj;
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
		overviewc.groups=new Array();
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
					//如果是第一级 父id为空
					//menu+="<li id="+javaData[i].id+" Pid="+javaData[i].parent_id+"><a href='#' onclick='overviewc.clickMenu(this,"+javaData[i].id+","+javaData[i].parent_id+");'>"+javaData[i].truename+"</a></li>";
					menu+="<li id="+javaData[i].id+"><a href='#' onclick='overviewc.clickMenu(this,"+javaData[i].id+",null);'>"+javaData[i].truename+"</a></li>";
					if(num == count){
						menu+="</ul>";
					}
				
					overviewc.filterArray(javaData[i].id,overviewc.groups);
				
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
		overviewc.arr=[];
		var menu="";
		 if(overviewc.map.hasOwnProperty(group)){
		      
		       var arr= overviewc.map[group].split(",");
		    	   
		    	   for ( var int = 0; int < arr.length; int++) {
		    		   
		    		   var data= overviewc._loadObj(javaData,arr[int]);
		    		 //  console.info(data);
		    		   if(data != null){
		    			   if(int == 0){
		    				   menu+="<ul>"; 
		    			   }
		    			   menu+="<li id="+data.id+" Pid="+data.parent_id+"><a href='#' onclick='overviewc.clickMenu(this,"+data.id+","+data.parent_id+");'>"+data.truename+"</a></li>";
		    			   if(int == (arr.length-1)){
		    				   menu+="</ul>";
		    			   }
		    		   }
		    	   } 
		    	   overviewc.arr=arr;   
		  }
		 
		 return menu;
	},
	
	show_select_xs : function(){
		if(overviewc.show_select_flag){
			jQuery("#div_general_select").removeClass();
		}else{
			jQuery("#div_general_select").addClass("hidden-xs");
		}
		overviewc.show_select_flag=!overviewc.show_select_flag;
	},
	
	select_user : function(){
		
		var user=jQuery(".selectpicker_user option:selected").val();
		var name=jQuery(".selectpicker_user option:selected").html();
		var users=user.split(",");
		var id=users[0];
		var Pid=users[1];
		
		if(name == "---请选择---"){
			overviewc.userId=id;
			overviewc.clickMenu(this,id,Pid);
		}else{
			jQuery(".first-tab-left").html("");	
			var pidName="";
			if(Pid != null && Pid != 'null'){
				pidName=overviewc.loadIdName(Pid);
			}
			jQuery(".first-tab-left").html(pidName+name);		
			
			overviewc.userId=id;
			var ftype=jQuery(".selectpicker_0 option:selected").val();
			var fyear=jQuery(".selectpicker_1 option:selected").val();
			var fseason=jQuery(".selectpicker_2 option:selected").val();
			overviewc.loadGridSystem(id,fyear,fseason,ftype);
			overviewc.loadTabData(id,fyear,fseason,ftype);
		}
	}
	
};

OverViewControl.main = function() {
	portalClient = new PortalClient();
	portalClient.init(null, null, "/servlets/binserv/Fair");
	overviewc = new OverViewControl();
};
jQuery(document).ready(OverViewControl.main);
