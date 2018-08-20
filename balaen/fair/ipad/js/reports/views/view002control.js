var view002c;
var View002Control = Class.create();
View002Control.prototype = {
	/**
	 * Description : to define parameter
	 * 
	 * @type private
	 * */
	initialize : function() {
		this.ajaxPrams = new Array();
		this.trans = new Object();
		this.pieOptions = new Object();
		this.columnOptions = new Object();
		this.singleChart = new Boolean();
		this.end = false;
		this.chainInfo = new Array();
		this.maxType = new String();
		this.dimIndex =  new Number();
		this.dims = new Array();
		this.back = new Boolean();
		this.prevDOM = null;
		this.charts = 2;
		this.isdefaulthide='N';
		this.ishidesomecols='N';
		this.columns=new Array();
		this.javaData= new Array();
		this.width = jQuery(document).width();
		this.height = jQuery(document).height();
		this.isNotPad = navigator.userAgent.indexOf('iPad') == -1;
		this.ratio=101;
		this.start = {
			x: -1,
			y: -1
		};
		this.touchStart = {
			x: -1,
			y: -1
		};
		this.scrollparams = {
			type: null,
			top: -1,
			left: -1,
			cwidth: -1,
			twidth: -1,
			cheight: -1,
			theight: -1,
			scrollX: -1,
			scrollY: -1
		};
		this.showtable="Y";
		this.columnlimit=16;
		this.fixedcolumns=0;
		this._init();
	},
	
	/**
	 * Description : to initialize trans,pieOptions,columnOptions.
	 * 	and to create html div for drawing charts.
	 * 
	 * @type private
	 * */
	_init : function(){
		this.dimIndex = 0;
		this.back = false;
		this.maxType = null;
		this.trans = {
			id: 1,
			command: "com.agilecontrol.fair.FairCmd",
			params:{
				cmd: "LoadRpt",
				sessionkey: rc.sessionkey,
				view: "view002",
				viewchain: null
			}
		};
		var options = Object.clone(rc._defaultOptions());
		options.chart.defaultSeriesType = "pie";
		options.legend = {enabled: false};
		options.tooltip={
				enabled: false,
				formatter: function() {
					return "<b>"+ this.point.name +"("+(Number(this.percentage).format("0,0%"))+")</b>: "+ this.point.y +" "+this.series.chart.rcOptions.unit[1];
				}	
			};
		options.plotOptions.pie.dataLabels.formatter = function(){
			return this.point.name+"("+(Number(this.percentage).format("0,0%"))+"): "+ this.point.actual;
		};
		this.pieOptions = Object.clone(options);
		options = Object.clone(rc._defaultOptions());
		options.chart.defaultSeriesType = "column";
		options.legend = {
			enabled: true,
			layout: 'vertical',
			floating: true,
			align: 'left',
			verticalAlign: 'top',
			symbolWidth : 30,
			symbolPadding: 1,
			itemStyle:{font: '8px Verdana'},
			y: -6,
			shadow: true
		};
		options.tooltip={
			enabled: false,
			formatter: function() {
				var s = '<b>'+ this.x +'</b>';
				var label;
				jQuery.each(this.points, function(i, point) {
					if(point.series.name == this.series.chart.rcOptions.varable)
						label = this.point.actual;
					else
						label = point.y +" "+this.series.chart.rcOptions.unit[1];
					s += '<br/> <span style="fill:'+point.series.color+'">'+ point.series.name +'</span>: '+ label;
				});
				return s;
			},
			shared: true
		};
		if(navigator.userAgent.indexOf('iPad') == -1 && jQuery(document).width() < 768){
			options.plotOptions.series.dataLabels = {
					enabled: true,
					formatter: function() {
						return this.point.actual;
					},
					style: {font: 'normal 8px Verdana, sans-serif'}
				};
		}else{
			options.plotOptions.series.dataLabels = {
					enabled: true,
					formatter: function() {
						return this.point.actual;
					},
					style: {font: 'normal 12px Verdana, sans-serif'}
				};
		}
		this.columnOptions = Object.clone(options);
		var view002_pie_max = "";
		var view002_column_max = "";
		var view002_table_max = "";
		if(navigator.userAgent.indexOf('iPad') == -1 && jQuery(document).width() < 768){
			view002_pie_max = "";
			view002_column_max = "";
//			view002_table_max = "";
			view002_table_max = "<div id='view002-table-max'" + "onclick=view002c.fullScreen(this,'table');>"+options+"</div>";
		}else{
			options = VIEWS_LOCALE.view_002.fullScreen;
			view002_pie_max = "<div id='view002-pie-max'" +"class='view002-max' onclick=view002c.fullScreen(this,'pie');>"+options+"</div>";
			view002_column_max = "<span id='view002-column-max' class='view002-max'onclick=view002c.fullScreen(this,'column');>"	+options+"</span>";
			view002_table_max = "<div id='view002-table-max' class='ajaxnoshow controltable'" + "onclick=view002c.fullScreen(this,'table');>"+options+"</div>";
		}
		if(navigator.userAgent.indexOf('iPad') == -1 && jQuery(document).width() < 768){
			jQuery("#views").append(jQuery("<div id='view002' class='viewport'><div id='view002-banner'><div id='view002-title'></div><div id='view002-buttons'>" +
					"<div id='view002-homepage'" +" class='view002-button' onclick='view002c.gotoHomePage();'><div id='view002-homepage-value'" +
					"class='view002-button-value'>"+"</div></div><div id='view002-refresh' class='view002-button' onclick='view002c.refresh();'><div id='view002-refresh-value'  class='view002-button-value'>"+
					"</div></div>" +"</div></div><div id='view002-single' class='view002-rpt'></div><div id='view002-single-legend'></div><div id='view002-mixed' class='view002-rpt'><div id='view002-dimensions'><ul></ul></div><div id='view002-details'>" +
					"<div id='view002-charts'><div id='view002-pie'></div><div id='view002-pie-buttons' class='ajaxnoshow'>" +"<select id='view002-pie-select' onchange=view002c.updateCharts(this,'pie');></select>"+view002_pie_max+"</div><div id='view002-column'></div><div id='view002-column-buttons' class='ajaxnoshow'><select id='view002-column-select'" +
					"onchange=view002c.updateCharts(this,'column');></select>"+view002_column_max+"</div></div>"+view002_table_max+"<div id='view002-table' class='controltable'></div></div></div><div id='view002-loading' class='mainpageajax'><div class='loadingimg'><div class='loadinglocale'>"+
					VIEWS_LOCALE.main.loading+"</div></div></div><div id='view002-nomatched' class='mainpageajax'><div class='noresult'>"+VIEWS_LOCALE.main.noResult+"</div></div></div>"));
		}else{
			jQuery("#views").append(jQuery("<div id='view002' class='viewport'><div id='view002-banner'><div id='view002-title'></div><div id='view002-buttons'><div id='view002-back' class='view002-button' onclick='view002c.goBack();'>" +
					"<div id='view002-back-value' class='view002-button-value'>"+VIEWS_LOCALE.view_002.back+"</div></div><div id='view002-homepage'" +" class='view002-button' onclick='view002c.gotoHomePage();'><div id='view002-homepage-value'" +
					"class='view002-button-value'>"+VIEWS_LOCALE.view_002.homepage+"</div></div><div id='view002-refresh' class='view002-button' onclick='view002c.refresh();'><div id='view002-refresh-value'  class='view002-button-value'>"+
					VIEWS_LOCALE.view_002.refresh+"</div></div>" +"</div></div><div id='view002-single' class='view002-rpt'></div><div id='view002-single-legend'></div><div id='view002-mixed' class='view002-rpt'><div id='view002-dimensions'><ul></ul></div><div id='view002-details'>" +
					"<div id='view002-charts'><div id='view002-pie'></div><div id='view002-pie-buttons' class='ajaxnoshow'>" +"<select id='view002-pie-select' onchange=view002c.updateCharts(this,'pie');></select>"+view002_pie_max+"</div><div id='view002-column'></div><div id='view002-column-buttons' class='ajaxnoshow'><select id='view002-column-select'" +
					"onchange=view002c.updateCharts(this,'column');></select>"+view002_column_max+"</div></div>"+view002_table_max+"<div id='view002-table' class='controltable'></div></div></div><div id='view002-loading' class='mainpageajax'><div class='loadingimg'><div class='loadinglocale'>"+
					VIEWS_LOCALE.main.loading+"</div></div></div><div id='view002-nomatched' class='mainpageajax'><div class='noresult'>"+VIEWS_LOCALE.main.noResult+"</div></div></div>"));
		}
		if(navigator.userAgent.indexOf('iPad') == -1 && jQuery(document).width() < 768){
			jQuery("#view002").css("width",jQuery(document).width());
			jQuery("#view002-banner").css("width",jQuery(document).width());
			jQuery("#view002-details").css("width",jQuery(document).width());
			jQuery(".view002-rpt").css("width",jQuery(document).width());
			jQuery("#view002-table-max").hide();
		}
//		if(rc.filter){
//			jQuery("<div id='view002-filter' class='rc-filter'><input type='checkbox' onchange=view002c.refresh(); /><span onclick='view002c.setFilter(this);'>"+VIEWS_LOCALE.main.filter+"</span></div>").insertAfter(jQuery("#view002-buttons"));
//		}
	},
	
	
	/**
	 * Description : to generate first rpt.
	 * 
	 * @type public
	 * */
	getActived : function(viewport,index){
		rc.actived = 2;
		rc.filterid=-1;
		rc.bfilterid=-1;
		jQuery("#singlestore").attr("onchange","view002c.refresh()");
		rc.initFilter(viewport);
		rc.drawSelect(rc.rptviews[index]);
		this.showtable=rc.showtable;
		jQuery("#views").show();
		jQuery("#view002").show();
		this.ajaxPrams = [viewport];
		this._drawCharts();
	},
	
	/**
	 * Description : to generate the rpt according to the linked params.
	 * 
	 * @type public
	 * */
	drawCharts : function(category){
		this._drawCharts(category);
	},
	
	_writeTitle : function(title){
		jQuery("#view002-title").html(title);
	},
	
	/**
	 * Description : to get native event in different browser.
	 * 
	 * @type private
	 * */
	getNativeEvent : function(event) {
		while (event && typeof event.originalEvent !== "undefined") {
			event = event.originalEvent;
		}
		return event;
	},
	
	/**
	 * Description : to record the pageX of cases ul when starting move.
	 * 
	 * @type public
	 * */
	handleTouchStart : function(event){
		event.stopPropagation();
		jQuery(".view002-scrollc div").stop(true);
		var touches = view002c.getNativeEvent(event).touches,
		type = view002c.scrollparams.type;
		if(type != null){
			var div = type == "v" ? "#view002-scrollbar-y > div" : type == "h" ? "#view002-scrollbar-x > div" : ".view002-scrollc div";
			jQuery(div).css({opacity: 1,display: "block"});
			if ( touches && touches.length === 1 ) {
				var t = touches[0];
				view002c.touchStart.x = view002c.start.x = t.pageX;
				view002c.touchStart.y = view002c.start.y = t.pageY;
			}
		}
	},
	
	/**
	 * Description : to handle after touchend on customer ul.
	 * 
	 * @type public
	 * */
	handleTouchEnd : function(event){
		event.stopPropagation();
		jQuery(".view002-scrollc div").animate({opacity: 0},1400);
		return;
	},
	
	/**
	 * Description : to handle after touchmove on customer ul.
	 * 
	 * @type public
	 * */
	handleTouchMove : function(event){
		event.stopPropagation();
		event.preventDefault();
		var touches = view002c.getNativeEvent(event).touches;
		if ( touches && touches.length === 1 ) {
			var t = touches[0],
			params = view002c.scrollparams,
			type = params.type,
			table = jQuery("#view002-table > table");
			if(type == "v"){//only vertical scroll.
				var y = t.pageY,
				cheight = params.cheight,
				theight = params.theight,
				top= parseInt(table.css("margin-top").replace(/px/g, ""));
				params.top = top;
				top +=  y - view002c.start.y;
				view002c.start.y = y;
				if(top > 0){
					top = 0;
				}else if(top+theight < cheight){
					top = cheight - theight;
				}
				table.css("margin-top",top);
				jQuery("#view002-fixedcolumns table").css("margin-top",top);
				jQuery("#view002-scrollbar-y div").css("top", top*params.scrollY);
			}else if(type == "h"){//only horizontal scroll.
				var x = t.pageX,
				cwidth = params.cwidth,
				twidth = params.twidth,
				left = parseInt(table.css("margin-left").replace(/px/g, ""));
				params.left =  left;
				left +=  x - view002c.start.x;
				view002c.start.x = x;
				table = jQuery("#view002-table table");
				if(left > 0){
					left = 0;
				}
				else if(left+twidth < cwidth){
					left = cwidth - twidth;
				}
				table.css("margin-left",left);
				jQuery("#view002-fixedcolumns table").css("margin-left",0);
				jQuery("#view002-fixedcolumnsheader table").css("margin-left",0);
				jQuery("#view002-scrollbar-x div").css({left: left*params.scrollX});
			}else if(type == "b"){//both scroll.
				var x = t.pageX,
				y = t.pageY,
				cwidth = params.cwidth,
				twidth = params.twidth,
				cheight = params.cheight,
				theight = params.theight,
				left = parseInt(table.css("margin-left").replace(/px/g, "")),
				top = parseInt(table.css("margin-top").replace(/px/g, ""));
				params.top = top;
				params.left = left;
				left +=  x - view002c.start.x;
				top +=  y - view002c.start.y;
				view002c.start.x = x;
				view002c.start.y = y;
				if(top > 0)
					top = 0;
				else if(top+theight < cheight)
					top = cheight - theight;
				if(left > 0)
					left =0;
				else if(left+twidth < cwidth)
					left = cwidth - twidth;
				jQuery("#view002-fixedheader table").css("margin-left",left);
				jQuery("#view002-scrollbar-x div").css({left: left*params.scrollX});
				jQuery("#view002-scrollbar-y div").css("top", top*params.scrollY);
				table.css({
					"margin-top": top,
					"margin-left": left
				});
				jQuery("#view002-fixedcolumns table").css("margin-top",top);
			}//type = null
		}
	},
	
	_bindTouchEvent : function(){
		var params = this.scrollparams,
		div = jQuery("#view002-table"),
		table = jQuery("#view002-table > table"),
		cwidth = params.cwidth = div.width()-4,//to consider border.
		twidth = params.twidth = table.width(),
		cheight = params.cheight = div.height()-4,
		theight = params.theight = table.height(),
		scrollx = jQuery("#view002-scrollbar-x").width() - twidth + cwidth,
		scrolly = jQuery("#view002-scrollbar-y").height() - theight + cheight;
		scrollx = scrollx < 32 ? 32 : scrollx;
		scrolly = scrolly < 32 ? 32 : scrolly;
		jQuery("#view002-scrollbar-x div").width(scrollx);
		jQuery("#view002-scrollbar-y div").height(scrolly);
		params.scrollX = (jQuery("#view002-scrollbar-x").width() - scrollx)/(cwidth-twidth);
		params.scrollY = (jQuery("#view002-scrollbar-y").height() - scrolly)/(cheight-theight);
		if(theight > cheight && twidth <= cwidth){//only vertical scroll.
			params.type = "v";
		}else if(theight <= cheight && twidth > cwidth){//only horizontal scroll.
			params.type = "h";
		}else if(theight > cheight && twidth > cwidth){//both scroll.
			params.type = "b";
		}else{
			params.type = null;
		}
		if(params.type != null){
			jQuery("#view002-table").bind("touchstart",this.handleTouchStart).bind("touchend",this.handleTouchEnd).bind("touchmove",this.handleTouchMove);
		}
	},
	
	_fixedHeader : function(){
		jQuery("#view002-table").children("div").remove();
		jQuery("#view002-table > table").css("margin-top",0);
		var height = jQuery("#view002-table > table thead").height(),
		table = jQuery("#view002-table > table");
		jQuery("#view002-table > table tbody tr:first td:first").css("min-width",45);
		jQuery("<div id='view002-fixedheader'></div><div id='view002-scrollbar-y' class='view002-scrollc'><div class='view002-scroll view002-scrollbar view002-scrolly'></div></div>" +
				"<div id='view002-scrollbar-x' class='view002-scrollc'><div class='view002-scroll view002-scrollbar view002-scrollx'></div></div>").insertBefore(table);
		jQuery("#view002-fixedheader").append(table.clone());
		jQuery("#view002-fixedheader").height(height);
		table.addClass("view002-scrollx view002-scrolly");
		if(jQuery("#view002-table > table").width()>jQuery("#view002-table").width()){
			this._fixedColumns();
		}
		this._bindTouchEvent();
	},
	
	_fixedColumns : function(){
		var height = jQuery("#view002-table > table thead").height(),
		table = jQuery("#view002-table > table");
		var width=0;
		for(var i=0;i<this.fixedcolumns;i++){
			width+=jQuery("#view002-table > table tbody tr:eq(0) td:eq("+i+")").width();
		}
		width+=this.fixedcolumns*4+2;
		jQuery("<div id='view002-fixedcolumnsheader'></div>").insertBefore(table);
		jQuery("<div id='view002-fixedcolumns'></div>").insertBefore(table);
		jQuery("#view002-fixedcolumnsheader").append(table.clone());
		jQuery("#view002-fixedcolumns").append(table.clone());
		jQuery("#view002-fixedcolumnsheader").height(height);
		jQuery("#view002-fixedcolumnsheader").width(width);
		jQuery("#view002-fixedcolumns").width(width);
		jQuery("#view002-fixedcolumns").height(table.height()+2);
	},
	
	/**
	 * Description : to draw charts according to global params and ajax params.
	 * 
	 * @type private
	 * */ 
	_drawCharts : function(category){
		if(category != undefined)this.ajaxPrams.push(category);
		jQuery("#view002-single-legend").hide().children().remove();
		jQuery("#view002-loading").show();
		jQuery("#view002-nomatched").hide();
		/*send ajax*/
		viewchain = this.ajaxPrams.toString().split(",");
		this.trans.params.viewchain = viewchain;
		this.getFilter();
		portalClient.sendOneRequest(this.trans, function(response){
			var javaData= response.data[0].result;
			var action = javaData.action,
			data = javaData.data;
			if(action == undefined || data == undefined){
				view002c.ajaxPrams.push("error");
				view002c.chainInfo.push({
					type: "single",
					dim: null,
				});
				this.singleChart = false;
				alert("返回的result缺少data或则action。");
			}else{
				if(action == "filter"){
					view002c.ajaxPrams.pop();
					jQuery("#view002-loading").hide();
					if(data != null)
						window.location.replace(data);
				}else if(action == "dims")
					view002c._drawDimensions(data);
				else
					view002c._drawSingle(data);
			}
		});
		/*end ajax*/
	},
	
	drawChartsBylengend : function(DOM){
		this._drawCharts(jQuery(DOM).next().html());
	},
	
	/**
	 * Description : to draw single displaying element;e.g. table,columnChart,pieChart.
	 * 
	 * type: private
	 * */
	_drawSingle : function(javaData){
		this.chainInfo.push({
			type: "single",
			dim: null,
		});
		jQuery("#view002-single > div").remove();
		this.singleChart = true;
		this._writeTitle(javaData.title);
		var data = new Array(),
		ul = jQuery("#view002-single-legend");
		options = Object.clone(this.pieOptions);
		options.chart.renderTo="view002-single";
		options.rcOptions={unit: javaData.unit};
		options.title = {text: javaData.title};
		for ( var i = 0; i < javaData.categories.length; i++) {
			data.push({
				name: javaData.categories[i],
				color: rc.chartsColors[i+1],
				y: javaData.data[i]
			});
			jQuery("<div class='view002-single-legend-item' onclick=view002c.drawChartsBylengend(this);><div class='view002-single-legend-item-name'>"+javaData.categories[i]+
					"</div><div class='view002-single-legend-item-color' style='background:"+rc.chartsColors[i+1]+"'></div></div>").appendTo(ul);
		}
		options.series=[{data: data}];
		options.plotOptions.series.point.events.click = function(){
			view002c.drawCharts(this.name);
		};
		new Highcharts.Chart(options);
		jQuery("#view002-single-legend").show();
		jQuery("#view002-mixed").hide();
		jQuery("#view002-single").show();
		jQuery("#view002-loading").hide();
	},
	
	/**
	 * Description : to draw three displaying element;e.g. table & columnChart & pieChart. 
	 * 
	 * type: private
	 * */
	_drawDimensions : function(javaData){
		this.chainInfo.push({
			type: "composite",
			dim: null,
		});
		this.singleChart = false;
		var html = "",
		temp = jQuery("#view002-dimensions ul");
		temp.children().remove();
		for ( var i = 0; i < javaData.length; i++) {
			html += "<li class='button' onclick=view002c.switchDimension('"+javaData[i]+"',this,'"+i+"');><div class='dimensionname'>"+javaData[i]+"</div></li>";
		}
		temp.append(html);
		this.ajaxPrams.push(javaData[0]);
		if(this.back) {
			jQuery("#view002-dimensions ul li:eq("+this.dimIndex+")").trigger("click");
			this.back = false;
		}
		else jQuery("#view002-dimensions ul li:first").trigger("click");
	},
	
	switchDimension : function(dimension,DOM,index){
		this.isdefaulthide='N';
		this.ishidesomecols='N';
		this.columns=new Array();
		this.dims.clear();
		this.fixedcolumns=0;
		jQuery("#view002-nomatched").hide();
		jQuery("#view002-loading").show();
		this._initCombination();
		this.ajaxPrams.pop();
		this.ajaxPrams.push(dimension);
		this.chainInfo[this.chainInfo.length-1].dim = parseInt(index);
		var viewchain = this.ajaxPrams.toString().split(",");
		this.trans.params.viewchain = viewchain;
		this.trans.params.df = jQuery("#singlestore").data("df");
		if("number" == (typeof rc.storeid)){/* 一定是玖姿的单店报表逻辑 */
			this.trans.params.ddvalue = rc.storeid;
		}else{
			if(!jQuery("#singlestore").is(":hidden")){
				this.trans.params.ddvalue=jQuery("#singlestore").find("option:selected").val();
			}else{
				this.trans.params.ddvalue=-2;
			}
		}
		jQuery("#view002-dimensions ul li").attr("class","button");
		jQuery(DOM).attr("class","active");
		this.charts = 2;
		this.getFilter();
		portalClient.sendOneRequest(this.trans, function(response){
				var javaData= response.data[0].result.data;
				view002c.javaData=javaData;
				view002c.end = response.data[0].result.end == "Y" ? true: false;
				var hidecolumns=javaData.hidecolumns;
				if(hidecolumns!=undefined){
					view002c.isdefaulthide=hidecolumns.isdefaulthide;
					view002c.columns=hidecolumns.columns;
				}
				if(view002c.isdefaulthide=="Y"){
					view002c.ishidesomecols = "Y";
				}else{
					view002c.ishidesomecols="N";
				}
				if(view002c.showtable=="Y"){
					if(view002c.ishidesomecols=="N"){
						jQuery("#hidecolumns").html(VIEWS_LOCALE.main.hidesomecols);
					}else{
						if(view002c.columns.length>0){
							jQuery("#hidecolumns").show();
						}else{
							jQuery("#hidecolumns").hide();
						}
						jQuery("#hidecolumns").html(VIEWS_LOCALE.main.showallcols);
					}
				}
				if(view002c.columns.length<1){
					jQuery("#hidecolumns").hide();
				}
				if(javaData.table.length == 0){
					jQuery("#view002-loading").hide();
					jQuery("#view002-nomatched").show();
				}else{
					jQuery("#view002-nomatched").hide();
					view002c._writeTitle(javaData.title);
					jQuery("#view002-pie").children().remove();
					jQuery("#view002-column").children().remove();
					view002c._drawtable(javaData);
					var iterator3,iterator4,iterator6,iterator7,
					dim_index = javaData.dim_index,
					iterator5 = javaData.trcolors;
					
					var actual,options,iterator2,
					category = undefined,
					colorCounts = rc.chartsColors.length,
					data = new Array(),
					select = jQuery("#view002-pie-select"),
					iterator = javaData.pie_charts;
					jQuery("#view002-pie").show();
					jQuery("#view002-pie-buttons").show();
					jQuery("#view002-pie-max").css("right",0);
					jQuery("#view002-column").show();
					jQuery("#view002-column-buttons").show();
					if(iterator == undefined || iterator.length == 0){
						jQuery("#view002-pie").hide();
						jQuery("#view002-pie-buttons").hide();
						view002c.charts--;
					}else{
						select.children().remove();
						dim_index = javaData.dim_index;
						for ( var i = 0; i < iterator.length; i++) {
							options = new Object();
							actual = new Array();
							options.title = {text: iterator[i].title};
							dim_index = javaData.dim_index;
							var  removecols= iterator[i].specialcols,specialcols=new Array();
							if(removecols!=undefined&&removecols.length>0){
								specialcols=rc.removeColumns(javaData.table,removecols);
							}
							if(dim_index == undefined)
								dim_index = 0;
							else if (typeof dim_index != "number"){
								dim_index = dim_index[dim_index.length-1];
							}
							options.rcOptions= {unit: iterator[i].unit,category: category};
							options.end = view002c.end;
							iterator2 = javaData.table[iterator[i].colidx];
							iterator5 = javaData.fmt;
							iterator6 = iterator5[iterator[i].colidx];
							if(iterator6 == null){
								for ( var j = 0; j < iterator2.length; j++) {
									if(specialcols!=undefined&&specialcols.length>0){
										if(rc.isInArray(j,specialcols)){
											continue;
										}
									}
									if(j < iterator2.length){
									actual.push({
										idx: j,
										actual: iterator2[j],
										name: javaData.table[dim_index][j],
										color: rc.chartsColors[(j+1)%colorCounts],
										y: iterator2[j]
									});
									}
								}
							}else{
								for ( var j = 0; j < iterator2.length; j++) {
									if(specialcols!=undefined&&specialcols.length>0){
										if(rc.isInArray(j,specialcols)){
											continue;
										}
									}
									if(j < iterator2.length){
									actual.push({
										idx: j,
										actual: Number(iterator2[j]).format(iterator6),
										name: javaData.table[dim_index][j],
										color: rc.chartsColors[(j+1)%colorCounts],
										y: iterator2[j]
									});
									}
								}
							}
							actual[0].sliced = true;
							actual[0].selected = true;
							options.data = actual;
							data.push(options);
							jQuery("<option value='"+i+"'>"+iterator[i].name+"</option>").appendTo(select);
						}
						if(iterator.length == 1) select.hide();
						select.children(":first").attr("selected","selected");
					}
					
					iterator = javaData.column_charts;
					if(iterator == undefined || iterator.length == 0){
						jQuery("#view002-column").hide();
						jQuery("#view002-column-buttons").hide();
						jQuery("#view002-pie-max").css("right",-542);
						jQuery("#view002-pie").css({"width":1024,"height":370});
						if(view002c.charts == 2)
							jQuery("#view002-pie-select").data("options",data).trigger("onchange");
						view002c.charts--;
					}else{
						if(view002c.charts == 2)
							jQuery("#view002-pie-select").data("options",data).trigger("onchange");
						else
							jQuery("#view002-column").css({width:1024,height:370});
						var planning,variable,m_planning,m_actual,v_var,max,column_options;
						data = new Array();
						select = jQuery("#view002-column-select");
						select.children().remove();
						iterator5 = javaData.fmt;
						for (var i = 0; i < iterator.length; i++) {
							column_options = new Object();
							actual = new Array();
							variable = new Array();
							dim_index = javaData.dim_index;
							var  removecols1= iterator[i].specialcols,iterator8=new Array();
							if(removecols1!=undefined&&removecols1.length>0){
								iterator8=rc.removeColumns(javaData.table,removecols1);
							}
							if(dim_index == undefined)
								dim_index = 0;
							else if (typeof dim_index != "number"){
								dim_index = dim_index[dim_index.length-1];
							}
							var tem =new Array;
							if(iterator8!=undefined&&iterator8.length>0){
								tem=rc.handleArray(javaData.table[dim_index],iterator8);
							}else{
								tem=javaData.table[dim_index];
							}
							column_options.rcOptions= {unit: iterator[i].unit, varable: iterator[i].coltitle[2],category: category};
							column_options.end = view002c.end;
							column_options.xAxis={categories: Object.clone(tem)};
							column_options.title = {
								text: iterator[i].title,
								margin: 34
							};
							column_options.yAxis={
								labels: {
									formatter: function() {
										return this.value;
									}
								},
								title: {text: iterator[i].unit[0]+" ( "+iterator[i].unit[1]+" ) "}
							};
								planning=rc.handleArray(javaData.table[iterator[i].colidx[0]],iterator8);
							//planning = javaData.table[iterator[i].colidx[0]];
							
							iterator2 = iterator[i].colidx.length == 1?javaData.table[iterator[i].colidx[0]]:javaData.table[iterator[i].colidx[1]];
							m_planning = planning.max();
							m_actual = iterator2.max();
							max = m_planning>m_actual?m_planning:m_actual;
							iterator4 = javaData.colors;
							if(iterator[i].colidx.length == 3){
								iterator6 = iterator[i].colidx[2];
								iterator3 = javaData.table[iterator6];
								iterator6 = iterator5[iterator6];
								iterator7 = iterator5[iterator[i].colidx[1]];
								for ( var j = 0; j < iterator2.length; j++) {
									if(iterator8!=undefined&&iterator8.length>0){
										if(rc.isInArray(j,iterator8)){
											continue;
										}
									}
									if(j < iterator2.length){
									v_var = iterator3[j];
									variable.push({
										idx: j,
										actual: iterator6 == null?v_var :Number(v_var).format(iterator6),
										y: max*v_var/100
									});
									actual.push({
										idx: j,
										actual: iterator7 == null?iterator2[j]:Number(iterator2[j]).format(iterator7),
										color:rc.noticeColor[iterator4[i][j]],
										y:iterator2[j]
									});
									}
								}
								if(javaData.tablecolors != undefined && javaData.tablecolors.length > 0)
									view002c._drawLump(iterator[i].colidx[2],javaData.tablecolors[i]);
							}else{
								iterator6 = iterator[i].colidx;
								iterator7 = iterator5[iterator6[iterator6.length-1]];
								if(iterator4[i] != undefined && iterator4[i].length != 0){
									if(iterator7 == null)
										for ( var j = 0; j < iterator2.length; j++){
											if(iterator8!=undefined&&iterator8.length>0){
												if(rc.isInArray(j,iterator8)){
													continue;
												}
											}
											if(j < iterator2.length){
											actual.push({
												idx: j,
												actual: iterator2[j],
												color: rc.noticeColor[iterator4[i][j]],
												y: iterator2[j]
											});
											}
										}
									else
										for ( var j = 0; j < iterator2.length; j++){
											if(iterator8!=undefined&&iterator8.length>0){
												if(rc.isInArray(j,iterator8)){
													continue;
												}
											}
											if(j < iterator2.length){
											actual.push({
												idx: j,
												actual: Number(iterator2[j]).format(iterator7),
												color: rc.noticeColor[iterator4[i][j]],
												y: iterator2[j]
											});
											}
										}
								}else{
									if(iterator7 == null)
										for ( var j = 0; j < iterator2.length; j++){
											if(iterator8!=undefined&&iterator8.length>0){
												if(rc.isInArray(j,iterator8)){
													continue;
												}
											}
											if(j < iterator2.length){
											actual.push({
												idx: j,
												actual: iterator2[j],
												color: rc.noticeColor["g"],
												y: iterator2[j]
											});
											}
										}
									else
										for ( var j = 0; j < iterator2.length; j++){
											if(iterator8!=undefined&&iterator8.length>0){
												if(rc.isInArray(j,iterator8)){
													continue;
												}
											}
											if(j < iterator2.length){
											actual.push({
												idx: j,
												actual: Number(iterator2[j]).format(iterator7),
												color: rc.noticeColor["g"],
												y: iterator2[j]
											});
											}
										}
								}
							}
							iterator6 = iterator5[iterator[i].colidx[0]];
							if(iterator6 == null){
								for ( var j = 0; j < planning.length; j++) {
									iterator7 = planning[j];
									planning[j] = {
										idx: j,
										actual: iterator7,
										y: iterator7
									};
								}
							}else{
								for ( var j = 0; j < planning.length; j++) {
									iterator7 = planning[j];
									planning[j] = {
										idx: j,
										actual: Number(iterator7).format(iterator6),
										y: iterator7
									};
								}
							}
							if(iterator[i].colidx.length == 3){
								column_options.series=[
			                       {
			                    	   name: iterator[i].coltitle[0],
			                    	   color:rc.noticeColor["planning"],
			                    	   type: "column",
			                    	   data: planning
			                       },
			                       {
			                    	   name: iterator[i].coltitle[1],
			                    	   color:rc.noticeColor["g"],
			                    	   type: "column",
			                    	   data: actual
			                       },{
			                    	   name: iterator[i].coltitle[2],
			                    	   color:rc.noticeColor["var"],
			                    	   type: "spline",
			                    	   zIndex: 10,
			                    	   data: variable
			                       }
								];
							}else if(iterator[i].colidx.length == 2){
								column_options.series=[
			                       {
			                    	   name: iterator[i].coltitle[0],
			                    	   color:rc.noticeColor["planning"],
			                    	   type: "column",
			                    	   data: planning
			                       },
			                       {
			                    	   name: iterator[i].coltitle[1],
			                    	   color:rc.noticeColor["g"],
			                    	   type: "column",
			                    	   data: actual
			                       }
			                    ];
							}else{
								column_options.series=[
			                       {
			                    	   name: iterator[i].coltitle[1],
			                    	   color:rc.noticeColor["g"],
			                    	   type: "column",
			                    	   data: actual
			                       }
			                    ];
							}
							data.push(column_options);
							jQuery("<option value='"+i+"'>"+iterator[i].name+"</option>").appendTo(select);
						}
						if(iterator.length == 1)
							select.hide();
						else
							select.show();
						select.children(":first").attr("selected","selected");
						select.data("options",data).trigger("onchange");
					}
					jQuery("#view002-single").hide();
					jQuery("#view002-mixed").show();
					
					//写适配的逻辑；
					if(view002c.isNotPad && view002c.width < 768){
						jQuery("table").parent().width(view002.width).height(jQuery("#view002-table > table").height() + 10);
					}
					
					if(javaData.fullTable == "Y"){
						jQuery("#view002-table-max").trigger("click").hide();
						jQuery("#view002-table").show();
						jQuery("#controltable").hide();
						if(view002c.columns.length>0){
							jQuery("#hidecolumns").show();
							if(view002c.isdefaulthide=="Y"){
								jQuery("#hidecolumns").html(VIEWS_LOCALE.main.showallcols);
							}else{
								jQuery("#hidecolumns").html(VIEWS_LOCALE.main.hidesomecols);
							}
						}
					}else{
						view002c._fixedHeader();
						if(view002c.showtable!=undefined){
							if(javaData.pie_charts.length==0&&javaData.column_charts.length==0){
								jQuery("#controltable").hide();
							}else{
								view002c.controlTable();
							}
						}
					}
					jQuery("#view002-loading").hide();
					if(view002c.isNotPad && view002c.width < 768){
						jQuery("<div class='rpt-cover'></div>").insertAfter(".highcharts-container");
						jQuery("#view002-table").css("height",jQuery("#view002-table > table").height());
						jQuery("#view002-table").after(jQuery("#view002-charts")[0]);
						
						jQuery("#view002-pie-buttons").css("top",jQuery("#view002-table > table").height() + 36);
						jQuery("#view002-column-select").css("top",jQuery("#view002-table > table").height() + 335);
//						jQuery("#view002-charts").css("top",jQuery("#view002-table > table").height());
					}
					/*end ajax*/
				}
				
				jQuery("#view002-charts").css({"left":0,"opacity": 1,"display":"block"});
				
			});
	},
	
	_drawtable : function(javaData){
		var iterator2,iterator3,iterator4,iterator6,dim_td,
		dim_index = javaData.dim_index,
		iterator5 = javaData.trcolors,
		articleHtmls = "<table><thead><tr>",
		headSecondTr = "<tr class='attr-region'>",
		iterator;
		if(view002c.ishidesomecols=="Y")iterator = rc.getNewHeader(javaData.header,view002c.columns);
		else iterator = javaData.header;
		if(javaData.fixcolumns!=undefined&&javaData.fixcolumns>0){
			view002c.fixedcolumns=javaData.fixcolumns;
		}
		var columns=0;
		for ( var i = 0; i < iterator.length; i++) {
			if(iterator[i].subheader == undefined){
				columns+=1;
				articleHtmls += "<td rowspan='2'>"+iterator[i].name+"</td>";
			}else{
				articleHtmls += "<td colspan='"+iterator[i].colspan+"'>"+iterator[i].name+"</td>";
				iterator2 = iterator[i].subheader;
				for ( var j = 0; j < iterator2.length; j++) {
					columns+=1;
					headSecondTr += "<td>"+iterator2[j]+"</td>";
				};
			}
		}
		articleHtmls += "</tr>"+headSecondTr+"</tr></thead><tbody>";
		iterator = javaData.table[0];
		iterator2 = javaData.table;
		iterator3 = javaData.fmt;
		if(javaData.bfbcompare!=undefined&&javaData.bfbcompare.ratio!=undefined){
			view002c.ratio = javaData.bfbcompare.ratio;
		}
		if(view002c.end){
			if(iterator5 != undefined){
				for ( var i = 0; i < iterator.length; i++) {
					iterator6 = iterator5[i];
					articleHtmls += "<tr onclick='view002c.selectedTr(this);' level='"+iterator6+"' style='background:"+rc.tableTrColor[iterator6]+"'><td class='sort-desc' nowrap='nowrap'>"+iterator[i]+"</td>";
					for ( var j = 1; j < iterator2.length; j++) {
						iterator4 = iterator3[j];
						if(view002c.ishidesomecols=="Y"&&rc.isInArray(j,view002c.columns)){}else{
							if(javaData.bfbcompare!=undefined && rc.isInArray(j,javaData.bfbcompare.columns)){
								if(iterator2[j][i]>view002c.ratio || iterator2[j][i]==view002c.ratio){
									if(iterator4 == null)
										articleHtmls += "<td style='background:"+javaData.bfbcompare.color+"'>"+iterator2[j][i]+"</td>";
									else{
										if(iterator2[j][i]=="") articleHtmls += "<td style='background:"+javaData.bfbcompare.color+"'>"+iterator2[j][i]+"</td>";
										else articleHtmls += "<td style='background:"+javaData.bfbcompare.color+"'>"+Number(iterator2[j][i]).format(iterator4)+"</td>";
									}
								}else{
									if(iterator4 == null)
										articleHtmls += "<td>"+iterator2[j][i]+"</td>";
									else{
										if(iterator2[j][i]=="") articleHtmls += "<td>"+iterator2[j][i]+"</td>";
										else articleHtmls += "<td>"+Number(iterator2[j][i]).format(iterator4)+"</td>";
									}
									}
								}else{
									if(this.ishidesomecols=='N'&&rc.isInArray(j,this.columns)){
										if(iterator4 == null)
											articleHtmls += "<td style='background:#FFC000;'>"+iterator2[j][i]+"</td>";
										else{
											if(iterator2[j][i]=="") articleHtmls += "<td style='background:#FFC000;'>"+iterator2[j][i]+"</td>";
											else articleHtmls += "<td style='background:#FFC000;'>"+Number(iterator2[j][i]).format(iterator4)+"</td>";
										}
									}else{
										if(iterator4 == null)
											articleHtmls += "<td>"+iterator2[j][i]+"</td>";
										else{
											if(iterator2[j][i]=="") articleHtmls += "<td>"+iterator2[j][i]+"</td>";
											else articleHtmls += "<td>"+Number(iterator2[j][i]).format(iterator4)+"</td>";
										}
									}
								}
						}
						
					}
					articleHtmls += "</tr>";
				}
			}else{
				for ( var i = 0; i < iterator.length; i++) {
					articleHtmls += "<tr onclick='view002c.selectedTr(this);' ><td class='sort-desc' nowrap='nowrap'>"+iterator[i]+"</td>";
					for ( var j = 1; j < iterator2.length; j++) {
						iterator4 = iterator3[j];
						if(view002c.ishidesomecols=="Y"&&rc.isInArray(j,view002c.columns)){}else{
							if(javaData.bfbcompare!=undefined && rc.isInArray(j,javaData.bfbcompare.columns)){
								if(iterator2[j][i]>view002c.ratio || iterator2[j][i]==view002c.ratio){
									if(iterator4 == null)
										articleHtmls += "<td style='background:"+javaData.bfbcompare.color+"'>"+iterator2[j][i]+"</td>";
									else{
										if(iterator2[j][i]=="") articleHtmls += "<td style='background:"+javaData.bfbcompare.color+"'>"+iterator2[j][i]+"</td>";
										else articleHtmls += "<td style='background:"+javaData.bfbcompare.color+"'>"+Number(iterator2[j][i]).format(iterator4)+"</td>";
									}
								}else{
									if(iterator4 == null)
										articleHtmls += "<td>"+iterator2[j][i]+"</td>";
									else{
										if(iterator2[j][i]=="") articleHtmls += "<td>"+iterator2[j][i]+"</td>";
										else articleHtmls += "<td>"+Number(iterator2[j][i]).format(iterator4)+"</td>";
									}
									}
								}else{
									if(this.ishidesomecols=='N'&&rc.isInArray(j,this.columns)){
										if(iterator4 == null)
											articleHtmls += "<td style='background:#FFC000;'>"+iterator2[j][i]+"</td>";
										else{
											if(iterator2[j][i]=="") articleHtmls += "<td style='background:#FFC000;'>"+iterator2[j][i]+"</td>";
											else articleHtmls += "<td style='background:#FFC000;'>"+Number(iterator2[j][i]).format(iterator4)+"</td>";
										}
									}else{
										if(iterator4 == null)
											articleHtmls += "<td>"+iterator2[j][i]+"</td>";
										else{
											if(iterator2[j][i]=="") articleHtmls += "<td>"+iterator2[j][i]+"</td>";
											else articleHtmls += "<td>"+Number(iterator2[j][i]).format(iterator4)+"</td>";
										}
									}
								}
						}
					}
					articleHtmls += "</tr>";
				}
			}
		}else{
			if(typeof(dim_index) == "number" || dim_index == undefined || dim_index.length == 1){
				if(dim_index == undefined)
					dim_index = 0;
				else if(typeof(dim_index) != "number"){
					dim_index = parseInt(dim_index[0]);
				}
				if(iterator5 != undefined){
					for ( var i = 0; i < iterator.length; i++) {
						iterator6 = iterator5[i];
						articleHtmls += "<tr onclick='view002c.selectedTr(this);' level='"+iterator6+"' style='background:"+rc.tableTrColor[iterator6]+"'>";
						for ( var j = 0; j < iterator2.length; j++) {
							iterator4 = iterator3[j];
							if(view002c.ishidesomecols=="Y"&&rc.isInArray(j,view002c.columns)){}else{
								if(javaData.bfbcompare!=undefined && rc.isInArray(j,javaData.bfbcompare.columns)){
									if(iterator2[j][i]>view002c.ratio || iterator2[j][i]==view002c.ratio){
										dim_td = j > dim_index?"<td style='background:"+javaData.bfbcompare.color+"'>":"<td style='background:"+javaData.bfbcompare.color+"' onclick='view002c.drawCharts(&quot;"+iterator2[dim_index][i]+"&quot;);' class='sort-desc'>";
									}else{
										dim_td = j > dim_index?"<td>":"<td onclick='view002c.drawCharts(&quot;"+iterator2[dim_index][i]+"&quot;);' class='sort-desc'>";
										}
									}else{
										if(this.ishidesomecols=='N'&&rc.isInArray(j,this.columns))
										dim_td = j > dim_index?"<td style='background:#FFC000;'>":"<td style='background:#FFC000;' onclick='view002c.drawCharts(&quot;"+iterator2[dim_index][i]+"&quot;);' class='sort-desc'>";
										else
											dim_td = j > dim_index?"<td>":"<td onclick='view002c.drawCharts(&quot;"+iterator2[dim_index][i]+"&quot;);' class='sort-desc'>";
									}
							if(iterator4 == null)
								articleHtmls += dim_td+iterator2[j][i]+"</td>";
							else{
								if(iterator2[j][i]=="") articleHtmls += dim_td+iterator2[j][i]+"</td>";
								else articleHtmls += dim_td+Number(iterator2[j][i]).format(iterator4)+"</td>";
							}
							}
						}
						articleHtmls += "</tr>";
					}
				}else{
					for ( var i = 0; i < iterator.length; i++) {
						articleHtmls += "<tr onclick='view002c.selectedTr(this);'>";
						for ( var j = 0; j < iterator2.length; j++) {
							iterator4 = iterator3[j];
							if(view002c.ishidesomecols=="Y"&&rc.isInArray(j,view002c.columns)){}else{
								if(javaData.bfbcompare!=undefined && rc.isInArray(j,javaData.bfbcompare.columns)){
									if(iterator2[j][i]>view002c.ratio || iterator2[j][i]==view002c.ratio){
										dim_td = j > dim_index?"<td style='background:"+javaData.bfbcompare.color+"'>":"<td style='background:"+javaData.bfbcompare.color+"' onclick='view002c.drawCharts(&quot;"+iterator2[dim_index][i]+"&quot;);' class='sort-desc'>";
									}else{
										dim_td = j > dim_index?"<td>":"<td onclick='view002c.drawCharts(&quot;"+iterator2[dim_index][i]+"&quot;);' class='sort-desc'>";
										}
									}else{
										if(this.ishidesomecols=='N'&&rc.isInArray(j,this.columns))
										dim_td = j > dim_index?"<td style='background:#FFC000;'>":"<td style='background:#FFC000;' onclick='view002c.drawCharts(&quot;"+iterator2[dim_index][i]+"&quot;);' class='sort-desc'>";
										else
										dim_td = j > dim_index?"<td>":"<td onclick='view002c.drawCharts(&quot;"+iterator2[dim_index][i]+"&quot;);' class='sort-desc'>";
									}
							if(iterator4 == null)
								articleHtmls += dim_td+iterator2[j][i]+"</td>";
							else{
								if(iterator2[j][i]=="") articleHtmls += dim_td+iterator2[j][i]+"</td>";
								else articleHtmls += dim_td+Number(iterator2[j][i]).format(iterator4)+"</td>";
							}
							}
						}
						articleHtmls += "</tr>";
					}
				}
			}else{
				var dim,
				java_dims = dim_index;
				dim_index = new Hash();
				for ( var i = 0; i < java_dims.length; i++)
					dim_index[java_dims[i]] = 1;
				java_dims = dim_index.keys();
				if(iterator5 != undefined){
					for ( var i = 0; i < iterator.length; i++) {
						dim = new Array();
						for (var j = 0; j < java_dims.length; j++)
							dim.push(iterator2[java_dims[j]][i]);
						dim = dim.toString();
						view002c.dims.push(dim);
						iterator6 = iterator5[i];
						articleHtmls += "<tr onclick='view002c.selectedTr(this);' level='"+iterator6+"' style='background:"+rc.tableTrColor[iterator6]+"'>" +
								"<td onclick='view002c.drawCharts(&quot;"+dim+"&quot;);' class='sort-desc'>"+iterator2[0][i]+"</td>";
						for ( var j = 1; j < iterator2.length; j++) {
							iterator4 = iterator3[j];
							if(view002c.ishidesomecols=="Y"&&rc.isInArray(j,view002c.columns)){}else{
								if(javaData.bfbcompare!=undefined && rc.isInArray(j,javaData.bfbcompare.columns)){
									if(iterator2[j][i]>view002c.ratio || iterator2[j][i]==view002c.ratio){
										if(iterator4 == null)
											articleHtmls += "<td style='background:"+javaData.bfbcompare.color+"'>"+iterator2[j][i]+"</td>";
										else{
											if(iterator2[j][i]=="") articleHtmls += "<td style='background:"+javaData.bfbcompare.color+"'>"+iterator2[j][i]+"</td>";
											else articleHtmls += "<td style='background:"+javaData.bfbcompare.color+"'>"+Number(iterator2[j][i]).format(iterator4)+"</td>";
										}
									}else{
										if(iterator4 == null)
											articleHtmls += "<td>"+iterator2[j][i]+"</td>";
										else{
											if(iterator2[j][i]=="") articleHtmls += "<td>"+iterator2[j][i]+"</td>";
											else articleHtmls += "<td>"+Number(iterator2[j][i]).format(iterator4)+"</td>";
										}
										}
									}else{
										if(this.ishidesomecols=='N'&&rc.isInArray(j,this.columns)){
											if(iterator4 == null)
												articleHtmls += "<td style='background:#FFC000;'>"+iterator2[j][i]+"</td>";
											else{
												if(iterator2[j][i]=="") articleHtmls += "<td style='background:#FFC000;'>"+iterator2[j][i]+"</td>";
												else articleHtmls += "<td style='background:#FFC000;'>"+Number(iterator2[j][i]).format(iterator4)+"</td>";
											}
										}else{
											if(iterator4 == null)
												articleHtmls += "<td>"+iterator2[j][i]+"</td>";
											else{
												if(iterator2[j][i]=="") articleHtmls += "<td>"+iterator2[j][i]+"</td>";
												else articleHtmls += "<td>"+Number(iterator2[j][i]).format(iterator4)+"</td>";
											}
										}
									}
							}
						}
						articleHtmls += "</tr>";
					}
				}else{
					for ( var i = 0; i < iterator.length; i++) {
						dim = new Array();
						for (var j = 0; j < java_dims.length; j++)
							dim.push(iterator2[java_dims[j]][i]);
						dim = dim.toString();
						view002c.dims.push(dim);
						articleHtmls += "<tr onclick='view002c.selectedTr(this);'>" +
								"<td onclick='view002c.drawCharts(&quot;"+dim+"&quot;);' class='sort-desc'>"+iterator2[0][i]+"</td>";
						for ( var j = 1; j < iterator2.length; j++) {
							iterator4 = iterator3[j];
							if(view002c.ishidesomecols=="Y"&&rc.isInArray(j,view002c.columns)){}else{
								if(javaData.bfbcompare!=undefined && rc.isInArray(j,javaData.bfbcompare.columns)){
									if(iterator2[j][i]>view002c.ratio || iterator2[j][i]==view002c.ratio){
										if(iterator4 == null)
											articleHtmls += "<td style='background:"+javaData.bfbcompare.color+"'>"+iterator2[j][i]+"</td>";
										else{
											if(iterator2[j][i]=="") articleHtmls += "<td style='background:"+javaData.bfbcompare.color+"'>"+iterator2[j][i]+"</td>";
											else articleHtmls += "<td style='background:"+javaData.bfbcompare.color+"'>"+Number(iterator2[j][i]).format(iterator4)+"</td>";
										}
									}else{
										if(iterator4 == null)
											articleHtmls += "<td>"+iterator2[j][i]+"</td>";
										else{
											if(iterator2[j][i]=="") articleHtmls += "<td>"+iterator2[j][i]+"</td>";
											else articleHtmls += "<td>"+Number(iterator2[j][i]).format(iterator4)+"</td>";
										}
										}
									}else{
										if(this.ishidesomecols=='N'&&rc.isInArray(j,this.columns)){
											if(iterator4 == null)
												articleHtmls += "<td style='background:#FFC000;'>"+iterator2[j][i]+"</td>";
											else{
												if(iterator2[j][i]=="") articleHtmls += "<td style='background:#FFC000;'>"+iterator2[j][i]+"</td>";
												else articleHtmls += "<td style='background:#FFC000;'>"+Number(iterator2[j][i]).format(iterator4)+"</td>";
											}
										}else{
											if(iterator4 == null)
												articleHtmls += "<td>"+iterator2[j][i]+"</td>";
											else{
												if(iterator2[j][i]=="") articleHtmls += "<td>"+iterator2[j][i]+"</td>";
												else articleHtmls += "<td>"+Number(iterator2[j][i]).format(iterator4)+"</td>";
											}
										}
									}
							}
						}
						articleHtmls += "</tr>";
					}
				}
			}
		}
		iterator = javaData.sum;
		var colcode="A";
		if(javaData.sumdefcol!=undefined){
			colcode=javaData.sumdefcol;
		}
		if(iterator != undefined){
			articleHtmls += "<tr style='background:"+rc.tableTrColor[colcode]+"'>";
			if(view002c.ishidesomecols=="Y"&&rc.isInArray(0,view002c.columns)){}else{
				articleHtmls +="<td style='text-align: left;'>"+VIEWS_LOCALE.view_002.sum+"</td>";}
			for ( var i = 1; i < iterator.length; i++) {
				iterator4 = iterator3[i];
				if(iterator[i] == null) {iterator2='';}
				else if(iterator[i] == ""){iterator2="";}
				else {iterator2 = Number(iterator[i]).format(iterator4);}
				if(view002c.ishidesomecols=="Y"&&rc.isInArray(i,view002c.columns)){}else{
				if(this.ishidesomecols=='N'&&rc.isInArray(i,this.columns))
					articleHtmls += "<td style='background:#FFC000;'>"+iterator2+"</td>";
						else
							articleHtmls += "<td>"+iterator2+"</td>";
				}
			}
			articleHtmls += "</tr></tbody></table>";
		}else
			articleHtmls += "</tbody></table>";
		var temp = jQuery("#view002-table");
		temp.children().remove();
		temp.append(jQuery(articleHtmls));
		if(javaData.specialcol!=undefined&&javaData.specialcol.length>0){
			rc.addspecilbg(javaData.specialcol,"#view002-table > table tbody");
		}
		if(columns>view002c.columnlimit){
			rc.tablecontrol();
		}
		var dom=jQuery("#view002-fixedheader table tbody tr:last");
		dom.removeClass();
		dom.addClass("view002-table-footer");
	},
	_drawLump : function(colIndex,colors){
		var td,
		trs = jQuery("#view002-table > table tbody tr:not(:last)");
		for ( var j = 0; j < trs.length; j++) {
			td = trs.eq(j).children("td:eq("+colIndex+")");
			if(td.width()<64) td.width(64);
			td.append(jQuery("<div class='view002-lump' style='background:"+rc.tableColor[colors[j]]+"'></div>"));
		}
	},
	
	selectedTr : function(DOM){
		var prev = this.prevDOM,
		current = jQuery(DOM);
		if(prev != null)
			prev.css("background",rc.tableTrColor[prev.attr("level")]).toggleClass("activedtr");
		this.prevDOM = current;
		current.toggleClass("activedtr");
	},
	
	chartMax : function(DOM,type){
		jQuery("#controltable").hide();
		jQuery("#hidecolumns").hide();
		this.maxType = type;
		var	chart,select,
		current = jQuery(DOM);
		if(type == "pie"){
			jQuery("#view002-column-buttons").hide();
			jQuery("#view002-column").hide();
			current.css("right",-542);
			chart = jQuery("#view002-pie");
			select = jQuery("#view002-pie-select");
		}else{
			jQuery("#view002-pie-buttons").hide();
			jQuery("#view002-pie").hide();
			chart = jQuery("#view002-column");
			select = jQuery("#view002-column-select");
		}
		current.html(VIEWS_LOCALE.view_002.restore);
		jQuery("#view002-table").hide();
		jQuery("#view002-table-max").hide();
		chart.css({"width":1024,"height":622});
		select.trigger("change");
		DOM.onclick = function(){view002c.backUpChart(DOM,type);};
		jQuery("#view002-fixedheader").hide();
	},
	
	backUpChart : function(DOM,type){
		jQuery(".view003-scroll").stop(true);
		jQuery("#view002-fixedheader").hide();
		this.maxType = null;
		var select,
		current = jQuery(DOM);
		if(this.showtable!=undefined){
			jQuery("#controltable").show();
			if(this.columns.length>0) jQuery("#hidecolumns").show();
		}
		if(type == "pie"){
			if(this.charts == 2){
				jQuery("#view002-pie").css({"width":482,"height":370});
				jQuery("#view002-column-buttons").show();
				jQuery("#view002-column").show();
				current.css("right",0);
			}
			else
				jQuery("#view002-pie").css({"width":1024,"height":370});
			select = jQuery("#view002-pie-select");
		}else{
			if(this.charts == 2){
				jQuery("#view002-pie-buttons").show();
				jQuery("#view002-pie").show();
				jQuery("#view002-column").css({"width":542,"height":370});
			}
			else
				jQuery("#view002-column").css({"width":1024,"height":370});
			select = jQuery("#view002-column-select");
		}
		jQuery("#view002-table-max").show();
		jQuery("#view002-table").show();
		if(this.showtable=="N"){
			if(type == "pie"){
				jQuery("#view002-pie").height(jQuery("#view002-details").height());
			}else{
				jQuery("#view002-column").height(jQuery("#view002-details").height());
			}
			jQuery(".controltable").hide();
		}
		select.trigger("change");
		current.html(VIEWS_LOCALE.view_002.fullScreen);
		DOM.onclick = function(){view002c.chartMax(DOM,type);};
		jQuery("#view002-fixedheader").show();
	},
	
	tableToggle : function(DOM,type){
		var current = jQuery(DOM),
		table = jQuery("#view002-table"),
		charts = jQuery("#view002-charts");
		jQuery("#view002-fixedheader").hide();
		jQuery("#view002-table > table").css("margin-left",0);
		if(table.height() == 214){
			jQuery("#controltable").hide();
			this.maxType = type;
			charts.animate({
				left: "+=200",
				opacity: 0.25,
				height: 'toggle'
			}, 700, function() {
				table.height(586);
				current.html(VIEWS_LOCALE.view_002.restore);
				view002c._fixedHeader();
			});
		}else{
			jQuery("#controltable").show();
			this.maxType = null;
			charts.animate({
				opacity: 1,
				left: 0,
				height: 'toggle'
			}, 1000, function() {
				if(view002c.isNotPad && view002c.width < 768){
				jQuery("#view002-banner").css("width",view002c.width);
				table.height(jQuery("#view002-table > table").height() + 8);
				}else{
					table.height(214);
				}
				current.html(VIEWS_LOCALE.view_002.fullScreen);
				view002c._fixedHeader();
			});
		}
	},
	
	updateCharts : function(DOM,type){
		var options,
		itself = jQuery(DOM);
		var divdata = itself.data("options")[DOM.value];
		if(type == "pie"){
			options = Object.clone(this.pieOptions);
			options.rcOptions = divdata.rcOptions;
			options.title = divdata.title;
			options.chart.renderTo="view002-pie";
			options.series=[{data: divdata.data}];
			if(divdata.end)
				options.plotOptions.series.point.events.click = function(){};
			else
				options.plotOptions.series.point.events.click = function(){
					var category;
					if(view002c.dims.length > 0){
						category = view002c.dims[this.idx];
					}else{
						category = this.name;
					}
					view002c.drawCharts(category);
				};
		}else{
			options = Object.clone(this.columnOptions);
			options.title = divdata.title;
			options.chart.renderTo="view002-column";
			options.rcOptions = divdata.rcOptions;
			options.xAxis= divdata.xAxis;
			options.yAxis= divdata.yAxis;
			options.series = divdata.series;
			if(divdata.series.length == 1)
				options.legend = {enabled: false};
			if(divdata.end)
				options.plotOptions.series.point.events.click = function(){};
			else
				options.plotOptions.series.point.events.click = function(){
					var category;
					if(view002c.dims.length > 0){
						category = view002c.dims[this.idx];
					}else{
						category = this.category;
					}
					view002c.drawCharts(category);
				};
		}
		new Highcharts.Chart(options);
	},
	
	setFilter : function(DOM,relative){
		var input = jQuery(DOM).prev();
		input.attr("checked",input.attr("checked") == "checked"?false:"checked");
		this.refresh();
	},
	
	getFilter : function(){
		this.trans.params.bfilterid = rc.bfilterid;
		this.trans.params.filterid = rc.filterid;
	},
	
	fullScreen : function(DOM,type){
		jQuery(".view003-scroll").stop(true);
		if(type == "table")
			this.tableToggle(DOM,type);
		else
			this.chartMax(DOM,type);
	},
	
	/**
	 * Description : to restore DOM heights and widthes of the combination charts
	 * 
	 * type: private
	 * */
	_initCombination : function(){
		var DOM,current,
		type = this.maxType;
		if(type != null){
			jQuery("#view002-loading").show();
			jQuery("#view002-table table").remove();
			if(type != "table"){
				if(type == "pie"){
					DOM = document.getElementById("view002-pie-max");
					current = jQuery(DOM);
					jQuery("#view002-column-buttons").show();
					jQuery("#view002-column").show();
					current.css("right",0);
				}else{
					DOM = document.getElementById("view002-column-max");
					current = jQuery(DOM);
				}
				jQuery("#view002-table-max").show();
				jQuery("#view002-table").show();
				DOM.onclick = function(){view002c.chartMax(DOM,type);};
			}else{
				DOM = document.getElementById("view002-table-max");
				current = jQuery(DOM);
				jQuery("#view002-charts").css({"left":0,"opacity": 1,"display":"block"});
				jQuery("#view002-table").height(214);
			}
			current.html(VIEWS_LOCALE.view_002.fullScreen).show();
			this.maxType = null;
		}
		if(view002c.isNotPad && view002c.width < 768){
			jQuery("#view002-table").css({"width":view002c.width});
			jQuery("#view002-pie").css({"width":view002c.width,"height":360});
			jQuery("#view002-column").css({"width":view002c.width,"height":360});
		}else{
			jQuery("#view002-pie").css({"width":482,"height":370});
			jQuery("#view002-column").css({"width":542,"height":370});
		}
	},
	
	/**
	 * Description : to delete the html DOM for next data input.
	 * 
	 * type: private
	 * */
	_deleteDOM : function(refresh){
		if(this.singleChart){
			jQuery("#view002-single > div").remove();
		}else{
			if(!refresh){
				jQuery("#view002-dimensions ul li").remove();
				jQuery("#view002-pie-select option").remove();
				jQuery("#view002-column-select option").remove();
			}
		}
	},
	
	/**
	 * Description : to send new ajax for showing upper level reports.
	 * 
	 * type: public
	 * */
	goBack : function(){
		this.ajaxPrams.pop();
		this.back = true;
		this._deleteDOM(false);
		this.chainInfo.pop();
		if(this.singleChart){
			if(this.ajaxPrams.length < 1){
				this.gotoHomePage();
				return;
			}else{
				if(this.chainInfo[this.chainInfo.length-1].type != "single")
					this.dimIndex = this.chainInfo[this.chainInfo.length-1].dim;
			}
		}else{
			this.ajaxPrams.pop();
			if(this.ajaxPrams.length < 1){
				this.gotoHomePage();
				return;
			}else{
				if(this.chainInfo[this.chainInfo.length-1].type != "single"){
					this.ajaxPrams.pop();
					this.dimIndex = this.chainInfo[this.chainInfo.length-1].dim;
				}
			}
		}
		this._drawCharts();
	},
	
	controlTable : function(){
			if(this.showtable=="N"){
				jQuery("#kpi-filter").show();
				jQuery("#controltable").show();
				jQuery("#controltable").html(VIEWS_LOCALE.main.showtable);
				jQuery(".controltable").hide();
				if(this.javaData.pie_charts.length>0){
					jQuery("#view002-pie").height(jQuery("#view002-details").height());
					jQuery("#view002-pie-select").trigger("change");
				}
				if(this.javaData.column_charts.length>0){
					jQuery("#view002-column").height(jQuery("#view002-details").height());
					jQuery("#view002-column-select").trigger("change");
				}
			}else{
				jQuery("#kpi-filter").show();
				jQuery("#controltable").show();
				jQuery("#controltable").html(VIEWS_LOCALE.main.hidetable);
				jQuery(".controltable").show();
				if(this.javaData.pie_charts.length>0){
					jQuery("#view002-pie").height("370");
					jQuery("#view002-pie-select").trigger("change");
				}
				if(this.javaData.column_charts.length>0){
					jQuery("#view002-column").height("370");
					jQuery("#view002-column-select").trigger("change");
				}
			}
	},
	
	controlbutton : function(){
		if(this.showtable=="N"){
			jQuery("#controltable").html(VIEWS_LOCALE.main.hidetable);
			if(this.columns.length>0)
			jQuery("#hidecolumns").show();
			if(this.ishidesomecols=="Y"){
				jQuery("#hidecolumns").html(VIEWS_LOCALE.main.showallcols);
			}else{
				jQuery("#hidecolumns").html(VIEWS_LOCALE.main.hidesomecols);
			}
			this.showtable="Y";
		}else{
			jQuery("#controltable").html(VIEWS_LOCALE.main.showtable);
			jQuery("#hidecolumns").hide();
			this.showtable="N";
		}
		view002c.controlTable();
	},
	_controlbutton : function(){
		if(this.ishidesomecols=='N'){
			jQuery("#hidecolumns").html(VIEWS_LOCALE.main.showallcols);
			this.ishidesomecols='Y';
		}else{
			jQuery("#hidecolumns").html(VIEWS_LOCALE.main.hidesomecols);
			this.ishidesomecols='N';
		}
		this._drawtable(this.javaData);
		view002c._fixedHeader();
	},
	/**
	 * Description : to goBack to rechoose the category.
	 * 
	 * type: public
	 * */
	gotoHomePage : function(){
		jQuery(".rc-filter").hide();
	    jQuery("#singlestore").hide();
	    jQuery('#singlestore option:first').attr('selected','selected');
		this.chainInfo = new Array();
		this.back = false;
		this._deleteDOM(false);
		jQuery("#view002-title").html("");
		jQuery(".viewport").hide();
		jQuery("#views").hide();
		jQuery(".mainpageajax").hide();
	},
	
	/**
	 * Description : to refresh the current reports.
	 * 
	 * type: public
	 * */
	refresh : function(){
		this._deleteDOM(true);
		if(this.singleChart)
			this._drawCharts();
		else
			jQuery(".active").trigger("click");
	}
};
View002Control.main = function(){
	view002c=new View002Control();
};
jQuery(document).ready(View002Control.main);