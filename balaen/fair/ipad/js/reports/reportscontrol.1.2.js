﻿/**

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
		this.updateKpi = Boolean;
		this.sessionkey = new String();
		this.noticeColor = new Hash();
		this.tableColor = new Hash();
		this.chartsColors = Highcharts.getOptions().colors;
		this._init();
	},
	
	_init : function(){
		ajaxController.setLoadingDiv("loading");
		//dwr.util.setEscapeHtml(false);
		/** A function to call if something fails. */
		ajaxController._errorHandler=function(message, ex) {
			if($("timeoutBox")!=null){
				$("timeoutBox").style.visibility = 'hidden';
			}
	  		while(ex!=null && ex.cause!=null) ex=ex.cause;
	  		if(ex!=null)message=ex.message;
			if (message == null || message == "") msgbox("A server error has occured. More information may be available in the console.");
	  		else msgbox(message);
			if($("list_query_form")!=null)toggleButtons($("list_query_form"),false);
		};
		this.updateKpi = true;
		this.noticeColor["planning"]='#4572A7';
		this.noticeColor["var"]='#aaeeee';
		this.noticeColor["g"] = '#A2BE67';
		this.noticeColor["y"] = '#DB843D';
		this.noticeColor["r"] = '#AA4643';
		this.tableColor["g"] = '#00ff00';
		this.tableColor["y"] = '#ffff00';
		this.tableColor["r"] = '#ff0000';
		this.tableColor["t"] = 'transparent';
	},
	
	/**
	 * Description : to define init params for charts.
	 * 
	 * type : private
	 * */
	_defaultOptions : function(){
		return {
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
					borderWidth: 0
				 },
				 pie: {
						allowPointSelect: true,
						dataLabels: {
							staggerLines : "n",
//							distance: 8,
							formatter: function() {
								return this.point.name+"<br/>"+ this.percentage.toFixed(2) +' %';
							},
							color: 'white'
						}
				}
			}
		};
	},
	
	/**
	 * Description : to import js & css file dynamically and create DOM elements.
	 * 
	 * type : private
	 * */
	generateViews : function(sessionkey){
		this.sessionkey = sessionkey;
		var params={cmd:"LoadRptViews"};
		var trans={id:1, command:"com.agilecontrol.fair.FairCmd",params:params};
		portalClient.sendOneRequest(trans, function(response){
			var javaData= response.data[0].result;
	//		var javaData = {
	//				locale: "zh_CN",
	//				meta: [{
	//					referTo: "view002",
	//					views:[
	//					       {name:"pdt",desc:"view002", img:"/fair/ipad/img/view003.png"}]
	//				},{
	//					referTo: "view003",
	//					views:[
	//					       {name:"pdt",desc:"商品", img:"/fair/ipad/img/view003.png"},
	//					       {name:"pdt",desc:"商品", img:"/fair/ipad/img/view003.png"},
	//					       {name:"pdt",desc:"商品", img:"/fair/ipad/img/view003.png"},
	//					       {name:"pdt",desc:"商品", img:"/fair/ipad/img/view003.png"},
	//					       {name:"store",desc:"商店",img:"/fair/ipad/img/view003.png"}]
	//				}]
	//		};
			var iterator2,
			ports = 0,
			iterator = javaData.meta;
			jQuery("<script language='javascript' src='/fair/ipad/js/locale/locale_"+ javaData.locale +".js' charset='utf-8'></script>").appendTo(jQuery("head"));
			jQuery("#views-loadinglocale").html(VIEWS_LOCALE.main.loading);
			jQuery("#views-noresult").html(VIEWS_LOCALE.main.noResult);
			jQuery("#mainpage-title").html(VIEWS_LOCALE.main.title);
			jQuery("#footer-left").html(VIEWS_LOCALE.main.footer_left);
			jQuery("#footer-right").html(VIEWS_LOCALE.main.footer_right);
			jQuery("#rank").html(VIEWS_LOCALE.rank.desc);
			ul = jQuery("#viewports ul");
			for ( var i = 0; i < iterator.length; i++) {
				jQuery("<link rel='stylesheet' href='/fair/ipad/css/reports/views/"+iterator[i].referTo+".css' type='text/css' media='screen' title='no title' charset='utf-8'>").appendTo(jQuery("head"));
				jQuery("<script language='javascript' src='/fair/ipad/js/reports/views/"+iterator[i].referTo+"control.js' charset='gbk'></script>").appendTo(jQuery("head"));
				iterator2 = iterator[i].views;
				for ( var j = 0; j < iterator2.length; j++) {
					ports++;
					ul.append(jQuery("<li onclick="+iterator[i].referTo+"c.getActived('"+iterator2[j].name+"');><div class='bgcolor'><div class='bgimg'></div></div><div class='viewtype-notice'><div class='viewtype-name'>"+iterator2[j].desc+"</div></div></li>"));
				}
			}
			jQuery("<link rel='stylesheet' href='/fair/ipad/css/reports/ports/port"+(ports>3?6:4)+".css' type='text/css' media='screen' title='no title' charset='utf-8'>").appendTo(jQuery("head"));
		});
	}
};
ReportsControl.main = function(){
	portalClient = new PortalClient();
	portalClient.init(null,null,"/servlets/binserv/Fair");
	rc = new ReportsControl();
};
jQuery(document).ready(ReportsControl.main);

