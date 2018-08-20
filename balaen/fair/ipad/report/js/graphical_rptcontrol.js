var rpt;
var RptControl = Class.create();
var coms = new Array();
var origins = {};
RptControl.prototype = {
	/**
	 * 定义全局变量
	 */
	initialize : function() {
		this.sessionkey = null;
		this.cmd =null;
		this.name = "";
//		this.odata = null;
//		this.data = null;
//		this.fmt = null;
//		this.colspan = -1;
//		this.formula = null;
//		this.top = 0;
//		this.fType = null;
		this.theme="01";
		this.filterid = -1;
		this.bfilterid = -1;
//		this.com = null;
//		this.fixedcolumns=3;
//		this.hasImage = 'N';
//		this.rptname = null;
//		this.cellcolumns=new Array();
		this.width = jQuery(document).width();
		this.height = jQuery(document).height();
		var userAgent = navigator.userAgent
		this.isNotPad = userAgent.indexOf('iPad') == -1;
		this.isPhone = userAgent.indexOf('iPhone')!=-1||userAgent.indexOf('Android')!=-1||userAgent.indexOf('Windows')!=-1;
//		this.Array_col = new Array();
//		this.jumpcount=0;//跳转报表的层数
//		this.jumpparams = new Array();//跳转报表每层的参数
//		this.params = new Array();

	},


	/**
	 * 初始化系统变量
	 * @param sessionkey
	 * @param name
	 */
	init: function(sessionkey,name,theme,isback,cmd){
		this.cmd = cmd;
		this.sessionkey = sessionkey;
		this.name = name;
/*		this.pages = -1;
		this.currentPage = 0;*/
/*		this.linecounts = 24;*/
		this.theme=theme;
		this.isback=isback;
		this.javaData = new Object();
		this.Array_col = new Array();
		jQuery("#loadinglocale").html(VIEWS_LOCALE.main.loading);
		if(rpt.isNotPad && rpt.width <  768){
			jQuery("#rpt-back .rpt-button-value").html();
			jQuery("#rpt-refresh .rpt-button-value").html();
		}else{
			jQuery("#rpt-back .rpt-button-value").html(VIEWS_LOCALE.orderdetails.back);
			jQuery("#rpt-refresh .rpt-button-value").html(VIEWS_LOCALE.main.refresh);
		}
	},
	tableinit : function(){
		jQuery(".table").html("");
		jQuery(".loadinglocale").html(VIEWS_LOCALE.main.loading);
		jQuery(".toolbars").hide();
		jQuery(".prev").hide();
		jQuery(".next").show();
		jQuery(".fixedcolumns").html("");
		jQuery(".current select option").remove();
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
	 * 跳转报表
	 * @param sessionkey
	 * @param name
	 */
	jump_load : function(sessionkey,name,theme,isback){
		jQuery(".content").hide();
		this.init(sessionkey,name,theme,isback);
		rpt.adaptation(theme);
		jQuery("#fixedcolumns").html("");
		jQuery("#loading").css("display","block");
		var params={cmd:"LoadRpt", view:"view900", sessionkey: this.sessionkey, name: this.name,viewchain:[this.name],filterid:this.filterid,bfilterid:this.bfilterid,filtervalues:this.params,filterrpt:this.filterrpt};
		var trans={id:1, command:this.cmd, params:params};
		if(jQuery("#showstores").is(":hidden")){
			trans.params.selectvalue=-1;
		}else{
			trans.params.selectvalue=jQuery("#showstores").find("option:selected").val();
		}
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
			rpt.drawTable(data);
			if(undefined!=javaData.view)jQuery("#rpt-title").html(javaData.view.desc);
			rpt._fixedColumns();

		});
	},
	isNull : function(data){
		if(undefined==data||null==data){
			return "";
		}else return data;
	},
	/**
	 * 加载报表
	 * @param sessionkey
	 * @param name
	 */
	load : function(sessionkey,name,theme,isback,cmd){
		var clientWidth = document.body.clientWidth;
		var availWidth = clientWidth;
		var linecounts = 0;//当前行图形个数，换行时重置；
		var prevline=0;
		var nextline =false;//换行标志，当前图形是否已是新的一行
		jQuery("#chart_container").hide();
		this.init(sessionkey,name,theme,isback,cmd);
		rpt.adaptation(theme);
		jQuery("#loading").css("display","block");
		var params={cmd:"LoadRpt", view:"view901", sessionkey: this.sessionkey, rptname: this.name,viewchain:[this.name],filterid:this.filterid,bfilterid:this.bfilterid,filtervalues:this.params,oufilterrpt:this.filterrpt};
		var trans={id:1, command:this.cmd, params:params};
		if(jQuery("#showstores").is(":hidden")){
			trans.params.selectvalue=-1;
		}else{
			trans.params.selectvalue=jQuery("#showstores").find("option:selected").val();
		}
		portalClient.sendOneRequest(trans, function(response){
			if(0 != response.data[0].code){
				alert(response.data[0].message);
				return;
			}
			origins={};
			jQuery("#loading").hide();
		    jQuery("#chart_container").show();
		    jQuery("#chart_container").html("");

			var origin = response.data[0].result.origin;
			for(var i in origin){
				var javaData = origin[i];
				javaData.rptname=i;
			    jQuery("#loading").hide();
			    jQuery(".contents").show();
//				if(javaData.mergecell!=undefined) rpt.cellcolumns=javaData.mergecell;
//				if(javaData.title!=undefined) jQuery("#rpt-title").html(javaData.title);
				rpt.drawSelect(javaData);
				//调用吴琼的列计算方法 在方法结束时写入origins :{rptname:{data}........}
				rpt.caculateByComs(javaData);
			}
			var charts = response.data[0].result.chart;
			//遍历画图表
			for(var i=0;i<charts.length;i++){
                var chart=charts[i];
				var chartname = chart.chartname;
				var cptname = chart.cptname;
				var maxWidth = chart.maxWidth;
				var minWidth = chart.minWidth;
				var title = chart.title;
				var datasource = chart.datasource;
				var lwr = chart.lwr;
				if(origins[datasource].data==null||origins[datasource].data.length==0){
					alert('数据源'+datasource+"无数据");
					return;
				}
				if(cptname=="Table"){
					var html ="<div id='"+chartname+"' style='margin-top:100px'><div id='rpt-title_"+datasource+"' style='margin-bottom:-30px'>"+title+"</div></div>";
					jQuery("#chart_container").append(html);
					rpt.drawTable(origins[datasource],datasource,chartname);
					rpt._fixedColumns(origins[datasource],datasource);


					//表格之前要调整间距，表格之后要强行换行
					gap = availWidth/(linecounts+1);
					var cur = jQuery("#"+chartname);
					for(var n=0;n<linecounts;n++){
                         cur.prev().css("margin-left",gap+"px");
                         cur = cur.prev();
					}
					nextline=false;
					linecounts=0;
					availWidth=clientWidth;


				}
				//图形化组件，自适应屏幕
				else{
					var width;
					var operArea = availWidth;
					var divided=2;
					var isFull=false;
					if(maxWidth<minWidth){
					  alert("组件最大宽度小于最小宽度，检查组件配置");
					  return;
					}
					if(minWidth>clientWidth){
						alert("组件最小宽度超出屏幕尺寸，检查组件配置");
						return;
					}
					loop1:
					while(1){
						//当前可用宽度落在最小宽度和最大宽度之间时取可用宽度,结束当前图形的递归
						if(minWidth<=operArea&&maxWidth>=operArea){
						    width=operArea;
						    availWidth=availWidth-width;
						    linecounts++;
						    break loop1;
					      }
					      //当最大宽度小于可用宽度时进行递归
					    if(maxWidth<operArea) {
					    	console.log("after divided:"+divided)
					    	if(isFull==false){
                               operArea=availWidth/divided;
                               divided+=1;
					    	}
					    	//来自下一层的返回
					    	else{
					    		width=maxWidth;
                                availWidth=availWidth-width;
                                linecounts++;
                                break loop1;
					    	}

					    }
					    //当最小宽度大于可用宽度,且已进行过二分，即退出递归且回溯到上一层
					    //若第一次放置即不够空间，则换行，同时调整当前行图形间距离
					    if(minWidth>operArea){
					    	if(divided>2){
                               divided-=1;
                               operArea=operArea*divided;
                               isFull=true;
                            }
                            else{
                               var gap = operArea/(linecounts+1);//将当前行的剩余空间进行等分
                               nextline=true;
                               operArea=availWidth=clientWidth;//换行
                               prevline=linecounts;//记住换行时当前行图形数；
                               linecounts=0;
                            }

					    }
					}
					var config = chart.config;
				    var columns = origins[datasource];
				    var height = width*lwr;
				    //按索引取得列数据
					for(var j in config){
					    var meta={};
						meta.value = columns.data[config[j].col];
						meta.desc =  config[j].desc
						config[j]=meta;
					}
					//强行设置成同步
					jQuery.ajax({
						url:cptname+"/"+cptname+".js",
						cache:false,
						async:false,
						dataType:"script",
						contentType: "application/x-www-form-urlencoded; charset=utf-8",
						success:function(){
	                        var html;
							html = "<div id='"+chartname+"' style='display:inline-block;margin-top:50px;width:"+width+"px;height:"+height+"px'></div>";
							jQuery("#chart_container").append(html);
							eval(""+cptname+"").handleData(chart);
							eval(""+cptname+"").drawChart(chartname);

							//调整当前行图形间距离，重置linecounts nextline
							if(nextline==true){
							   var cur = jQuery("#"+chartname);
							   for(var k=0;k<prevline;k++){
                                 cur.prev().css("margin-left",gap+"px");
                                 cur=cur.prev();
							   }
							   nextline=false;
							}
                            //最后一个图形，调整间距
							if(i+1==charts.length){
							   gap=availWidth/(linecounts+1);
							   var cur = jQuery("#"+chartname);
							   for(var k=0;k<linecounts;k++){
                                 cur.css("margin-left",gap+"px");
                                 cur = cur.prev();
							   }
							   nextline=false;
							}


						}
					});
				}
			}

		});
	},
	caculateByComs : function(javaData){
		this.com = new Array();
//		this.data = javaData.data;
//		this.fmt = javaData.fmt;
//		this.top = javaData.top;
//		this.colspan = javaData.header.lefttop.colspan;
		var coms = javaData.components;
		var topCount = 0;
		for(var j = 0; j < coms.length;j++){
			if(4 == coms[j].type){
				topCount++;
			}
		}
		javaData.topCount = topCount;
		if(null == coms || undefined == coms || coms.length == 0){
			origins[javaData.rptname]=javaData;
			return;
		}
		var Array_col = new Array();
		for ( var i = 0; i < coms.length; i++) {
			if(0 == coms[i].type){
				for ( var j = 1; j <getObjectSize(coms[i].params); j++) {
					for ( var k = 0; k < coms[i].params[j].length; k++) {
						Array_col.push(coms[i].params[j][k]);
					}
				}
			}else if(1 == coms[i].type){
				Array_col.push(coms[i].params[0][0]);
			}else if(2 == coms[i].type){
				Array_col.push(coms[i].params[0][0]);
			}else if(3 == coms[i].type){
				Array_col.push(coms[i].params[0][0]);
			}else if(4 == coms[i].type){
				Array_col.push(coms[i].params[1][0]);
			}
			this.removeDuplElem(Array_col);
			javaData.Array_col = Array_col;
			rpt.drawComOne(coms[i],javaData);
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
	drawTable : function(result,name,chartname){
		this.tableinit();
		var headerobj=result.header;
		var header=headerobj.th;
		var thtml="<div id='t_"+name+"' class='t_container'><div id='table-container_"+name+"' class='contents'><div id='table-header_"+name+"'></div><div id='table_"+name+"'></div><div id='fixedcolumns_"+name+"'></div></div>" +
				"<div id='toolbars_"+name+"' class='contents'><div id='prev_"+name+"' class='toolbar' onclick= rpt.switchPage(0,'"+name+"');><div class='toolbarimg'></div>" +
				"<div class='toolbardesc'>上一页</div></div><div id='page_"+name+"'><div id='current_"+name+"'><select onchange=rpt._switchPage('"+name+"');></select></div><div id='total_"+name+"'></div></div>" +
				"<div id='next_"+name+"' class='toolbar' onclick=rpt.switchPage(1,'"+name+"');><div class='toolbarimg'></div><div class='toolbardesc'>下一页</div></div></div></div>";
		jQuery(thtml).appendTo("#"+chartname);
		var html="<table><thead>";
		//if(headerobj.lefttop!=undefined)this.fixedcolumns=headerobj.lefttop.colspan
		jQuery("#table-container_"+name).height(jQuery(window).height()-160);
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
		var height=jQuery("#table-container_"+name).height();
		var lines = parseInt((height-header.length*23)/23);
		if(result.hasImage=='Y') lines = parseInt((height-header.length*23)/62);
		length = result.data[0].length;
		origins[name].linecounts=lines;
		origins[name].pages = (length%lines == 0 ? length/lines : parseInt(length/lines)+1);
		if(origins[name].pages > 1){
			length = lines;
			var select = jQuery("#current_"+name+" select");
			select.append("<option value='1' selected='selected'>"+VIEWS_LOCALE.rank.pagestart+" 1 "+VIEWS_LOCALE.rank.pagetotalend+"</option>");
			for ( var i = 1; i < origins[name].pages; i++) {
				select.append("<option value='"+(i+1)+"'>"+VIEWS_LOCALE.rank.pagestart+(i+1)+VIEWS_LOCALE.rank.pagetotalend+"</option>");
			}
			jQuery("#toolbars_"+name).show();
		}
		jQuery("#total_"+name).html(VIEWS_LOCALE.rank.pagetotal+"<span>"+origins[name].pages+"</span> "+VIEWS_LOCALE.rank.pagetotalend);
		html+=this._drawTr(0,length,name);
		html+="</tbody></table>";
		jQuery(html).appendTo("#table_"+name);
		jQuery(".hide").hide();
		this._addBackground("#t_"+name);
		//if(javaData.title!=undefined) jQuery("#rpt-title").html(origins[name].title);
/*		this._table_rowspan("#t_"+name+" .table",isNull(origins[name].cellcolumns));
		this._table_rowspan("#t_"+name+" .fixedcolumns",isNull(origins[name].cellcolumns));*/
	},
	/**
	 * 跳转报表
	 */
	jumprpt : function(dom,rptname){
		alert("暂不支持跳转报表");
		origins[rptname][jumpparams].push({
			name:this.name,
			params:this.params
		});
		origins[rptname][jumpcount]+=1;
		var rindex=jQuery(dom).parent("td").parent("tr").index();
		var headerobj=rpt.javaData.header,cols=0,arr=new Array();
		if(headerobj.lefttop!=undefined)cols=headerobj.lefttop.colspan;
		for(var i=0;i<cols;i++){
			var dom=jQuery("#t"+rptname+" .table > table tbody tr:eq(0) td:eq("+i+")");
			arr.push(dom.attr("v"));
			if(dom.hasClass("hide")){
				cols+=1;
				continue;
			}
		}
		this.params=arr;
		rpt.load(this.sessionkey,rptname,rpt.theme);
	},
	_drawTr : function(start,end,name){;
		var html="";
		var result=origins[name];
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
		var trans={id:1, command:this.cmd, params:params};
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

	_addBackground : function(name){
		jQuery(name+'.table table tbody tr').each(function(){
			jQuery(this).find("td").filter(":contains('小计')").parent("tr").css("background","#C0504D");
		});
		jQuery(name+' .fixedcolumns table tbody tr').each(function(){
			jQuery(this).find("td").filter(":contains('小计')").parent("tr").css("background","#C0504D");
		});
	},
	isexist:function(a,b){
		for(var i=0;i<a.length;i++){
			if(b==a[i])
				return true;
		}
		return false;
	},
	_fixedColumns : function(data,name){
		var headerobj=data.header;
		if(headerobj.lefttop!=undefined)fixedcolumns=headerobj.lefttop.colspan;
		jQuery("#fixedcolumns_"+name).html("");
		var width1=jQuery("#table-container_"+name).width(),width2=jQuery("#table_"+name+" > table").width();
		if(Number(width2)>Number(width1)){
			var height = jQuery("#table_"+name+" > table thead").height();
			table = jQuery("#table_"+name+" > table");
			var width=0;
			if(rpt.isNotPad && rpt.width <  768) fixedcolumns=2;
			for(var i=0;i<fixedcolumns;i++){
				var dom=jQuery("#table_"+name+" > table tbody tr:eq(0) td:eq("+i+")");
				if(dom.hasClass("hide")){
					fixedcolumns+=1;
					continue;
				}
				width+=dom.outerWidth();
			}
			jQuery("#fixedcolumns_"+name).append(table.clone());
			jQuery("#fixedcolumns_"+name).width(width);
		}
	},
	_switchPage : function(name){
		var select = jQuery("#current_"+name+" select"),
		val = select.val();
		origins[name].currentPage = val - 1;
		if(RegExp("^\\d+$").test(val)){
			val = parseInt(val);
			switch (val) {
			case 1:
				jQuery("#prev_"+name).hide();
				jQuery("#next_"+name).show();
				break;
			case origins[name].pages:
				jQuery("#prev_"+name).show();
				jQuery("#next_"+name).hide();
				break;
			default:
				jQuery("#prev_"+name).show();
				jQuery("#next_"+name).show();
				break;
			}
			jQuery("table_"+name+" > table tbody tr").remove();
			var s = (val-1)*origins[name].linecounts;
			jQuery("#table_"+name+" > table tbody").html(this._drawTr(s, (val == origins[name].pages ? origins[name].data[0].length : s + origins[name].linecounts),name));
			jQuery(".hide").hide();
			rpt._fixedColumns(origins[name],name);
			this._addBackground("#t_"+name);
			//this._table_rowspan("#table_"+name,isNull(origins[name].cellcolumns));
			//this._table_rowspan("#fixedcolumns"+name,isNull(origins[name].cellcolumns));
		}
	},

	switchPage : function(type,name){
		var select = jQuery("#current_"+name+" select"),
		val = parseInt(select.val());
		switch (type) {
		case 0:
			select.val(--val);
			this._switchPage(name);
			break;
		case 1:
			select.val(++val);
			this._switchPage(name);
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
		this.load(this.sessionkey,this.name,rpt.theme,this.isback,this.cmd);
	},
	back : function(){
		if(this.jumpcount>0){
			var arr=this.jumpparams.pop();
			this.jumpcount-=1;
			this.params=arr.params;
			this.load(this.sessionkey,arr.name,rpt.theme);
		}else{
			jQuery("#chart_container").hide();
			jQuery("#loading").show();
			//window.location.replace("/fair/ipad/kpi.jsp?sessionkey="+this.sessionkey+"&isback="+this.isback);
			history.back(-1);
		}

	},
	drawComOne : function(com,javaData){
		var c;
		var type = com.type;
		var params = com.params;
//		this.formula = com.formula;
		javaData.formula = com.formula;
		javaData.hasImage = "N";
		switch (type) {
		case 0:
			c = Com_0.draw(params,javaData);
			break;
		case 1:
			c = Com_1.draw(params,javaData);
			break;
		case 2:
			c = Com_2.draw(params,javaData);
			break;
		case 3:
			c = Com_3.draw(params,javaData);
			break;
		case 4:
			c = Com_4.draw(params,javaData);
			break;
		case 5:
			c = Com_5.draw(params,javaData);
			break;
		case 6:
			c = Com_6.draw(params,javaData);
//			rpt.hasImage = 'Y';
			break;
		case 7:
			//this.rptname = com.rptname;
			javaData.rptname = com.rptname;
			c = Com_7.draw(params,javaData);
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
			jQuery("<link rel='stylesheet' href='css/common/graphical_adaptation.css?t="+new Date().getTime()+"' type='text/css' media='screen' title='no title' charset='utf-8'>").appendTo(jQuery("head"));
			jQuery("<link rel='stylesheet' href='css/"+theme+"/graphical_adaptation.css?t="+new Date().getTime()+"' type='text/css' media='screen' title='no title' charset='utf-8'>").appendTo(jQuery("head"));
		}else{
			jQuery("<link rel='stylesheet' href='css/common/graphical_rpt.css?t="+new Date().getTime()+"' type='text/css' media='screen' title='no title' charset='utf-8'>").appendTo(jQuery("head"));
			jQuery("<link rel='stylesheet' href='/fair/ipad/css/"+theme+"/rpt.css?t="+new Date().getTime()+"' type='text/css' media='screen' title='no title' charset='utf-8'>").appendTo(jQuery("head"));
		}
	},

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
