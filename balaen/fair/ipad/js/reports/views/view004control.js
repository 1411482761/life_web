var view004c;
var View004Control = Class.create();
View004Control.prototype = {
	/**
	 * Description : to define parameters.
	 * 
	 * @type private
	 * */
	initialize : function() {
		this.report=undefined;
		this.trans = {
			id: 1,
			command: "com.agilecontrol.fair.FairCmd",
			"nds.control.ejb.UserTransaction": "N",
			params:{
				cmd: "LoadRpt",
				"nds.control.ejb.UserTransaction": "N",
				sessionkey: rc.sessionkey,
				view: "view004",
				viewchain: null
			}
		};
		this._init();
		this.width = jQuery(document).width();
		this.height = jQuery(document).height();
		this.isNotPad = navigator.userAgent.indexOf('iPad') == -1;
	},
	
	/**
	 * Description : to initialize the parameters.
	 * 	and to create some DOM Object.
	 * 
	 * @type private
	 * */
	_init : function(){
		if(navigator.userAgent.indexOf('iPad') == -1 && jQuery(document).width() < 768){
			jQuery("body").append("<div id='view004'><div id = 'banner'><ul id='view004-buttons'><li id='view004-homepage' onclick='view004c.gotoHomePage();'>"
					+"</li><li id='view004-refresh' onclick='view004c.refresh();'>"+"</li></ul>" +
					"<div id='view004-title'></div></div><div id='view004-loading' class='mainpageajax'><div class='loadingimg'><div class='loadinglocale'>"+VIEWS_LOCALE.main.loading+"</div></div>" +
			"</div><div id='view004-container'></div></div>");
		}else{
			jQuery("body").append("<div id='view004'><div id = 'banner'><ul id='view004-buttons'><li id='view004-homepage' onclick='view004c.gotoHomePage();'>"
					+VIEWS_LOCALE.view_004.homepage+"</li><li id='view004-refresh' onclick='view004c.refresh();'>"+VIEWS_LOCALE.view_004.refresh+"</li></ul>" +
					"<div id='view004-title'></div></div><div id='view004-loading' class='mainpageajax'><div class='loadingimg'><div class='loadinglocale'>"+VIEWS_LOCALE.main.loading+"</div></div>" +
			"</div><div id='view004-container'></div></div>");
			
		}
	},
	
	
	
	/**
	 * Description : to activate the report.
	 * 
	 * @type public
	 * 
	 * @param report -String
	 * 	the name of the report.
	 * */
	getActived : function(report){
		this.report=report;
		jQuery("body").css("overflow","auto");
		jQuery("html").css("overflow","auto");
		jQuery("#container").hide();
		jQuery("#view004").show();
		this._drawRpt(report);
	},
	
	/**
	 * Description : begin to notice loading.
	 * 
	 * @type private
	 * */
	_startLoading : function(report){
		if(undefined == rc.rptOpt[report]){
			jQuery("#view004-container").html("");
		}else{
			jQuery("#view004-container").html("<div id='view004-filter' class='view004-content'></div><div id='view004-body' class='view004-content view004-fixed'></div><div id='view004-header' class='view004-content view004-fixed'></div><div id='view004-column' class='view004-content view004-fixed'></div><div id='view004-corner' class='view004-content view004-fixed'></div>");
		}
		jQuery("#view004-loading").show();
	},
	
	/**
	 * Description : to draw report.
	 * 
	 * @type private
	 * 
	 * @param report -String
	 * 	the name of the report.
	 * */
	_drawRpt : function(report){
		this._startLoading(report);
		if(report != undefined)
			this.trans.params.viewchain = [report];
		portalClient.sendOneRequest(this.trans, function(response){
			var javaData= response.data[0].result.data;
//			var javaData = {
//					title: "马克华菲 - HTML报表",
//					pdfurl: "/develop/d.....",
//					report: "<table></table>"
//			};
			view004c._fixedHeaderAndColumn(report,javaData);
			view004c._writeTitle(javaData.title);
			jQuery("#view004-loading").hide();
		});
	},
	
	_fixedHeaderAndColumn : function(report,javaData){
		if(undefined == rc.rptOpt[report]){
			jQuery("#view004-container").append(javaData.report);
			jQuery("#view004-container style").remove();
		}else{
			jQuery("#view004-filter").append(javaData.report);
			jQuery("#view004-filter style").remove();
			jQuery("#view004-body, #view004-header, #view004-column, #view004-corner").append(jQuery("#view004-filter").html());
			jQuery("#view004-filter").width(jQuery("#view004-body table").outerWidth(true));
			jQuery("#view004-filter").height(jQuery("#view004-body table").outerHeight(true));
			jQuery("#view004-filter").html("");
			jQuery(".view004-content").css({"margin-top":0,"margin-left":0});
			var c = rc.rptOpt[report].c;
			var h = rc.rptOpt[report].h;
			var sum = 0;
			var cnt = 0;
			for(var i = 0 ; i <= 100 ; i++){
				var tr = jQuery("#view004-header>table>tbody>tr").eq(i);
				if(cnt<h && tr.html()!=""){
					sum += tr.outerHeight();
					cnt++;
				}
				if(cnt == h){
					break;
				}
			};
			jQuery("#view004-header,#view004-corner").height(sum);
			sum = 0;
			for(var i = 0 ; i < c ; i++){
				sum += (jQuery("#view004-header>table>tbody>tr").eq(h).find("td").eq(i).outerWidth());
			}
			jQuery("#view004-column,#view004-corner").width(sum).css("margin",0);
			jQuery("#view004-container").bind("scroll",function(){
				var top = -jQuery("#view004-container").scrollTop();
				var left = -jQuery("#view004-container").scrollLeft();
				jQuery("#view004-column").css("margin-top",top);
				jQuery("#view004-header").css("margin-left",left);
				jQuery("#view004-body").css({"margin-top":top,"margin-left":left});
			});
		}
	},
	
	/**
	 * Description : to write the 
	 * 
	 * @type private.
	 * 
	 * @param rptName -String
	 * */
	_writeTitle : function(rptName){
		jQuery("#view004-title").html(rptName);
	},
	
	/**
	 * Description : to redraw report.
	 * 
	 * @type public
	 * */
	refresh : function(){
		this._drawRpt(this.report);
	},
	
	/**
	 * Description : to go back to Home.
	 * 
	 * @type public.
	 * */
	gotoHomePage : function(){
		jQuery("#container").show();
		jQuery("#view004").hide();
		jQuery("body").css("overflow","hidden");
		jQuery("html").css("overflow","hidden");
	}
};
View004Control.main = function(){
	view004c=new View004Control();
};
jQuery(document).ready(View004Control.main);