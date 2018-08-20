/**

* CopyRright (c)2012: lifecycle

* Project: order details - Ipad System

* Comments: to control the order details.

* Create Date：2012-09-25
	@version: 1.0
	@since: portal5.0
	@author: cico
*/
var odc;
var OrderDetailsControl = Class.create();
OrderDetailsControl.prototype = {

	/**
	 * Description : to initialize OrderDetailsControl region params.
	 * 
	 * @param prevVal -Number
	 *  the td origin value.
	 * 
	 * @param format -Array
	 *  to record the column format info. 
	 * 
	 * @param fetdi -Number
	 *  to record the index of the first editable td.
	 * 
	 * type : private
	 * */
	initialize : function() {
		this.sessionkey = null;
		this.debug = false;
		this.firstDraw = true;
		this.filterid = -1;
		this.showThumbnail = true;
		this.thumbnailPath = "/pdt/s/";
		this.imgs = null;
		this.linecounts = 24;
		this.canedit=true;
		this.theme="01";
		this.fetdi = -1;
		this.showtooltips = "Y";
		this.showddpr=false;
		this.model=-1;
		this._init();
		this.ismanual = false;
		this.foid=-1;//订单id
		this.ordertype='day';//是否是日单
		this.fairid= -1;//供应商id
		this.isfirst='Y';//是否有月单
		this.ismonth="月单";//是否是月单
		this.titleType="购物车";//标题类型
		this.loadIdx=0;//返回首页所需索引
		this.judgeIsMonth=false;//判断是否存在月单
		this.clientChoice="";//用户选择月单或者日单
		this.isEndUser="";//是否是终端店
		this.collectionOpen=true;//我的收藏夹是否打开
		this.fairtype="all";//当前订单类型
		this.isCollection="no";//当前展示是否是收藏商品
		this.isTopdt="no";//当前展示是否是收藏商品
	},
	
	_init : function(){
		this.prevVal = 0;
		this.format = undefined;
		this.tr = undefined;
		this.sumtr = false;
		this.sumtrFordraw = true;
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
		this.startX = -1;
		this.startY = -1;
		this.pages = -1;
		this.currentPage = 0;
		this.modify = new Hash();
		this.editcolumn = new Object();
		this.javaData = new Object();
		jQuery("#toolbars").hide();
		jQuery("#prev").hide();
		jQuery("#next").show();
		jQuery("#current select option").remove();
	},
	colToggle : function(){
		if (this.collectionOpen) {
			jQuery("#st-colt").show();
		}else{
			jQuery("#st-colt").hide();
		}
		this.collectionOpen=!this.collectionOpen;
	},
	collection : function(type){
		var params={cmd:"JudgeMonth",fairid:odc.fairid,method:"beforeCollection",judtype:type};
		var trans={id:1, command:"com.agilecontrol.fair.FairCmd",params:params};
		portalClient.sendOneRequest(trans, function(response){
			var ret=response.data[0].result;
			console.info(ret+"--"+type);
			if (ret==0) {
				if (type=="month") {
					window.location.replace('/fair/ipad/B2B/shoppingCart.jsp?loadIdx='+odc.loadIdx+'&fairid='+odc.fairid+'&ordertype=month&iscollection=yes');
					odc.backSave();
				}else if(type=="day"){
					window.location.replace('/fair/ipad/B2B/shoppingCart.jsp?loadIdx='+odc.loadIdx+'&fairid='+odc.fairid+'&ordertype=day&iscollection=yes');
					odc.backSave();
				}
			}else{
				if (type == "month") {
					alert("当前存在未确认的月单，无法创建月单收藏订单");
				} else if (type == "day") {
					alert("当前存在未确认的日单，无法创建日单收藏订单");
				}
			}
		});
	},
	aIndex : function(t,e){
		var aa=jQuery(t).parent().attr("title");
		var num=aa.indexOf("_");
		var pid;
		if (num!=-1) {
			odc.isTopdt="yes";
			pid=aa.substring(0,num);
			window.location.href='/fair/ipad/b2bOrder.jsp?loadIdx='+odc.loadIdx+'&orderId='+odc.foid+'&fairid='+odc.fairid+'&pdtid='+pid+'&fairtype='+odc.fairtype;
			this.commonSave();
		}
	},
	doOrder : function(){
		this.commonSave();
		var filtervalue="";
		var order=jQuery("#st-order").val();
		var params={cmd:"LoadB2BOrderLines",sessionkey: odc.sessionkey,filter:filtervalue,fairid:odc.fairid,foid:odc.foid,screenorder:order};
		this.onLoad(odc.sessionkey, params);
		jQuery("#currentPage").text(1);
		jQuery("#search").val("");
	},
	dosearch : function(){
		this.commonSave();
		var order=0;
		var filtervalue=jQuery("#search").val();
		var params={cmd:"LoadB2BOrderLines",sessionkey: odc.sessionkey,filter:filtervalue,fairid:odc.fairid,foid:odc.foid,screenorder:order};
		this.onLoad(odc.sessionkey, params);
		jQuery("#currentPage").text(1);
		jQuery("#st-order").val(0);
	},
	doLogin : function(num){
		//alert(num);
		var params={cmd:"B2b_GetSheetWeb",fairid:num};
		var trans={id:1, command:"com.agilecontrol.fair.MiscCmd",params:params};
		portalClient.sendOneRequest(trans, function(response){
			if(response.data[0].code==-1){
    			alert(response.data[0].message);
    			return;
    		}
			var data = response.data[0].result;
    		odc.sessionkey = data.sessionkey;
		});
	},
	judgeMonth : function(fairid){
		var params={cmd:"JudgeMonth",fairid:fairid,method:"exitmonth"};
		var trans={id:1, command:"com.agilecontrol.fair.FairCmd",params:params};
		portalClient.sendOneRequest(trans, function(response){
			var ret=response.data[0].result;
			if (jQuery.isEmptyObject(ret)) {
				var params={cmd:"LoadB2BOrderLines",sessionkey: odc.sessionkey,fairid:fairid,ordertype:"ismonth",ismonth:"月单"};
				odc.onLoad(odc.sessionkey, params);
				jQuery("#isSupply").modal("hide");
			}else{
				if (ret.status==1) {
					if (ret.cfm_status==1) {
						var orderid=ret.id;
						var params={cmd:"LoadB2BOrderLines",sessionkey: sessionkey,foid:orderid,fairid:fairid};
						this.onLoad(sessionkey, params);
						jQuery("#isSupply").modal("hide");
					}else{
						alert("当月已存在确认月单，请选择补单类型！");
					}
				}else{
					alert("当月已存在月单，请选择补单类型！");
				}
			}
		});
	},
	judge_MON : function(fairid){
		var params={cmd:"JudgeMonth",fairid:fairid,method:"exitmonth"};
		var trans={id:1, command:"com.agilecontrol.fair.FairCmd",params:params};
		portalClient.sendOneRequest(trans, function(response){
			var ret=response.data[0].result;
			if (jQuery.isEmptyObject(ret)) {
				var params={cmd:"LoadB2BOrderLines",sessionkey: odc.sessionkey,fairid:fairid,ordertype:"ismonth",ismonth:"月单"};
				odc.onLoad(odc.sessionkey, params);
			}else{
				if (ret.status==1) {
					if (ret.cfm_status==1) {
						var orderid=ret.id;
						var params={cmd:"LoadB2BOrderLines",sessionkey: sessionkey,foid:orderid,fairid:fairid};
						this.onLoad(sessionkey, params);
					}else{
						var flag= confirm("当月已存在确认月单，是否转到补单？（取消跳转到订单中心）");
						if (flag) {
							var params={cmd:"LoadB2BOrderLines",sessionkey: sessionkey,fairid:fairid,ordertype:"ismonth",ismonth:"补单"};
							odc.onLoad(sessionkey, params);
						}else{
							odc.ordercenter();
						}
					}
				}else{
					alert("当月已存在月单，请前往订单中心编辑");
					odc.ordercenter();
				}
			}
		});
	},
	delNull : function(num){
		var params={cmd:"JudgeMonth",foid:num,method:"delNull"};
		var trans={id:1, command:"com.agilecontrol.fair.FairCmd",params:params};
		portalClient.sendOneRequest(trans, function(response){
			var ret=response.data[0].result;
			//window.location.replace('/fair/ipad/B2B/index.jsp?loadIdx=0');
		});
	},
	ordercenter : function(){
		window.location.replace("/fair/ipad/B2B/orderCenter.jsp?loadIdx="+odc.loadIdx+"&fairid="+odc.fairid);
		odc.backSave();
	},
	managercenter : function(){
		window.open('/nea/core/portal');
	},
	commonSave : function(){
		var temp,
		tojava = new Array(),
		iterator2 = this.modify,
		iterator = iterator2.keys();
		for ( var i = 0; i < iterator.length; i++) {
			temp = new Array();
			temp = iterator[i].split(",");
			temp.push(iterator2[iterator[i]]);
			tojava.push(temp);
		}
		var id=-1;
		if(this.model==1) id=jQuery("#showstores").find("option:selected").val();
		if(tojava.length != 0){
			var params;
			params={cmd: "SaveB2BOrderLines",sessionkey: this.sessionkey,data: tojava,id:id,foid:odc.foid,isback:"yes"};
			var trans={id:1, command:"com.agilecontrol.fair.FairCmd",params:params};
			portalClient.sendOneRequest(trans, function(response){
				alert(response.data[0].message);
				if(response.data[0].code == 0){
					odc.modify = new Hash();
					//odc.delNull(odc.foid);
				}else{
					odc.delNull(odc.foid);
					window.location.reload();
				}
			});
		}
	},
	backSave : function(){
		var temp,
		tojava = new Array(),
		iterator2 = this.modify,
		iterator = iterator2.keys();
		for ( var i = 0; i < iterator.length; i++) {
			temp = new Array();
			temp = iterator[i].split(",");
			temp.push(iterator2[iterator[i]]);
			tojava.push(temp);
		}
		var id=-1;
		if(this.model==1) id=jQuery("#showstores").find("option:selected").val();
		if(tojava.length != 0){
			var params;
			params={cmd: "SaveB2BOrderLines",sessionkey: this.sessionkey,data: tojava,id:id,foid:odc.foid,isback:"yes"};
			var trans={id:1, command:"com.agilecontrol.fair.FairCmd",params:params};
			portalClient.sendOneRequest(trans, function(response){
				alert(response.data[0].message);
				if(response.data[0].code == 0){
					odc.modify = new Hash();
					odc.delNull(odc.foid);
				}else{
					odc.delNull(odc.foid);
					window.location.reload();
				}
			});
		}else{
			if(odc.isTopdt=="yes"){
				odc.isTopdt=="no"
			}else{
				odc.delNull(odc.foid);
			}
		}
	},
	initParam : function(sessionkey,orderid,type,fairid,loadIdx,isfirst,isEndUser,isCollection){
		console.info("---sessionkey---"+sessionkey+"---orderid---"+orderid+"---type---"+type+"---fairid---"+fairid+"-----loadIdx----"+loadIdx+"---isfirst----"+isfirst+"---isEndUser----"+isEndUser+"-----"+isCollection);
		this.doLogin(fairid);
		odc.isEndUser=isEndUser;
		if (odc.isEndUser=="true") {
			jQuery("#mgCenter").hide();
		}else{
			jQuery("#mgCenter").show();
		}
		odc.isCollection=isCollection;
		odc.sessionkey=sessionkey;
		odc.fairid=fairid;
		odc.loadIdx=loadIdx;
		if (orderid!=null && orderid!="" && orderid!="null") {
			odc.titleType="购物车";
			odc.foid=orderid;
			var params={cmd:"LoadB2BOrderLines",sessionkey: sessionkey,foid:orderid,fairid:fairid};
			this.onLoad(sessionkey, params);
		}else{
			odc.titleType="批量下单";
			if (type=="month" && isfirst=="N") {
				jQuery("#isSupply").modal({backdrop:"static"});
			}else if(type=="month" && isfirst=="MON"){
				this.judge_MON(fairid);
			}else if(type=="month" && isfirst=="DAY"){
				var params={cmd:"LoadB2BOrderLines",sessionkey: sessionkey,fairid:fairid,ordertype:"ismonth",ismonth:"补单"};
				this.onLoad(sessionkey, params);
			}
			if (type=="day") {
				var params={cmd:"LoadB2BOrderLines",sessionkey: sessionkey,fairid:fairid,ordertype:"isday"};
				this.onLoad(sessionkey, params);
			}
		}
		odc.loadIdx=loadIdx;
		document.title=odc.titleType;
	},
	setOrderDefault : function(){
		odc.ismonth="月单";
		var ret= this.judgeMonth(odc.fairid);
	},
	setMonth : function(){
		var isSupply = jQuery("#isSupply_sel").val();
		odc.ismonth=isSupply=="MON"?"月单":"补单";
		var choice=odc.ismonth;
		if (choice=="月单") {
			var ret= this.judgeMonth(odc.fairid);
		}else{
			var params={cmd:"LoadB2BOrderLines",sessionkey: odc.sessionkey,fairid:odc.fairid,ordertype:"ismonth",ismonth:"补单"};
			odc.onLoad(odc.sessionkey, params);
			jQuery("#isSupply").modal("hide");
		}
	},
	backHome : function(){
		window.location.replace('/fair/ipad/B2B/index.jsp?loadIdx='+odc.loadIdx);
		this.backSave();
	},
	judgeOrder : function(){
		var params={cmd:"JudgeMonth",foid:odc.foid,method:"judgeOrder"};
		var trans={id:1, command:"com.agilecontrol.fair.FairCmd",params:params};
		portalClient.sendOneRequest(trans, function(response){
			var count=response.data[0].result;
			if(count>0){
				odc.synchronize('yes');
			}else{
				odc.synchronize('no');
			}
		});
	},
	cFilter : function(){
		window.location.replace("http://search.fair.app");
	},
	
	setFilter : function(DOM,relative){
		var input = jQuery(DOM).prev();
		input.attr("checked",input.attr("checked") == "checked"?false:"checked");
		this.refresh();
	},
	refresh : function(){
		jQuery("#loading").show();
		this.onLoad(this.sessionkey);
	},
	
	/*search : function(){
		var info= jQuery("#search").val();
		
	},*/
	
	/**
	 * Description : 更新单个td的内容
	 * 
	 * type : private
	 * */
	_updateTD : function(td,delta,sformat){
		var val = parseFloat(td.attr("title")) + delta;
		if(isNaN(val)){val= parseFloat(td.html()) + delta;}
		if(sformat == null || sformat == "" || sformat == undefined){
			td.html(val).attr("title",val);
		}else{
			sformat = val.format(sformat);
			td.html(sformat).attr("title",val);
		}
	},
	
	/**
	 * Description : 批量格式化列方向的td的内容
	 * 
	 * type : private
	 * */
	_formatTDs : function(delta,index){
		var tds = "td:eq("+index+")",
		sformat = this.format[index];
		this._updateTD(this.tr.children(tds),delta,sformat);
		if(this.sumtr != false)
			this._updateTD(this.sumtr.children(tds),delta,sformat);
	},
	
	/**
	 * Description : 控制Grid的单元格联动。
	 * 
	 * type : private
	 * */
	_controlGrid : function(input,event){
		var td = input.parent(),
		val = input.val();
		if(val=="")val=0;
		//得力的需求，页面显示的尺码订量是实际除以倍数的量，保存的时候需要乘以倍数
		var multi=1;
		if(td.attr("multi")!=undefined)multi=td.attr("multi");
		if(td.attr("title") == val){
			td.html(val);
		}else{
			if(new RegExp("^\\d+$").test(val)){
				val = parseFloat(val);
				var tr = this.tr = input.parents("tr");
				this.modify[tr.attr("title")+","+(tr.children("td").index(td)-this.fetdi)] = val*multi;
				//this.modify[tr.attr("title")+","+(tr.children("td.data").index(td))] = val;
				if(this.sumtr != false)
					this.sumtr = jQuery("tr#"+tr.attr("class"));
				var damount = val - this.prevVal,
				dtotal= damount*parseFloat(tr.children("td.price").attr("title")),
				iamount = tr.children().index(tr.children("td.amount")),
				itotal = tr.children().index(tr.children("td.total"));
				var lineidx = this.currentPage*this.linecounts+jQuery("#table > table tbody tr").index(tr);
				this.javaData.table[tr.children().index(td)][lineidx] = val*multi;
				if(this.javaData.operation.qty>0)
				//----------------------------------------------------------------------------------------------------------
				this.javaData.table[this.javaData.operation.qty][lineidx] += damount*multi;
				this.javaData.table[this.javaData.operation.amount][lineidx] += dtotal*multi;
				this._formatTDs(damount,tr.children().index(td));/*修改当前激活的td 以及 当前列数量合计。*/
				if(iamount==-1)alert("ad_sql#fair_orderlines_meta中价格列或者数量列索引配置有误！");
				//----------------------------------------------------------------------------------------------------------
				this._formatTDs(damount*multi,iamount);/*修改当前td所在行的数量的合计  以及 列小计所在行的数量合计*/
				this._formatTDs(dtotal*multi,itotal);/*修改当前行金额的合计  以及 列小计所在行的金额合计*/
				td = "#footer td";
				if(this.javaData.operation.qty==-1){
					var iamount1=this.javaData.editablecolumn[0];
					this._updateTD(jQuery(td+":eq("+iamount1+")"), damount*multi, this.format[iamount1]);/*修改总计的数量*/
				}else{
					this._updateTD(jQuery(td+".amount"), damount*multi, this.format[iamount]);/*修改总计的数量*/
				}
				this._updateTD(jQuery(td+".total"), dtotal*multi, this.format[itotal]);/*修改总计的金额*/
			}else{
				input.css({background: "#AA4643",color: "white"}).focus().select();
			}
		}
	},
	
	_bindChangeQty : function(event){
		odc._controlGrid(jQuery(this),event);
	},
	
	/**
	 * Description : to be called after clicking the editable td.
	 * 
	 * @type public
	 * */
	clickTD : function(DOM,event){
		if(jQuery("#table input").length == 0){
			var td = jQuery(DOM),
			val = td.attr("title"),
			input = jQuery("<input type='text' pattern='[0-9]*' onkeyup='value=value.replace(/[^\\d]/g,\"\")'  onbeforepaste='clipboardData.setData(\"text\",clipboardData.getData(\"text\").replace(/[^\\d]/g,\"\"))' class='input' value="+val+">");//pattern='[0-9]*',virtual keyborder.
			odc.prevVal = parseFloat(val);
			if(odc.showtooltips!="Y")
				odc.writeFeedback(DOM,event);
			td.html(input);
			input.focus().select().bind("blur",this._bindChangeQty).bind('keydown', function(event){
				if (event.keyCode=="13") {/*回车*/
					odc._controlGrid(jQuery(this),event);
				}
			}).bind("click",function(event){
				return;
			}).bind('dblclick', function(event){
				return;
			});
		}
	},
	
	/**
	 * 单击某一个款时，显示当前款的图片
	 * */
	showpdt : function(DOM,event){
		event.stopPropagation();
		var td = jQuery(DOM),
		tr = td.parent(),
		//offset = td.offset(),
		src = this.javaData.imgs[this.currentPage*this.linecounts + tr.parent().children().index(tr)];
		jQuery("#pdtimg").attr({
			alt : "",
			src : "/pdt/m/"+src
		}).css({
			top : event.pageY,
			left : event.pageX
		}).show();
	},
	
	writeFeedback : function(DOM,event){
		event.stopPropagation();
		var td = jQuery(DOM),
		offset = td.offset();
		if(this.showtooltips=="Y"){
			jQuery("#tooltip span").html(td.html()).parent().css({
				top : offset.top+3,
				left : offset.left,
				width: td.width(),
				height: td.height()
			}).show();
		}else{
			jQuery("#table table tr td").removeClass("activedtr");
			td.parents("tr").find("td").addClass("activedtr");
			this.selectedTr(td.parents("tr"));
		}
	},
	
	selectedTr : function(DOM){
		var current = jQuery(DOM);
		jQuery("table tr").removeClass("activedtr");
		current.addClass("activedtr");
	},
	/**
	 * Description : 同步数据。
	 * 
	 * type : public
	 * */
	synchronize : function(str){
		var temp,
		tojava = new Array(),
		iterator2 = this.modify,
		iterator = iterator2.keys();
		for ( var i = 0; i < iterator.length; i++) {
			temp = new Array();
			temp = iterator[i].split(",");
			temp.push(iterator2[iterator[i]]);
			tojava.push(temp);
		}
		var id=-1;
		if(this.model==1) id=jQuery("#showstores").find("option:selected").val();
		if(tojava.length != 0){
				var params;
				params={cmd: "SaveB2BOrderLines",sessionkey: this.sessionkey,data: tojava,id:id,foid:odc.foid,ordertype:odc.ordertype,isback:"no"};
				var trans={id:1, command:"com.agilecontrol.fair.FairCmd",params:params};
				portalClient.sendOneRequest(trans, function(response){
					alert(response.data[0].message);
					if(response.data[0].code == 0){
						odc.modify = new Hash();
						odc.delNull(odc.foid);
					}else{
						odc.delNull(odc.foid);
						window.location.reload();
					}
				});
		}else{
			if (str=="yes") {
				alert("当前订单为空，无法确认提交！");
			}else if (str=="no") {
				var params;
				params={cmd: "SaveB2BOrderLines",sessionkey: this.sessionkey,data: tojava,id:id,foid:odc.foid,ordertype:odc.ordertype,isback:"no"};
				var trans={id:1, command:"com.agilecontrol.fair.FairCmd",params:params};
				portalClient.sendOneRequest(trans, function(response){
					alert(response.data[0].message);
					if(response.data[0].code == 0){
						odc.modify = new Hash();
						odc.delNull(odc.foid);
					}else{
						odc.delNull(odc.foid);
						window.location.reload();
					}
				});
			}
		}
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
		jQuery(".scroll").stop(true);
		var touches = odc.getNativeEvent(event).touches;
		if ( touches && touches.length === 1 ) {
			var type = odc.scrollparams.type;
			if(type != null){
				var div = type == "v" ? "#scrollbar-y > div" : type == "h" ? "#scrollbar-x > div" : ".scrollc div";
				jQuery(div).css({opacity: 1,display: "block"});
			}
			odc.startX = touches[0].pageX;
			odc.startY = touches[0].pageY;
		}
	},
	
	/**
	 * Description : to handle after touchend on customer ul.
	 * 
	 * @type public
	 * */
	handleTouchEnd : function(event){
		event.stopPropagation();
		jQuery(".scroll").animate({opacity: 0},1400);
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
		if(odc.scrollparams.type != null){
			var touches = odc.getNativeEvent(event).touches;
			if ( touches && touches.length === 1 ) {
				var t = touches[0],
				params = odc.scrollparams,
				type = params.type,
				table = jQuery("#table > table");
				if(type == "v"){//only vertical scroll.
					var y = t.pageY,
					cheight = params.cheight,
					theight = params.theight,
					top= parseInt(table.css("margin-top").replace(/px/g, ""));
					params.top = top;
					top +=  y - odc.startY;
					odc.startY = y;
					if(top > 0){
						top = 0;
					}else if(top+theight < cheight){
						top = cheight - theight;
					}
					table.css("margin-top",top);
					jQuery("#scrollbar-y div").css("top", top*params.scrollY);
				}else if(type == "h"){
					var x = t.pageX,
					cwidth = params.cwidth,
					twidth = params.twidth,
					left = parseInt(table.css("margin-left").replace(/px/g, ""));
					params.left =  left;
					left +=  x -  odc.startX;
					odc.startX = x;
					if(left > 0){
						left = 0;
					}else if(left+twidth < cwidth){
						left = cwidth - twidth;
					}
					jQuery(".hscroll table").css("margin-left",left);
					jQuery("#scrollbar-x div").css("left", left*params.scrollX);
				}else{
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
					left +=  x -  odc.startX;
					top +=  y - odc.startY;
					odc.startX = x;
					odc.startY = y;
					if(top > 0)
						top = 0;
					else if(top+theight < cheight)
						top = cheight - theight;
					if(left > 0)
						left = 0;
					else if(left+twidth < cwidth)
						left = cwidth - twidth;
					jQuery(".fixed table").css("margin-left",left);
					table.css({
						"margin-top": top,
						"margin-left": left
					});
					jQuery("#scrollbar-y div").css("top", top*params.scrollY);
					jQuery("#scrollbar-x div").css("left", left*params.scrollX);
				}
			}
		}
	},
	
	/**
	 * Description : to write the name of the order details.
	 * 
	 * type : private
	 * */
	_writeTitle : function(title){
		if(title == undefined || title == ""){
			//alert("订单明细没有title。");
			return;
		}
		//jQuery("#title span").html(title);
	},
	
	/**
	 * Description : to draw colgroup tag.
	 * 
	 * type : private
	 * */
	_drawColgroup : function(colgroup){
		if(colgroup == undefined || colgroup.length == 0){
			alert("colgroup属性不正确。应该是int的数组，length=列数。");
			return;
		}
		var s = "<colgroup>";
		var sum = 0;
		for ( var i = 0; i < colgroup.length; i++) {
			s += "<col width='"+colgroup[i]+"'>";
			sum += colgroup[i];
		}
		if(this.ismanual){
			jQuery("#header>table,#table>table,#footer>table").width(sum);
		}
		s += "</colgroup>";
		if(this.firstDraw){
			jQuery("div.basic > table").append(s);
		}else{
			jQuery("#table > table").append(s);
		}
	},
	
	/**
	 * Description : to draw table header.
	 * 
	 * type : private
	 * */
	_drawThead : function(header){
		if(header == undefined || header.length == 0){
			alert("header属性不正确。ex:[{name:'SKU',colspan:3, subheader:['Planning','Actual','Var']}]");
			return;
		}
		var iterator,
		s = "<thead><tr>",
		ss = "<tr>";
		for ( var i = 0; i < header.length; i++) {
			if(header[i].subheader == undefined){
				s += "<td rowspan='2'>"+header[i].name+"</td>";
			}else{
				s += "<td colspan='"+header[i].colspan+"'>"+header[i].name+"</td>";
				iterator = header[i].subheader;
				for ( var j = 0; j < iterator.length; j++) {
					ss += "<td>"+iterator[j]+"</td>";
				}
			}
		}
		s += "</tr>"+ss+"</tr></thead>";
		jQuery("#header > table").append(s);
	},
	
	/**
	 * Description : to format the value.
	 * 
	 * type : private
	 * */
	_format : function(v,findex){
		var sformat = this.format[findex];
		return v == null ? "" : (sformat == null?v:(isNaN(parseFloat(v))?v:Number(v).format(sformat)));
	},
	
	/**
	 * Description : to draw table footer.
	 * 
	 * type : private
	 * */
	_drawTfoot : function(sum,o){
		if(sum != undefined){
			var qty = o.qty,
	    	amount = o.amount,
			s = "<tfoot><tr>";
			for ( var i = 0; i < sum.length; i++) {
				switch (i) {
				case qty:
					s += "<td class='sum amount' title='"+sum[i]+"'>"+this._format(sum[i],i)+"</td>";
					break;
				case amount:
					s += "<td class='sum total' title='"+sum[i]+"'>"+this._format(sum[i],i)+"</td>";
					break;
				default:
					s += "<td>"+this._format(sum[i],i)+"</td>";
					break;
				}
			}
			s += "</tr></tfoot>";
			jQuery("#footer > table > tfoot").remove();
			jQuery("#footer > table").append(s);
		}
	},
	
	_drawFirstTd : function(desc,index){
		var td = "<td onmouseover=odc.showpdt(this,event)  onmouseout=odc.pdthide() class='desc'>";
		if(this.showThumbnail){
			td += "<img alt='' src='"+(this.thumbnailPath+this.javaData.imgs[index])+"' />";
		}else{
			td += desc;
		}
		return td+"</td>";
	},
	pdthide : function(){
		jQuery("#pdtimg").hide();
	},
	
	_drawTr : function(start,end){
		var p,qty,amount,
		javaData = this.javaData,
		editcolumn = this.editcolumn,
		iterator = javaData.table[0],
		iterator3 = javaData.trno,
		iterator2 = javaData.operation,
		aindex=javaData.aindex;
		//得力的需求，页面显示的尺码订量是实际除以倍数的量，保存的时候需要乘以倍数
		if(javaData.sizeMultiple!=undefined&&javaData.sizeMultiple.length>0&&iterator2.fistsize==undefined){
			alert("ad_sql#fair_orderlines_meta的operation里的fistsize没有配置");
			return;
		}
		if(javaData.canedit=="N") editcolumn=[-1];
		if(iterator2 == undefined){
			iterator = iterator[iterator.length - 1];
			iterator2.qty = ++iterator;
			iterator2.p = ++iterator;
			iterator2.amount = ++iterator;
		}
		if(javaData.unedit=="N")editcolumn=[-1];
		p = iterator2.p;
		qty = iterator2.qty;
    	amount = iterator2.amount;
		iterator2 = javaData.table;
		/**
		 * Description : to deal with the td.
		 * 
		 * type : private
		 * 
		 * @param v -String
		 *   value
		 *   
		 * @param ci -Number
		 *  column index
		 * 
		 * @param sum -boolean
		 *  whether the current tr is sum tr.
		 * */
		function _dealWithTD(v,ci,sum,n){
			var show = ((v == undefined || v == null || v == "") ? "" : (v == -1 ? "" : odc._format(v,ci))),
			actual = (show == "" ? 0 : v);
			//-----------------------------------修改显示价格为0
			if(ci==p&&show=="")show="￥0";
			switch (ci) {
			case p:
				return "<td class='sum price' title='"+actual+"'>"+show+"</td>";
			case qty:
				return "<td class='sum amount' title='"+actual+"'>"+show+"</td>";
			case amount:
				return "<td class='sum total' title='"+actual+"'>"+show+"</td>";
			default:
					var td = "<td ";
					if(v == -1){
						td += "class='desc'>";
					}else{
						if(editcolumn[ci])
							td += "class='data' multi='"+n+"' title='"+actual/n+(sum?"'>":"' onclick=odc.clickTD(this,event);>");
						//td += "title='"+actual+(sum?"'>":"'>");
						else{
							if (ci==aindex) {
								td += "class='desc sp-aindex' onclick=odc.aIndex(this,event)>";
							}else{
								td += "class='desc' onclick=odc.writeFeedback(this,event)>";
							}
						}
					}
					if(editcolumn[ci])
						td += show/n+"</td>";
					else
						td += show+"</td>";
					return td;
			}
		}
		var s= "";
		var n=1;
		if(this.sumtrFordraw != false){
			var k = 1;
			for ( var i = start; i < end; i++) {
				if(sumtr[i]){
					s += "<tr id='tr0"+k+"' class='sum' title='"+iterator3[i]+"'>"+this._drawFirstTd(iterator[i],i);
					for ( var j = 1; j < iterator2.length; j++) {
						s += _dealWithTD(iterator2[j][i],j,true,n);
					}
					k++;
				}else{
					s += "<tr class='tr0"+k+"' title='"+iterator3[i]+"'>"+this._drawFirstTd(iterator[i],i);
					for ( var j = 1; j < iterator2.length; j++) {
						//得力的需求，页面显示的尺码订量是实际除以倍数的量，保存的时候需要乘以倍数
						if(javaData.sizeMultiple!=undefined&&javaData.sizeMultiple.length>0){
							n=javaData.sizeMultiple[i][j-javaData.operation.fistsize];
						}
						if(n==undefined)n=1;
						s += _dealWithTD(iterator2[j][i],j,false,n);
					}
				}
				s += "</tr>";
			}
		}else{
			for ( var i = start; i < end; i++) {
				s += "<tr title='"+iterator3[i]+"'>"+this._drawFirstTd(iterator[i],i);
				for ( var j = 1; j < iterator2.length; j++) {
					//得力的需求，页面显示的尺码订量是实际除以倍数的量，保存的时候需要乘以倍数
					if(javaData.sizeMultiple!=undefined&&javaData.sizeMultiple.length>0){
						n=javaData.sizeMultiple[i][j-javaData.operation.fistsize];
					}
					if(n==undefined)n=1;
					s += _dealWithTD(iterator2[j][i],j,false,n);
				}
				s += "</tr>";
			}
		}
		return s;
	},
	
	/**
	 * Description : to draw table body.
	 * 
	 * type : private
	 * */
	_drawTbody : function(javaData){
		if(javaData.trno == undefined || javaData.trno.length == 0){
			return;
		}
		var  editcolumn = new Hash(),
		iterator = javaData.editablecolumn;
		if(iterator == undefined || iterator.length == 0){
			return;
			//
		}else{/*记录可编辑列信息*/
			if(!this.canedit) iterator=[-1];
			var ftindx = iterator[0];
			for ( var i = 0; i < iterator.length; i++) {
				ftindx = ftindx > iterator[i] ? iterator[i] : ftindx;
				editcolumn[iterator[i]] = true;
			}
			this.fetdi = ftindx;
		}
		var s = "<tbody>",
		sumtr = new Hash();
		iterator2 = javaData.table;
		if(javaData.subtotal == undefined || javaData.subtotal.length == 0){/*记录小计行信息*/
			this.sumtr = false;
			this.sumtrFordraw = false;
		}else{
			iterator = javaData.subtotal;
			for ( var i = 0; i < iterator.length; i++) {
				sumtr[iterator[i]] = true;
			}
			this.sumtr = true;
			this.sumtrFordraw =  sumtr;
		}
		iterator = javaData.table[0];
		var lines = this.linecounts,
		length = iterator.length;
		this.pages = (length%lines == 0 ? length/lines : parseInt(length/lines)+1);
		this.javaData = javaData;
		this.editcolumn = editcolumn;
		if(this.pages > 1){
			length = lines;
			var select = jQuery("#current select");
			select.append("<option value='1' selected='selected'>"+VIEWS_LOCALE.rank.pagestart+" 1 "+VIEWS_LOCALE.rank.pagetotalend+"</option>");
			for ( var i = 1; i < this.pages; i++) {
				select.append("<option value='"+(i+1)+"'>"+VIEWS_LOCALE.rank.pagestart+(i+1)+VIEWS_LOCALE.rank.pagetotalend+"</option>");
			}
			//jQuery("#toolbars").show();
		}
		s += this._drawTr(0,length) + "</tbody>";
		jQuery("#table > table").append(s);
		if(javaData.content_text_align!=undefined){
			jQuery(".desc").css("text-align",javaData.content_text_align);
			jQuery(".desc").css("text-align",javaData.content_text_align);
			jQuery(".data").css("text-align",javaData.content_text_align);
			jQuery(".sum").css("text-align",javaData.content_text_align);
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
			jQuery("#table > table tbody").append(this._drawTr(s, (val == this.pages ? this.javaData.table[0].length : s + this.linecounts)));
			if(odc.javaData.content_text_align!=undefined){
				jQuery(".desc").css("text-align",odc.javaData.content_text_align);
				jQuery(".desc").css("text-align",odc.javaData.content_text_align);
				jQuery(".data").css("text-align",odc.javaData.content_text_align);
				jQuery(".sum").css("text-align",odc.javaData.content_text_align);
			}
		}
	},
	
	switchPage : function(type){
		if(this.pages<=1){
			return;
		}
		this._initWindow();
		var select = jQuery("#current select"),
		val = parseInt(select.val());
		switch (type) {
		case 0:
			if (val==1) {
				return;
			}
			select.val(--val);
			this._switchPage();
			jQuery("#currentPage").text(select.val());
			break;
		case 1:
			if (val==this.pages) {
				return;
			}
			select.val(++val);
			this._switchPage();
			jQuery("#currentPage").text(select.val());
			break;
		default:
			alert("odc.swithPage type 参数..");
			break;
		}
	},
	
	_bindSwitchPage : function(event){
		odc._switchPage(jQuery(this),event);
	},
	
	/**
	 * Description : to control this page.
	 * 
	 * type : private
	 * */
	_controlPage : function(){
		if (this.pages==-1) {
			this.pages+=1;
		}
		jQuery("#total").html(VIEWS_LOCALE.rank.pagetotal+"<span>"+this.pages+"</span> "+VIEWS_LOCALE.rank.pagetotalend);
		var params = this.scrollparams,
		cwidth = params.cwidth = jQuery("#table").width(),
		cheight = params.cheight = jQuery("#table").height(),
		twidth = params.twidth = jQuery("#table > table").outerWidth(true),
		theight = params.theight = jQuery("#table > table").outerHeight(true),
		scrollx = jQuery("#scrollbar-x").width() - twidth + cwidth,
		scrolly = jQuery("#scrollbar-y").height() - theight + cheight;
		scrollx = scrollx < 32 ? 32: scrollx;
		scrolly = scrolly < 32 ? 32: scrolly;
		jQuery("#scrollbar-x > div").width(scrollx);
		jQuery("#scrollbar-y > div").height(scrolly);
		params.scrollX = (jQuery("#scrollbar-x").width() - scrollx)/(cwidth-twidth);
		params.scrollY = (jQuery("#scrollbar-y").height() - scrolly)/(cheight-theight);
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
			jQuery("#table").bind("touchstart",this.handleTouchStart).bind("touchend",this.handleTouchEnd).bind("touchmove",this.handleTouchMove);
		}
	},
	
	/**
	 * Description : to draw the order details.
	 * 
	 * type : private
	 * */
	_drawOrderDetails : function(javaData){
		jQuery("#table table").children().remove();
		this._init();
		this.javaData.imgs = javaData.imgs;
		if(javaData.model!=undefined){
			this.model=javaData.model;
		}
		if(javaData.linecounts != undefined)
			this.linecounts = javaData.linecounts;
		if(javaData.showtooltips!=undefined){
			this.showtooltips=javaData.showtooltips;
		}
		if(javaData.stores!=undefined&&javaData.stores.length>0){
			var temp=jQuery("#showstores"),html="",iterator=javaData.stores;
			temp.show();
			for(var i=0;i<iterator.length;i++){
				html+="<option index='"+i+"' value='"+iterator[i][0]+"'>"+iterator[i][1]+"</option>";
			}
			if(temp.find("option:selected").val()==undefined){
				temp.html(html);
			}
			if(jQuery("#showstores").find("option:selected").val()==-1){
				this.canedit=false;
			}else{
				this.canedit=true;
			}
		}
		if(javaData.theme != undefined)
			odc.theme = javaData.theme;
		//jQuery("<link rel='stylesheet' href='/fair/ipad/css/"+ odc.theme +"/orderdetails.css' type='text/css' media='screen' title='no title' charset='utf-8'>").appendTo(jQuery("head"));
		this.format = javaData.fmt.clone();
		this._drawColgroup(javaData.colgroup);
		if(this.firstDraw){
			this._writeTitle(javaData.title);
			this._drawThead(javaData.header);
		}
		if(javaData.operation==undefined){alert("operation没有配置");return;}
		this._drawTfoot(javaData.sum,javaData.operation);
		this.adjustHeight(javaData);
		this._drawTbody(javaData);
		this._controlPage();
		this.firstDraw = false;
		jQuery("#loading").hide();
	},
	
	_initWindow : function(){
		jQuery(".tooltip").hide();
	},
	
	back : function(){
		jQuery("#loading").show();
		window.location.replace("/fair/ipad/kpi.jsp?sessionkey="+this.sessionkey);
	},
	
	adjustHeight : function(javaData){
		var height=jQuery(window).height(),
		height1=jQuery("#table").height(),
		//temp=height-jQuery("#header").height()-jQuery("#footer").height()-104;
		temp=height-jQuery("#header").height()-jQuery("#footer").height()-35;
		var showThumbnail = javaData.showThumbnail;
		if(temp<height1){
			jQuery("#table").height(temp-4);
			if(showThumbnail != undefined && showThumbnail == "Y"){
				this.showThumbnail = true;
			}else{
				this.showThumbnail = false;
			}
			}else{
				if(showThumbnail != undefined && showThumbnail == "Y"){
					this.showThumbnail = true;
				}else{
					this.showThumbnail = false;
				}
			}
		
	},
	/**
	 * Description : first load main page.
	 * 
	 * type : public
	 * */
	onLoad : function(sessionkey,params) {
		//alert("进入onload");
		this.sessionkey = sessionkey;
		if(this.debug)
			jQuery("#debug").show();
		/*var params={cmd:"LoadB2BOrderLines",sessionkey: sessionkey,filterid:(jQuery("#search input").attr("checked")=="checked"?this.filterid:-1)};*/
		//var params={cmd:"LoadB2BOrderLines",sessionkey: sessionkey,filter:filtervalue,foid:odc.foid,ordertype:odc.ordertype,fairid:odc.fairid,ismonth:odc.ismonth};
		if (odc.isCollection=="yes") {
			params.cmd="LoadB2BCollection";
		}
		if (!("screenorder" in params)) {
			params.ischoice="no";
		}else{
			params.ischoice="yes";
		}
		var trans={id:1, command:"com.agilecontrol.fair.FairCmd",params:params};
		if(jQuery("#showstores").is(":hidden")){
			trans.params.ddvalue=-1;
		}else{
			trans.params.ddvalue=jQuery("#showstores").find("option:selected").val();
		}
		portalClient.sendOneRequest(trans, function(response){
			var javaData= response.data[0].result;
			var message=response.data[0].message;
			var special=javaData.special;
			if (special=="existMON") {
				jQuery("#isSupply").modal({backdrop:"static"});
				return;
			}
			if(javaData.locale != undefined && null != javaData.locale)
			jQuery("<script language='javascript' src='/fair/ipad/js/locale/locale_"+ javaData.locale +".js' charset='utf-8'></script>").appendTo(jQuery("head"));
			else
			jQuery("<script language='javascript' src='/fair/ipad/js/locale/locale_zh_CN.js' charset='utf-8'></script>").appendTo(jQuery("head"));
			if(response.data[0].code == 0){
				this.ismanual = response.data[0].result.ismanual=='Y';
				odc._drawOrderDetails(response.data[0].result);
			}else if(response.data[0].code == 3){
				jQuery("#loading").hide();
				alert("您下的是月单且每月月单截止日期是28号,当前时间不在截止日期前10天内,不能下单!");
				var params={cmd:"JudgeMonth",foid:javaData.orderid,method:"delNull"};
				var trans={id:1, command:"com.agilecontrol.fair.FairCmd",params:params};
				portalClient.sendOneRequest(trans, function(response){
					var ret=response.data[0].result;
					odc.ordercenter();
				});
				//window.location.replace('/fair/ipad/B2B/index.jsp?loadIdx='+odc.loadIdx);
			}else{
				jQuery("#loading").hide();
				alert(response.data[0].message);
			}
			jQuery("#kpi-filter").html(VIEWS_LOCALE.orderdetails.query_condition);
			jQuery("#back").html(VIEWS_LOCALE.orderdetails.back);
			jQuery("#synchronize").html(VIEWS_LOCALE.orderdetails.save);
			jQuery("#prev .toolbardesc").html(VIEWS_LOCALE.main.previous_page);
			jQuery("#next .toolbardesc").html(VIEWS_LOCALE.main.next_page);
			odc.foid=javaData.orderid;
			var ordertype=javaData.docno.b2b_fo_type;
			var docno=javaData.docno.docno;
			var provider=javaData.provider.truename;
			if(ordertype==null || ordertype=="null" || ordertype==""){
				jQuery("#shoptitle div").html("日单单号：");
				odc.fairtype="all";
			}else if(ordertype.toLowerCase()=="mon"){
				jQuery("#shoptitle div").html("月单单号：");
				odc.fairtype="MON";
			}else if(ordertype.toLowerCase()=="day"){
				jQuery("#shoptitle div").html("补单单号：");
				odc.fairtype="DAY";
			}
			//默认为已下量或者全部
			var screenorder=javaData.screenorder;
			jQuery("#st-order").val(screenorder);
			jQuery("#shoptitle span").html(docno);
			jQuery("#provider span").html(provider);
		});
	}
};
OrderDetailsControl.main = function() {
	portalClient = new PortalClient();
	portalClient.init(null,null,"/servlets/binserv/Fair");
	odc = new OrderDetailsControl();
	jQuery(window).bind("click", odc._initWindow);
	jQuery(window).bind("beforeunload", function() {
		odc.backSave();
	});
};
jQuery(document).ready(OrderDetailsControl.main);

function appFilterID(filterid){
	jQuery("#loading").show();
	odc.filterid = filterid;
	jQuery("#filter input").attr("checked","checked");
	odc.refresh();
	return "ok";
}
function AppBrowserClose(){
	odc.synchronize();
		return;
}