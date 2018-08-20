var view003c;
var View003Control = Class.create();
View003Control.prototype = {
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
		this.numCharts = new Number();
		this.maxType = new String();
		this.end = new Boolean();
		this.dims = new Array();
		this.prevDOM = null;
		this.isdefaulthide='N';
		this.ishidesomecols='N';
		this.columns=new Array();
		this.javaData=new Array();
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
		this.numCharts = -1;
		this.maxType = null;
		this.end = true;
		this.trans = {
			id: 1,
			command: "com.agilecontrol.fair.FairCmd",
			params:{
				cmd: "LoadRpt",
				sessionkey: rc.sessionkey,
				view: "view003",
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
//			itemStyle:{font: '12px Verdana'},
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
		this.columnOptions = Object.clone(options);
		if(this.isNotPad && this.width < 768){
			jQuery("#views").append(jQuery(
					"<div id='view003' class='viewport'><div id='view003-banner'><div id='view003-buttons'><ul><li id='view003-homepage' class='view003-button' onclick='view003c.gotoHomePage();'><div class='view003-button-value'>"+"</div></li><li id='view003-refresh' class='view003-button' onclick='view003c.refresh();'><div class='view003-button-value'>"+"</div></li></ul></div>" +
					"<div id='view003-title'></div></div><div id='view003-container'></div><div id='view003-loading' class='mainpageajax'><div class='loadingimg'><div id='view003-loadinglocale' class='loadinglocale'>"+
					VIEWS_LOCALE.main.loading+"</div></div></div>"+"<div id='view003-nomatched' class='mainpageajax'><div id='view003-noresult' class='noresult'>"+VIEWS_LOCALE.main.noResult+"</div></div></div>"
			));
		}else{
			jQuery("#views").append(jQuery(
					"<div id='view003' class='viewport'><div id='view003-banner'><div id='view003-buttons'><ul><li id='view003-back' class='view003-button' onclick='view003c.gotoHomePage();'><div class='view003-button-value'>"+VIEWS_LOCALE.view_003.back+"</div></li><li id='view003-homepage' class='view003-button' onclick='view003c.gotoHomePage();'><div class='view003-button-value'>"+
					VIEWS_LOCALE.view_003.homepage+"</div></li><li id='view003-refresh' class='view003-button' onclick='view003c.refresh();'><div class='view003-button-value'>"+VIEWS_LOCALE.view_003.refresh+"</div></li></ul></div>" +
					"<div id='view003-title'></div></div><div id='view003-container'></div><div id='view003-loading' class='mainpageajax'><div class='loadingimg'><div id='view003-loadinglocale' class='loadinglocale'>"+
					VIEWS_LOCALE.main.loading+"</div></div></div>"+"<div id='view003-nomatched' class='mainpageajax'><div id='view003-noresult' class='noresult'>"+VIEWS_LOCALE.main.noResult+"</div></div></div>"
			));
			
		}
//		if(rc.filter){
//			jQuery("<div id='view003-filter' class='rc-filter'><input type='checkbox' onchange=view003c.refresh(); /><span onclick='view003c.setFilter(this);'>"+VIEWS_LOCALE.main.filter+"</span></div>").insertAfter(jQuery("#view003-buttons"));
//		}
	},
	
	/**
	 * Description : to generate first rpt.
	 * 
	 * @type public
	 * */
	getActived : function(viewport,index){
		rc.actived = 3;
		rc.filterid=-1;
		rc.bfilterid=-1;
		jQuery("#singlestore").attr("onchange","view003c.refresh()");
		rc.initFilter(viewport);
		rc.drawSelect(rc.rptviews[index]);
		this.showtable=rc.showtable;
		jQuery("#views").show();
		jQuery("#view003").show();
		this.ajaxPrams = [viewport];
		this.drawCharts();
	},
	
	/**
	 * Description : to draw charts according to global params and ajax params.
	 * 
	 * @type private
	 * */
	drawCharts : function(category){
		this.columns=new Array();
		this.isdefaulthide='N';
		this.ishidesomecols='N';
		if(category != undefined) this.ajaxPrams.push(category);
		jQuery("#view003-loading").show();
		jQuery("#view003-nomatched").hide();
		/*send ajax*/
		var viewchain = this.ajaxPrams.toString().split(",");
		this.trans.params.viewchain = viewchain;
		this.trans.params.bfilterid = rc.bfilterid;
		this.trans.params.filterid = rc.filterid;
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
		portalClient.sendOneRequest(this.trans, function(response){
			var javaData= response.data[0].result;
			var action = javaData.action,
			data = javaData.data;
			if(action == "filter"){
				view003c.ajaxPrams.pop();
				jQuery("#view003-loading").hide();
				if(data != null)
					window.location.replace(data);
			}
			else{
				view003c._drawRpt(data,javaData.end);
				jQuery("<div class='rpt-filter'></div>").insertAfter(".highcharts-container");
				if(view003c.isNotPad && view003c.width < 768){
					jQuery("#view003-charts").css("top",jQuery("#view003-table > table").height());
					jQuery("#view003-banner").css("width",view003c.width);
					jQuery("#view003-table-details").css("width",view003c.width);
				}
			}
		});
		/*end ajax*/
	},
	
	_drawRpt : function(javaData,end){
		view003c.javaData=javaData;
		var hidecolumns=javaData.hidecolumns;
		if(hidecolumns!=undefined){
			this.isdefaulthide=hidecolumns.isdefaulthide;
			this.columns=hidecolumns.columns;
		}
		if(this.isdefaulthide=="Y"){
			this.ishidesomecols = "Y";
		}else{
			this.ishidesomecols="N";
		}
		if(this.showtable=="Y"){
			if(this.ishidesomecols=="N"){
				jQuery("#hidecolumns").html(VIEWS_LOCALE.main.hidesomecols);
			}else{
				jQuery("#hidecolumns").show();
				jQuery("#hidecolumns").html(VIEWS_LOCALE.main.showallcols);
			}
		}
		if(end == undefined){
			this.end = javaData.end == "undefined"?false:(javaData.end == "Y"?true:false);
		}else{
			this.end = end == "Y"?true:false;
		}
		if(javaData.fixcolumns!=undefined&&javaData.fixcolumns>0){
			this.fixedcolumns=javaData.fixcolumns;
		}
		jQuery("#view003-title").html(javaData.title);
		if(javaData.table.length == 0){
			jQuery("#view003-loading").hide();
			jQuery("#view003-nomatched").show();
		}else{
			jQuery("#view003-nomatched").hide();
			this.numCharts = 1;
			jQuery("#view003-container").children().remove();
			if(javaData.pie_charts.length == 0 && javaData.column_charts.length == 0){
				this.numCharts = 0;
				jQuery("#view003-container").append(jQuery("<div id='view003-table-details' style='height: 622px;'><div id='view003-table'></div></div>"));
				this._drawtable(javaData);
			}else if(javaData.pie_charts.length != 0 && javaData.column_charts.length != 0){
				this.numCharts = 2;
				var view003_pie_max = "";
				var view003_column_max = "";
				var viewoo3_table_max = "";
				if(view003c.isNotPad && view003c.width < 768){
					view003_pie_max = "";
					view003_column_max = "";
					viewoo3_table_max = "";
					jQuery("#view003-banner").css("width",view003c.width);
				}else{
					var temp = VIEWS_LOCALE.view_003.fullScreen;
					view003_pie_max = "<div id='view003-pie-max' class='view003-max view003-chart-max' onclick=view003c.fullScreen(this,'pie');>"+temp+"</div>";
					view003_column_max = "<div id='view003-column-max' class='view003-max view003-chart-max' onclick=view003c.fullScreen(this,'column');>"+temp+"</div>";
					viewoo3_table_max = "<div id='view003-table-max' class='view003-max' onclick=view003c.fullScreen(this,'table');>"+temp+"</div>";
				}
				
				jQuery("#view003-container").append(jQuery(
					"<div id='view003-charts'><div id='view003-pie-details'><div id='view003-pie' class='view003-pie-restore'></div><div id='view003-pie-button'>" +
					"<select id='view003-pie-select' class='view003-chart-select' onchange=view003c.updateCharts(this,'pie');></select>"+view003_pie_max+"</div></div><div id='view003-column-details'><div id='view003-column' class='view003-column-restore'></div><div id='view003-column-button'>" +
					"<select id='view003-column-select'  class='view003-chart-select' onchange=view003c.updateCharts(this,'column');></select>" +view003_column_max+"</div></div></div><div id='view003-table-details'><div id='view003-table'></div>" +
					viewoo3_table_max+"</div>"
				));
				this._drawtable(javaData);
				this._drawPie(javaData);
				this._drawColumn(javaData);
				if(view003c.isNotPad && view003c.width < 768){
					jQuery("#view003-table").css("width",view003c.width);
				}
			}else if(javaData.pie_charts.length != 0){
				var view003_pie_max = "";
				var viewoo3_table_max = "";
				if(view003c.isNotPad && view003c.width < 768){
					view003_pie_max = "";
					viewoo3_table_max = "";
					jQuery("#view003-banner").css("width",view003c.width);
				}else{
					var temp = VIEWS_LOCALE.view_003.fullScreen;
					view003_pie_max = "<div id='view003-pie-max' class='view003-max view003-chart-max' onclick=view003c.fullScreen(this,'pie');  style='right: -542px;'>"+temp+"</div>";
					viewoo3_table_max = "<div id='view003-table-max' class='view003-max' onclick=view003c.fullScreen(this,'table');>"+temp+"</div>";
				}
				jQuery("#view003-container").append(jQuery(
						"<div id='view003-charts'><div id='view003-pie-details'><div id='view003-pie' class='view003-chart-restore'></div><div id='view003-pie-button'><select id='view003-pie-select' class='view003-chart-select' " +
						"onchange=view003c.updateCharts(this,'pie');></select>"+view003_pie_max+
						"</div></div></div><div id='view003-table-details' class='view003-table-restore'><div id='view003-table'></div>"+viewoo3_table_max+"</div>"
				));
				this._drawtable(javaData);
				this._drawPie(javaData);
				if(view003c.isNotPad && view003c.width < 768){
					jQuery("#view003-table").css("width",view003c.width);
				}
			}else{
				var view003_column_max = "";
				var viewoo3_table_max = "";
				if(view003c.isNotPad && view003c.width < 768){
					view003_column_max = "";
					viewoo3_table_max = "";
					jQuery("#view003-banner").css("width",view003c.width);
				}else{
					var temp = VIEWS_LOCALE.view_003.fullScreen;
					view003_column_max = "<div id='view003-column-max' class='view003-max view003-chart-max' onclick=view003c.fullScreen(this,'column');>"+temp+"</div>";
					viewoo3_table_max = "<div id='view003-table-max' class='view003-max' onclick=view003c.fullScreen(this,'table');>"+temp+"</div>";
				}
				jQuery("#view003-container").append(jQuery(
						"<div id='view003-charts'><div id='view003-column-details'><div id='view003-column' class='view003-chart-restore'></div><div id='view003-column-button'><select id='view003-column-select' class='view003-chart-select' " +
						"onchange=view003c.updateCharts(this,'column');></select>"+view003_column_max+"</div></div></div>" +
						"<div id='view003-table-details' class='view003-table-restore'><div id='view003-table'></div>"+viewoo3_table_max+"</div>"
				));
				this._drawtable(javaData);
				this._drawColumn(javaData);
				if(view003c.isNotPad && view003c.width < 768){
					jQuery("#view003-table").css("width",view003c.width);
				}
			}
			this._fixedHeader();
			if(javaData.fullTable == "Y"){
				jQuery("#view003-table-max").trigger("click");
				jQuery("#view003-table").show();
				jQuery("#controltable").hide();
			}else if(javaData.fullTable == "c"){
				jQuery("#view003-column-max").trigger("click");
				jQuery("#view003-table").show();
				jQuery("#controltable").hide();
			}else{
				this._fixedHeader();
				if(view003c.showtable!=undefined){
					if(javaData.pie_charts.length==0&&javaData.column_charts.length==0){
						jQuery("#controltable").hide();
					}else{
						view003c.controlTable();
					}
				}
			}
			jQuery("#view003-loading").hide();
		}
	},
	
	_drawtable : function(javaData){
		this.dims.clear();
		var iterator2,iterator3,iterator4,iterator6,dim_td,
		iterator5 = javaData.trcolors,
		articleHtmls = "<table class='view003-scroll'><thead><tr>",
		headSecondTr = "<tr class='attr-region'>",
		iterator;
		if(this.ishidesomecols=="Y")iterator = rc.getNewHeader(javaData.header,this.columns);
		else iterator = javaData.header;
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
			};
		}
		if(javaData.bfbcompare!=undefined&&javaData.bfbcompare.ratio!=undefined){
			view003c.ratio = javaData.bfbcompare.ratio;
		}
		articleHtmls += "</tr>"+headSecondTr+"</tr></thead><tbody>";
		iterator = javaData.table[0];
		iterator2 = javaData.table;
		iterator3 = javaData.fmt;
		if(this.end){
			if(iterator5 != undefined){
				for ( var i = 0; i < iterator.length; i++) {
					iterator6 = iterator5[i];
					articleHtmls += "<tr onclick='view003c.selectedTr(this);' level='"+iterator6+"' style='background:"+rc.tableTrColor[iterator6]+"'><td class='sort-desc' nowrap='nowrap'>"+iterator[i]+"</td>";
					for ( var j = 1; j < iterator2.length; j++) {
						iterator4 = iterator3[j];
						if(this.ishidesomecols=="Y"&&rc.isInArray(j,this.columns)){}else{
							if(javaData.bfbcompare!=undefined && rc.isInArray(j,javaData.bfbcompare.columns)){
								if(iterator2[j][i]>view003c.ratio || iterator2[j][i]==view003c.ratio){
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
				};
			}else{
				for ( var i = 0; i < iterator.length; i++) {
					articleHtmls += "<tr onclick='view003c.selectedTr(this);'><td class='sort-desc' nowrap='nowrap'>"+iterator[i]+"</td>";
					for ( var j = 1; j < iterator2.length; j++) {
						iterator4 = iterator3[j];
						if(this.ishidesomecols=="Y"&&rc.isInArray(j,this.columns)){}else{
							if(javaData.bfbcompare!=undefined && rc.isInArray(j,javaData.bfbcompare.columns)){
								if(iterator2[j][i]>view003c.ratio || iterator2[j][i]==view003c.ratio){
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
						};
						
					}
					articleHtmls += "</tr>";
				};
			};
		}else{
			var dim,
			dim_index = javaData.dim_index;
			if(typeof(dim_index) == "number" || dim_index == undefined || dim_index.length == 1){
				if(dim_index == undefined)
					dim_index = 0;
				else if(typeof(dim_index) != "number"){
					dim_index = parseInt(dim_index[0]);
				}
				if(iterator5 != undefined){
					for ( var i = 0; i < iterator.length; i++) {
						dim = iterator2[dim_index][i];
						iterator6 = iterator5[i];
						articleHtmls += "<tr onclick='view003c.selectedTr(this);' level='"+iterator6+"' style='background:"+rc.tableTrColor[iterator6]+"'>";
						for ( var j = 0; j < iterator2.length; j++) {
							iterator4 = iterator3[j];
							if(this.ishidesomecols=="Y"&&rc.isInArray(j,this.columns)){}else{
								if(javaData.bfbcompare!=undefined && rc.isInArray(j,javaData.bfbcompare.columns)){
									if(iterator2[j][i]>view003c.ratio || iterator2[j][i]==view003c.ratio){
										dim_td = j > dim_index?"<td style='background:"+javaData.bfbcompare.color+"'>":"<td style='background:"+javaData.bfbcompare.color+"' style='white-space:nowrap;' onclick='view003c.drawCharts(&quot;"+dim+"&quot;);' class='sort-desc'>";
									}else{
										dim_td = j > dim_index?"<td>":"<td style='white-space:nowrap;' onclick='view003c.drawCharts(&quot;"+dim+"&quot;);' class='sort-desc'>";
										}
									}else{
									if(this.ishidesomecols=='N'&&rc.isInArray(j,this.columns))
										dim_td = j > dim_index?"<td style='background:#FFC000;'>":"<td style='white-space:nowrap;background:#FFC000;' onclick='view003c.drawCharts(&quot;"+dim+"&quot;);' class='sort-desc'>";
										else
										dim_td = j > dim_index?"<td>":"<td style='white-space:nowrap;' onclick='view003c.drawCharts(&quot;"+dim+"&quot;);' class='sort-desc'>";
									}
							if(iterator4 == null)
								articleHtmls += dim_td+iterator2[j][i]+"</td>";
							else{
								if(iterator2[j][i]=="") articleHtmls += dim_td+iterator2[j][i]+"</td>";
								else articleHtmls += dim_td+Number(iterator2[j][i]).format(iterator4)+"</td>";
							}
							};
							
						}
						articleHtmls += "</tr>";
					};
				}else{
					for ( var i = 0; i < iterator.length; i++) {
						dim = iterator2[dim_index][i];
						articleHtmls += "<tr onclick='view003c.selectedTr(this);'>";
						for ( var j = 0; j < iterator2.length; j++) {
							iterator4 = iterator3[j];
							if(this.ishidesomecols=="Y"&&rc.isInArray(j,this.columns)){}else{
								if(javaData.bfbcompare!=undefined && rc.isInArray(j,javaData.bfbcompare.columns)){
									if(iterator2[j][i]>view003c.ratio || iterator2[j][i]==view003c.ratio){
										dim_td = j > dim_index?"<td style='background:"+javaData.bfbcompare.color+"'>":"<td style='background:"+javaData.bfbcompare.color+"' style='white-space:nowrap;' onclick='view003c.drawCharts(&quot;"+dim+"&quot;);' class='sort-desc'>";
									}else{
										dim_td = j > dim_index?"<td>":"<td style='white-space:nowrap;' onclick='view003c.drawCharts(&quot;"+dim+"&quot;);' class='sort-desc'>";
										}
									}else{
										if(this.ishidesomecols=='N'&&rc.isInArray(j,this.columns))
											dim_td = j > dim_index?"<td style='background:#FFC000;'>":"<td style='white-space:nowrap;background:#FFC000;' onclick='view003c.drawCharts(&quot;"+dim+"&quot;);' class='sort-desc'>";
											else
										dim_td = j > dim_index?"<td>":"<td style='white-space:nowrap;' onclick='view003c.drawCharts(&quot;"+dim+"&quot;);' class='sort-desc'>";
									}
							if(iterator4 == null)
								articleHtmls += dim_td+iterator2[j][i]+"</td>";
							else{
								if(iterator2[j][i]=="") articleHtmls += dim_td+iterator2[j][i]+"</td>";
								else articleHtmls += dim_td+Number(iterator2[j][i]).format(iterator4)+"</td>";
							}
							};
							
						}
						articleHtmls += "</tr>";
					};
				};
			}else{
				var java_dims = dim_index;
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
						this.dims.push(dim);
						iterator6 = iterator5[i];
						articleHtmls += "<tr onclick='view003c.selectedTr(this);' level='"+iterator6+"' style='background:"+rc.tableTrColor[iterator6]+"'>" +
								"<td style='white-space:nowrap;' onclick='view003c.drawCharts(&quot;"+dim+"&quot;);' class='sort-desc'>"+iterator2[0][i]+"</td>";
						for ( var j = 1; j < iterator2.length; j++) {
							iterator4 = iterator3[j];
							if(this.ishidesomecols=="Y"&&rc.isInArray(j,this.columns)){}else{
								if(javaData.bfbcompare!=undefined && rc.isInArray(j,javaData.bfbcompare.columns)){
									if(iterator2[j][i]>view003c.ratio || iterator2[j][i]==view003c.ratio){
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
										if(iterator4 == null){
											if(this.ishidesomecols=='N'&&rc.isInArray(j,this.columns))
											articleHtmls += "<td style='background:#FFC000;'>"+iterator2[j][i]+"</td>";
											else
												articleHtmls += "<td>"+iterator2[j][i]+"</td>";
												
										}
										else{
											if(this.ishidesomecols=='N'&&rc.isInArray(j,this.columns)){
												if(iterator2[j][i]=="") articleHtmls += "<td style='background:#FFC000;'>"+iterator2[j][i]+"</td>";
												else articleHtmls += "<td style='background:#FFC000;'>"+Number(iterator2[j][i]).format(iterator4)+"</td>";
											}else{
												if(iterator2[j][i]=="") articleHtmls += "<td>"+iterator2[j][i]+"</td>";
												else articleHtmls += "<td>"+Number(iterator2[j][i]).format(iterator4)+"</td>";
											}
										}
									}
							};
						}
						articleHtmls += "</tr>";
					};
				}else{
					for ( var i = 0; i < iterator.length; i++) {
						dim = new Array();
						for (var j = 0; j < dim_index.keys().length; j++)
							dim.push(iterator2[java_dims[j]][i]);
						dim = dim.toString();
						this.dims.push(dim);
						articleHtmls += "<tr onclick='view003c.selectedTr(this);'>" +
								"<td style='white-space:nowrap;' onclick='view003c.drawCharts(&quot;"+dim+"&quot;);' class='sort-desc'>"+iterator2[0][i]+"</td>";
						for ( var j = 1; j < iterator2.length; j++) {
							iterator4 = iterator3[j];
							if(this.ishidesomecols=="Y"&&rc.isInArray(j,this.columns)){}else{
								if(javaData.bfbcompare!=undefined && rc.isInArray(j,javaData.bfbcompare.columns)){
									if(iterator2[j][i]>view003c.ratio || iterator2[j][i]==view003c.ratio){
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
										if(iterator4 == null){
											if(this.ishidesomecols=='N'&&rc.isInArray(j,this.columns))
											articleHtmls += "<td style='background:#FFC000;'>"+iterator2[j][i]+"</td>";
											else
												articleHtmls += "<td>"+iterator2[j][i]+"</td>";
												
										}
										else{
											if(this.ishidesomecols=='N'&&rc.isInArray(j,this.columns)){
												if(iterator2[j][i]=="") articleHtmls += "<td style='background:#FFC000;'>"+iterator2[j][i]+"</td>";
												else articleHtmls += "<td style='background:#FFC000;'>"+Number(iterator2[j][i]).format(iterator4)+"</td>";
											}else{
												if(iterator2[j][i]=="") articleHtmls += "<td>"+iterator2[j][i]+"</td>";
												else articleHtmls += "<td>"+Number(iterator2[j][i]).format(iterator4)+"</td>";
											}
										}
									}
							};
						}
						articleHtmls += "</tr>";
					};
				};
			};
		}
		iterator = javaData.sum;
		var colcode="A";
		if(javaData.sumdefcol!=undefined){
			colcode=javaData.sumdefcol;
		}
		if(iterator != undefined){
			articleHtmls += "<tr style='background:"+rc.tableTrColor[colcode]+"'>";
			if(this.ishidesomecols=="Y"&&rc.isInArray(0,this.columns)){}else{
				articleHtmls +="<td style='text-align: left;'>"+VIEWS_LOCALE.view_003.sum+"</td>";
			}
			for ( var i = 1; i < iterator.length; i++) {
				iterator4 = iterator3[i];
				if(iterator[i] == null) iterator2='';
				else iterator2 = Number(iterator[i]).format(iterator4);
				if(this.ishidesomecols=="Y"&&rc.isInArray(i,this.columns)){}else{
					if(this.ishidesomecols=='N'&&rc.isInArray(i,this.columns))
				articleHtmls += "<td style='background:#FFC000;'>"+iterator2+"</td>";
					else
						articleHtmls += "<td>"+iterator2+"</td>";
						
				};
			}
			articleHtmls += "</tr></tbody></table>";
		}else{
			articleHtmls += "</tbody></table>";
		}
		var temp = jQuery("#view003-table");
		temp.children().remove();
		temp.append(jQuery(articleHtmls));
		if(javaData.specialcol!=undefined&&javaData.specialcol.length>0){
			rc.addspecilbg(javaData.specialcol,"#view003-table > table tbody");
		}
		if(columns>view003c.columnlimit){
			rc.tablecontrol();
		};
	},
	_drawLump : function(colIndex,colors){
		var td,
		trs = jQuery("#view003-table > table tbody tr:not(:last)");
		for ( var j = 0; j < trs.length; j++) {
			td = trs.eq(j).children("td:eq("+colIndex+")");
			if(td.width()<64) td.width(64);
			td.append(jQuery("<div class='view003-lump' style='background:"+rc.tableColor[colors[j]]+"'></div>"));
		}
	},
	
	_drawColumn : function(javaData){
		var planning,variable,m_planning,m_actual,v_var,max,column_options,iterator2,iterator3,iterator6,iterator7,
		iterator4 = javaData.colors,
		iterator5 = javaData.fmt,
		data = new Array(),
		select = jQuery("#view003-column-select");
		select.children().remove();
		var category = undefined,
		dim_index = javaData.dim_index,
		iterator = javaData.column_charts;
		for (var i = 0; i < iterator.length; i++) {
			column_options = new Object();
			actual = new Array();
			variable = new Array();
			if(dim_index == undefined){
				dim_index = 0;
			}else if (typeof dim_index != "number"){
				dim_index = dim_index[dim_index.length-1];
			}
			iterator2 = iterator[i].coltitle;
			var  removecols1= iterator[i].specialcols,iterator8=new Array();
			if(removecols1!=undefined&&removecols1.length>0){
				iterator8=rc.removeColumns(javaData.table,removecols1);
			}
			var tem =new Array;
			if(iterator8!=undefined&&iterator8.length>0){
				tem=rc.handleArray(javaData.table[dim_index],iterator8);
			}else{
				tem=javaData.table[dim_index];
			}
			if(iterator2 != undefined && iterator2.length == 3)
				column_options.rcOptions= {unit: iterator[i].unit, varable: iterator2[2],category: category};
			else
				column_options.rcOptions= {unit: iterator[i].unit, varable: "var",category: category};
			column_options.xAxis={categories:tem};
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
			iterator2 = iterator[i].colidx.length == 1?javaData.table[iterator[i].colidx[0]]:javaData.table[iterator[i].colidx[1]];
			m_planning = planning.max();
			m_actual = iterator2.max();
			max = m_planning>m_actual?m_planning:m_actual;
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
				}
				if(javaData.tablecolors != undefined && javaData.tablecolors.length > 0)
					this._drawLump(iterator[i].colidx[2],javaData.tablecolors[i]);
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
									idx:j,
									actual: iterator2[j],
									color: rc.noticeColor[iterator4[i][j]],
									y: iterator2[j]
								});}
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
								idx:j,
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
								idx:j,
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
								idx:j,
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
					if(iterator8!=undefined&&iterator8.length>0){
						if(rc.isInArray(j,iterator8)){
							continue;
						}
					}
					if(j < planning.length){
					iterator7 = planning[j];
					planning[j] = {
						idx:j,
						actual: iterator7,
						y: iterator7
					};
					}
				}
			}else{
				for ( var j = 0; j < planning.length; j++) {
					if(iterator8!=undefined&&iterator8.length>0){
						if(rc.isInArray(j,iterator8)){
							continue;
						}
					}
					if(j < planning.length){
					iterator7 = planning[j];
					planning[j] = {
						idx:j,
						actual: Number(iterator7).format(iterator6),
						y: iterator7
					};
					}
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
	            	   color:rc.noticeColor["g"],
	            	   type: "column",
	            	   data: actual
	               }
               ];
			}
			data.push(column_options);
			jQuery("<option value='"+i+"'>"+iterator[i].name+"</option>").appendTo(select);
		}
		if(iterator.length == 1) select.hide();
		select.children(":first").attr("selected","selected");
		select.data("options",data).trigger("onchange");
	},
	
	_drawPie : function(javaData){
		var actual,options,iterator2,iterator6,
		dim_index = javaData.dim_index,
		iterator5 = javaData.fmt,
		category = undefined,
		colorIndex = 0,
		colorCounts = rc.chartsColors.length,
		data = new Array(),
		select = jQuery("#view003-pie-select"),
		iterator = javaData.pie_charts;
		select.children().remove();
		if(javaData.colorcss != undefined){
			for ( var i = 0; i < iterator.length; i++) {
				options = new Object();
				actual = new Array();
				options.title = {text: iterator[i].title};
				if(dim_index == undefined)
					dim_index = 0;
				else if (typeof(dim_index) != "number"){
					dim_index = dim_index[dim_index.length-1];
				}
				options.rcOptions= {unit: iterator[i].unit,category: category};
				iterator2 = javaData.table[iterator[i].colidx];
				iterator6 = iterator5[iterator[i].colidx];
				var  removecols= iterator[i].specialcols,iterator7=new Array();
				if(removecols!=undefined&&removecols.length>0){
					iterator7=rc.removeColumns(javaData.table,removecols);
				}
				if(iterator6 == null){
					for ( var j = 0; j < iterator2.length; j++) {
						if(iterator7!=undefined&&iterator7.length>0){
							if(rc.isInArray(j,iterator7)){
								continue;
							}
						}
						if(j < iterator2.length){
							if(typeof(iterator2[j]) == "object"){
								iterator2[j] = iterator2[j].y;
							}
							actual.push({
								idx:j,
								actual: iterator2[j],
								name: javaData.table[dim_index][j],
								color: javaData.colorcss[j]==null?rc.chartsColors[(colorIndex++)%colorCounts]:javaData.colorcss[j],
										y: iterator2[j]
							});
						}
					}
				}else{
					for ( var j = 0; j < iterator2.length; j++) {
						if(iterator7!=undefined&&iterator7.length>0){
							if(rc.isInArray(j,iterator7)){
								continue;
							}
						}
						if(j < iterator2.length){
						if(typeof(iterator2[j]) == "object"){
							iterator2[j] = iterator2[j].y;
						}
						actual.push({
							idx:j,
							actual: Number(iterator2[j]).format(iterator6),
							name: javaData.table[dim_index][j],
							color: javaData.colorcss[j]==null?rc.chartsColors[(colorIndex++)%colorCounts]:javaData.colorcss[j],
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
		}else{
			for ( var i = 0; i < iterator.length; i++) {
				options = new Object();
				actual = new Array();
				options.title = {text: iterator[i].title};
				if(dim_index == undefined)
					dim_index = 0;
				else if (typeof(dim_index) != "number"){
					dim_index = dim_index[dim_index.length-1];
				}
				options.rcOptions= {unit: iterator[i].unit,category: category};
				iterator2 = javaData.table[iterator[i].colidx];
				iterator6 = iterator5[iterator[i].colidx];
				var  removecols= iterator[i].specialcols,iterator7=new Array();
				if(removecols!=undefined&&removecols.length>0){
					iterator7=rc.removeColumns(javaData.table,removecols);
				}
				if(iterator6 == null){
					for ( var j = 0; j < iterator2.length; j++) {
						if(iterator7!=undefined&&iterator7.length>0){
							if(rc.isInArray(j,iterator7)){
								continue;
							}
						}
						if(j < iterator2.length){
						if(typeof(iterator2[j]) == "object"){
							iterator2[j] = iterator2[j].y;
						}
						actual.push({
							idx:j,
							actual: iterator2[j],
							name: javaData.table[dim_index][j],
							color: rc.chartsColors[j%colorCounts],
							y: iterator2[j]
						});
						}
					}
				}else{
					for ( var j = 0; j < iterator2.length; j++) {
						if(iterator7!=undefined&&iterator7.length>0){
							if(rc.isInArray(j,iterator7)){
								continue;
							}
						}
						if(j < iterator2.length){
						if(typeof(iterator2[j]) == "object"){
							iterator2[j] = iterator2[j].y;
						}
						actual.push({
							idx:j,
							actual: Number(iterator2[j]).format(iterator6),
							name: javaData.table[dim_index][j],
							color: rc.chartsColors[j%colorCounts],
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
		}
		if(iterator.length == 1) select.hide();
		select.children(":first").attr("selected","selected");
		select.data("options",data).trigger("onchange");
	},
	
	selectedTr : function(DOM){
		var prev = this.prevDOM,
		current = jQuery(DOM);
		if(prev != null)
			prev.css("background",rc.tableTrColor[prev.attr("level")]).toggleClass("activedtr");
		this.prevDOM = current;
		current.toggleClass("activedtr");
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
		jQuery(".view003-scrollc div").stop(true);
		var touches = view003c.getNativeEvent(event).touches,
		type = view003c.scrollparams.type;
		if(type != null){
			var div = type == "v" ? "#view003-scrollbar-y > div" : type == "h" ? "#view003-scrollbar-x > div" : ".view003-scrollc div";
			jQuery(div).css({opacity: 1,display: "block"});
			if ( touches && touches.length === 1 ) {
				var t = touches[0];
				view003c.touchStart.x = view003c.start.x = t.pageX;
				view003c.touchStart.y = view003c.start.y = t.pageY;
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
		jQuery(".view003-scrollc div").animate({opacity: 0},1400);
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
		var touches = view003c.getNativeEvent(event).touches;
		if ( touches && touches.length === 1 ) {
			var t = touches[0],
			params = view003c.scrollparams,
			type = params.type,
			table = jQuery("#view003-table > table");
			if(type == "v"){//only vertical scroll.
				var y = t.pageY,
				cheight = params.cheight,
				theight = params.theight,
				top= parseInt(table.css("margin-top").replace(/px/g, ""));
				params.top = top;
				top +=  y - view003c.start.y;
				view003c.start.y = y;
				if(top > 0){
					top = 0;
				}else if(top+theight < cheight){
					top = cheight - theight;
				}
				table.css("margin-top",top);
				jQuery("#view003-fixedcolumns table").css("margin-top",top);
				jQuery("#view003-scrollbar-y div").css("top", top*params.scrollY);
			}else if(type == "h"){//only horizontal scroll.
				var x = t.pageX,
				cwidth = params.cwidth,
				twidth = params.twidth,
				left = parseInt(table.css("margin-left").replace(/px/g, ""));
				params.left =  left;
				left +=  x - view003c.start.x;
				view003c.start.x = x;
				if(left > 0){
					left = 0;
				}else if(left+twidth < cwidth){
					left = cwidth - twidth;
				}
				table = jQuery("#view003-table table");
				table.css("margin-left",left);
				jQuery("#view003-fixedcolumns table").css("margin-left",0);
				jQuery("#view003-fixedcolumnsheader table").css("margin-left",0);
				jQuery("#view003-scrollbar-x div").css({left: left*params.scrollX});
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
				left +=  x - view003c.start.x;
				top +=  y - view003c.start.y;
				view003c.start.x = x;
				view003c.start.y = y;
				if(top > 0)
					top = 0;
				else if(top+theight < cheight)
					top = cheight - theight;
				if(left > 0)
					left =0;
				else if(left+twidth < cwidth)
					left = cwidth - twidth;
				jQuery("#view003-fixedheader table").css("margin-left",left);
				jQuery("#view003-scrollbar-x div").css({left: left*params.scrollX});
				jQuery("#view003-scrollbar-y div").css("top", top*params.scrollY);
				table.css({
					"margin-top": top,
					"margin-left": left
				});
				jQuery("#view003-fixedcolumns table").css("margin-top",top);
			}//type = null
		}
	},
	
	_bindTouchEvent : function(){
		var params = this.scrollparams,
		div = jQuery("#view003-table"),
		table = jQuery("#view003-table > table"),
		cwidth = params.cwidth = div.width()-2,//to consider border.
		twidth = params.twidth = table.width(),
		cheight = params.cheight = div.height()-2,
		theight = params.theight = table.height(),
		scrollx = jQuery("#view003-scrollbar-x").width() - twidth + cwidth,
		scrolly = jQuery("#view003-scrollbar-y").height() - theight + cheight;
		scrollx = scrollx < 32 ? 32 : scrollx;
		scrolly = scrolly < 32 ? 32 : scrolly;
		jQuery("#view003-scrollbar-x div").width(scrollx);
		jQuery("#view003-scrollbar-y div").height(scrolly);
		params.scrollX = (jQuery("#view003-scrollbar-x").width() - scrollx)/(cwidth-twidth);
		params.scrollY = (jQuery("#view003-scrollbar-y").height() - scrolly)/(cheight-theight);
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
			jQuery("#view003-table").bind("touchstart",this.handleTouchStart).bind("touchend",this.handleTouchEnd).bind("touchmove",this.handleTouchMove);
		}
	},
	
	_fixedHeader : function(){
		jQuery("#view003-table").children("div").remove();
		jQuery("#view003-table > table").css("margin-top",0);
		var height = jQuery("#view003-table > table thead").height(),
		table = jQuery("#view003-table > table");
		jQuery("#view002-table > table tbody tr:first td:first").css("min-width",45);
		jQuery("<div id='view003-fixedheader'></div><div id='view003-scrollbar-y' class='view003-scrollc'><div class='view003-scroll view003-scrollbar view003-scrolly'></div></div>" +
				"<div id='view003-scrollbar-x' class='view003-scrollc'><div class='view003-scroll view003-scrollbar view003-scrollx'></div></div>").insertBefore(table);
		jQuery("#view003-fixedheader").append(table.clone());
		jQuery("#view003-fixedheader").height(height);
		table.addClass("view003-scrollx view003-scrolly");
		if(jQuery("#view003-table > table").width()>jQuery("#view003-table").width()){
			this._fixedColumns();
		}
		this._bindTouchEvent();
	},
	
	_fixedColumns : function(){
		var height = jQuery("#view003-table > table thead").height(),
		table = jQuery("#view003-table > table");
		var width=0;
		for(var i=0;i<this.fixedcolumns;i++){
			width+=jQuery("#view003-table > table tbody tr:eq(0) td:eq("+i+")").width();
		}
		width+=this.fixedcolumns*5;
		jQuery("<div id='view003-fixedcolumnsheader'></div>").insertBefore(table);
		jQuery("<div id='view003-fixedcolumns'></div>").insertBefore(table);
		jQuery("#view003-fixedcolumnsheader").append(table.clone());
		jQuery("#view003-fixedcolumns").append(table.clone());
		jQuery("#view003-fixedcolumnsheader").height(height);
		jQuery("#view003-fixedcolumnsheader").width(width);
		jQuery("#view003-fixedcolumns").width(width);
	},
	
	chartMax : function(DOM,type){
		jQuery("#controltable").hide();
		jQuery("#hidecolumns").hide();
		this.maxType = type;
		var	chart,select,
		current = jQuery(DOM);
		if(type == "pie"){
			jQuery("#view003-column-details").hide();
			current.css("right",-542);
			chart = jQuery("#view003-pie");
			select = jQuery("#view003-pie-select");
		}else{
			jQuery("#view003-pie-details").hide();
			chart = jQuery("#view003-column");
			select = jQuery("#view003-column-select");
		}
		if(this.showtable=="Y"){
			chart.removeAttr("style");
		}
		current.html(VIEWS_LOCALE.view_003.restore);
		jQuery("#view003-table-details").hide();
		chart.attr("class","view003-chart-fullscreen");
		select.trigger("change");
		DOM.onclick = function(){view003c.backUpChart(DOM,type);};
		jQuery("#view003-fixedheader").hide();
	},
	
	backUpChart : function(DOM,type){
		this.maxType = null;
		var select,
		current = jQuery(DOM);
		if(this.showtable!=undefined){
			jQuery("#controltable").show();
			if(this.columns.length>0) jQuery("#hidecolumns").show();
		}
		if(type == "pie"){
			this._backUp(type);
			jQuery("#view003-column-details").show();
			if(this.numCharts == 2) current.css("right",0);
			select = jQuery("#view003-pie-select");
		}else{
			this._backUp(type);
			jQuery("#view003-pie-details").show();
			select = jQuery("#view003-column-select");
		}
		jQuery("#view003-table-details").show();
		if(this.showtable=="N"){
			jQuery("#view003-table-details").hide();
		}
		select.trigger("change");
		current.html(VIEWS_LOCALE.view_003.fullScreen);
		DOM.onclick = function(){view003c.chartMax(DOM,type);};
		jQuery("#view003-fixedheader").show();
	},
	
	_backUp : function(type){
		if(this.numCharts == 2)
			jQuery("#view003-"+type).attr("class","view003-"+type+"-restore");
		else
			jQuery("#view003-"+type).attr("class","view003-chart-restore");
	},
	
	tableToggle : function(DOM,type){
		var current = jQuery(DOM),
		table = jQuery("#view003-table-details"),
		charts = jQuery("#view003-charts");
		jQuery("#view003-fixedheader").hide();
		jQuery("#view003-table > table").css("margin-left",0);
		if(table.height() == 244){
			jQuery("#controltable").hide();
			this.maxType = type;
			charts.animate({
				left: "+=200",
				opacity: 0.25,
				height: 'toggle'
			}, 700, function() {
				table.height(622);
				current.html(VIEWS_LOCALE.view_003.restore);
				view003c._fixedHeader();
				jQuery("#view003-loading").hide();
			});
		}else{
			jQuery("#controltable").show();
			this.maxType = null;
			charts.animate({
				opacity: 1,
				left: 0,
				height: 'toggle'
			}, 1000, function() {
				table.height(244);
				current.html(VIEWS_LOCALE.view_003.fullScreen);
				view003c._fixedHeader();
				jQuery("#view003-loading").hide();
			});
		}
		jQuery("#view003-loading").hide();
	},
	
	updateCharts : function(DOM,type){
		var options,
		itself = jQuery(DOM);
		var divdata = itself.data("options")[DOM.value];
		if(type == "pie"){
			options = Object.clone(this.pieOptions);
			options.rcOptions = divdata.rcOptions;
			options.title = divdata.title;
			options.chart.renderTo="view003-pie";
			options.series=[{data: divdata.data}];
			if(this.end)
				options.plotOptions.series.point.events.click = function(){};
			else
				options.plotOptions.series.point.events.click = function(){
				var category;
				if(view003c.dims.length > 0){
					category = view003c.dims[this.idx];
				}else{
					category = this.name;
				}
					view003c.drawCharts(category);
				};
		}else{
			options = Object.clone(this.columnOptions);
			options.title = divdata.title;
			options.chart.renderTo="view003-column";
			options.rcOptions = divdata.rcOptions;
			options.xAxis= divdata.xAxis;
			options.yAxis= divdata.yAxis;
			options.series = divdata.series;
			if(divdata.series.length == 1)
				options.legend = {enabled: false};
			if(this.end)
				options.plotOptions.series.point.events.click = function(){};
			else
				options.plotOptions.series.point.events.click = function(){
				var category;
				if(view003c.dims.length > 0){
					category = view003c.dims[this.idx];
				}else{
					category = this.category;
				}
					view003c.drawCharts(category);
				};
		}
		new Highcharts.Chart(options);
	},
	
	setFilter : function(DOM,relative){
		var input = jQuery(DOM).prev();
		input.attr("checked",input.attr("checked") == "checked"?false:"checked");
		this.refresh();
	},
	
	fullScreen : function(DOM,type){
		if(type == "table")
			this.tableToggle(DOM,type);
		else
			this.chartMax(DOM,type);
	},
	
	
	controlTable : function(){
		if(this.showtable=="N"){
			jQuery("#kpi-filter").show();
			jQuery("#controltable").show();
			jQuery("#controltable").html(VIEWS_LOCALE.main.showtable);
			jQuery("#view003-table-details").hide();
			if(this.javaData.pie_charts.length>0){
				jQuery("#view003-pie").height(jQuery("#view002-details").height());
				jQuery("#view003-pie-select").trigger("change");
			}
			if(this.javaData.column_charts.length>0){
				jQuery("#view003-column").height(jQuery("#view002-details").height());
				jQuery("#view003-column-select").trigger("change");
			}
		}else{
			jQuery("#kpi-filter").show();
			jQuery("#controltable").show();
			jQuery("#controltable").html(VIEWS_LOCALE.main.hidetable);
			jQuery("#view003-table-details").show();
			if(this.javaData.pie_charts.length>0){
				jQuery("#view003-pie").height("392");
				jQuery("#view003-pie-select").trigger("change");
			}
			if(this.javaData.column_charts.length>0){
				jQuery("#view003-column").height("392");
				jQuery("#view003-column-select").trigger("change");
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
		view003c.controlTable();
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
		this._fixedHeader();
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
		jQuery("#view003-container").children().remove();
		jQuery(".viewport").hide();
		jQuery("#views").hide();
		jQuery(".mainpageajax").hide();
	},
	/**
	 * Description : display adaptation for view003
	 * 
	 * type: public
	 */
	_adaptation : function(){
		jQuery(".mainpageajax").css("width",view003c.width);
		jQuery("#view003-container").css("width",view003c.width);
	},
	/**
	 * Description : to refresh the current reports.
	 * 
	 * type: public
	 * */
	refresh : function(){
		jQuery("#view003-loading").show();
		jQuery("#view003-container").children().remove();
		this.drawCharts();
	},
	/**
	 * Description : to achieve web smooth scrolling
	 * 
	 * type: public
	 */
	
};
View003Control.main = function(){
	view003c=new View003Control();
	if(view003c.isNotPad && view003c.width < 768){
		view003c._adaptation();
	}
};
jQuery(document).ready(View003Control.main);
