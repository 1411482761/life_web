var view007c;
var View007Control = Class.create();
View007Control.prototype = {
	/**
	 * Description : to define parameter
	 * 
	 * @type private
	 * */
	initialize : function() {
		this.debug = false;
		this.shouldsyn = true;
		this.end = true;
		this.ajaxPrams = new Array();
		this.trans = {
			id: 1,
			command: "com.agilecontrol.fair.FairCmd",
			params:{
				cmd: "LoadRpt",
				sessionkey: rc.sessionkey,
				view: "view007",
				viewchain: null
			}
		};
		this.showThumbnail = false;
		this.thumbnailPath = "/pdt/s/";
		this.imgs = null;
		this.prevDOM = null;
		this.linecounts = -1;
		this._init();
		this.ismultipleext="N";
		this.isjump="N";
		this.ratio=101;
		this.sortSign=null;
		this.width = jQuery(document).width();
		this.height = jQuery(document).height();
		this.isNotPad = navigator.userAgent.indexOf('iPad') == -1;
		if(this.isNotPad && this.width < 768){
			jQuery("#views").append(jQuery(
					"<div id='view007' class='viewport'><div id='view007-banner'><div id='view007-buttons'><ul><li id='view007-homepage' class='view007-button' onclick='view007c.gotoHomePage();'><div class='view007-button-value'>"+
					"</div></li><li id='view007-refresh' class='view007-button' onclick='view007c.refresh();'><div class='view007-button-value'>"+"</div></li></ul></div>" +
					"<div id='view007-title'></div></div><div id='view007-container'><div id='view007-header' class='view007-basic hscroll fixed'></div>" +
					"<div id='view007-table' class='view007-basic hscroll fixed'></div><div id='view007-footer' class='view007-basic'></div><div id='view007-toolbars'>" +
					"<div id='view007-prev' class='toolbar' ontouchstart='view007c.switchPage(0);'><div class='toolbarimg'></div><div class='toolbardesc'>"+VIEWS_LOCALE.main.previous_page+"</div>" +
					"</div><div id='view007-page'><div id='view007-current'><select onchange='view007c._switchPage();'></select></div><div id='view007-total'></div></div>" +
					"<div id='view007-next' class='toolbar' ontouchstart='view007c.switchPage(1);'><div class='toolbarimg'></div><div class='toolbardesc'>"+VIEWS_LOCALE.main.next_page+"</div>" +
					"</div></div><img id='view007-pdtimg' class='tooltip' alt='缺图' src='' onclick='jQuery(this).hide();'><div id='view007-tooltip' class='tooltip'" +
					" onclick='jQuery(this).hide();'><span></span></div>" +
					"</div><div id='view007-loading' class='mainpageajax'><div class='loadingimg'><div id='view007-loadinglocale' class='loadinglocale'>"+
					VIEWS_LOCALE.main.loading+"</div></div></div>"+"<div id='view007-nomatched' class='mainpageajax'><div id='view007-noresult' class='noresult'>"+VIEWS_LOCALE.main.noResult+"</div></div></div>"
			));
			jQuery("#view007-container").css("width",this.width);
			jQuery("#view007-banner").css("width",this.width);
			jQuery("#view007-loading").css("width",this.width);
		}else{
			jQuery("#views").append(jQuery(
					"<div id='view007' class='viewport'><div id='view007-banner'><div id='view007-buttons'><ul><li id='view007-homepage' class='view007-button' onclick='view007c.gotoHomePage();'><div class='view007-button-value'>"+
					VIEWS_LOCALE.view_003.homepage+"</div></li><li id='view007-refresh' class='view007-button' onclick='view007c.refresh();'><div class='view007-button-value'>"+VIEWS_LOCALE.view_003.refresh+"</div></li></ul></div>" +
					"<div id='view007-title'></div></div><div id='view007-container'><div id='view007-header' class='view007-basic hscroll fixed'></div>" +
					"<div id='view007-table' class='view007-basic hscroll fixed'></div><div id='view007-footer' class='view007-basic hscroll fixed'></div><div id='view007-toolbars'>" +
					"<div id='view007-prev' class='toolbar' ontouchstart='view007c.switchPage(0);'><div class='toolbarimg'></div><div class='toolbardesc'>"+VIEWS_LOCALE.main.previous_page+"</div>" +
					"</div><div id='view007-page'><div id='view007-current'><select onchange='view007c._switchPage();'></select></div><div id='view007-total'></div></div>" +
					"<div id='view007-next' class='toolbar' ontouchstart='view007c.switchPage(1);'><div class='toolbarimg'></div><div class='toolbardesc'>"+VIEWS_LOCALE.main.next_page+"</div>" +
					"</div></div><img id='view007-pdtimg' class='tooltip' alt='缺图' src='' onclick='jQuery(this).hide();'><div id='view007-tooltip' class='tooltip'" +
					" onclick='jQuery(this).hide();'><span></span></div>" +
					"</div><div id='view007-loading' class='mainpageajax'><div class='loadingimg'><div id='view007-loadinglocale' class='loadinglocale'>"+
					VIEWS_LOCALE.main.loading+"</div></div></div>"+"<div id='view007-nomatched' class='mainpageajax'><div id='view007-noresult' class='noresult'>"+VIEWS_LOCALE.main.noResult+"</div></div></div>"
			));
		}
	},
	
	_init : function(){
		this.prevVal = 0;
		this.format = undefined;
		this.tr = undefined;
		this.sumtr = false;
		this.sumtrFordraw = true;
		this.pages = -1;
		this.currentPage = 0;
		this.modify = new Hash();
		this.editcolumn = new Object();
		this.javaData = new Object();
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
		jQuery("#view007-toolbars").hide();
		jQuery("#view007-prev").hide();
		jQuery("#view007-next").show();
		jQuery("#view007-current select option").remove();
		jQuery(".view007-basic").children().remove();
		this.ismanual = false;
		this.sum_width = 0;
	},
	
	/**
	 * Description : to generate first rpt.
	 * 
	 * @type public
	 * */
	getActived : function(viewport,index){
		rc.actived = 7;
		rc.filterid=-1;
		rc.bfilterid=-1;
		jQuery("#singlestore").attr("onchange","view007c.refresh()");
		rc.initFilter(viewport);
		rc.drawSelect(rc.rptviews[index]);
		jQuery("#views").show();
		jQuery("#view007").show();
		this.ajaxPrams = [viewport];
		this.ismultipleext="N";
		this.isjump="N";
		this.drawCharts();
	},
	
	/**
	 * Description : to draw charts according to global params and ajax params.
	 * 
	 * @type private
	 * */
	drawCharts : function(category){
		jQuery("#view007-loading").show();
		if(category != undefined)
			this.ajaxPrams.push(category);
		this.trans.params.bfilterid = rc.bfilterid;
		this.trans.params.filterid = rc.filterid;
		if(!jQuery("#singlestore").is(":hidden")){
			this.trans.params.storeid=jQuery("#singlestore").find("option:selected").val();
		}else{
			this.trans.params.storeid=-1;
		}
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
		portalClient.sendOneRequest(this.trans, function(response){
			var javaData= response.data[0].result;
			var action = javaData.action,
			data = javaData.data;
			
			this.ismanual = data.ismanual == 'Y';
			if(data.showThumbnail != undefined){
				view007c.showThumbnail = data.showThumbnail == "Y" ? true : false;
				view007c.linecounts = data.lines;
				view007c._drawRpt(data,"Y");
			}else{
				if(action == "filter"){
					view007c.ajaxPrams.pop();
					jQuery("#view007-loading").hide();
					if(data != null)
						window.location.replace(data);
				}else{
					view007c.linecounts = data.lines;
					view007c._drawRpt(data,javaData.end);
				}
			}
			var divcss=javaData.divcss;
			if(divcss!=null){
				jQuery("#view007-header").addClass(divcss);
				jQuery("#view007-table").addClass(divcss);
			}
		});
		/*end ajax*/
	},
	
	_drawRpt : function(javaData,end){
		if(end == undefined){
			this.end = javaData.end == "undefined"?false:(javaData.end == "Y"?true:false);
		}else{
			this.end = end == "Y"?true:false;
		}
		if(javaData.ismultipleext!=undefined){
			this.ismultipleext=javaData.ismultipleext;
		}
		if(javaData.isjump!=undefined){
			this.isjump=javaData.isjump;
		}
		if(javaData.table.length == 0){
			jQuery("#view007-loading").hide();
			jQuery("#view007-nomatched").show();
		}else{
			jQuery("#view007-nomatched").hide();
			this._init();
			this.format = javaData.fmt.clone();
			this._writeTitle(javaData.title);
			this._drawColgroup(javaData.colgroup,true);
			this._drawThead(javaData.header);
			this._drawTfoot(javaData.sum,javaData.operation);
			this._drawTbody(javaData);
			this._controlPage();
			jQuery("#view007-loading").hide();
			if(view007c.isNotPad && view007c.width < 768){
				jQuery("#view007-header>table,#view007-table>table,#view007-footer>table").width(view007c.width);
			}else{
				jQuery("#view007-header>table,#view007-table>table,#view007-footer>table").width(this.sum_width);
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
		var touches = view007c.getNativeEvent(event).touches;
		if ( touches && touches.length === 1 ) {
			var type = view007c.scrollparams.type;
			if(type != null){
				var div = type == "v" ? "#scrollbar-y > div" : type == "h" ? "#scrollbar-x > div" : ".scrollc div";
				jQuery(div).css({opacity: 1,display: "block"});
			}
			view007c.startX = touches[0].pageX;
			view007c.startY = touches[0].pageY;
		}
	},
	
	/**
	 * Description : to handle after touchend on customer ul.
	 * 
	 * @type public
	 * */
	handleTouchEnd : function(event){
		event.stopPropagation();
		jQuery(".scroll").animate({opacity: 0},700);
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
		if(view007c.scrollparams.type != null){
			var touches = view007c.getNativeEvent(event).touches;
			if ( touches && touches.length === 1 ) {
				var t = touches[0],
				params = view007c.scrollparams,
				type = params.type,
				table = jQuery("#view007-table > table");
				if(type == "v"){//only vertical scroll.
					var y = t.pageY,
					cheight = params.cheight,
					theight = params.theight,
					top= parseInt(table.css("margin-top").replace(/px/g, ""));
					params.top = top;
					top +=  y - view007c.startY;
					view007c.startY = y;
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
					left +=  x -  view007c.startX;
					view007c.startX = x;
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
					left +=  x -  view007c.startX;
					top +=  y - view007c.startY;
					view007c.startX = x;
					view007c.startY = y;
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
				}
			}
		}
	},
	
	_writeTitle : function(title){
		jQuery("#view007-title").html(title);
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
		var s = "<table><colgroup>";
		for ( var i = 0; i < colgroup.length; i++) {
			s += "<col width='"+colgroup[i]+"'>";
			this.sum_width += colgroup[i];
		}
		s += "</colgroup></table>";
		jQuery(".view007-basic").append(s);
		s = "<div id='scrollbar-y' class='scrollc'><div class='scroll scrollbar scrolly'></div></div><div id='scrollbar-x' class='scrollc'><div class='scroll scrollbar scrollx'></div></div>";
		jQuery("#view007-table").append(s);
	},
	
	/**
	 * 点击某一列排序
	 */
	sort : function(DOM , index){
		jQuery("#view007-loading").show();
		
		var array=this.javaData.table[index];
		
		//升降序
		var order = jQuery(DOM).attr("order");
		
		var lineIds =[];
		for ( var i = 0; i < array.length; i++) {
			lineIds.push(i);
		}
	//	jQuery("td").removeAttr("sign");
		if(undefined == order){
			lineIds= this.quickSort(array,0,array.length-1, lineIds);
			jQuery(DOM).attr("order","asc");
			
			jQuery(DOM).attr("sign","↑");
		}else if("asc" == order){
			lineIds= this.quickSort(array,0,array.length-1, lineIds);
			jQuery(DOM).attr("order","desc");
			this.javaData.table[index].reverse();
			lineIds.reverse();
			
			jQuery(DOM).attr("sign","↓");
		}else if("desc" == order){
			lineIds= this.quickSort(array,0,array.length-1, lineIds);
			jQuery(DOM).attr("order","asc");
			
			jQuery(DOM).attr("sign","↑");
		}
		if(this.sortSign != null && this.sortSign != jQuery(DOM)){
			this.sortSign.html(this.sortSign.attr("name"));
		}
		jQuery(DOM).html(jQuery(DOM).attr("name")+jQuery(DOM).attr("sign"));
		this.sortSign=jQuery(DOM);
		
	    for (var k= 0; k <this.javaData.table.length; k++) {
          	var temp=[];
          	for ( var m = 0; m < lineIds.length; m++) {
      			if(k != index){
      				temp.push(this.javaData.table[k][lineIds[m]]);
      			}else{
      				temp.push(this.javaData.table[k][m]);
      			}
      		}
          	this.javaData.table[k]=temp;
		}
		this._switchPage();
		
		jQuery("#view007-loading").hide();
	},
	
	quickSort : function(arr,l,r,lineIds){
		if(l<r){
            var mid=arr[parseInt((l+r)/2)],i=l-1,j=r+1;         
            while(true){
        		while(arr[++i]<mid);
        		while(arr[--j]>mid);             
        		if(i>=j)break;
                
                var temp0=lineIds[i];
                lineIds[i]=lineIds[j];
                lineIds[j]=temp0;
                
                var temp=arr[i];
                arr[i]=arr[j];
                arr[j]=temp;
          
            }
            lineIds = this.quickSort(arr,l,i-1,lineIds);
            lineIds = this.quickSort(arr,j+1,r,lineIds);
        }
        return lineIds;
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
				s += "<td rowspan='2'  onclick=view007c.sort(this,"+i+") name="+header[i].name+" >"+header[i].name+"</td>";
			}else{
				s += "<td colspan='"+header[i].colspan+"'>"+header[i].name+"</td>";
				iterator = header[i].subheader;
				for ( var j = 0; j < iterator.length; j++) {
					ss += "<td  onclick=view007c.sort(this,"+i+") name="+header[i].name+">"+iterator[j]+"</td>";
				}
			}
		}
		s += "</tr>"+ss+"</tr></thead>";
		jQuery("#view007-header > table").append(s);
		if(view007c.isNotPad && view007c.width < 768){
			return;
		}else{
			jQuery("#view007-table").height(jQuery("#view007-container").height() - jQuery("#view007-header").outerHeight(true) - jQuery("#view007-footer").outerHeight(true) - jQuery("#view007-toolbars").outerHeight(true) - 30);
		}
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
			jQuery("#view007-footer > table > tfoot").remove();
			jQuery("#view007-footer > table").append(s);
		}
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
	 * Description : to draw table body.
	 * 
	 * type : private
	 * */
	_drawTbody : function(javaData){
		if(javaData.trno == undefined || javaData.trno.length == 0){
			this.shouldsyn = false;
		}else{
			this.shouldsyn = true;
		}
		var  editcolumn = new Hash(),
		iterator = javaData.editablecolumn;
		if(iterator == undefined || iterator.length == 0){
			return;
		}else{/*记录可编辑列信息*/
			for ( var i = 0; i < iterator.length; i++) {
				editcolumn[iterator[i]] = true;
			}
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
			var select = jQuery("#view007-current select");
			select.append("<option value='1' selected='selected'>"+VIEWS_LOCALE.rank.pagestart+" 1 "+VIEWS_LOCALE.rank.pageend+"</option>");
			for ( var i = 1; i < this.pages; i++) {
				select.append("<option value='"+(i+1)+"'> "+VIEWS_LOCALE.rank.pagestart+(i+1)+VIEWS_LOCALE.rank.pageend+"</option>");
			}
			jQuery("#view007-toolbars").show();
		}
		jQuery("#view007-total").html(VIEWS_LOCALE.rank.pagetotal+" <span>"+this.pages+"</span>"+VIEWS_LOCALE.rank.pagetotalend);
		s += this._drawTr(0,length) + "</tbody>";
		jQuery("#view007-table > table").append(s);
	},
	
	_switchPage : function(event){
	    var table = jQuery("#view007-table > table");
	    table.css("margin-left",0);
		var select = jQuery("#view007-current select"),
		val = select.val();
		if(val == null){
			val = 1;
		}
		this.currentPage = val - 1;
		if(RegExp("^\\d+$").test(val)){
			val = parseInt(val);
			switch (val) {
			case 1:
				jQuery("#view007-prev").hide();
				jQuery("#view007-next").show();
				break;
			case this.pages:
				jQuery("#view007-prev").show();
				jQuery("#view007-next").hide();
				break;
			default:
				jQuery("#view007-prev").show();
				jQuery("#view007-next").show();
				break;
			}
			jQuery("#view007-table > table tbody tr").remove();
			var s = (val-1)*this.linecounts, end = (val == this.pages ? this.javaData.table[0].length : s + this.linecounts);
			jQuery("#view007-table > table tbody").append(this._drawTr(s, end));
			this._controlItems();
		}
	},
	
	_controlItems: function(){
		var params = this.scrollparams,
		table = jQuery("#view007-table > table"),
		cwidth = params.cwidth,
		cheight = params.cheight;
		var twidth = params.twidth = table.outerWidth(true),
		theight = params.theight = table.outerHeight(true),
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
		jQuery(".fixed table").css("margin-left", 0);
		table.css("margin-top", 0);
		jQuery("#view007-loading").hide();
	},
	
	/**
	 * Description : to control this page.
	 * 
	 * type : private
	 * */
	_controlPage : function(){
		jQuery("#total").html("共 <span>"+this.pages+"</span> 页");
		var params = this.scrollparams;
		params.cwidth = jQuery("#view007-table").width(),
		params.cheight = jQuery("#view007-table").height();
		this._controlItems();
		jQuery("#view007-table").bind("touchstart",this.handleTouchStart).bind("touchend",this.handleTouchEnd).bind("touchmove",this.handleTouchMove);
	},
	
	_drawFirstTd : function(desc,index){
		var td = "onclick=view007.selectedTr(this)>";/* ">"end of "<tr '>'" */
		if(this.isjump == "Y"){
			if(this.showThumbnail&&this.javaData.imgindex==0){
				if(this.ismultipleext == "Y"){
					td = "><td onclick=view007c.jumpPdt('"+this.javaData.table[(this.javaData.table.length-1)][index]+"')><img alt='' src='"+this.thumbnailPath+desc+"'>";
				}else{
					td = "><td onclick=view007c.jumpPdt('"+this.javaData.table[(this.javaData.table.length-1)][index]+"')><img alt='' src='"+this.thumbnailPath+desc+".jpg'>";
				}
			}else{
				td = "><td onclick=view007c.jumpPdt('"+this.javaData.table[(this.javaData.table.length-1)][index]+"')>"+desc;
			}
		}else{
			if(this.showThumbnail&&this.javaData.imgindex==0){
				if(this.ismultipleext == "Y"){
				  td = "><td onclick=view007c.drawCharts('"+desc+"')><img alt='' src='"+this.thumbnailPath+desc+"'>";
				}else{
				  td = "><td onclick=view007c.drawCharts('"+desc+"')><img alt='' src='"+this.thumbnailPath+desc+".jpg'>";
				}
			}else{
				if(this.end){
					td = "><td >"+desc;
				}else{
					td = "><td onclick=view007c.drawCharts('"+desc+"')>"+desc;
				}
			}
		}
		
		return td+"</td>";
	},
	/**
	 * 点击某一个款跳转，只支持款色(name)跳转，如果想要款跳转，则数据库需要新添加额外的一列，把当前款的所有款色号列出来，格式pdtname+pdtname+pdtname
	 */
	jumpPdt : function(name){
		window.location.href = "http://pdtid.fair.app#"+name;
	},
	/**
	 * 单击某一个款时，显示当前款的图片
	 * */
	showpdt : function(DOM,index){
		event.stopPropagation();
		var td = jQuery(DOM).find("td:eq("+index+")"),
		tr = td.parent(),
		offset = td.offset();
		src =this.javaData.table[index][this.currentPage*this.linecounts + tr.parent().children().index(tr)];
		jQuery("#view007-pdtimg").attr({
			alt : "",
			src : "/pdt/m/"+src+".jpg"
		}).css({
			top : offset.top-td.height()-8,
			left : offset.left,
			position: "absolute"
		}).show();
	},
	writeFeedback : function(DOM,event){
//		event.stopPropagation();
//		var td = jQuery(DOM),
//		offset = td.offset();
//		jQuery("#view007-tooltip span").html(td.html()).parent().css({
//			top : offset.top+3,
//			left : offset.left,
//			width: td.html().length*18,
//			height: td.height()
//		}).show();
//		setTimeout("jQuery('.tooltip').hide(500);", 1400);
	},
	
	_drawTr : function(start,end){
		var p,qty,amount,
		javaData = this.javaData,
		editcolumn = this.editcolumn,
		iterator = javaData.table[0],
		iterator3 = (this.shouldsyn == true ? javaData.trno : false),
		iterator2 = javaData.operation,
		iterator5 = javaData.trcolors,iterator6;
		if(iterator2 == undefined){
			iterator = iterator[iterator.length - 1];
			iterator2.qty = ++iterator;
			iterator2.p = ++iterator;
			iterator2.amount = ++iterator;
		}
		if(javaData.bfbcompare!=undefined && javaData.bfbcompare.ratio!=undefined){
			view007c.ratio = javaData.bfbcompare.ratio;
		}
		p = iterator2.p;
		qty = iterator2.qty;
    	amount = iterator2.amount;
		iterator2 = javaData.table;
		var length=iterator2.length;
		if(this.isjump=="Y") length=iterator2.length-1;
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
		function _dealWithTD(v,ci,sum){
			var tem = false;
			if(view007c.javaData.bfbcompare!=undefined && rc.isInArray(ci,view007c.javaData.bfbcompare.columns)){
				if(v>view007c.ratio || v==view007c.ratio){
					tem=true;
					}else{
						tem=false;
					}
				}else{
					tem=false;
				}
			//var show = ((v == undefined || v == null || v == "") ? "" : (v == -1 ? "" : view007c._format(v,ci))),
			//去掉对-1的控制，值有可能为-1
			var show = ((v == undefined || v == null || v == "") ? "" : view007c._format(v,ci)),
			actual = (show == "" ? 0 : v);
			if(v==0){
				if(view007c.javaData.clearzero!=undefined&&view007c.javaData.clearzero==1)show="";
				else show=0;
			}
			switch (ci) {
			case p:
				return tem?"<td style='background:"+view007c.javaData.bfbcompare.color+"' class='sum price' title='"+actual+"'>"+show+"</td>":"<td class='sum price' title='"+actual+"'>"+show+"</td>";
			case qty:
				return tem?"<td style='background:"+view007c.javaData.bfbcompare.color+"' class='sum amount' title='"+actual+"'>"+show+"</td>":"<td class='sum amount' title='"+actual+"'>"+show+"</td>";
			case amount:
				return tem?"<td style='background:"+view007c.javaData.bfbcompare.color+"' class='sum total' title='"+actual+"'>"+show+"</td>":"<td class='sum total' title='"+actual+"'>"+show+"</td>";
			default:
					var td = "";
					if(view007c.showThumbnail&&view007c.javaData.imgindex==ci){
						td = "<td><img alt='' src='"+view007c.thumbnailPath+show+".jpg'></td>";
					}else{
				        tem?td+="<td style='background:"+view007c.javaData.bfbcompare.color+"'":td+="<td ";
						if(v == -1){
							td += "class='desc'>";
						}else{
							if(editcolumn[ci])
								td += "class='data' title='"+actual+(sum?"'>":"' onclick=view007c.clickTD(this);>");
							else
								td += "class='desc' >";
						}
						td += show+"</td>";
					}
					return td;
			}
		}
		var s= "";
		if(this.sumtrFordraw != false){
			var k = 1;
			for ( var i = start; i < end; i++) {
				if(sumtr[i]){
					if(iterator5 != undefined){
							iterator6 = iterator5[i];
							s += "<tr id='tr0"+k+"' class='sum' level='"+iterator6+"' style='background:"+rc.tableTrColor[iterator6]+"' title='"+(iterator3 == false ? "" : iterator3[i])+"' "+this._drawFirstTd(iterator[i],i);
					}else{
						s += "<tr id='tr0"+k+"' class='sum' title='"+(iterator3 == false ? "" : iterator3[i])+"' "+this._drawFirstTd(iterator[i],i);
					}
					for ( var j = 1; j < length; j++) {
						s += _dealWithTD(iterator2[j][i],j,true);
					}
					k++;
				}else{
					if(iterator5 != undefined){
						iterator6 = iterator5[i];
						s += "<tr onclick='view007c.selectedTr(this);' class='tr0"+k+"' level='"+iterator6+"' style='background:"+rc.tableTrColor[iterator6]+"' title='"+(iterator3 == false ? "" : iterator3[i])+"' "+this._drawFirstTd(iterator[i],i);
				}else{
					s += "<tr onclick='view007c.selectedTr(this);' class='tr0"+k+"' title='"+(iterator3 == false ? "" : iterator3[i])+"' "+this._drawFirstTd(iterator[i],i);
				}
					for ( var j = 1; j < length; j++) {
						s += _dealWithTD(iterator2[j][i],j,false);
					}
				}
				s += "</tr>";
			}
		}else{
			for ( var i = start; i < end; i++) {
				if(iterator5 != undefined){
					iterator6 = iterator5[i];
					s += "<tr onclick='view007c.selectedTr(this);' level='"+iterator6+"' style='background:"+rc.tableTrColor[iterator6]+"' title='"+(iterator3 == false ? "" : iterator3[i])+"' "+this._drawFirstTd(iterator[i],i);
			}else{
				s += "<tr onclick='view007c.selectedTr(this);' title='"+(iterator3 == false ? "" : iterator3[i])+"' "+this._drawFirstTd(iterator[i],i);
			}
				for ( var j = 1; j < length; j++) {
					s += _dealWithTD(iterator2[j][i],j,false);
				}
				s += "</tr>";
			}
		}
		return s;
	},
	
	selectedTr : function(DOM){
		var prev = this.prevDOM,
		current = jQuery(DOM);
		if(this.javaData.imgindex!=undefined&&!this.showThumbnail){
			this.showpdt(DOM,this.javaData.imgindex);
		}
		if(prev != null)
			prev.css("background",rc.tableTrColor[prev.attr("level")]).toggleClass("activedtr");
		this.prevDOM = current;
		current.toggleClass("activedtr");
	},
	
	_initWindow : function(){
		jQuery("#view007-loading").show();
		jQuery(".tooltip").hide();
		jQuery(".scroll").stop(true);
	},
	
	switchPage : function(type){
		this._initWindow();
		var select = jQuery("#view007-current select"),
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
			alert("view007c.swithPage type 参数..");
			break;
		}
	},
	
	cFilter : function(){
		window.location.replace("http://search.fair.app");
	},
	
	setFilter : function(DOM,relative){
		var input = jQuery(DOM).prev();
		input.attr("checked",input.attr("checked") == "checked"?false:"checked");
		this.refresh();
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
		jQuery(".viewport").hide();
		jQuery("#views").hide();
		this._init();
		jQuery(".mainpageajax").hide();
	},
	
	/**
	 * Description : to refresh the current reports.
	 * 
	 * type: public
	 * */
	refresh : function(){
		jQuery("#view007-loading").show();
		jQuery(".tooltip").hide();
		this._init();
		this.drawCharts();
	}
};
View007Control.main = function(){
	view007c=new View007Control();
};
jQuery(document).ready(View007Control.main);