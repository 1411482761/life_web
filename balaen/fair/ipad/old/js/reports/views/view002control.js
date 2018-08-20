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
		this.chainInfo = new Array();
		this.maxType = new String();
		this.dimIndex =  new Number();
		this.back = new Boolean();
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
				return '<b>'+ this.point.name +'</b>: '+ this.point.y +" "+this.series.chart.rcOptions.unit[1];
			}	
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
			itemStyle:{font: '14px Verdana'},
			x: 44,
			y: -10,
			shadow: true
		};
		options.tooltip={
			enabled: false,
			formatter: function() {
				var s = '<b>'+ this.x +'</b>';
				var label;
				jQuery.each(this.points, function(i, point) {
					if(point.series.name == this.series.chart.rcOptions.varable)
						label = (this.point.actual*100).toFixed(2)+"%";
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
			color: '#FFFFFF',
			formatter: function() {
				var dataLabel;
				if(this.series.name == this.series.chart.rcOptions.varable)
					dataLabel = this.point.actual.toFixed(2) + "%";
				else
					dataLabel = this.y;
				return dataLabel;
			},
			style: {font: 'normal 11px Verdana, sans-serif'}
		};
		this.columnOptions = Object.clone(options);
		options = VIEWS_LOCALE.view_002.fullScreen;
		jQuery("#views").append(jQuery("<div id='view002' class='viewport'><div id='view002-title'></div><div id='view002-buttons'><div id='view002-back' class='view002-button' onclick='view002c.goBack();'>" +
				"<div id='view002-back-value' class='view002-button-value'>"+VIEWS_LOCALE.view_002.back+"</div></div><div id='view002-homepage'" +" class='view002-button' onclick='view002c.gotoHomePage();'><div id='view002-homepage-value'" +
				"class='view002-button-value'>"+VIEWS_LOCALE.view_002.homepage+"</div></div><div id='view002-refresh' class='view002-button' onclick='view002c.refresh();'><div id='view002-refresh-value'  class='view002-button-value'>"+
				VIEWS_LOCALE.view_002.refresh+"</div></div>" +"</div><div id='view002-single' class='view002-rpt'></div><div id='view002-mixed' class='view002-rpt'><div id='view002-dimensions'><ul></ul></div><div id='view002-details'>" +
				"<div id='view002-charts'><div id='view002-pie'></div><div id='view002-pie-buttons' class='ajaxnoshow'>" +"<select id='view002-pie-select' onchange=view002c.updateCharts(this,'pie');></select><div id='view002-pie-max'" +
				"class='view002-max' onclick=view002c.fullScreen(this,'pie');>"+options+"</div></div><div id='view002-column'></div><div id='view002-column-buttons' class='ajaxnoshow'><select id='view002-column-select'" +
				"onchange=view002c.updateCharts(this,'column');></select><span id='view002-column-max' class='view002-max'onclick=view002c.fullScreen(this,'column');>"	+options+"</span></div></div><div id='view002-table-max' class='ajaxnoshow'" +
				"onclick=view002c.fullScreen(this,'table');>"+options+"</div>"+"<div id='view002-table'></div></div></div><div id='view002-loading' class='mainpageajax'><div class='loadingimg'><div class='loadinglocale'>"+
				VIEWS_LOCALE.mainpage.loading+"</div></div></div><div id='view002-nomatched' class='mainpageajax'><div class='noresult'>"+VIEWS_LOCALE.mainpage.noResult+"</div></div></div>"));
	},
	
	/**
	 * Description : to generate first rpt.
	 * 
	 * @type public
	 * */
	getActived : function(viewport){
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
	 * Description : to draw charts according to global params and ajax params.
	 * 
	 * @type private
	 * */
	_drawCharts : function(category){
		if(category != undefined)this.ajaxPrams.push(category);
		jQuery("#view002-loading").show();
		jQuery("#view002-nomatched").hide();
		/*send ajax*/
		this.trans.params.viewchain = this.ajaxPrams;
		portalClient.sendOneRequest(this.trans, function(response){
			var javaData= response.data[0].result;
//			var javaData =
//			{
//				action: "dims",/*filter,pie,column,table,dims*/
//				data: ["sub-class","height","type","factory","class","series","store","wave","vm","theme"],
//				fmt:  [null,null],
//				title: "test"
//				data: {
//					categories: ["shoes","belts","bags"],
//					title: "Distribution of the aticles",
//					unit: ["Qty","thousands"],
//					data:[12,20,16]
//				},
//			};
			var action = javaData.action,
			data = javaData.data;
			if(action == "filter"){
				jQuery("#view002-loading").hide();
				if(data != null){
					view002c.ajaxPrams.pop();
					window.location = data;
				}
			}
			else if(action == "dims")
				view002c._drawDimensions(data);
			else
				view002c._drawSingle(data);
		});
		/*end ajax*/
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
		var data = new Array();
		var options = Object.clone(this.pieOptions);
		options.chart.renderTo="view002-single";
		options.rcOptions={unit: javaData.unit};
		options.title = {text: javaData.title};
		for ( var i = 0; i < javaData.categories.length; i++) {
			data.push({
				name: javaData.categories[i],
				color: rc.chartsColors[i+1],
				y: javaData.data[i]
			});
		}
		options.series=[{data: data}];
		options.plotOptions.series.point.events.click = function(){view002c.drawCharts(this.name);};
		new Highcharts.Chart(options);
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
		jQuery("#view002-nomatched").hide();
		jQuery("#view002-loading").show();
		this._initCombination();
		this.ajaxPrams.pop();
		this.ajaxPrams.push(dimension);
		this.chainInfo[this.chainInfo.length-1].dim = parseInt(index);
		this.trans.params.viewchain = this.ajaxPrams;
		jQuery("#view002-dimensions ul li").attr("class","button");
		jQuery(DOM).attr("class","active");
		portalClient.sendOneRequest(this.trans, function(response){
				var javaData= response.data[0].result.data;
//				var javaData = {
//					table:[
//					       ['Covered', 'Open Toe', 'Peep Toe'],
//					       [32, 34, 39],
//					       [19, 18, 14],
//					       [0.30,0.1,0.45],
//					       [120,130,110],
//					       [35, 34, 32],
//					       [14, 18, 19],
//					       [-0.2,0.13,-0.4],
//					       [110,130,120]
//					],
//					title: "shoes sub-class",
//					fmt: [null, null, null, "00.0%",  null, null, "00.0%", null],
//					header: [
//					         {name:'Sub Class',colspan:1},
//					 		 {name:'SKU',colspan:3, subheader:['Planning','Actual','Var']},
//							 {name:'Ordered Qty', colspan:1},
//							 {name:'No of Design',colspan:3, subheader:['Planning','Actual','Var']},
//							 {name:'Avg Cost', colspan:1}
//					],
//					colors:[
//						    ["g","y","r"],
//						    ["y","r","g"]
//					],
//					pie_charts:[
//					            {name:'Ordered Qty',title:'Ordered Qty',unit:['Qty','Piece'],colidx:4},
//								{name:'No of Design',title:'No of Design',unit:['Cnt','Design'], colidx:8}
//					],
//					column_charts:[
//					               {name:'No of SKU',title:'No of SKU',coltitle:["Plan","Actual","Var"],unit:['Qty','k'], colidx:[1,2,3]},
//					               {name:'No of warehouse',title:'No of warehouse',coltitle:["Planning","Actual","Var"],unit:['Qty','Piece'],colidx:[5,6,7]}
//					]
//				};

				if(javaData.table.length == 0){
					jQuery("#view002-loading").hide();
					jQuery("#view002-nomatched").show();
				}else{
					view002c._writeTitle(javaData.title);
					jQuery("#view002-pie").children().remove();
					jQuery("#view002-column").children().remove();
					var actual,options,iterator2,
					colorCounts = rc.chartsColors.length,
					data = new Array(),
					select = jQuery("#view002-pie-select"),
					iterator = javaData.pie_charts;
					select.children().remove();
					for ( var i = 0; i < iterator.length; i++) {
						options = new Object();
						actual = new Array();
						options.title = {text: iterator[i].title};
						options.rcOptions= {unit: iterator[i].unit};
						options.end = response.data[0].result.end;
						iterator2 = javaData.table[iterator[i].colidx];
						for ( var j = 0; j < iterator2.length; j++) {
							actual.push({
								name: javaData.table[0][j],
								color: rc.chartsColors[(j+1)%colorCounts],
								y: iterator2[j]
							});
						}
						actual[0].sliced = true;
						actual[0].selected = true;
						options.data = actual;
						data.push(options);
						jQuery("<option value='"+i+"'>"+iterator[i].name+"</option>").appendTo(select);
					}
					select.children(":first").attr("selected","selected");
					select.data("options",data).trigger("onchange");
					var planning,variable,m_planning,m_actual,v_var,max,column_options;
					data = new Array();
					select = jQuery("#view002-column-select");
					select.children().remove();
					iterator = javaData.column_charts;
					for (var i = 0; i < iterator.length; i++) {
						column_options = new Object();
						actual = new Array();
						variable = new Array();
						column_options.rcOptions= {unit: iterator[i].unit, varable: iterator[i].coltitle[2]};
						column_options.end = response.data[0].result.end;
						column_options.xAxis={categories:javaData.table[0]};
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
						iterator2 = javaData.table[iterator[i].colidx[1]];
						m_planning = planning.max();
						m_actual = iterator2.max();
						max = m_planning>m_actual?m_planning:m_actual;
						var iterator3 = javaData.table[iterator[i].colidx[2]],
						iterator4 = javaData.colors;
						for ( var j = 0; j < iterator2.length; j++) {
							v_var = iterator3[j];
							variable.push({actual: v_var,y:max*v_var/100});
							actual.push({color:rc.noticeColor[iterator4[i][j]],y:iterator2[j]});
						}
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
						data.push(column_options);
						jQuery("<option value='"+i+"'>"+iterator[i].name+"</option>").appendTo(select);
					}
					select.children(":first").attr("selected","selected");
					select.data("options",data).trigger("onchange");
					var articleHtmls = "<table><thead><tr>",
					headSecondTr = "<tr class='attr-region'>";
					iterator = javaData.header;
					iterator3 = -1;
					for ( var i = 0; i < iterator.length; i++) {
						if(iterator[i].subheader == undefined){
							iterator3++;
							articleHtmls += "<td id='"+iterator3+"' rowspan='2' onclick=view002c.sortTable('"+iterator3+"');>"+iterator[i].name+"</td>";
						}
						else{
							articleHtmls += "<td colspan='"+iterator[i].colspan+"'>"+iterator[i].name+"</td>";
							iterator2 = iterator[i].subheader;
							for ( var j = 0; j < iterator2.length; j++) {
								iterator3++;
								headSecondTr += "<td id='"+iterator3+"' onclick=view002c.sortTable('"+iterator3+"');>"+iterator2[j]+"</td>";
							};
						}
					}
					articleHtmls += "</tr>"+headSecondTr+"</tr></thead><tbody>";
					iterator = javaData.table[0];
					iterator2 = javaData.table;
					iterator3 = javaData.fmt;
					if(response.data[0].result.end == "Y"){
						for ( var i = 0; i < iterator.length; i++) {
							articleHtmls += "<tr onclick='view002c.selectedTr(this);'><td class='sort-desc' nowrap='nowrap'>"+iterator[i]+"</td>";
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
							articleHtmls += "<tr onclick='view002c.selectedTr(this);'><td onclick='view002c.drawCharts(&quot;"+iterator[i]+"&quot;);' class='sort-desc' nowrap='nowrap'>"+iterator[i]+"</td>";
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
					iterator = javaData.sum;
					articleHtmls += "<tr style='background-color: #4e4f4e;'><td style='text-align: right;'>"+VIEWS_LOCALE.view_002.sum+"</td>";
					for ( var i = 1; i < iterator.length; i++) {
						iterator4 = iterator3[i];
						if(iterator[i] == null) iterator2='';
						else iterator2 = Number(iterator[i]).format(iterator4);
						articleHtmls += "<td>"+iterator2+"</td>";
					}
					articleHtmls += "</tr></tbody></table>";
					var temp = jQuery("#view002-table");
					temp.children().remove();
					temp.append(jQuery(articleHtmls));
//					if(javaData.softedColumn.index != -1)
//						view002c._sortColumn(javaData.softedColumn);
					jQuery("#view002-single").hide();
					jQuery("#view002-mixed").show();
					if(javaData.fullTable == "Y")
						jQuery("#view002-table-max").trigger("click");
					else
						jQuery("#view002-loading").hide();
					/*end ajax*/
				}
			});
	},
	
	selectedTr : function(DOM){
		jQuery("#view002-table table tbody tr:not(:last)").css("background","#111111");
		jQuery(DOM).css("background","#02445b");
	},
	
	_sortColumn : function(softedColumn){
//		softedColumn.index = 4;
//		if(softedColumn.sequence == "up")
//			jQuery("#"+softedColumn.index).attr("class","sorted up");
//		else
//			jQuery("#"+softedColumn.index).attr("class","sorted down");
		jQuery("#view002-table table thead td").attr("class","sorted up");
	},
	
	sortTable : function(columnIndex){
		console.log(columnIndex);
//		jQuery("#"+columnIndex).attr();
	},
	
	chartMax : function(DOM,type){
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
			chart = jQuery("#view002-column");
			select = jQuery("#view002-column-select");
		}
		current.html(VIEWS_LOCALE.view_002.restore);
		jQuery("#view002-table").hide();
		jQuery("#view002-table-max").hide();
		chart.css({"width":1024,"height":634});
		select.trigger("change");
		DOM.onclick = function(){view002c.backUpChart(DOM,type);};
	},
	
	backUpChart : function(DOM,type){
		this.maxType = null;
		var select,
		current = jQuery(DOM);
		if(type == "pie"){
			jQuery("#view002-pie").css({"width":482,"height":392});
			jQuery("#view002-column-buttons").show();
			jQuery("#view002-column").show();
			current.css("right",0);
			select = jQuery("#view002-pie-select");
		}else{
			jQuery("#view002-column").css({"width":542,"height":392});
			select = jQuery("#view002-column-select");
		}
		jQuery("#view002-table-max").show();
		jQuery("#view002-table").show();
		select.trigger("change");
		current.html(VIEWS_LOCALE.view_002.fullScreen);
		DOM.onclick = function(){view002c.chartMax(DOM,type);};
	},
	
	tableToggle : function(DOM,type){
		var current = jQuery(DOM),
		table = jQuery("#view002-table"),
		charts = jQuery("#view002-charts");
		if(table.height() == 214){
			this.maxType = type;
			charts.animate({
				left: "+=200",
				opacity: 0.25,
				height: 'toggle'
			}, 700, function() {
				table.height(604);
				current.html(VIEWS_LOCALE.view_002.restore);
				jQuery("#view002-loading").hide();
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
				jQuery("#view002-loading").hide();
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
			if(divdata.end == undefined)
				options.plotOptions.series.point.events.click = function(){view002c.drawCharts(this.name);};
			else
				options.plotOptions.series.point.events.click = function(){};
					
		}else{
			options = Object.clone(this.columnOptions);
			options.title = divdata.title;
			options.chart.renderTo="view002-column";
			options.rcOptions = divdata.rcOptions;
			options.xAxis= divdata.xAxis;
			options.yAxis= divdata.yAxis;
			options.series = divdata.series;
			if(divdata.end == undefined)
				options.plotOptions.series.point.events.click = function(){view002c.drawCharts(this.category);};
			else
				options.plotOptions.series.point.events.click = function(){};
		}
		new Highcharts.Chart(options);
	},
	
	fullScreen : function(DOM,type){
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
					jQuery("#view002-pie").css({"width":482,"height":392});
					jQuery("#view002-column-buttons").show();
					jQuery("#view002-column").show();
					current.css("right",0);
				}else{
					jQuery("#view002-column").css({"width":542,"height":392});
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
			current.html(VIEWS_LOCALE.view_002.fullScreen);
			this.maxType = null;
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
	
	/**
	 * Description : to goBack to rechoose the category.
	 * 
	 * type: public
	 * */
	gotoHomePage : function(){
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