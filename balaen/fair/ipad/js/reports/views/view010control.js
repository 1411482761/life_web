var view010c;
var View010Control = Class.create();
View010Control.prototype = {
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
				view: "view010",
				filterid : -1,
				viewchain: null
			}
		};
		this.showThumbnail = false;
		this.thumbnailPath = "/pdt/s/";
		this.imgs = null;
		this.linecounts = 6;
		this._init();
		jQuery("#views").append(jQuery(
			"<div id='view010' class='viewport'><div id='view010-banner'><div id='view010-buttons'><ul><li id='view010-homepage' class='view010-button' onclick='view010c.gotoHomePage();'><div class='view010-button-value'>"+
			VIEWS_LOCALE.view_003.homepage+"</div></li><li id='view010-refresh' class='view010-button' onclick='view010c.refresh();'><div class='view010-button-value'>"+VIEWS_LOCALE.view_003.refresh+"</div></li></ul></div>" +
			"<div id='view010-title'></div></div><div id='view010-container'><div id='view010-header' class='view010-basic'></div>" +
			"<div id='view010-table' class='view010-basic'></div><div id='view010-footer' class='view010-basic'></div><div id='view010-toolbars'>" +
			"<div id='view010-prev' class='toolbar' ontouchstart='view010c.switchPage(0);'><div class='toolbarimg'></div><div class='toolbardesc'>上一页</div>" +
			"</div><div id='view010-page'><div id='view010-current'><select onchange='view010c._switchPage();'></select></div><div id='view010-total'></div></div>" +
			"<div id='view010-next' class='toolbar' ontouchstart='view010c.switchPage(1);'><div class='toolbarimg'></div><div class='toolbardesc'>下一页</div>" +
			"</div></div><img id='view010-pdtimg' class='tooltip' alt='缺图' src='' onclick='jQuery(this).hide();'><div id='view010-tooltip' class='tooltip'" +
			" onclick='jQuery(this).hide();'><span></span></div>" +
			"</div><div id='view010-loading' class='mainpageajax'><div class='loadingimg'><div id='view010-loadinglocale' class='loadinglocale'>"+
			VIEWS_LOCALE.main.loading+"</div></div></div>"+"<div id='view010-nomatched' class='mainpageajax'><div id='view010-noresult' class='noresult'>"+VIEWS_LOCALE.main.noResult+"</div></div></div>"
		));
		if(rc.filter){
			jQuery("<div id='view010-filter' class='rc-filter'><input type='checkbox' onchange=view010c.refresh(); /><span onclick='view010c.setFilter(this);'>"+VIEWS_LOCALE.main.filter+"</span></div>").insertAfter(jQuery("#view010-buttons"));
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
		jQuery("#view010-toolbars").hide();
		jQuery("#view010-prev").hide();
		jQuery("#view010-next").show();
		jQuery("#view010-current select option").remove();
		jQuery(".view010-basic").children().remove();
	},

	/**
	 * Description : to generate first rpt.
	 *
	 * @type public
	 * */
	getActived : function(viewport){
		rc.actived = 10;
		jQuery("#view010-filter input").attr("checked",false);
		if(rc.rpt[viewport] == "Y")
			jQuery(".rc-filter").show();
		else
			jQuery(".rc-filter").hide();
		jQuery("#views").show();
		jQuery("#view010").show();
		this.ajaxPrams = [viewport];
		this.drawCharts();
	},

	/**
	 * Description : to draw charts according to global params and ajax params.
	 *
	 * @type private
	 * */
	drawCharts : function(category){
		jQuery("#view010-loading").show();
		if(category != undefined)
			this.ajaxPrams.push(category);
		if(rc.filter && rc.filterid != null){
			if(jQuery("#view010-filter input").attr("checked") == "checked"){
				this.trans.params.filterid = rc.filterid;
			}else{
				this.trans.params.filterid = null;
			}
		}
		var viewchain = this.ajaxPrams.toString().split(",");
		this.trans.params.viewchain = viewchain;
		portalClient.sendOneRequest(this.trans, function(response){
			var javaData= response.data[0].result;
			var action = javaData.action;

			data = javaData.data;
			//////////////////////////

			if(javaData.showThumbnail != undefined){
				this.showThumbnail = javaData.showThumbnail == "Y" ? true : false;
				view010c._drawRpt(data,"Y");
			}else{
				if(action == "filter"){
					view010c.ajaxPrams.pop();
					jQuery("#view010-loading").hide();
					if(data != null)
						window.location.replace(data);
				}else{
					view010c._drawRpt(data,javaData.end);
				}
			}
		});
		/*end ajax*/
	},

	_drawRpt : function(javaData,end){

		////////////////////////////////
	//	javaData.table = {"table":[1,2,3,4,5]};
		if(end == undefined){
			this.end = javaData.end == "undefined"?false:(javaData.end == "Y"?true:false);
		}else{
			this.end = end == "Y"?true:false;
		}
		if(javaData.table.length == 0){
			jQuery("#view010-loading").hide();
			jQuery("#view010-nomatched").show();
		}else{
			this._init();
			this.format = javaData.fmt.clone();
			this._writeTitle(javaData.title);
			this._drawColgroup(javaData.colgroup);
			this._drawThead(javaData.header);
			//this._drawTfoot(javaData.sum,javaData.operation);
			this._drawTbody(javaData);
			jQuery("#view010-loading").hide();
		}
	},

	_writeTitle : function(title){
		jQuery("#view010-title").html(title);
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
		}
		s += "</colgroup></table>";
		jQuery(".view010-basic").append(s);
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
		jQuery("#view010-header > table").append(s);
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
			jQuery("#view010-footer > table > tfoot").remove();
			jQuery("#view010-footer > table").append(s);
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
//		var  editcolumn = new Hash(),
//		iterator = javaData.editablecolumn;
//		if(iterator == undefined || iterator.length == 0){
//			return;
//		}else{/*记录可编辑列信息*/
//			for ( var i = 0; i < iterator.length; i++) {
//				editcolumn[iterator[i]] = true;
//			}
//		}
		var s = "<tbody>",
		sumtr = new Hash();
		iterator2 = javaData.table;
		if(javaData.linecounts!=undefined){
			this.linecounts=javaData.linecounts;
		}
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
	//	this.editcolumn = editcolumn;
		if(this.pages > 1){
			length = lines;
			var select = jQuery("#view010-current select");
			select.append("<option value='1' selected='selected'>第 1 页</option>");
			for ( var i = 1; i < this.pages; i++) {
				select.append("<option value='"+(i+1)+"'>第 "+(i+1)+" 页</option>");
			}
			jQuery("#view010-toolbars").show();
		}
		jQuery("#view010-total").html("共 <span>"+this.pages+"</span> 页");
		s += this._drawTr(0,length) + "</tbody>";
		jQuery("#view010-table > table").append(s);
	},

	_switchPage : function(event){
		var select = jQuery("#view010-current select"),
		val = select.val();
		this.currentPage = val - 1;
		if(RegExp("^\\d+$").test(val)){
			val = parseInt(val);
			switch (val) {
			case 1:
				jQuery("#view010-prev").hide();
				jQuery("#view010-next").show();
				break;
			case this.pages:
				jQuery("#view010-prev").show();
				jQuery("#view010-next").hide();
				break;
			default:
				jQuery("#view010-prev").show();
				jQuery("#view010-next").show();
				break;
			}
			jQuery("#view010-table > table tbody tr").remove();
			var s = (val-1)*this.linecounts;
			jQuery("#view010-table > table tbody").append(this._drawTr(s, (val == this.pages ? this.javaData.table[0].length : s + this.linecounts)));
		}
	},

	_drawFirstTd : function(desc,index){
		var td = "onclick=view010.selectedTr(this)>";/* ">"end of "<tr '>'" */
		var dim_index=this.javaData.dim_index[0];
		if(dim_index == undefined)
			dim_index = 0;
//		if(this.showThumbnail){
		if(this.end){
			td = "><td align='center'><img alt='' width='60' height='75' src='"+(this.thumbnailPath+this.javaData.table[dim_index][index])+".jpg'>";
		}else{
			td = "><td align='center' onclick=view010c.drawCharts('"+this.javaData.table[dim_index][index]+"')><img alt='' width='60' height='75' src='"+(this.thumbnailPath+this.javaData.table[dim_index][index])+".jpg'>";
		}
//		}else{
//			if(this.end){
//				td = "><td onclick=view010c.writeFeedback(this,event)>"+desc;
//			}else{
//				td = "><td onclick=view010c.drawCharts('"+desc+"')>"+desc;
//			}
//		}
		return td+"</td>";
	},

	writeFeedback : function(DOM,event){
		event.stopPropagation();
		var td = jQuery(DOM),
		offset = td.offset();
		jQuery("#view010-tooltip span").html(td.html()).parent().css({
			top : offset.top+3,
			left : offset.left,
			width: td.width(),
			height: td.height()
		}).show();
	},

	_drawTr : function(start,end){
		var p,qty,amount,
		javaData = this.javaData,
		//editcolumn = this.editcolumn,
		iterator = javaData.table[0],
		iterator3 = (this.shouldsyn == true ? javaData.trno : false),
//		iterator2 = javaData.operation;
		iterator2 = "";
		if(iterator2 == undefined){
			iterator = iterator[iterator.length - 1];
			iterator2.qty = ++iterator;
			iterator2.p = ++iterator;
			iterator2.amount = ++iterator;
		}
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
		function _dealWithTD(v,ci,sum){
			var show = ((v == undefined || v == null || v == "") ? 0 : (v == -1 ? "" : view010c._format(v,ci))),
			actual = (show == "" ? 0 : v);

			switch (ci) {
//			case p:
//				return "<td class='sum price' title='"+actual+"'>"+show+"</td>";
//			case qty:
//				return "<td class='sum amount' title='"+actual+"'>"+show+"</td>";
//			case amount:
//				return "<td class='sum total' title='"+actual+"'>"+show+"</td>";
			default:
					var td = "<td ";
					if(v == -1){
						td += "class='desc'>";
					}else{
//						if(editcolumn[ci])
//							td += "class='data' title='"+actual+(sum?"'>":"' onclick=view010c.clickTD(this);>");
//						else
							td += "class='desc' onclick=view010c.writeFeedback(this,event)>";
					}
					if(isNaN(show)){
						var arr=show.split(",");
						if(arr.length>1){
							show=arr.join("<br>");
						}
					}
					td += show+"</td>";
					return td;
			}
		}
		var s= "";
		if(this.sumtrFordraw != false){
			var k = 1;
			for ( var i = start; i < end; i++) {
				if(sumtr[i]){
					s += "<tr id='tr0"+k+"' class='sum' title='"+(iterator3 == false ? "" : iterator3[i])+"' "+this._drawFirstTd(iterator[i],i);
					for ( var j = 1; j < iterator2.length; j++) {
						s += _dealWithTD(iterator2[j][i],j,true);
					}
					k++;
				}else{
					s += "<tr class='tr0"+k+"' title='"+(iterator3 == false ? "" : iterator3[i])+"' "+this._drawFirstTd(iterator[i],i);
					for ( var j = 1; j < iterator2.length; j++) {
						s += _dealWithTD(iterator2[j][i],j,false);
					}
				}
				s += "</tr>";
			}
		}else{
			for ( var i = start; i < end; i++) {
				s += "<tr title='"+(iterator3 == false ? "" : iterator3[i])+"' "+this._drawFirstTd(iterator[i],i);
				for ( var j = 1; j < iterator2.length; j++) {
					s += _dealWithTD(iterator2[j][i],j,false);
				}
				s += "</tr>";
			}
		}
		return s;
	},

	_initWindow : function(){
		jQuery(".tooltip").hide();
	},

	switchPage : function(type){
		this._initWindow();
		var select = jQuery("#view010-current select"),
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

	selectedTr : function(DOM){
		jQuery("#view010-table > table tr").removeClass("activedtr");
		jQuery(DOM).toggleClass("activedtr");
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
		jQuery("#view010-loading").show();
		this._init();
		this.drawCharts();
	}
};
View010Control.main = function(){
	view010c=new View010Control();
};
jQuery(document).ready(View010Control.main);
