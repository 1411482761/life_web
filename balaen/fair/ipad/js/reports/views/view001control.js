var v001c;
var View001Control = Class.create();
View001Control.prototype = {
	/**
	 * Description : to define parameter
	 * 
	 * @type private
	 * */
	initialize : function() {
		this.viewParams = new String();
		this.charts = new Hash();
		this.ajaxParams = new Object();
		this._init();
	},
	
	_init : function(){
		this.viewParams={
				basicTable : "U_wall",
				viewName : "wall"
		};
		jQuery("#viewtype ul").append(jQuery('<li onclick="v001c.getActived();rc.firstSwitch();" style="background: url(/plugins/test/img/view001.png);" ><div class="viewtype-notice"><div class="viewtype-name">'+this.viewParams.viewName+'</div></div></li>'));
		jQuery("#viewbuttons ul").append(jQuery('<li onclick="v001c.getActived();"><div class="viewbutton-name">'+this.viewParams.viewName+'</div></li>'));
		jQuery("#viewports").append(jQuery('<div id="view001" class="viewport"><div id="view001-basic"></div><div id="view001-category"></div><div id="view001-details"></div></div>'));
	},
	
	getActived : function(){
		if(rc.isActived["view001"] == true){
			v001c._showView();
		}else{
			
			jQuery.getJSON("",this.ajaxParams,function(dbData){
				
			});
			/*
			 * @begin ajax
			 *  send ajax with params: viewParams.tableId*/
			var tableDesc = v001c.viewParams.basicTable;
			var dbData =
			{
				categories: ["Spring01","Spring02","Spring03"],
				title: "Distribution of the wave",
				unit: ["Qty","kinds"],
				planning: null,
				actual:[12,20,16]
			};
			var data = new Array();
			var options = Object.clone(rc.chartsDefualtOptions);
			options.chart.renderTo="view001-basic";
			options.chart.defaultSeriesType="pie";
			options.iccOptions={
        			unit: dbData.unit
			};
			options.title = {text: dbData.title};
			options.legend.enabled= false;
			options.tooltip={
				formatter: function() {
					return '<b>'+ this.point.name +'</b>: '+ this.percentage.toFixed(2) +' %';
				}	
			};
			for ( var i = 0; i < dbData.categories.length; i++) {
				data.push({
					name: dbData.categories[i],
					color: rc.chartsColors[i+1],
					y: dbData.actual[i]
				});
			}
			options.series=[{
				data: data,
				dataLabels: {
					formatter: function() {
						return this.y > 5 ? this.point.name : null;
					},
					color: 'white',
					distance: -30
				}
			}];
			options.plotOptions.series.point.events.click = function(){
            	v001c.showCategories(this.name);
			};
			v001c.charts["basic"]=new Highcharts.Chart(options);
			
			v001c._showView();
			rc.isActived["view001"] = true;
			/* @end ajax*/
		}
	},
	
	showCategories : function(basic){
		v001c.ajaxParams = new Object();
		v001c.ajaxParams={wave: basic};
		if(jQuery("#view001-details").css("display") == "block") {
			v001c.charts["details"].destroy();
			jQuery("#view001-details").hide();
		}
		v001c.charts["basic"].setSize(420,657);
		if(jQuery("#view001-category").css("display") != "block"){
			jQuery("#view001-basic").css({"height":657,"width":420});
			jQuery("#view001-category").css({"height":657,"width":604}).show();
		}else{
			jQuery("#view001-category").css({"height":657,"width":604});
			v001c.charts["category"].setSize(604,657);
		}
		
		jQuery.getJSON("",this.ajaxParams,function(dbData){
			
		});
		/* send ajax with params: v001c.ajaxParams*/
		var dbData =
		{
			categories: ["bags","clothes","belts","glasses"],
			title: "Distribution of categories",
			unit: ["Qty","tens"],
			planning: [120.4,129.2,116.0,144.0],
			actual: [["normal",105.5],["warning",100.3],["notice",100.5],["normal",95.5]]
		};
		var options = Object.clone(rc.chartsDefualtOptions);
		options.chart.renderTo="view001-category";
		options.chart.defaultSeriesType="column";
		options.title = {text: dbData.title};
		options.legend.enabled= true;
		options.iccOptions={
    			unit: dbData.unit
		};
		options.plotOptions.series.pointWidth = jQuery("#view001-category").width()/dbData.categories.length*0.23;
		options.plotOptions.series.dataLabels = {
			 enabled: true,
			 color: '#FFFFFF',
			 formatter: function() {
				 return this.y + " "+this.series.chart.iccOptions.unit[1];
			 },
			 style: {font: 'normal 11px Verdana, sans-serif'}
		 };
		options.tooltip={
			formatter: function() {
	            var s = '<b>'+ this.x +'</b>';
	            jQuery.each(this.points, function(i, point) {
	                s += '<br/><span style="fill:'+point.series.color+'">'+ point.series.name +'</span>: '+
	                    point.y +" "+this.series.chart.iccOptions.unit[1];
	            });
	            return s;
	        },
	        shared: true
		};
		var actual = new Array();
		var planning = new Array();
		for ( var i = 0; i < dbData.categories.length; i++) {
			planning.push(dbData.planning[i]);
			actual.push({color:rc.noticeColor[dbData.actual[i][0]],y:dbData.actual[i][1]});
		}
		options.xAxis={categories: dbData.categories};
		options.yAxis={
			min: 0,
			title: {text: dbData.unit[0]+" ( "+dbData.unit[1]+" ) "}
		};
		options.series=[
			 {
				 name: "planning",
				 color:rc.noticeColor["planning"],
				 data: planning
			 },
			 {
				 color:rc.noticeColor["normal"],
				 name: "actual",
				 data: actual
			 }
		];
		options.plotOptions.series.point.events.click = function(){
        	v001c._showDetails(this.category);
		};
		v001c.charts["category"]=new Highcharts.Chart(options);
		/*end ajax*/
		
	},
	
	_showDetails : function(category){
		v001c.ajaxParams.cate = category;
		v001c.charts["basic"].setSize(420,357);
		v001c.charts["category"].setSize(604,357);
		if(jQuery("#view001-details").css("display") != "block"){
			jQuery("#view001-basic").css({"height":357,"width":420});
			jQuery("#view001-category").css({"height":357,"width":604});
			jQuery("#view001-details").css({"height":300,"width":1024}).show();
		}
		
		jQuery.getJSON("",this.ajaxParams,function(dbData){
			
		});
		
		/* send ajax with params: v001c.ajaxParams*/
		var dbData =
		{
			categories: ["coat","sweater","windcoat","jacket","underwear","sark"],
			title: "Distribution of clothes",
			unit: ["Qty","tens"],
			planning: null,
			actual: [105.5,70.3,130.5,95.5,89.4,110]
		};
		var options = Object.clone(rc.chartsDefualtOptions);
		options.chart.renderTo="view001-details";
		options.chart.defaultSeriesType="column";
		options.title = {text: dbData.title};
		options.legend.enabled= false;
		options.plotOptions.series.pointWidth = jQuery("#view001-details").width()/dbData.categories.length*0.86;
		options.plotOptions.series.dataLabels = {
			 enabled: true,
			 color: '#FFFFFF',
			 formatter: function() {
				 return this.y + " "+this.series.chart.iccOptions.unit[1];
			 },
			 style: {font: 'normal 11px Verdana, sans-serif'}
		 };
		options.tooltip={
			formatter: function() {
				return ''+ this.x +': '+ (this.y/this.series.chart.iccOptions.total*100).toFixed(2) +' %';
	        }
		};
		var actual = new Array();
		var total = 0;
		for ( var i = 0; i < dbData.categories.length; i++) {
			total += dbData.actual[i];
			actual.push(dbData.actual[i]);
		}
		options.iccOptions={
				unit: dbData.unit,
				total: total
		};
		options.xAxis={categories: dbData.categories};
		options.yAxis={
			min: 0,
			title: {text: dbData.unit[0]+" ( "+dbData.unit[1]+" ) "}
		};
		options.series=[
			 {
				 stack: "details",
				 color: rc.noticeColor["normal"],
				 data: actual
			 }
		];
		options.plotOptions.series.point.events.click = function(){
			v001c.ajaxParams.ass = this.category;
			v001c._gotoC();
		};
		v001c.charts["details"]=new Highcharts.Chart(options);
		/*end ajax*/

	},
	
	_gotoC : function(){
		//alert(Object.toJSON(v001c.ajaxParams));
	},
	
	_showView : function(){
		if(jQuery("#view001").css("display")!="block") jQuery("#view001").show(50);
		jQuery('.viewport:not(#view001)').hide(50);
	}
};
View001Control.main = function(){
	v001c=new View001Control();
};
jQuery(document).ready(View001Control.main);
