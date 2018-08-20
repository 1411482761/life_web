/**
* CopyRright (c)2015: lifecycle
* Project: Ordering - Board
* Comments:  to show the KPIs
* Create Date：2015-01-28
	@version: 1.0
	@author: cico
*/

var rpt;
var RptControl = Class.create();
var coms = new Array();
RptControl.prototype = {
	/**
	 * 定义全局变量
	 */
	initialize : function() {
		this.sessionkey = null;
		this.name = "";
		this.odata = null;
		this.data = null;
		this.fmt = null;
		this.colspan = -1;
		this.formula = null;
		this.top = 0;
		this.fType = null;
		this.theme="01";
		this.filterid = -1;
		this.bfilterid = -1;
		this.com = null;
		this.fixedcolumns=3;
		this.hasImage = 'N';
		this.topCount = 0;
		this.rptname = null;
		this.cellcolumns=new Array();
		this.width = jQuery(document).width();
		this.height = jQuery(document).height();
		this.isNotPad = navigator.userAgent.indexOf('iPad') == -1;
		this.Array_col = new Array();
		this.jumpcount=0;//跳转报表的层数
		this.jumpparams = new Array();//跳转报表每层的参数
		this.filterrpt="";//跳转报表原始报表
		this.firstdisplaycol=-1;//报表显示的第一列，排除隐藏列
		this.titlearray=new Hash();//跳转报表title需要记住前面如小类(A001,上衣)
		this.params = new Array();
	},
	
	
	/**
	 * 初始化系统变量
	 * @param sessionkey
	 * @param name
	 */
	init: function(sessionkey,name,theme,isback){
		this.sessionkey = sessionkey;
		this.name = name;
		this.pages = -1;
		this.currentPage = 0;
		this.linecounts = 24;
		this.theme=theme;
		this.isback=isback;
		this.javaData = new Object();
		jQuery("#table").html("");
		jQuery("#loadinglocale").html(VIEWS_LOCALE.main.loading);
		if(rpt.isNotPad && rpt.width <  768){
			jQuery("#rpt-back .rpt-button-value").html();
			jQuery("#rpt-refresh .rpt-button-value").html();
		}else{
			jQuery("#rpt-back .rpt-button-value").html(VIEWS_LOCALE.orderdetails.back);
			jQuery("#rpt-refresh .rpt-button-value").html(VIEWS_LOCALE.main.refresh);
		}
		jQuery("#toolbars").hide();
		jQuery("#prev").hide();
		jQuery("#next").show();
		jQuery("#current select option").remove();
	},
	
	initGlobalPrams: function(javaData){
		rpt.odata = javaData.data;
		rpt.fmt = javaData.fmt;
		rpt.data = javaData.data.slice(0);
	},
	
	/*隐藏列*/
	hideColumns: function(data){
		var hidden = data.hidden;
		var flag = 0;
		for(var i = 0; i < hidden.length; i++){
			data.data.splice(hidden[i] - flag,1);
			flag++;
		}
	},
	
	/**
	 * 加载报表
	 * @param sessionkey
	 * @param name
	 */
	load : function(sessionkey,name,theme,isback){
		this.Array_col = new Array();
		this.init(sessionkey,name,theme,isback);
		rpt.adaptation(theme);
		jQuery("#fixedcolumns").html("");
		jQuery("#loading").css("display","block");
		var params={cmd:"LoadRpt", view:"view900", sessionkey: this.sessionkey, name: this.name,viewchain:[this.name],filterid:this.filterid,bfilterid:this.bfilterid,filtervalues:this.params,filterrpt:this.filterrpt, urlquery:location.search};
		var trans={id:1, command:"com.agilecontrol.fair.FairCmd", params:params};
		if(jQuery("#showstores").is(":hidden")){
			trans.params.selectvalue=-1;
		}else{
			trans.params.selectvalue=jQuery("#showstores").find("option:selected").val();
		}
		jQuery(".contents").hide();
		portalClient.sendOneRequest(trans, function(response){
			if(0 != response.data[0].code){
				alert(response.data[0].message);
				return;
			}
		    jQuery("#loading").hide();
		    jQuery(".contents").show();
			var javaData= response.data[0].result;
			if(javaData.mergecell!=undefined) rpt.cellcolumns=javaData.mergecell;
			if(javaData.title!=undefined) jQuery("#rpt-title").html(javaData.title);
			rpt.drawSelect(javaData);
			rpt.initGlobalPrams(javaData);
			//rpt.initData(javaData);
			rpt.caculateByComs(javaData);
			var data = {
				header: javaData.header,
				fmt: javaData.fmt,
				hidden: javaData.hidden,
				data: rpt.data
			};
			//rpt.hideColumns(data);
			rpt.javaData=data;
			jQuery("#container").height(jQuery(window).height()-50);
			jQuery("#table-container").height(jQuery(window).height()-190);
			rpt.drawTable(data);
			if(undefined!=javaData.view)jQuery("#rpt-title").html(javaData.view.desc);
			if(rpt.jumpcount>0){
				var otitle=jQuery("#rpt-title").html();
				jQuery("#rpt-title").html(otitle+"("+rpt.titlearray[rpt.jumpcount-1]+")");
			}
			rpt._fixedColumns();
			
		});
	},
	caculateByComs : function(javaData){
		this.com = new Array();
		this.data = javaData.data;
		this.fmt = javaData.fmt;
		this.top = javaData.top;
		this.colspan = javaData.header.lefttop.colspan;
		var coms = javaData.components;
		this.topCount = 0;
		for(var j = 0; j < coms.length;j++){
			if(4 == coms[j].type){
				this.topCount++;
			}
		}
		if(null == coms || undefined == coms || coms.length == 0){
			return;
		}
		for ( var i = 0; i < coms.length; i++) {
			if(0 == coms[i].type){
				for ( var j = 1; j <getObjectSize(coms[i].params); j++) {
					for ( var k = 0; k < coms[i].params[j].length; k++) {
						this.Array_col.push(coms[i].params[j][k]);
					}
				}
			}else if(1 == coms[i].type){
				this.Array_col.push(coms[i].params[0][0]);
			}else if(2 == coms[i].type){
				this.Array_col.push(coms[i].params[0][0]);
			}else if(3 == coms[i].type){
				this.Array_col.push(coms[i].params[0][0]);
			}else if(4 == coms[i].type){
				this.Array_col.push(coms[i].params[1][0]);
			}
			this.removeDuplElem(this.Array_col);
			rpt.drawComOne(coms[i]);

		}
	},
	drawSelect : function(result){
		if(result.stores!=undefined&&result.stores.length>0){
			var temp=jQuery("#showstores"),html="",iterator=result.stores;
			temp.show();
			for(var i=0;i<iterator.length;i++){
				html+="<option index='"+i+"' value='"+iterator[i][0]+"'>"+iterator[i][1]+"</option>";
			}
			if(temp.find("option:selected").val()==undefined){
				temp.html(html);
			}
			
		}
	},
	drawTable : function(result){
		var headerobj=result.header;
		var header=headerobj.th;
		var html="<table><thead>";
		
		if(headerobj.lefttop!=undefined)this.fixedcolumns=headerobj.lefttop.colspan;
		for(var i=0;i<header.length;i++){
			var header_tr=header[i];
			html+="<tr>";
			if(headerobj.lefttop!=undefined&&i==0){
				if(headerobj.lefttop.rowspan>0&&headerobj.lefttop.colspan>0){
					if(headerobj.lefttop.rowspan>1 && headerobj.lefttop.colspan>0)
					html+="<td rowspan="+headerobj.lefttop.rowspan+" colspan="+headerobj.lefttop.colspan+"></td>";
				}
			}
			for(var j=0;j<header_tr.length;j++){
				if(header_tr[j].rowspan!=undefined)
					html+="<td rowspan="+header_tr[j].rowspan+">"+header_tr[j].val+"</td>";
				else if(header_tr[j].colspan!=undefined) 
					html+="<td colspan="+header_tr[j].colspan+">"+header_tr[j].val+"</td>";
				else
					html+="<td>"+header_tr[j].val+"</td>";
			}
			html+="</tr>";
		}
		html+="</thead><tbody>";
        
		var height=jQuery("#table-container").height();
		var lines = parseInt((height-header.length*23)/23),
		length = result.data[0].length;
		if(this.hasImage=='Y') lines = parseInt((height-header.length*23)/62);
		this.linecounts=lines;
		this.pages = (length%lines == 0 ? length/lines : parseInt(length/lines)+1);
		if(this.pages > 1){
			length = lines;
			var select = jQuery("#current select");
			select.append("<option value='1' selected='selected'>"+VIEWS_LOCALE.rank.pagestart+" 1 "+VIEWS_LOCALE.rank.pagetotalend+"</option>");
			for ( var i = 1; i < this.pages; i++) {
				select.append("<option value='"+(i+1)+"'>"+VIEWS_LOCALE.rank.pagestart+(i+1)+VIEWS_LOCALE.rank.pagetotalend+"</option>");
			}
			jQuery("#toolbars").show();
		}else{
			jQuery("#toolbars").hide();
		}
		jQuery("#total").html(VIEWS_LOCALE.rank.pagetotal+"<span>"+this.pages+"</span> "+VIEWS_LOCALE.rank.pagetotalend);
		html+=this._drawTr(0,length);
		html+="</tbody></table>";
		jQuery(html).appendTo("#table");
		jQuery(".hide").hide();
		this._addBackground();
		this._table_rowspan("#table",rpt.cellcolumns);
		this._table_rowspan("#fixedcolumns",rpt.cellcolumns);
	},
	/**
	 * 跳转报表
	 */
	jumprpt : function(dom,rptname){
		this.jumpparams.push({
			name:this.name,
			params:this.params
		});
		this.filterrpt=this.name;
		this.jumpcount+=1;
		var rindex=jQuery(dom).parent("td").parent("tr").index();
		var headerobj=rpt.javaData.header,cols=0,arr=new Array();
		if(headerobj.lefttop!=undefined){
			if(headerobj.lefttop.colcnt!=undefined)
				cols=headerobj.lefttop.colcnt;
			else
				cols=headerobj.lefttop.colspan;
	    }
		for(var i=0;i<cols;i++){
			var dom=jQuery("#table > table tbody tr:eq("+rindex+") td:eq("+i+")");
			arr.push(dom.attr("v"));
			if(dom.hasClass("hide")&&headerobj.lefttop.colcnt==undefined){
				cols+=1;
				continue;
			}
		}
		var btitle=jQuery("#table > table tbody tr:eq("+rindex+") td:eq("+this.firstdisplaycol+")").html();
		if(this.titlearray.keys().length>0&&this.jumpcount>1)
			this.titlearray[this.jumpcount-1]=(this.titlearray[this.jumpcount-2]+","+btitle);
		else
			this.titlearray[this.jumpcount-1]=btitle;
		this.params=arr;
		rpt.load(this.sessionkey,rptname,rpt.theme);
	},
	_drawTr : function(start,end){
		var html="";
		var result=this.javaData;
		var data = result.data;
		var fmt=new Object();
		if(result.fmt!=undefined){
			fmt=result.fmt;
		}
		//度量列text-align:right
		var databegin=result.header.lefttop.colspan;
		var hidden=result.hidden;
		if(data.length>0){
			for( var i = start; i < end; i++){
				html+="<tr>";
				for(var j=0;j<data.length;j++){
					var jumpstr="";
					if(j<databegin)jumpstr="onclick=rpt._jump("+i+");";
					if(data[j][i]==undefined)data[j][i]="";
					if(fmt[j]!=undefined && data[j][i]!="" && fmt[j]!="no"){
						if("number" == typeof(data[j][i])){
							if(rpt.isexist(hidden,j))
//							html+="<td class='hide data' v="+data[j][i]+">"+Number(data[j][i]).format(fmt[j])+"</td>";
							html+="<td class='hide data' v="+data[j][i]+">"+this.format(data[j][i],fmt[j])+"</td>";
							else{
									html+="<td class='data' "+jumpstr+" v="+data[j][i]+" >"+this.format(data[j][i],fmt[j])+"</td>";
							}
								
						}else if(data[j][i].indexOf( '<')==0){
							if(rpt.isexist(hidden,j))
								html+="<td class='hide' v=''>"+data[j][i]+"</td>";
								else{
									if(databegin<j)
										html+="<td class='data' "+jumpstr+" v='' >"+data[j][i]+"</td>";
									else
										html+="<td "+jumpstr+" v='' >"+data[j][i]+"</td>";
								}
						}else{
							if(rpt.isexist(hidden,j))
							html+="<td class='hide' v="+data[j][i]+">"+data[j][i]+"</td>";
							else{
								if(databegin<j)
									html+="<td class='data' "+jumpstr+" v="+data[j][i]+" >"+data[j][i]+"</td>";
								else
									html+="<td "+jumpstr+" v="+data[j][i]+" >"+data[j][i]+"</td>";
							}
						}
					}
					else{
						if("string" == typeof(data[j][i])&&data[j][i].indexOf( '<')==0){
							if(rpt.isexist(hidden,j))
								html+="<td class='hide' v=''>"+data[j][i]+"</td>";
							else{
								if(databegin<j)
									html+="<td class='data' "+jumpstr+" v='' >"+data[j][i]+"</td>";
								else
									html+="<td "+jumpstr+" v='' >"+data[j][i]+"</td>";
							}
						}else{
							if(rpt.isexist(hidden,j))
								html+="<td class='hide' v="+data[j][i]+">"+data[j][i]+"</td>";
							else{
								if(databegin<j)
									html+="<td class='data' "+jumpstr+" v="+data[j][i]+" >"+data[j][i]+"</td>";
								else
									html+="<td "+jumpstr+" v="+data[j][i]+" >"+data[j][i]+"</td>";
							}
						}
							
					}
					if(!rpt.isexist(hidden,j)&&this.firstdisplaycol==-1){
						this.firstdisplaycol=j;
					}
				}
				html+="</tr>";
			}
		}
		return html;
	},
	format: function(element,fmt){
		if(fmt.indexOf("%") != -1){
			element = Number(element) * 100;
		}
		return Number(element).format(fmt);
	},
	_jump : function(row){
		var col=1;
		var headerobj=rpt.javaData.header;
		if(headerobj.lefttop!=undefined)col=headerobj.lefttop.colspan;
		var arr=new Array();
		arr.push(this.name);
		var result=this.javaData;
		var data = result.data;
		for(var i=0;i<col;i++){
			var dom=jQuery("#table > table tbody tr:eq(0) td:eq("+i+")");
			if(dom.hasClass("hide")){
				col+=1;
				continue;
			}
		}
		for(var j=0;j<col;j++){
			arr.push(data[j][row]);
		}
		var params={cmd:"LoadRpt", view:"view900", sessionkey: this.sessionkey, name: this.name,viewchain:arr,filterid:this.filterid,bfilterid:this.bfilterid,action:"filter"};
		var trans={id:1, command:"com.agilecontrol.fair.FairCmd", params:params};
		portalClient.sendOneRequest(trans, function(response){
			var javaData= response.data[0].result;
			data = javaData.data;
				if(data != null)
					window.location.replace(data);
		});
	},
	/**
	 * table相邻单元格内容相同行合并
	 */
	_table_rowspan : function(table_id,_w_table_colnum){
		  var  _w_table_firsttd = "", 
		    _w_table_currenttd = "",  
		    _w_table_SpanNum = 0;
		    if(_w_table_colnum!=""){
		    	for(var j=0;j<_w_table_colnum.length;j++){
		    		jQuery(table_id+ '> table tbody tr').each(function(i){
		    			if(i==0){ 
		    				_w_table_firsttd = jQuery(this).find("td:eq(" + (_w_table_colnum[j]-1) + ")"); 
		    				_w_table_SpanNum = 1; 
		    			}else{  
		    				_w_table_currenttd = jQuery(this).find("td:eq(" + (_w_table_colnum[j]-1) + ")"); 
		    				if(_w_table_firsttd.text()==_w_table_currenttd.text()){
		    					_w_table_SpanNum++;  
		    					_w_table_currenttd.hide(); //remove();  
		    					_w_table_firsttd.attr("rowSpan",_w_table_SpanNum);  
		    				}else{  
		    					_w_table_firsttd = jQuery(this).find("td:eq(" + (_w_table_colnum[j]-1) + ")");   
		    					_w_table_SpanNum = 1;  
		    				}  
		    			}  
		    		});
		    	}
		    }
		   },  
	
	_addBackground : function(){
		jQuery('#table table tbody tr').each(function(){
			jQuery(this).find("td").filter(":contains('小计')").parent("tr").css("background","#ebebeb").css("color","#000000");
		});
		jQuery('#fixedcolumns table tbody tr').each(function(){
			jQuery(this).find("td").filter(":contains('小计')").parent("tr").css("background","#ebebeb").css("color","#000000");
		});
	},
	isexist:function(a,b){
		for(var i=0;i<a.length;i++){
			if(b==a[i])
				return true;
		}
		return false;
	},
	_fixedColumns : function(){
		var headerobj=rpt.javaData.header;
		if(headerobj.lefttop!=undefined)this.fixedcolumns=headerobj.lefttop.colspan;
		jQuery("#fixedcolumns").html("");
		var width1=jQuery("#table-container").width(),width2=jQuery("#table > table").width();
		if(width2>width1){
			var height = jQuery("#table > table thead").height(),
			table = jQuery("#table > table");
			var width=0;
			if(rpt.isNotPad && rpt.width <  768) this.fixedcolumns=1;
			for(var i=0;i<this.fixedcolumns;i++){
				var dom=jQuery("#table > table tbody tr:eq(0) td:eq("+i+")");
				if(dom.hasClass("hide")){
					this.fixedcolumns+=1;
					continue;
				}
				width+=dom.outerWidth();
			}
			jQuery("#fixedcolumns").append(table.clone());
			jQuery("#fixedcolumns").width(width);
		}
	},
	_switchPage : function(event){
		var select = jQuery("#current select"),
		val = select.val();
		this.currentPage = val - 1;
		if(RegExp("^\\d+$").test(val)){
			val = parseInt(val);
			switch (val) {
			case 1:
				jQuery("#prev").hide();
				jQuery("#next").show();
				break;
			case this.pages:
				jQuery("#prev").show();
				jQuery("#next").hide();
				break;
			default:
				jQuery("#prev").show();
				jQuery("#next").show();
				break;
			}
			jQuery("#table > table tbody tr").remove();
			var s = (val-1)*this.linecounts;
			jQuery("#table > table tbody").append(this._drawTr(s, (val == this.pages ? this.javaData.data[0].length : s + this.linecounts)));
			jQuery(".hide").hide();
			rpt._fixedColumns();
			this._addBackground();
			this._table_rowspan("#table",rpt.cellcolumns);
			this._table_rowspan("#fixedcolumns",rpt.cellcolumns);
		}
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
	cFilter : function(DOM,type){
		this.fType = type;
		if("pdt" == type){
			window.location.replace("http://search.fair.app");
		}else{
			window.location.replace("http://buyer.fair.app");
		}
	},
	refresh : function(){
		jQuery("#loading").show();
		this.load(this.sessionkey,this.name,rpt.theme);
	},
	back : function(){
		if(this.jumpcount>0){
			var arr=this.jumpparams.pop();
			this.jumpcount-=1;
			this.params=arr.params;
			if(this.jumpparams.length>0)
				this.filterrpt=this.jumpparams[this.jumpparams.length-1].name;
			else
				this.filterrpt="";
			this.load(this.sessionkey,arr.name,rpt.theme);
		}else{
			jQuery(".contents").hide();
			jQuery("#loading").show();
			window.location.replace("/fair/ipad/kpi.jsp?sessionkey="+this.sessionkey+"&isback="+this.isback);
		}
		
	},
	drawComOne : function(com){
		var c;
		var type = com.type;
		var params = com.params;
		this.formula = com.formula;
		switch (type) {
		case 0:
			c = Com_0.draw(params);
			break;
		case 1:
			c = Com_1.draw(com);
			break;
		case 2:
			c = Com_2.draw(params);
			break;
		case 3:
			c = Com_3.draw(params);
			break;
		case 4:
			c = Com_4.draw(params);
			break;
		case 5:
			c = Com_5.draw(params);
			break;
		case 6:
			c = Com_6.draw(params);
			rpt.hasImage = 'Y';
			break;
		case 7:
			this.rptname = com.rptname;
			c = Com_7.draw(params);
			break;
		default:
			alert("系统错误。不支持的组建类型" + coms[i].type);
			return;
		}
		/*调用画table的逻辑**/
	},
	/*
	 * 计算object的个数；
	 */
	getObjectSize: function(obj) {
	    var size = 0, key;
	    for (key in obj) {
	        if (obj.hasOwnProperty(key)) size++;
	    }
	    return size;
	},
	/*
	 * 找到array中重复的数据；
	 */
	removeDuplElem: function(array){
		array = array.sort();
		for(var i = 0;i < array.length;i++){
			for(var j = i+1;j < array.length;j++){
				if(array[i] == array[j]){
					array = this.removeElement(j,array);//删除指定下标的元素;
					i = -1;
					break;
				}	
			}
		}
	},
	/*
	 * 将重复的数据删除；
	 */
	removeElement:function(index,array){
		if(index>=0 && index<array.length){
		      for(var i=index; i<array.length; i++){
		        array[i] = array[i+1];
		      }
		      array.length = array.length-1;
		    }
		    return array;
	},
	adaptation: function(theme){
		if(rpt.isNotPad && rpt.width <  768){
			jQuery("<link rel='stylesheet' href='/fair/ipad/css/common/rpt_adaptation.css?t="+new Date().getTime()+"' type='text/css' media='screen' title='no title' charset='utf-8'>").appendTo(jQuery("head"));
			jQuery("<link rel='stylesheet' href='/fair/ipad/css/"+theme+"/rpt_adaptation.css?t="+new Date().getTime()+"' type='text/css' media='screen' title='no title' charset='utf-8'>").appendTo(jQuery("head"));
		}else{
			jQuery("<link rel='stylesheet' href='/fair/ipad/css/common/rpt.css?t="+new Date().getTime()+"' type='text/css' media='screen' title='no title' charset='utf-8'>").appendTo(jQuery("head"));
			jQuery("<link rel='stylesheet' href='/fair/ipad/css/"+theme+"/rpt.css?t="+new Date().getTime()+"' type='text/css' media='screen' title='no title' charset='utf-8'>").appendTo(jQuery("head"));
		}
	}
};
RptControl.main = function(){
	portalClient = new PortalClient();
	portalClient.init(null,null,"/servlets/binserv/Fair");
	rpt = new RptControl();
};
jQuery(document).ready(RptControl.main);
function appFilterID(filterid){
	if("pdt" == rpt.fType){
		rpt.filterid = filterid;
	}else{
		rpt.bfilterid = filterid;
	}
	rpt.refresh();
	return "ok";
}