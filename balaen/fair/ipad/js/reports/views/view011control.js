var view011c;
var View011Control = Class.create();
View011Control.prototype = {
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
		this.columnlimit=16;
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
				view: "view011",
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
			itemStyle:{font: '12px Verdana'},
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
		options.plotOptions.series.dataLabels = {
			enabled: true,
			formatter: function() {
				return this.point.actual;
			},
			style: {font: 'normal 12px Verdana, sans-serif'}
		};
		this.columnOptions = Object.clone(options);
		options = VIEWS_LOCALE.view_002.fullScreen;
		jQuery("#views").append(jQuery("<div id='view011' class='viewport'><div id='view011-title'></div><div id='view011-buttons'><div id='view011-back' class='view011-button' onclick='view011c.goBack();'>" +
				"<div id='view011-back-value' class='view011-button-value'>"+VIEWS_LOCALE.view_002.back+"</div></div><div id='view011-homepage'" +" class='view011-button' onclick='view011c.gotoHomePage();'><div id='view011-homepage-value'" +
				"class='view011-button-value'>"+VIEWS_LOCALE.view_002.homepage+"</div></div><div id='view011-refresh' class='view011-button' onclick='view011c.refresh();'><div id='view011-refresh-value'  class='view011-button-value'>"+
				VIEWS_LOCALE.view_002.refresh+"</div></div>" +"</div><div id='view011-single' class='view011-rpt'></div><div id='view011-single-legend'></div><div id='view011-mixed' class='view011-rpt'><div id='view011-dimensions'><ul></ul></div><div id='view011-details'>" +
				"<div id='view011-charts'><div id='view011-pie'></div><div id='view011-pie-buttons' class='ajaxnoshow'>" +"<select id='view011-pie-select' onchange=view011c.updateCharts(this,'pie');></select><div id='view011-pie-max'" +
				"class='view011-max' onclick=view011c.fullScreen(this,'pie');>"+options+"</div></div><div id='view011-column'></div><div id='view011-column-buttons' class='ajaxnoshow'><select id='view011-column-select'" +
				"onchange=view011c.updateCharts(this,'column');></select><span id='view011-column-max' class='view011-max'onclick=view011c.fullScreen(this,'column');>"	+options+"</span></div></div><div id='view011-table-max' class='ajaxnoshow'" +
				"onclick=view011c.fullScreen(this,'table');>"+options+"</div>"+"<div id='view011-table'></div></div></div><div id='view011-loading' class='mainpageajax'><div class='loadingimg'><div class='loadinglocale'>"+
				VIEWS_LOCALE.main.loading+"</div></div></div><div id='view011-nomatched' class='mainpageajax'><div class='noresult'>"+VIEWS_LOCALE.main.noResult+"</div></div></div>"));
//		if(rc.filter){
//			jQuery("<div id='view011-filter' class='rc-filter'><input type='checkbox' onchange=view011c.refresh(); /><span onclick='view011c.setFilter(this);'>"+VIEWS_LOCALE.main.filter+"</span></div>").insertAfter(jQuery("#view011-buttons"));
//		}
	},
	
	
	/**
	 * Description : to generate first rpt.
	 * 
	 * @type public
	 * */
	getActived : function(viewport){
		rc.actived = 2;
//		jQuery("#view011-filter input").attr("checked",false);
		rc.initFilter(viewport);
		jQuery("#views").show();
		jQuery("#view011").show();
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
		jQuery("#view011-title").html(title);
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
		jQuery(".view011-scrollc div").stop(true);
		var touches = view011c.getNativeEvent(event).touches,
		type = view011c.scrollparams.type;
		if(type != null){
			var div = type == "v" ? "#view011-scrollbar-y > div" : type == "h" ? "#view011-scrollbar-x > div" : ".view011-scrollc div";
			jQuery(div).css({opacity: 1,display: "block"});
			if ( touches && touches.length === 1 ) {
				var t = touches[0];
				view011c.touchStart.x = view011c.start.x = t.pageX;
				view011c.touchStart.y = view011c.start.y = t.pageY;
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
		jQuery(".view011-scrollc div").animate({opacity: 0},1400);
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
		var touches = view011c.getNativeEvent(event).touches;
		if ( touches && touches.length === 1 ) {
			var t = touches[0],
			params = view011c.scrollparams,
			type = params.type,
			table = jQuery("#view011-table > table");
			if(type == "v"){//only vertical scroll.
				var y = t.pageY,
				cheight = params.cheight,
				theight = params.theight,
				top= parseInt(table.css("margin-top").replace(/px/g, ""));
				params.top = top;
				top +=  y - view011c.start.y;
				view011c.start.y = y;
				if(top > 0){
					top = 0;
				}else if(top+theight < cheight){
					top = cheight - theight;
				}
				table.css("margin-top",top);
				jQuery("#view011-scrollbar-y div").css("top", top*params.scrollY);
			}else if(type == "h"){//only horizontal scroll.
				var x = t.pageX,
				cwidth = params.cwidth,
				twidth = params.twidth,
				left = parseInt(table.css("margin-left").replace(/px/g, ""));
				params.left =  left;
				left +=  x - view011c.start.x;
				view011c.start.x = x;
				table = jQuery("#view011-table table");
				if(left > 0){
					left = 0;
				}
				else if(left+twidth < cwidth){
					left = cwidth - twidth;
				}
				table.css("margin-left",left);
				jQuery("#view011-scrollbar-x div").css({left: left*params.scrollX});
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
				left +=  x - view011c.start.x;
				top +=  y - view011c.start.y;
				view011c.start.x = x;
				view011c.start.y = y;
				if(top > 0)
					top = 0;
				else if(top+theight < cheight)
					top = cheight - theight;
				if(left > 0)
					left =0;
				else if(left+twidth < cwidth)
					left = cwidth - twidth;
				jQuery("#view011-fixedheader table").css("margin-left",left);
				jQuery("#view011-scrollbar-x div").css({left: left*params.scrollX});
				jQuery("#view011-scrollbar-y div").css("top", top*params.scrollY);
				table.css({
					"margin-top": top,
					"margin-left": left
				});
			}//type = null
		}
	},
	
	_bindTouchEvent : function(){
		var params = this.scrollparams,
		div = jQuery("#view011-table"),
		table = jQuery("#view011-table > table"),
		cwidth = params.cwidth = div.width()-4,//to consider border.
		twidth = params.twidth = table.width(),
		cheight = params.cheight = div.height()-4,
		theight = params.theight = table.height(),
		scrollx = jQuery("#view011-scrollbar-x").width() - twidth + cwidth,
		scrolly = jQuery("#view011-scrollbar-y").height() - theight + cheight;
		scrollx = scrollx < 32 ? 32 : scrollx;
		scrolly = scrolly < 32 ? 32 : scrolly;
		jQuery("#view011-scrollbar-x div").width(scrollx);
		jQuery("#view011-scrollbar-y div").height(scrolly);
		params.scrollX = (jQuery("#view011-scrollbar-x").width() - scrollx)/(cwidth-twidth);
		params.scrollY = (jQuery("#view011-scrollbar-y").height() - scrolly)/(cheight-theight);
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
			jQuery("#view011-table").bind("touchstart",this.handleTouchStart).bind("touchend",this.handleTouchEnd).bind("touchmove",this.handleTouchMove);
		}
	},
	
	_fixedHeader : function(){
		jQuery("#view011-table").children("div").remove();
		jQuery("#view011-table > table").css("margin-top",0);
		var height = jQuery("#view011-table > table thead").height(),
		table = jQuery("#view011-table > table");
		jQuery("#view011-table > table tbody tr:first td:first").css("min-width",45);
		jQuery("<div id='view011-fixedheader'></div><div id='view011-scrollbar-y' class='view011-scrollc'><div class='view011-scroll view011-scrollbar view011-scrolly'></div></div>" +
				"<div id='view011-scrollbar-x' class='view011-scrollc'><div class='view011-scroll view011-scrollbar view011-scrollx'></div></div>").insertBefore(table);
		jQuery("#view011-fixedheader").append(table.clone());
		jQuery("#view011-fixedheader").height(height);
		table.addClass("view011-scrollx view011-scrolly");
		this._bindTouchEvent();
	},
	
	/**
	 * Description : to draw charts according to global params and ajax params.
	 * 
	 * @type private
	 * */ 
	_drawCharts : function(category){
		if(category != undefined)this.ajaxPrams.push(category);
		jQuery("#view011-single-legend").hide().children().remove();
		jQuery("#view011-loading").show();
		jQuery("#view011-nomatched").hide();
		/*send ajax*/
		viewchain = this.ajaxPrams.toString().split(",");
		this.trans.params.viewchain = viewchain;
		this.getFilter();
		portalClient.sendOneRequest(this.trans, function(response){
			var javaData= response.data[0].result;
			var action = javaData.action,
			data = javaData.data;
			if(action == undefined || data == undefined){
				view011c.ajaxPrams.push("error");
				view011c.chainInfo.push({
					type: "single",
					dim: null,
				});
				this.singleChart = false;
				alert("返回的result缺少data或则action。");
			}else{
				if(action == "filter"){
					view011c.ajaxPrams.pop();
					jQuery("#view011-loading").hide();
					if(data != null)
						window.location.replace(data);
				}else if(action == "dims")
					view011c._drawDimensions(data);
				else
					view011c._drawSingle(data);
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
		jQuery("#view011-single > div").remove();
		this.singleChart = true;
		this._writeTitle(javaData.title);
		var data = new Array(),
		ul = jQuery("#view011-single-legend");
		options = Object.clone(this.pieOptions);
		options.chart.renderTo="view011-single";
		options.rcOptions={unit: javaData.unit};
		options.title = {text: javaData.title};
		for ( var i = 0; i < javaData.categories.length; i++) {
			data.push({
				name: javaData.categories[i],
				color: rc.chartsColors[i+1],
				y: javaData.data[i]
			});
			jQuery("<div class='view011-single-legend-item' onclick=view011c.drawChartsBylengend(this);><div class='view011-single-legend-item-name'>"+javaData.categories[i]+
					"</div><div class='view011-single-legend-item-color' style='background:"+rc.chartsColors[i+1]+"'></div></div>").appendTo(ul);
		}
		options.series=[{data: data}];
		options.plotOptions.series.point.events.click = function(){
			view011c.drawCharts(this.name);
		};
		new Highcharts.Chart(options);
		jQuery("#view011-single-legend").show();
		jQuery("#view011-mixed").hide();
		jQuery("#view011-single").show();
		jQuery("#view011-loading").hide();
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
		temp = jQuery("#view011-dimensions ul");
		temp.children().remove();
		for ( var i = 0; i < javaData.length; i++) {
			html += "<li class='button' onclick=view011c.switchDimension('"+javaData[i]+"',this,'"+i+"');><div class='dimensionname'>"+javaData[i]+"</div></li>";
		}
		temp.append(html);
		this.ajaxPrams.push(javaData[0]);
		if(this.back) {
			jQuery("#view011-dimensions ul li:eq("+this.dimIndex+")").trigger("click");
			this.back = false;
		}
		else jQuery("#view011-dimensions ul li:first").trigger("click");
	},
	
	switchDimension : function(dimension,DOM,index){
		this.dims.clear();
		jQuery("#view011-nomatched").hide();
		jQuery("#view011-loading").show();
		this._initCombination();
		this.ajaxPrams.pop();
		this.ajaxPrams.push(dimension);
		this.chainInfo[this.chainInfo.length-1].dim = parseInt(index);
		var viewchain = this.ajaxPrams.toString().split(",");
		this.trans.params.viewchain = viewchain;
		jQuery("#view011-dimensions ul li").attr("class","button");
		jQuery(DOM).attr("class","active");
		this.charts = 2;
		this.getFilter();
		portalClient.sendOneRequest(this.trans, function(response){
				var javaData= response.data[0].result.data;
				view011c.end = response.data[0].result.end == "Y" ? true: false;
				if(javaData.table.length == 0){
					jQuery("#view011-loading").hide();
					jQuery("#view011-nomatched").show();
				}else{
					view011c._writeTitle(javaData.title);
					jQuery("#view011-pie").children().remove();
					jQuery("#view011-column").children().remove();
					var iterator2,iterator3,iterator4,iterator6,iterator7,dim_td,
					dim_index = javaData.dim_index,
					iterator5 = javaData.trcolors,
					articleHtmls = "<table><thead><tr>",
					headSecondTr = "<tr class='attr-region'>",
					iterator = javaData.header;
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
					if(view011c.end){
						if(iterator5 != undefined){
							for ( var i = 0; i < iterator.length; i++) {
								iterator6 = iterator5[i];
								articleHtmls += "<tr onclick='view011c.selectedTr(this);' level='"+iterator6+"' style='background:"+rc.tableTrColor[iterator6]+"'><td class='sort-desc' nowrap='nowrap'>"+iterator[i]+"</td>";
								for ( var j = 1; j < iterator2.length; j++) {
									iterator4 = iterator3[j];
									if(iterator4 == null)
										articleHtmls += "<td>"+iterator2[j][i]+"</td>";
									else
										articleHtmls += "<td>"+Number(iterator2[j][i]).format(iterator4)+"</td>";
									
								}
								articleHtmls += "</tr>";
							}
						}else{
							for ( var i = 0; i < iterator.length; i++) {
								articleHtmls += "<tr onclick='view011c.selectedTr(this);' ><td class='sort-desc' nowrap='nowrap'>"+iterator[i]+"</td>";
								for ( var j = 1; j < iterator2.length; j++) {
									iterator4 = iterator3[j];
									if(iterator4 == null)
										articleHtmls += "<td>"+iterator2[j][i]+"</td>";
									else
										articleHtmls += "<td>"+Number(iterator2[j][i]).format(iterator4)+"</td>";
									
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
									articleHtmls += "<tr onclick='view011c.selectedTr(this);' level='"+iterator6+"' style='background:"+rc.tableTrColor[iterator6]+"'>";
									for ( var j = 0; j < iterator2.length; j++) {
										iterator4 = iterator3[j];
										dim_td = j > dim_index?"<td>":"<td onclick='view011c.drawCharts(&quot;"+iterator2[dim_index][i]+"&quot;);' class='sort-desc'>";
										if(iterator4 == null)
											articleHtmls += dim_td+iterator2[j][i]+"</td>";
										else
											articleHtmls += dim_td+Number(iterator2[j][i]).format(iterator4)+"</td>";
										
									}
									articleHtmls += "</tr>";
								}
							}else{
								for ( var i = 0; i < iterator.length; i++) {
									articleHtmls += "<tr onclick='view011c.selectedTr(this);'>";
									for ( var j = 0; j < iterator2.length; j++) {
										iterator4 = iterator3[j];
										dim_td = j > dim_index?"<td>":"<td onclick='view011c.drawCharts(&quot;"+iterator2[dim_index][i]+"&quot;);' class='sort-desc'>";
										if(iterator4 == null)
											articleHtmls += dim_td+iterator2[j][i]+"</td>";
										else
											articleHtmls += dim_td+Number(iterator2[j][i]).format(iterator4)+"</td>";
										
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
									view011c.dims.push(dim);
									iterator6 = iterator5[i];
									articleHtmls += "<tr onclick='view011c.selectedTr(this);' level='"+iterator6+"' style='background:"+rc.tableTrColor[iterator6]+"'>" +
											"<td onclick='view011c.drawCharts(&quot;"+dim+"&quot;);' class='sort-desc'>"+iterator2[0][i]+"</td>";
									for ( var j = 1; j < iterator2.length; j++) {
										iterator4 = iterator3[j];
										if(iterator4 == null)
											articleHtmls += "<td>"+iterator2[j][i]+"</td>";
										else
											articleHtmls += "<td>"+Number(iterator2[j][i]).format(iterator4)+"</td>";
										
									}
									articleHtmls += "</tr>";
								}
							}else{
								for ( var i = 0; i < iterator.length; i++) {
									dim = new Array();
									for (var j = 0; j < java_dims.length; j++)
										dim.push(iterator2[java_dims[j]][i]);
									dim = dim.toString();
									view011c.dims.push(dim);
									articleHtmls += "<tr onclick='view011c.selectedTr(this);'>" +
											"<td onclick='view011c.drawCharts(&quot;"+dim+"&quot;);' class='sort-desc'>"+iterator2[0][i]+"</td>";
									for ( var j = 1; j < iterator2.length; j++) {
										iterator4 = iterator3[j];
										if(iterator4 == null)
											articleHtmls += "<td>"+iterator2[j][i]+"</td>";
										else
											articleHtmls += "<td>"+Number(iterator2[j][i]).format(iterator4)+"</td>";
										
									}
									articleHtmls += "</tr>";
								}
							}
						}
					}
					iterator = javaData.sum;
					if(iterator != undefined){
						articleHtmls += "<tr><td style='text-align: right;'>"+VIEWS_LOCALE.view_002.sum+"</td>";
						for ( var i = 1; i < iterator.length; i++) {
							iterator4 = iterator3[i];
							if(iterator[i] == null) iterator2='';
							else iterator2 = Number(iterator[i]).format(iterator4);
							articleHtmls += "<td>"+iterator2+"</td>";
						}
						articleHtmls += "</tr></tbody></table>";
					}else
						articleHtmls += "</tbody></table>";
					var temp = jQuery("#view011-table");
					temp.children().remove();
					temp.append(jQuery(articleHtmls));
					if(columns>view011c.columnlimit){
						rc.tablecontrol();
					}
					var dom=jQuery("#view011-fixedheader table tbody tr:last");
					dom.removeClass();
					dom.addClass("view011-table-footer");
					
					var actual,options,iterator2,
					category = undefined,
					colorCounts = rc.chartsColors.length,
					data = new Array(),
					select = jQuery("#view011-pie-select"),
					iterator = javaData.pie_charts;
					jQuery("#view011-pie").show();
					jQuery("#view011-pie-buttons").show();
					jQuery("#view011-column").show();
					jQuery("#view011-column-buttons").show();
					if(iterator == undefined || iterator.length == 0){
						jQuery("#view011-pie").hide();
						jQuery("#view011-pie-buttons").hide();
						view011c.charts--;
					}else{
						select.children().remove();
						dim_index = javaData.dim_index;
						for ( var i = 0; i < iterator.length; i++) {
							options = new Object();
							actual = new Array();
							options.title = {text: iterator[i].title};
							dim_index = javaData.dim_index;
							if(dim_index == undefined)
								dim_index = 0;
							else if (typeof(dim_index) != "number"){
								dim_index = dim_index[dim_index.length-1];
							}
							options.rcOptions= {unit: iterator[i].unit,category: category};
							options.end = view011c.end;
							iterator2 = javaData.table[iterator[i].colidx];
							iterator5 = javaData.fmt;
							iterator6 = iterator5[iterator[i].colidx];
							if(iterator6 == null){
								for ( var j = 0; j < iterator2.length; j++) {
									actual.push({
										idx:j,
										actual: iterator2[j],
										name: javaData.table[dim_index][j],
										color: rc.chartsColors[(j+1)%colorCounts],
										y: iterator2[j]
									});
								}
							}else{
								for ( var j = 0; j < iterator2.length; j++) {
									actual.push({
										idx:j,
										actual: Number(iterator2[j]).format(iterator6),
										name: javaData.table[dim_index][j],
										color: rc.chartsColors[(j+1)%colorCounts],
										y: iterator2[j]
									});
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
						jQuery("#view011-column").hide();
						jQuery("#view011-column-buttons").hide();
						jQuery("#view011-pie-max").css("right",-542);
						jQuery("#view011-pie").css({"width":1024,"height":392});
						if(view011c.charts == 2)
							jQuery("#view011-pie-select").data("options",data).trigger("onchange");
						view011c.charts--;
					}else{
						if(view011c.charts == 2)
							jQuery("#view011-pie-select").data("options",data).trigger("onchange");
						else
							jQuery("#view011-column").css({width:1024,height:392});
						var planning,variable,m_planning,m_actual,v_var,max,column_options;
						data = new Array();
						select = jQuery("#view011-column-select");
						select.children().remove();
						iterator5 = javaData.fmt;
						for (var i = 0; i < iterator.length; i++) {
							column_options = new Object();
							actual = new Array();
							variable = new Array();
							dim_index = javaData.dim_index;
							if(dim_index == undefined)
								dim_index = 0;
							else if (typeof(dim_index) != "number"){
								dim_index = dim_index[dim_index.length-1];
							}
							column_options.rcOptions= {unit: iterator[i].unit, varable: iterator[i].coltitle[2],category: category};
							column_options.end = view011c.end;
							column_options.xAxis={categories: Object.clone(javaData.table[dim_index])};
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
							planning = javaData.table[iterator[i].colidx[0]];
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
									v_var = iterator3[j];
									variable.push({
										idx:j,
										actual: iterator6 == null?v_var :Number(v_var).format(iterator6),
										y: max*v_var/100
									});
									actual.push({
										idx:j,
										actual: iterator7 == null?iterator2[j]:Number(iterator2[j]).format(iterator7),
										color:rc.noticeColor[iterator4[i][j]],
										y:iterator2[j]
									});
								}
								if(javaData.tablecolors != undefined && javaData.tablecolors.length > 0)
									view011c._drawLump(iterator[i].colidx[2],javaData.tablecolors[i]);
							}else{
								iterator6 = iterator[i].colidx;
								iterator7 = iterator5[iterator6[iterator6.length-1]];
								if(iterator4[i] != undefined && iterator4[i].length != 0){
									if(iterator7 == null)
										for ( var j = 0; j < iterator2.length; j++)
											actual.push({
												idx:j,
												actual: iterator2[j],
												color: rc.noticeColor[iterator4[i][j]],
												y: iterator2[j]
											});
									else
										for ( var j = 0; j < iterator2.length; j++)
											actual.push({
												idx:j,
												actual: Number(iterator2[j]).format(iterator7),
												color: rc.noticeColor[iterator4[i][j]],
												y: iterator2[j]
											});
								}else{
									if(iterator7 == null)
										for ( var j = 0; j < iterator2.length; j++)
											actual.push({
												idx:j,
												actual: iterator2[j],
												color: rc.noticeColor["g"],
												y: iterator2[j]
											});
									else
										for ( var j = 0; j < iterator2.length; j++)
											actual.push({
												idx:j,
												actual: Number(iterator2[j]).format(iterator7),
												color: rc.noticeColor["g"],
												y: iterator2[j]
											});
								}
							}
							iterator6 = iterator5[iterator[i].colidx[0]];
							if(iterator6 == null){
								for ( var j = 0; j < planning.length; j++) {
									iterator7 = planning[j];
									planning[j] = {
										idx:j,
										actual: iterator7,
										y: iterator7
									};
								}
							}else{
								for ( var j = 0; j < planning.length; j++) {
									iterator7 = planning[j];
									planning[j] = {
										idx:j,
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
					jQuery("#view011-single").hide();
					jQuery("#view011-mixed").show();
					if(javaData.fullTable == "Y"){
						jQuery("#view011-table-max").trigger("click").hide();
					}else{
						view011c._fixedHeader();
					}
					jQuery("#view011-loading").hide();
					/*end ajax*/
					if(javaData.status!=undefined){
						view011c.stylespecial(javaData.status);
					}
				}
			});
	},
	
	_drawLump : function(colIndex,colors){
		var td,
		trs = jQuery("#view011-table > table tbody tr:not(:last)");
		for ( var j = 0; j < trs.length; j++) {
			td = trs.eq(j).children("td:eq("+colIndex+")");
			if(td.width()<64) td.width(64);
			td.append(jQuery("<div class='view011-lump' style='background:"+rc.tableColor[colors[j]]+"'></div>"));
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
		this.maxType = type;
		var	chart,select,
		current = jQuery(DOM);
		if(type == "pie"){
			jQuery("#view011-column-buttons").hide();
			jQuery("#view011-column").hide();
			current.css("right",-542);
			chart = jQuery("#view011-pie");
			select = jQuery("#view011-pie-select");
		}else{
			chart = jQuery("#view011-column");
			select = jQuery("#view011-column-select");
		}
		current.html(VIEWS_LOCALE.view_002.restore);
		jQuery("#view011-table").hide();
		jQuery("#view011-table-max").hide();
		chart.css({"width":1024,"height":634});
		select.trigger("change");
		DOM.onclick = function(){view011c.backUpChart(DOM,type);};
		jQuery("#view011-fixedheader").hide();
	},
	
	backUpChart : function(DOM,type){
		jQuery(".view003-scroll").stop(true);
		jQuery("#view011-fixedheader").hide();
		this.maxType = null;
		var select,
		current = jQuery(DOM);
		if(type == "pie"){
			if(this.charts == 2){
				jQuery("#view011-pie").css({"width":482,"height":392});
				jQuery("#view011-column-buttons").show();
				jQuery("#view011-column").show();
				current.css("right",0);
			}
			else
				jQuery("#view011-pie").css({"width":1024,"height":392});
			select = jQuery("#view011-pie-select");
		}else{
			if(this.charts == 2)
				jQuery("#view011-column").css({"width":542,"height":392});
			else
				jQuery("#view011-column").css({"width":1024,"height":392});
			select = jQuery("#view011-column-select");
		}
		jQuery("#view011-table-max").show();
		jQuery("#view011-table").show();
		select.trigger("change");
		current.html(VIEWS_LOCALE.view_002.fullScreen);
		DOM.onclick = function(){view011c.chartMax(DOM,type);};
		jQuery("#view011-fixedheader").show();
	},
	
	tableToggle : function(DOM,type){
		var current = jQuery(DOM),
		table = jQuery("#view011-table"),
		charts = jQuery("#view011-charts");
		jQuery("#view011-fixedheader").hide();
		if(table.height() == 214){
			this.maxType = type;
			charts.animate({
				left: "+=200",
				opacity: 0.25,
				height: 'toggle'
			}, 700, function() {
				table.height(604);
				current.html(VIEWS_LOCALE.view_002.restore);
				view011c._fixedHeader();
			});
		}else{
			this.maxType = null;
			charts.animate({
				opacity: 1,
				left: 0,
				height: 'toggle'
			}, 1000, function() {
				table.height(214);
				current.html(VIEWS_LOCALE.view_002.fullScreen);
				view011c._fixedHeader();
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
			options.chart.renderTo="view011-pie";
			options.series=[{data: divdata.data}];
			if(divdata.end)
				options.plotOptions.series.point.events.click = function(){};
			else
				options.plotOptions.series.point.events.click = function(){
				var category;
				if(view011c.dims.length > 0){
					category = view011c.dims[this.idx];
				}else{
					category = this.name;
				}
				view011c.drawCharts(category);
				};
		}else{
			options = Object.clone(this.columnOptions);
			options.title = divdata.title;
			options.chart.renderTo="view011-column";
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
				if(view011c.dims.length > 0){
					category = view011c.dims[this.idx];
				}else{
					category = this.category;
				}
				view011c.drawCharts(category);
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
			jQuery("#view011-loading").show();
			jQuery("#view011-table table").remove();
			if(type != "table"){
				if(type == "pie"){
					DOM = document.getElementById("view011-pie-max");
					current = jQuery(DOM);
					jQuery("#view011-column-buttons").show();
					jQuery("#view011-column").show();
					current.css("right",0);
				}else{
					DOM = document.getElementById("view011-column-max");
					current = jQuery(DOM);
				}
				jQuery("#view011-table-max").show();
				jQuery("#view011-table").show();
				DOM.onclick = function(){view011c.chartMax(DOM,type);};
			}else{
				DOM = document.getElementById("view011-table-max");
				current = jQuery(DOM);
				jQuery("#view011-charts").css({"left":0,"opacity": 1,"display":"block"});
				jQuery("#view011-table").height(214);
			}
			current.html(VIEWS_LOCALE.view_002.fullScreen).show();
			this.maxType = null;
		}
		jQuery("#view011-pie").css({"width":482,"height":392});
		jQuery("#view011-column").css({"width":542,"height":392});
	},
	
	/**
	 * Description : to delete the html DOM for next data input.
	 * 
	 * type: private
	 * */
	_deleteDOM : function(refresh){
		if(this.singleChart){
			jQuery("#view011-single > div").remove();
		}else{
			if(!refresh){
				jQuery("#view011-dimensions ul li").remove();
				jQuery("#view011-pie-select option").remove();
				jQuery("#view011-column-select option").remove();
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
	/**
	 * Description : icicle SKU测算报表添加特殊的style
	 * @param status
	 */
	stylespecial : function(status){
		var table=jQuery("#view011-table > table tbody");
		if(status==1){
			var rindex=table.children("tr").length,
			cindex=table.children("tr:eq(0)").children("td").length;
			for(var i=0;i<rindex-2;i++){
				for(var j=0;j<cindex;j++){
					var dom=table.children("tr:eq("+i+")").children("td:eq("+j+")");
					if(dom.html().indexOf("%")>0)dom.css("background","#FFFFCC");
				}
			}
		}else if(status==2){
			var cindex=table.children("tr:eq(0)").children("td").length;
			for(var i=0;i<4;i++){
				for(var j=0;j<cindex;j++){
					var dom=table.children("tr:eq("+i+")").children("td:eq("+j+")");
					dom.css("background","#dedede");
				}
			}
		}
	},
	/**
	 * Description : to goBack to rechoose the category.
	 * 
	 * type: public
	 * */
	gotoHomePage : function(){
		jQuery(".rc-filter").hide();
		this.chainInfo = new Array();
		this.back = false;
		this._deleteDOM(false);
		jQuery("#view011-title").html("");
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
View011Control.main = function(){
	view011c=new View011Control();
};
jQuery(document).ready(View011Control.main);