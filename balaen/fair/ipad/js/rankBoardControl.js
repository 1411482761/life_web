var rankBoard;
var rankBoardControl = Class.create();
rankBoardControl.prototype = {
		
	/**
	 * Description : to define parameter
	 * @type private
	 * */
	initialize : function() {
		this.int=-1;
		this.userid=-1;
		this.faird=-1;
		this.ad_sql="";
		this.time=0;
		this.title="订货查询";
		this.rank_board_json_sql = "rank_board_json";
		this.javaData = new Object();
		this.activeSQL = "";
		this.activeFilterSQL = "";
		this.activeClassIdx = 0;
		this.activeClassConfig = new Object();
		this.imageurl = "";
		this.orderbyExpr = "";
		this.filterColumnsIdxArray = new Array();
		this.filterArray = new Array();
		this.filterOrderByIdxArray = new Array();
		this.filterOrderByArray = new Array();
		this.filterStr = "";
		this.width = "";
		this,rowspanColumns = new Array();
		this.rowspanStartIdx = new Array();
		this.interval = "";
		this.viewall = false;
		this.dataRows = 0;
		this.currectPage = 1;
		this.pages = 1;
		this.dataJSON = new Array();
		this.viewAlldefaultLines = 5;
		this.defaultLines = 5;
		this.defaultOrderBy = "";
		this.refreshType="page"; //two types: page - refresh whole page, 'firstdd' - first dropdown box selection
	},
	/**
	初始化页面
	@param fairname 订货会名称
	@param fairid - 订货会id
	@param time - 定时刷新时间，按分钟计算
	@param refType 页面定时刷新方式
	'page' - refresh whole page, 'firstdd' - first dropdown box selection 第一个selection类型的字段做循环
	*/
	load : function(fairname,fairid,time,refType){
		/*rankBoard.userid=userid;*/
		rankBoard.refreshType=refType;
		rankBoard.fairid = fairid;
		rankBoard.time = time;
		rankBoard.title = fairname + " " + rankBoard.title;
		jQuery("#header").html(rankBoard.title);
		var viewall = "<div id='viewAll' onclick=rankBoard.viewAllData('viewall')>查看详情</div>";
		jQuery("#header").append(viewall);
		
		jQuery(".loader").css("display","block");
		runsql.getJSON(rankBoard.rank_board_json_sql,function(reponse){
			jQuery(".loader").css("display","none");
			rankBoard.javaData = reponse.data[0].result;
			var str = "";
			for(var i = 0;i < rankBoard.javaData.length;i++){
				var desc = rankBoard.javaData[i].title;
				if(desc != undefined){
					str += "<li id='classification-"+i+"' onclick=rankBoard.getModel("+i+")>" + desc +"</li>";
				}
			}
			jQuery('#classification ul').html(str);
			jQuery('#classification-0').addClass("classBackground");
			rankBoard.getModel(0);
			if(rankBoard.refreshType=="page")
				rankBoard.interval = setInterval("rankBoard.getModel('interval')",rankBoard.time * 60000);
			else
				rankBoard.interval = setInterval("rankBoard.changeFirstDDColumn()",rankBoard.time * 60000);
		});
		
	},
	viewAllData: function(type){
		var viewAll = "";
		if("viewall" == type){
			clearInterval(rankBoard.interval);
			jQuery("#header").html(rankBoard.title);
			viewAll = "<div id='viewAll' onclick=rankBoard.viewAllData()>定时刷新</div>";
			rankBoard.viewall = true;
			jQuery("#header").append(viewAll);
		}else{
			jQuery("#header").html(rankBoard.title);
			viewAll = "<div id='viewAll' onclick=rankBoard.viewAllData('viewall')>查看详情</div>";
			jQuery("#header").append(viewAll);
			rankBoard.viewall = false;
			if(rankBoard.refreshType=="page")
				rankBoard.interval = setInterval("rankBoard.getModel('interval')",rankBoard.time * 60000);
			else
				rankBoard.interval = setInterval("rankBoard.changeFirstDDColumn()",rankBoard.time * 60000);
		}
		rankBoard.getModel(rankBoard.activeClassIdx);
		
	},
	/**
	 循环刷新当前页面的第一下拉框字段的每个选项
	*/
	changeFirstDDColumn:function(){
		var idx = rankBoard.activeClassIdx;
		var config = rankBoard.javaData[idx];
		var columns = config.columns;
		for(var i = 0; i < columns.length;i++){
			if(columns[i].select!=null){
				//get current select index
				var selEle=jQuery("#columns-"+i+">:first-child")[0];
				var currIdx=selEle.selectedIndex+1;
				if(currIdx==columns[i].select.length)currIdx=0;
				selEle.selectedIndex=currIdx;
				rankBoard.filterData(i);
				break;
			}
		}
	},
	
	/**
	 * 获得第几个分类  分类有（全部订量，区域，组织，客户）
	 * @param
	 * idx index 第几个分类*/
	getModel : function(idx){
		if('interval' == idx){
			idx = rankBoard.activeClassIdx;
		}
		jQuery('#classification-' + rankBoard.activeClassIdx).removeClass("classBackground");
		jQuery('#classification-' + idx).addClass("classBackground");
		rankBoard.activeClassIdx = idx;
		var config = rankBoard.javaData[idx];
		rankBoard.activeClassConfig = config;
		rankBoard.imageurl = config.imageurl;
		rankBoard.activeSQL = config.adSQL;
		rankBoard.activeFilterSQL = config.filterAdSQL;
		rankBoard.rowspanColumns = config.rowspan;
		
		if(config.defaultLines != undefined){
			rankBoard.defaultLines = Number(config.defaultLines);
		}
		if(config.viewAlldefaultLines != undefined){
			rankBoard.viewAlldefaultLines = Number(config.viewAlldefaultLines);
		}
		if(config.orderby != undefined){
			rankBoard.defaultOrderBy = config.orderby;
		}else{
			rankBoard.defaultOrderBy = "";
		}
		
		rankBoard.filterColumnsIdxArray = new Array();
		rankBoard.filterArray = new Array();
		rankBoard.filterOrderByIdxArray = new Array();
		rankBoard.filterOrderByArray = new Array();
		
		var columns = config.columns;
		var str = "";
		for(var i = 0; i < columns.length;i++){
			
			if(columns[i].select == undefined){
				var style = columns[i].style;
				if(style != undefined){
					str += "<li id='columns-"+i+"' style='"+style+"'>"+columns[i].desc+"</li>";
				}else{
					str += "<li id='columns-"+i+"'>"+columns[i].desc+"</li>";
				}
				
			}else{
				str += "<li id='columns-"+i+"'><select onchange='rankBoard.filterData("+i+")' style='font-size:20px;color:#505150'>";
				for(var j = 0;j < columns[i].select.length; j++){
					var expr = columns[i].select[j].expr;
					var value = columns[i].select[j].value;
					str += '<option value ="'+expr+'">'+value+'</option>';
				}
				str += 	"</select></li>";
			}
		}
		jQuery('#tableHeader ul').html(str);
		var width = 100/columns.length;
		rankBoard.width = width + "%";
		jQuery("#tableHeader ul li").width(rankBoard.width);
		var params = {"fairid":rankBoard.fairid};
		rankBoard.getData(rankBoard.activeSQL,params);
	},
	getData : function(sql,params,type,filter){
		if(type != undefined){
			jQuery(".loader").css("display","block");
			runsql.queryByExpression(sql,params,filter,function(javaData){
				var data = javaData.data[0].result.data;
				var dataJSON = rankBoard.getDataJSON(data);
				rankBoard.dataJSON = dataJSON;
				var str = "";
				if(rankBoard.viewall){
					rankBoard.showToolbar(dataJSON);
				}else{
					jQuery("#toolbars").hide();
					str = rankBoard.getViewString(dataJSON);
					jQuery('#contents').html(str);
					jQuery(".tableContent ul li").width(rankBoard.width);
				}
				jQuery(".loader").css("display","none");
			});
		}else{
			jQuery(".loader").css("display","block");
			runsql.query(sql,params,function(javaData){
				jQuery(".loader").css("display","none");
				var data = javaData.data[0].result;
				var dataJSON = rankBoard.getDataJSON(data);
				rankBoard.dataJSON = dataJSON;
				var str = "";
				if(rankBoard.viewall){
					rankBoard.showToolbar(dataJSON);
				}else{
					jQuery("#toolbars").hide();
					str = rankBoard.getViewString(dataJSON);
					jQuery('#contents').html(str);
					jQuery(".tableContent ul li").width(rankBoard.width);
				}
				jQuery(".loader").css("display","none");
			});
		}
		
	},
	showToolbar : function(dataJSON){
		rankBoard.pages =(rankBoard.dataRows%rankBoard.viewAlldefaultLines == 0 ? rankBoard.dataRows/rankBoard.viewAlldefaultLines : parseInt(rankBoard.dataRows/rankBoard.viewAlldefaultLines)+1);
		
		if(rankBoard.pages > 1){
			var select = jQuery("#current select");
			select.html("");
			select.append("<option value='1' selected='selected'>第 1 页</option>");
			for ( var i = 1; i < rankBoard.pages; i++) {
				select.append("<option value='"+(i+1)+"'>第 "+(i+1)+" 页</option>");
			}
			jQuery("#total").html("共 <span>"+rankBoard.pages+"</span> 页");
			jQuery("#prev").hide();
			jQuery("#toolbars").show();
			
		}else{
			jQuery("#toolbars").hide();
		}
		this._switchPage();
	},
	switchPage : function(type){
		var select = jQuery("#current select"),
		val = parseInt(select.val());
		switch (type) {
		case 0:
			select.val(--val);
			this._switchPage();
			break;
		case 1:
			select.val(++val);
			this._switchPage();
			break;
		default:
			alert("odc.swithPage type 参数..");
			break;
		}
	},
	_switchPage : function(event){
		var select = jQuery("#current select"),
		val = select.val();
		rankBoard.currectPage = val - 1;
		if(RegExp("^\\d+$").test(val)){
			val = parseInt(val);
			switch (val) {
			case 1:
				jQuery("#prev").hide();
				jQuery("#next").show();
				break;
			case rankBoard.pages:
				jQuery("#prev").show();
				jQuery("#next").hide();
				break;
			default:
				jQuery("#prev").show();
				jQuery("#next").show();
				break;
			}
			
			var start = (val-1)*rankBoard.viewAlldefaultLines;
			var end = val*rankBoard.viewAlldefaultLines;
			var str = rankBoard.getViewAllString(rankBoard.dataJSON,start,end);
			jQuery('#contents').html(str);
			jQuery(".tableContent ul li").width(rankBoard.width);
		}
	},
	getDataJSON : function(data){
		var referData = "";
		var lastData = "";
		var dataJSON = {};
		rankBoard.dataRows = 0;
		for(var i = 0;i < data.length;i++){
			if(rankBoard.rowspanColumns == undefined){
				this.rowspanStartIdx.push(i);
				dataJSON[i] = {};
				for(var j = 0;j <  data[i].length; j++){
					dataJSON[i][j] = [];
					if(data[i][j] == null){
						data[i][j] = "";
					}
					dataJSON[i][j].push(data[i][j].toString());
				}
				rankBoard.dataRows++;
			}else{
				referData = data[i][0];
				if(i == 0){
					lastData = "";
				}else{
					lastData = data[i-1][0];
				}
				if(referData != lastData){
					this.rowspanStartIdx.push(i);
					dataJSON[i] = {};
					for(var j = 0;j <  data[i].length; j++){
						dataJSON[i][j] = [];
						if(data[i][j] == null){
							data[i][j] = "";
						}
						dataJSON[i][j].push(data[i][j].toString());
					}
					rankBoard.dataRows++;
				}else{
					var row = this.rowspanStartIdx[this.rowspanStartIdx.length-1];
					for(var k = 0; k < rankBoard.rowspanColumns.length;k++){
						var col = rankBoard.rowspanColumns[k];
						dataJSON[row][col].push(data[i][col].toString());
					}
				}
			}
		}            
		return dataJSON;
	},
	/*获得所有的排行*/
	getViewAllString : function(dataJSON,start,end){
		var str = "";
		var flag = 0;
		for(var row in dataJSON){
			if(flag < start){
				flag++;
				continue;
			}else{
				flag++;
			}
			if(flag-1 >= end){
				break;
			}
			str += "<div class='tableContent'><ul>";
			for(var col in dataJSON[row]){
				str += "<li>";
				var lineHeight = 80/dataJSON[row][col].length;
				lineHeight = lineHeight + "px";
				for(var i = 0 ; i < dataJSON[row][col].length;i++){
					var con = dataJSON[row][col][i].toString();
					if(con.indexOf(".png") > -1 || con.indexOf(".jpg") > -1 || con.indexOf(".PNG") > -1 || con.indexOf(".JPG") > -1){
						var src = rankBoard.imageurl + dataJSON[row][col][i];
						str +="<img src='"+src+"'/>";
					}else{
						
						str += "<span style='line-height:"+lineHeight+"'>"+dataJSON[row][col][i] + "</span></br>";
					}
				}
				str += "</li>";
			}
			str +="<ul></div>";
		}
		jQuery('#contents').html(str);
		jQuery(".tableContent ul li").width(rankBoard.width);
	},
	getViewString : function(dataJSON){
		var str = "";
		var flag = 0;
		for(var row in dataJSON){
			if(flag > rankBoard.defaultLines){
				return str;
			}
			str += "<div class='tableContent'><ul>";
			for(var col in dataJSON[row]){
				str += "<li>";
				var lineHeight = 80/dataJSON[row][col].length;
				lineHeight = lineHeight + "px";
				for(var i = 0 ; i < dataJSON[row][col].length;i++){
					var con = dataJSON[row][col][i].toString();
					if(con.indexOf(".png") > -1 || con.indexOf(".jpg") > -1 || con.indexOf(".PNG") > -1 || con.indexOf(".JPG") > -1){
						var src = rankBoard.imageurl + dataJSON[row][col][i];
						str +="<img src='"+src+"'/>";
					}else{
						
						str += "<span style='line-height:"+lineHeight+"'>"+dataJSON[row][col][i] + "</span></br>";
					}
				}
				str += "</li>";
			}
			str +="<ul></div>";
			flag++;
		}
		return str;
	},
	quickSearch : function(){
		var searchText = jQuery('#quickSearch').val();
		var searchExpr = rankBoard.activeClassConfig.search;
		var idx = searchExpr.indexOf("$");
		var lastIdx = searchExpr.lastIndexOf("$");
		var expr  = searchExpr.substring(0,idx)+searchText+searchExpr.substring(lastIdx+1,searchExpr.length);
		
		var params = {"fairid":rankBoard.fairid};
		var filter = {"$filter$":expr,"$orderby$":rankBoard.defaultOrderBy};
		rankBoard.getData(rankBoard.activeFilterSQL,params,'search',filter);
	},
	/**
	 * 字段的筛选
	 * @param
	 * idx 第几个字段
	 * */
	filterData : function(idx){
		var selectVal = jQuery("#columns-" + idx + " select").val();
		
		var params = {"fairid":rankBoard.fairid};
		var filter = {};
		
		var filterStr = "";
		var orderByStr = "";
		if(selectVal.toLowerCase().indexOf(" and ") == -1 && "" != selectVal){
			rankBoard.filterOrderByIdxArray.push(idx);
			rankBoard.filterOrderByArray.push(selectVal);
			
			var flag = new Array();
			for(var i = 0;i < rankBoard.filterOrderByIdxArray.length;i++){
				if(rankBoard.filterOrderByIdxArray[i] == idx){
					flag.push(i);
				}
			}
			if(flag.length > 1){
				rankBoard.filterOrderByIdxArray.splice(flag[0],1);
				rankBoard.filterOrderByArray.splice(flag[0],1);
			}
			for(var j = 0;j < rankBoard.filterOrderByArray.length;j++){
				orderByStr += rankBoard.filterOrderByArray[j];
			}
			rankBoard.orderbyExpr = orderByStr;
			
		}else{
			rankBoard.filterColumnsIdxArray.push(idx);
			rankBoard.filterArray.push(selectVal);
			
			var flag = new Array();
			for(var i = 0;i < rankBoard.filterColumnsIdxArray.length;i++){
				if(rankBoard.filterColumnsIdxArray[i] == idx){
					flag.push(i);
				}
			}
			if(flag.length > 1){
				rankBoard.filterColumnsIdxArray.splice(flag[0],1);
				rankBoard.filterArray.splice(flag[0],1);
			}
			for(var j = 0;j < rankBoard.filterArray.length;j++){
				filterStr += rankBoard.filterArray[j];
			}
			rankBoard.filterStr = filterStr;
		}
		if(rankBoard.orderbyExpr == "" && rankBoard.defaultOrderBy != ""){
			rankBoard.orderbyExpr = rankBoard.defaultOrderBy;
		}
		filter = {"$filter$":rankBoard.filterStr,"$orderby$":rankBoard.orderbyExpr};
		rankBoard.getData(rankBoard.activeFilterSQL,params,'filter',filter);
	}
};
rankBoardControl.main = function(){
	portalClient = new PortalClient();
	portalClient.init(null,null,"/servlets/binserv/Fair");
	rankBoard=new rankBoardControl();
};
jQuery(document).ready(rankBoardControl.main);