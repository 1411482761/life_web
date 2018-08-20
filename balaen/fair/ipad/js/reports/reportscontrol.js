/**

* CopyRright (c)2011: lifecycle

* Project: Ordering - Board

* Comments:  to show the KPIs

* Create Date：2012-01-09

	@version: 1.0
	@since: portal5.0 jQuery1.7.1 prototype1.5.1.2 highCharts2.1.9 jquery-ui-1.8
	@author: cico

*/

var rc;
var ReportsControl = Class.create();
ReportsControl.prototype = {
	/**
	 * Description : to define parameter
	 *
	 * @type private
	 * */
	initialize : function() {
		this.debug = false;
		this.filter = false;
		this.updateKpi = Boolean;
		this.sessionkey = new String();
		this.noticeColor = new Hash();
		this.tableColor = new Hash();
		this.tableTrColor = new Hash();
		this.rpt = new Hash();
		this.rptFF = new Hash();
		this.rptOpt = new Hash();
		this.filterid = -1;
		this.bfilterid = -1;
		this.fType = null;
		this.actived = -1;
		this.rptviews=new Array();
		this.sigleJavaData = new Array();
		this.isMgrRpt = false;
		this.chartsColors = Highcharts.getOptions().colors;
		this.theme = "01";
		this.storeid = undefined;
		this.showtable="Y";
		this._init();
		this.tag_index = 0;
		this.dragscreen = jQuery("#dragscreen");
		this.width = jQuery(document).width();
		this.height = jQuery(document).height();
		this.isNotPad = navigator.userAgent.indexOf('iPad') == -1;
	},

	_init : function(){
		this.updateKpi = true;
//		this.rpt["rpt-filter"] = true;
		this.noticeColor["planning"]='#4572A7';
		this.noticeColor["var"]='#aaeeee';
		this.noticeColor["g"] = '#A2BE67';
		this.noticeColor["y"] = '#DB843D';
		this.noticeColor["r"] = '#AA4643';
		this.tableColor["g"] = '#00ff00';
		this.tableColor["y"] = '#ffff00';
		this.tableColor["r"] = '#ff0000';
		this.tableColor["t"] = 'transparent';
		this.tableTrColor["A"] = "#C0504D";
		this.tableTrColor["B"] = "#9E5921";
		this.tableTrColor["C"] = "#025B44";
		this.tableTrColor["D"] = "#8064A2";
		this.tableTrColor["E"] = "#C0504D";
		this.tableTrColor["N"] = "transparent";
		this.tableTrColor["active"] = "#3A3A3A";
	},
	abandonzero : function(str){
		if(str-0<0.01) str="";
			return str;
		},
	cFilter : function(DOM,type){
		this.fType = type;
		if("pdt" == type){
			window.location.replace("http://search.fair.app");
		}else{
			window.location.replace("http://buyer.fair.app");
		}
	},

	cDebug : function(DOM){
		window.location.reload();
	},

	saveBill : function(){
		jQuery("#views-loading").show();
		jQuery("#views").show();
		window.location.replace("/fair/ipad/orderdetails.jsp?jumped=Y&sessionkey="+this.sessionkey);
	},
	jumpRpt : function(referTo,name,locale,desc,allow_filter,allow_f_filter,isback){
		if(referTo=='view900')
			window.location.replace("/fair/ipad/rpt.jsp?sessionkey="+this.sessionkey+"&name="+name+"&locale="+locale+"&theme="+rc.theme+"&desc="+desc+"&allow_filter="+allow_filter+"&allow_f_filter="+allow_f_filter+"&isback="+isback);
		else if(referTo=='view901')
			window.location.replace("/fair/ipad/report/graphical_rpt.jsp?sessionkey="+this.sessionkey+"&name="+name+"&locale="+locale+"&theme="+rc.theme+"&desc="+desc+"&allow_filter="+allow_filter+"&allow_f_filter="+allow_f_filter+"&isback="+isback);
		else
			alert("error!");
	},

	isInArray : function(a,arr){
		if(arr!=undefined&&arr.length>0){
			for ( var i = 0; i < arr.length; i++){
				if (arr[i] == a)
					return true;
			}return false;
		}else return false;
	},

	handleArray : function(arr1,arr2){
		var tem=new Array();
			for(var i=0;i<arr1.length;i++){
				if(!rc.isInArray(i,arr2))tem.push(arr1[i]);
			}
        	return tem;
	},

	removeColumns : function(arr1,arr2){
		var tem=new Array();
		for(var i=0;i<arr2.length;i++){
			for(var j=0;j<arr1[0].length;j++){
				var tem1=arr2[i][0],tem2=rc.getColsIndex(arr2[i][1],arr1[tem1]);
				 for(var m=0;m<tem2.length;m++){
					 if(!rc.isInArray(tem2[m],tem))tem.push(tem2[m]);
				 }

			}
		}
		return tem;
	},
	getNewHeader : function(javaData,columns){
		var flag = 0; flag1 = 0;
		var newHeader = new Array();
		for ( var p = 0; p < javaData.length; p++) {
			var temp=javaData[p];
			var arr1 = new Array();
			var temp1={
					name:temp.name,
					colspan:temp.colspan,
					subheader:temp.subheader
			};
			if(flag1 < columns.length){/* 没删除完 */
				for ( var m = 0; m < columns.length; m++) {
					if(temp1.subheader == undefined){
						if(flag != columns[flag1]){
							newHeader.push(temp1);
						}else{
							flag1 ++;
						}
						flag ++;
						break;
					}else{
						var rel = columns[flag1] - flag;
							if(rel<temp1.subheader.length){
								arr1.push(rel );
								temp1.colspan --;
								if(flag1+1 < columns.length)
								{
									flag1 ++;
								}else{
									if(arr1.length>0){
										temp1.subheader=rc.handleArray(temp1.subheader,arr1);
									}
									flag +=temp1.colspan+arr1.length;
									flag1 ++;
									if(temp1.colspan>0)
									newHeader.push(temp1);
									break;
								}
								continue;
							}else{
								if(arr1.length>0){
									temp1.subheader=rc.handleArray(temp1.subheader,arr1);
								}
								flag +=temp1.colspan+arr1.length;
								newHeader.push(temp1);
								break;
							}
							newHeader.push(temp1);
					}
				}
			}else{newHeader.push(temp);}
		}
		return newHeader;
	},
	getColsIndex : function(a,arr){
		var tem=new Array();
		for ( var i = 0; i < arr.length; i++){
			if (arr[i] == a)
				tem.push(i);
		}
		return tem;
	},
	/**
	 * Description : to define init params for charts.
	 *
	 * type : private
	 * */
	_defaultOptions : function(){
		var options = "";
		if(rc.isNotPad && rc.width < 768){
			var color = '#FFFFFF';
			if(theme.labelFontColor != undefined)
				color = theme.labelFontColor;
			options = {
					chart: {
						borderRadius: 0
					},
					credits: {enabled: false},
					subtitle: {text: ' '},
					plotOptions: {
						series: {
							point: {events: {click: null}}
						},
						column: {
							pointPadding: 0.2,
							borderWidth: 0,
							dataLabels: {
								enabled: true,
								color: color,
								formatter: function() {
									return this.point.actual;
								},
								style: {font: 'normal 8px Verdana, sans-serif'}
							}
						},
						spline: {
							dataLabels: {
								enabled: true,
								color: color,
								formatter: function() {
									return this.point.actual;
								},
								style: {font: 'normal 8px Verdana, sans-serif'}
							}
						},
						pie: {
							allowPointSelect: true,
							size: "50%",
							dataLabels: {
								staggerLines : "n",
								distance: 8,
								formatter: function() {
									return this.point.name+": "+ this.percentage.toFixed(2) +' %';
								},
								style: {font: 'normal 8px Verdana, sans-serif'},
								color: color
							}
						}
					}
			};
		}else{
			var color = '#FFFFFF';
			if(theme.labelFontColor != undefined)
				color = theme.labelFontColor;
			options = {
					chart: {
						borderRadius: 0
					},
					credits: {enabled: false},
					subtitle: {text: ' '},
					plotOptions: {
						series: {
							point: {events: {click: null}}
						},
						column: {
							pointPadding: 0.2,
							borderWidth: 0,
							dataLabels: {
								enabled: true,
								color: color,
								formatter: function() {
									return this.point.actual;
								},
								style: {font: 'normal 12px Verdana, sans-serif'}
							}
						},
						spline: {
							dataLabels: {
								enabled: true,
								color: color,
								formatter: function() {
									return this.point.actual;
								},
								style: {font: 'normal 12px Verdana, sans-serif'}
							}
						},
						pie: {
							allowPointSelect: true,
							dataLabels: {
								staggerLines : "n",
								formatter: function() {
									return this.point.name+": "+ this.percentage.toFixed(2) +' %';
								},
								style: {font: 'normal 12px Verdana, sans-serif'},
								color: color
							}
						}
					}
			};
		}
		if(theme.background != undefined)
			options.chart.backgroundColor = theme.background;
		return options;
	},
	/**
	 * Description :如果table的列数超过某个值是，则设置class nowap属性
	 * @param DOM
	 */
	 tablecontrol : function(){
		 jQuery("table").addClass("nowap");
	 },
	_outLine : function(viewname, isoutline){
		return isoutline ? "<span style='font-weight: bold;'>"+viewname+"</span>": viewname;
	},

	/**
	 * Description : 控制过滤条件
	 */
	_synFilterDef : function(view){
		if(view.allow_filter != undefined){
			this.filter = true;
			this.rpt[view.name] = view.allow_filter;
		}
		if(view.allow_f_filter != undefined){
			this.filter = true;
			this.rptFF[view.name] = view.allow_f_filter;
		}
	},

	/**
	 * 对每一份报表初始化过滤条件。
	 */
	initFilter : function(viewport){
		jQuery(".rc-filter").hide();
		if(rc.rpt[viewport] == "Y"){
			jQuery(".rc-filter").show();
			jQuery("#c-filter").show();
		}else{
			jQuery("#c-filter").hide();
		}
		if(rc.rptFF[viewport] == "Y"){
			jQuery(".rc-filter").show();
			jQuery("#f-filter").show();
		}else{
			jQuery("#f-filter").hide();
		}
		jQuery("#controltable").remove();
		jQuery("#hidecolumns").remove();
		jQuery("<li id='hidecolumns' onclick="+rc._getViewObjectStr()+"._controlbutton() style='display:none;'></li><li id='controltable' onclick=view00"+rc.actived+"c.controlbutton() style='display:none;'></li>").appendTo("#kpi-filter");
	},

	/**
	 * Description : to import js & css file dynamically and create DOM elements.
	 *
	 * type : private
	 * */
    /* 2018-5-3 指标达成报表 修改 */
    generateViews : function(sessionkey,storeid,pdtid,isback,isacross,isMgrRpt,showTopBar,index,isKpi2){
        this.isMgrRpt = isMgrRpt;
		this.sessionkey = sessionkey;
		this.storeid = storeid;
		if(this.debug)
			jQuery("#kpi-debug").show();
		var params={cmd:"LoadRptViews",sessionkey:sessionkey,isacross:isacross};
		var trans={id:1, command:"com.agilecontrol.fair.FairCmd",params:params};
		portalClient.sendOneRequest(trans, function(response){
			var javaData= response.data[0].result;
            this.cacheData = javaData;
			rc.sigleJavaData = javaData;
			if(javaData.theme != undefined)
				rc.theme = javaData.theme;
				rc.showtable=javaData.showtable;
			jQuery("<link rel='stylesheet' href='/fair/ipad/css/"+ rc.theme +"/main.css' type='text/css' media='screen' title='no title' charset='utf-8'>").appendTo(jQuery("head"));
			jQuery("<link rel='stylesheet' href='/fair/ipad/css/"+ rc.theme +"/reports/kpicard.css' type='text/css' media='screen' title='no title' charset='utf-8'>").appendTo(jQuery("head"));
			jQuery("<script language='javascript' src='/fair/ipad/js/locale/locale_"+ javaData.locale +".js' charset='utf-8'></script>").appendTo(jQuery("head"));
			var ma = VIEWS_LOCALE.main;
			jQuery("#views-loadinglocale").html(ma.loading);
			jQuery("#mainpage-portal-desc").html(ma.portal);
			jQuery("#views-noresult").html(ma.noResult);
			if (javaData.title!= undefined && javaData.title!= null && javaData.title!= "") {
				jQuery("#mainpage-title").html(javaData.title);
			}else{
				jQuery("#mainpage-title").html(ma.title);
			}
			jQuery("#footer-left").html(ma.footer_left);
			jQuery("#footer-right").html(ma.footer_right);
			jQuery("#rank").html(VIEWS_LOCALE.rank.desc);
			jQuery("#c-filter").html(ma.ipadfilter);
			jQuery("#df-filter-button").html(ma.search);
			jQuery("#f-filter").html(ma.f_filter);
			if(rc.theme != undefined){
				jQuery("<script language='javascript' src='/fair/ipad/js/reports/themes/"+rc.theme+".js' charset='gbk'></script>").appendTo(jQuery("head"));
			}else{
				jQuery("<script language='javascript' src='/fair/ipad/js/highcharts/gray.js' charset='gbk'></script>").appendTo(jQuery("head"));
			}

			if(javaData.tags != undefined){
				var tags = javaData.tags;
				for(var i = 0 ; i < tags.length ; i++){
					var li = jQuery("<li>"+tags[i].name+"</li>").appendTo(".kpi-banner>ul");
					if(i == 0){
						li.addClass("selected");
					}
				}
				jQuery(".kpi-banner>ul>li").each(function(index){
					jQuery(this).click(function(){
						jQuery(".kpi-banner>ul>li").removeClass("selected");
						jQuery(this).addClass("selected");
						rc.tag_index = index;
						rc._generateViews(javaData);
					});
				});
			}

			if(javaData.meta != undefined){
				var iterator2,
				ports = 0,
				iterator = javaData.meta,
				ul = jQuery("#viewports ul");
				jQuery("<link rel='stylesheet' href='/fair/ipad/css/common/reports/reports.css' type='text/css' media='screen' title='no title' charset='utf-8'>").appendTo(jQuery("head"));
				jQuery("<link rel='stylesheet' href='/fair/ipad/css/"+ rc.theme +"/reports/reports.css' type='text/css' media='screen' title='no title' charset='utf-8'>").appendTo(jQuery("head"));
				for ( var i = 0; i < iterator.length; i++) {
					if(iterator[i].pageurl!="" &&iterator[i].pageurl!=undefined&&iterator[i].pageurl!=null&&iterator[i].pageurl!="null"){
						continue;
					}
					if(iterator[i].referTo=="view900") continue;
					jQuery("<link rel='stylesheet' href='/fair/ipad/css/common/reports/views/"+iterator[i].referTo+".css' type='text/css' media='screen' title='no title' charset='utf-8'>").appendTo(jQuery("head"));
					jQuery("<link rel='stylesheet' href='/fair/ipad/css/"+ rc.theme +"/reports/views/"+iterator[i].referTo+".css' type='text/css' media='screen' title='no title' charset='utf-8'>").appendTo(jQuery("head"));
					jQuery("<script language='javascript' src='/fair/ipad/js/reports/views/"+iterator[i].referTo+"control.js' charset='gbk'></script>").appendTo(jQuery("head"));
					iterator2 = iterator[i].views;
					rc.rptviews = iterator[i].views;
					for ( var j = 0; j < iterator2.length; j++) {
						rc._synFilterDef(iterator2[j]);
						rc.rptOpt[iterator2[j].name] = iterator2[j].opt;
						ports++;
						ul.append(jQuery("<li onclick="+iterator[i].referTo+"c.getActived('"+iterator2[j].name+"',"+j+");><div class='bgcolor'><div class='bgimg'></div></div><div class='viewtype-notice'><div class='viewtype-name'>"+iterator2[j].desc+"</div></div></li>"));
					}
				}
				jQuery("<link rel='stylesheet' href='/fair/ipad/css/common/reports/ports/port"+(ports>4?6:4)+".css' type='text/css' media='screen' title='no title' charset='utf-8'>").appendTo(jQuery("head"));
				jQuery("<link rel='stylesheet' href='/fair/ipad/css/"+ rc.theme +"/reports/ports/port"+(ports>4?6:4)+".css' type='text/css' media='screen' title='no title' charset='utf-8'>").appendTo(jQuery("head"));

			}else{
				if(rc.isNotPad && rc.width < 768){
						jQuery("<link rel='stylesheet' href='/fair/ipad/css/common/reports/reports.1.3_adaptation.css' type='text/css' media='screen' title='no title' charset='utf-8'>").appendTo(jQuery("head"));
						jQuery("#viewtype").css("width",rc.width);
						jQuery("#viewtype").css("height",rc.height);
						jQuery.debug = true;
						jQuery(".kpi-banner").css("width",rc.width);
						jQuery(".kpi-title").css("width",rc.width);
						jQuery("#views").css("width",rc.width);
						jQuery("#container").css("width",rc.width);
						jQuery(".viewport").css("width",rc.width);
						jQuery("#viewtype").css("height",rc.height);
						jQuery("<link rel='stylesheet' href='/fair/ipad/css/"+ rc.theme +"/reports/reports.1.3_adaptation.css' type='text/css' media='screen' title='no title' charset='utf-8'>").appendTo(jQuery("head"));
				}else{
					jQuery("<link rel='stylesheet' href='/fair/ipad/css/common/reports/reports.1.3.css' type='text/css' media='screen' title='no title' charset='utf-8'>").appendTo(jQuery("head"));
					jQuery("<link rel='stylesheet' href='/fair/ipad/css/"+ rc.theme +"/reports/reports.1.3.css' type='text/css' media='screen' title='no title' charset='utf-8'>").appendTo(jQuery("head"));
				}
				rc._generateViews(javaData,isback);
				ports = new Hash();
				iterator = javaData.views;
				for ( var i = 0; i < iterator.length; i++) {
					ports[iterator[i].referTo] = 1;
				}

                iterator = ports.keys();
				for ( var i = 0; i < iterator.length; i++) {
					if(iterator[i].pageurl!="" &&iterator[i].pageurl!=undefined&&iterator[i].pageurl!=null&&iterator[i].pageurl!="null"){
						continue;
					}
					if(iterator[i]=="view900") continue;
					if(rc.isNotPad && rc.width < 768){
							jQuery("<link rel='stylesheet' href='/fair/ipad/css/common/reports/views/"+iterator[i]+"_adaptation.css' type='text/css' media='screen' title='no title' charset='utf-8'>").appendTo(jQuery("head"));
							jQuery("<link rel='stylesheet' href='/fair/ipad/css/"+ rc.theme +"/reports/views/"+iterator[i]+"_adaptation.css' type='text/css' media='screen' title='no title' charset='utf-8'>").appendTo(jQuery("head"));
					}else{
						jQuery("<link rel='stylesheet' href='/fair/ipad/css/common/reports/views/"+iterator[i]+".css' type='text/css' media='screen' title='no title' charset='utf-8'>").appendTo(jQuery("head"));
						jQuery("<link rel='stylesheet' href='/fair/ipad/css/"+ rc.theme +"/reports/views/"+iterator[i]+".css' type='text/css' media='screen' title='no title' charset='utf-8'>").appendTo(jQuery("head"));
					}
					jQuery("<script language='javascript' src='/fair/ipad/js/reports/views/"+iterator[i]+"control.js' charset='gbk'></script>").appendTo(jQuery("head"));
				}
			}
			/* 2018-5-3 指标达成报表 添加 */
            if(isKpi2 == true){//是从kpi2.jsp 页面跳转过来的
                if(showTopBar !=null && showTopBar != undefined &&showTopBar!= "" && showTopBar!= 'null'){
                    jQuery("#viewtype").hide();
                    if(this.cacheData !=null && this.cacheData != undefined && this.cacheData != "" && this.cacheData != 'null'){
                        doJump(index,isback);
                    }
                }
            }
		});
	},

	_generateViews : function(javaData,isback){
		var ul = jQuery("#viewports ul"),
		iterator = javaData.views;
		ul.find("li").remove();
		if(javaData.tags != null){
			iterator = javaData.tags[rc.tag_index].views;
		}
		if(iterator != undefined){
			rc.rptviews = javaData.views;
			for ( var i = 0; i < iterator.length; i++) {
				rc._synFilterDef(iterator[i]);
				rc.rptOpt[iterator[i].name] = iterator[i].opt;
				if(iterator[i].pageurl!="" &&iterator[i].pageurl!=undefined&&iterator[i].pageurl!=null&&iterator[i].pageurl!="null"){
					ul.append("<li onclick=window.location.replace('"+iterator[i].pageurl+"#/"+this.sessionkey+"')><div class='bgcolor'><div class='bgimg' style='background: url(/fair/ipad/img/o.png);'></div></div><div class='views-name'>"+iterator[i].desc+"</div></li>");
				}else{
					if(parseInt(iterator[i].referTo.substring(4)) >= 900){
						ul.append("<li onclick=rc.jumpRpt('"+iterator[i].referTo+"','"+iterator[i].name+"','"+javaData.locale+"','"+iterator[i].desc+"','"+iterator[i].allow_filter+"','"+iterator[i].allow_f_filter+"','"+isback+"');><div class='bgcolor'><div class='bgimg' style='background: url("+iterator[i].img+
								");'></div></div><div class='views-name'>"+(rc._outLine(iterator[i].desc, "Y" == iterator[i].isoutline))+"</div></li>");
					}else{
						if(rc.isNotPad && rc.width < 768){
							
							if(iterator[i].referTo=="showexcel"){
								ul.append("<li onclick=window.location.replace('http://pdf.fair.app/#"+iterator[i].src+"')><div class='bgcolor'><div class='bgimg' style='background: url(/fair/ipad/img/o.png);'></div></div><div class='views-name'>"+iterator[i].desc+"</div></li>");
							}else{
								ul.append("<li onclick="+iterator[i].referTo+"c.getActived('"+iterator[i].name+"',"+i+");><div class='bgcolor'><div class='bgimg' style='background: url("+iterator[i].img+
										");background-size:130px,100px; '></div></div><div class='views-name'>"+(rc._outLine(iterator[i].desc, "Y" == iterator[i].isoutline))+"</div></li>");
							}
						}else{
							if(iterator[i].referTo=="showexcel"){
								ul.append("<li onclick=window.location.replace('http://pdf.fair.app/#"+iterator[i].src+"')><div class='bgcolor'><div class='bgimg' style='background: url(/fair/ipad/img/o.png);'></div></div><div class='views-name'>"+iterator[i].desc+"</div></li>");
							}else{
								ul.append("<li onclick="+iterator[i].referTo+"c.getActived('"+iterator[i].name+"',"+i+");><div class='bgcolor'><div class='bgimg' style='background: url("+iterator[i].img+
										");'></div></div><div class='views-name'>"+(rc._outLine(iterator[i].desc, "Y" == iterator[i].isoutline))+"</div></li>");
							}
						}
						
					}
				}
		}
		}
		if(javaData.savebill != undefined){
        	var ul = jQuery("#viewports ul");
            ul.append("<li onclick=rc.saveBill();><div class='bgcolor'><div class='bgimg' style='background: url(/fair/ipad/img/"+rc.theme+"/s.png);'></div></div><div class='views-name'>"+javaData.savebill+"</div></li>");
        }
	},


	drawSelect : function(javaData){
		if(javaData.df == undefined){
			jQuery("#singlestore").data("df","0");
		}else{
			jQuery("#singlestore").data("df",javaData.df);
		}
		if("number" == (typeof rc.storeid)){/* 一定是玖姿的单店报表逻辑 */
			jQuery("#singlestore").hide();
		}else{
			if(javaData.ddvalue!=undefined&&javaData.ddvalue!=-2){
				var temp = jQuery("#singlestore"),html = "",iterator=javaData.ddvalue;
				/**
				 * 森马主管登录查看报表参数控制 this.isMgrRpt
				 */
				if(this.isMgrRpt && this.isMgrRpt !="false"){
					html += "<option  value=''>"+"————请选择————"+"</option>";
				}
				for ( var i = 0; i < iterator.length; i++) {
					html += "<option index='"+i+"' value='"+iterator[i][0]+"'>"+iterator[i][1]+"</option>";
				}
				temp.html(html);
				jQuery(".rc-filter").show();
				jQuery("#singlestore").show();
				if(this.isMgrRpt && this.isMgrRpt !="false"){
					jQuery("#df-filter-button").show();
					jQuery("#df-filter-input").show();
				}
			}else{
				jQuery("#singlestore").hide();
				jQuery("#df-filter-button").hide();
				jQuery("#df-filter-input").hide();
			}
		}
	},

	/**
	 * 搜索
	 * @拿到当前报表的数据rc.sigleJavaData（javaData），从而取到单店铺信息  只要有1.0的报表，并且有相同的下级，那么就有下拉
	 */
	searchBuyerpt : function(){
		var fliter = document.getElementById("flist").value;
		for(var j=0;j<rc.sigleJavaData.views.length;j++){
			if(fliter != undefined && fliter != null && fliter != ""){
				if(rc.sigleJavaData.views[j].ddvalue!=undefined&&rc.sigleJavaData.views[j].ddvalue!=-2){
					var temp = jQuery("#singlestore"),html = "",iterator=rc.sigleJavaData.views[j].ddvalue;
					html += "<option  value=''>"+"————请选择————"+"</option>";
					for ( var i = 0; i < iterator.length; i++) {
						if(iterator[i][1].indexOf(fliter) >= 0){
							//根据过滤条件重新从前端给下拉赋值，无条件则显示全部下拉
							html += "<option index='"+i+"' value='"+iterator[i][0]+"'>"+iterator[i][1]+"</option>";
						}
						temp.html(html);
					}
				}
			}else{
				/**
				 *清空搜索条件，显示所有下拉
				 */
				if(rc.sigleJavaData.views[j].ddvalue!=undefined&&rc.sigleJavaData.views[j].ddvalue!=-2){
					var temp = jQuery("#singlestore"),html = "",iterator=rc.sigleJavaData.views[j].ddvalue;
					if(this.isMgrRpt && this.isMgrRpt !="false"){
						html += "<option  value=''>"+"————请选择————"+"</option>";
					}
					for ( var i = 0; i < iterator.length; i++) {
						html += "<option index='"+i+"' value='"+iterator[i][0]+"'>"+iterator[i][1]+"</option>";
					}
					temp.html(html);
				}
			}
		}
		alert("完成，请点击下拉选择你要查看的报表")
	},


	/**
	 * 给表格特殊的列添加别经颜色
	 */
	addspecilbg : function(cols,dom){
		jQuery(dom).find("tr").each(function(){
			for(var i=0;i<cols.length;i++){
				jQuery(this).find("td:eq("+cols[i]+")").each(function(){
					jQuery(this).css("background","#555555");
				});
			}
			});
	},
	_getViewObjectStr : function(){
		var s = rc.actived+"";
		var sl = s.length;
		if(sl < 3){
			for ( var i = 0; i < 3 - sl; i++) {
				s = "0" + s;
			}
		}
		s = "view" + s + "c";
		return s;
	},
	adaptation : function(){
		if(rc.isNotPad && rc.width < 768){
			jQuery("<link rel='stylesheet' href='/fair/ipad/css/common/main_adaptation.css?t=<%=date %>' type='text/css' media='screen' title='no title' charset='utf-8'>").appendTo("head");
		}else{
			jQuery("<link rel='stylesheet' href='/fair/ipad/css/common/main.css?t=<%=date %>' type='text/css' media='screen' title='no title' charset='utf-8'>").appendTo("head");
		}
	}
};
ReportsControl.main = function(){
	portalClient = new PortalClient();
	portalClient.init(null,null,"/servlets/binserv/Fair");
	rc = new ReportsControl();
	if(!rc.isNotPad){
		jQuery("<meta name='viewport' content='width=device-width,user-scalable=yes' />").remove();
		jQuery("<meta name='viewport' content='width=device-width,minimum-scale=1.0,maximum-scale=1.0'>").appendTo("head");
	}
	rc.adaptation();
};
jQuery(document).ready(ReportsControl.main);
function appFilterID(filterid){
	if("pdt" == rc.fType){
		rc.filterid = filterid;
	}else{
		rc.bfilterid = filterid;
	}
	jQuery(".rc-filter input").attr("checked","checked");
	var s = rc._getViewObjectStr() + ".refresh();";
	eval(s);
	return "ok";
}
/* 2018-5-3 指标达成报表 添加 */
function  doJump(i,isback){
    var index;
    if(isNull(this.cacheData)) return ;
    var iterator = this.cacheData.views[i];

    if(iterator==null || iterator==undefined){//i 为报表name,寻找报表下标
        for(var j=0;j<this.cacheData.views.length;j++){
            if(i==this.cacheData.views[j].name){
                index=j;
                iterator=this.cacheData.views[j];
                break;
            }
        }
    } else {
        index=i;
    }
    if(jQuery("#"+iterator.referTo+"-back")) jQuery("#"+iterator.referTo+"-back").css("visibility","hidden");
    if( jQuery("#"+iterator.referTo+"-homepage"))  jQuery("#"+iterator.referTo+"-homepage").css("visibility","hidden");
    var interval2 = setInterval(function(){
        if(this[iterator.referTo+"c"] !=null && this[iterator.referTo+"c"] != undefined && this[iterator.referTo+"c"] != "" && this[iterator.referTo+"c"] != 'null'){
            this[iterator.referTo+"c"].getActived(iterator.name,index);
            clearInterval(interval2);
        }
    }, 200);

}

function isNull(str) {
    if(str == "" || str == null || str =="null" || str == undefined) return true;
    return false;
}