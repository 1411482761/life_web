var view009c;
var View009Control = Class.create();
View009Control.prototype = {
	/**
	 * Description : to define parameter
	 * 
	 * @type private
	 * */
	initialize : function() {
		this.ajaxPrams = new Array();
		this.trans = {
				id: 1,
				command: "com.agilecontrol.fair.FairCmd",
				params:{
					cmd: "LoadRpt",
					sessionkey: rc.sessionkey,
					filterid : -1,
					view: "view009",
					viewchain: null
				}
			};
		this._init();
		this.modify = new Hash();
		this.myScroll;
		jQuery("<script language='javascript' src='/fair/ipad/js/reports/iscroll.js' charset='gbk'></script>").appendTo(jQuery("head"));
		jQuery("#views").append(jQuery(
				"<div id='view009' class='viewport'><div id='view009-banner'><div id='view009-buttons'><ul><li id='view009-homepage' class='view009-button' onclick='view009c.gotoHomePage();'><div class='view009-button-value'>"+
				VIEWS_LOCALE.view_003.homepage+"</div></li><li id='view009-refresh' class='view009-button' onclick='view009c.refresh();'><div class='view009-button-value'>"+VIEWS_LOCALE.view_003.refresh+"</div></li></ul></div>" +
				"<div id='view009-title'></div>" +
				"<div onclick='view009c.synchronize()' class='rightbutton' id='synchronize' style='display:none'>"+VIEWS_LOCALE.comment.saves+"</div>"+
				"</div><div id='view009-container'><div id='view009-header' class='view009-basic'><table></table></div><div id='view009-table' class='view009-basic'><table></table></div><div id='view009-toolbars'>" +
				"<div id='view009-prev' class='toolbar' ontouchstart='view009c.switchPage(0);'><div class='toolbarimg'></div><div class='toolbardesc'>"+VIEWS_LOCALE.main.previous_page+"</div>" +
				"</div><div id='view009-page'><div id='view009-current'><select onchange='view009c._switchPage();'></select></div><div id='view009-total'></div></div>" +
				"<div id='view009-next' class='toolbar' ontouchstart='view009c.switchPage(1);'><div class='toolbarimg'></div><div class='toolbardesc'>"+VIEWS_LOCALE.main.next_page+"</div>" +
				"</div></div><div id='view009-tooltip' class='tooltip' onclick='jQuery(this).hide();'><span></span></div>" +
				"</div><div id='view009-loading' class='mainpageajax'><div class='loadingimg'><div id='view009-loadinglocale' class='loadinglocale'>"+
				VIEWS_LOCALE.main.loading+"</div></div></div></div>"
			));
	},
	_init : function(){
		this.pages=-1;
		this.linecounts = 8;
		this.currentPage = 0;
		this.javaData = new Object();
		this.height=new Array();
		this._initWindow();
		jQuery("#view009-toolbars").hide();
		jQuery("#view009-prev").hide();
		jQuery("#view009-next").show();
		jQuery("#view009-current select option").remove();
		jQuery("#synchronize").html(VIEWS_LOCALE.comment.saves);
	},
	
	/**
	 * Description : to generate first rpt.
	 * 
	 * @type public
	 * */
	getActived : function(viewport,index){
		rc.actived = 9;
		rc.filterid=-1;
		rc.bfilterid=-1;
		this.ajaxPrams = [viewport];
		jQuery("#singlestore").attr("onchange","view009c.refresh()");
		rc.initFilter(viewport);
		rc.drawSelect(rc.rptviews[index]);
		jQuery("#views").show();
		jQuery("#view009").show();
		this._initWindow();
		this.drawCharts();
		
	},
	drawCharts : function(){
		var viewchain = this.ajaxPrams;
		this.trans.params.viewchain = viewchain;
		jQuery("#view009-loading").show();
		this.trans.params.bfilterid = rc.bfilterid;
		this.trans.params.filterid = rc.filterid;
		portalClient.sendOneRequest(this.trans, function(response){
			var javaData= response.data[0].result.data;
			jQuery("#view009-loading").hide();
			view009c.drawTable(javaData);
		});	
	},
	getHeight : function(){
		var index=this.javaData.feedback,table=this.javaData.table;
		for(var i=0;i<table.length;i++){
			var length=table[i][index].length;
			if(length<3)length=3;
			this.height.push(length*25);
		}
	},
	_drawColgroup : function(colgroup){
		if(colgroup == undefined || colgroup.length == 0){
			alert("colgroup属性不正确。应该是int的数组，length=列数。");
			return;
		}
		var s = "<colgroup>";
		for ( var i = 0; i < colgroup.length; i++) {
			if(colgroup[i]==undefined){
				s += "<col>";
			}else{
			s += "<col width='"+colgroup[i]+"'>";}
		}
		s += "</colgroup>";
		jQuery(".view009-basic table").append(s);
	},
	drawHeader : function(javaData){
		jQuery("#view009-header table").html("");
		this._drawColgroup(javaData.colgroup);
		var htmls="<thead><tr>";
		var header=javaData.header;
		for(var i=0;i<header.length;i++){
			
				htmls+="<td>"+header[i]+"</td>";
			
		}
		htmls+="</tr></thead><tbody></tbody>";
		jQuery(htmls).appendTo("#view009-header table");
	},
	drawTable : function(javaData){
		var data=javaData.table;
		view009c.addScroll();
		jQuery("#view009-table table").html("");
		view009c.drawHeader(javaData);
		jQuery("#view009-title").html(javaData.title);
		var length=data.length,lines = this.linecounts;
		this.pages = (length%lines == 0 ? length/lines : parseInt(length/lines)+1);
		this.javaData = javaData;
		this.getHeight();
		if(this.pages > 1){
			length = lines;
			var select = jQuery("#view009-current select");
			jQuery("#view009-current select option").remove();
			select.append("<option value='1' selected='selected'>"+VIEWS_LOCALE.main.pagestart+" 1"+VIEWS_LOCALE.main.pageend+"</option>");
			for ( var i = 1; i < this.pages; i++) {
				select.append("<option value='"+(i+1)+"'>"+VIEWS_LOCALE.main.pagestart+(i+1)+" "+VIEWS_LOCALE.main.pageend+"</option>");
			}
			jQuery("#view009-toolbars").show();
			jQuery("#view009-prev").hide();
			jQuery("#view009-next").show();
		}
		jQuery("#view009-total").html(VIEWS_LOCALE.main.pagetotal+" <span>"+this.pages+"</span> "+VIEWS_LOCALE.main.pagetotalend);
		jQuery("#view009-table table").append(this._drawTr(0,length));
	},
	_drawTr : function(start,end){
		this.clearScroll();
		var data=this.javaData.table,trno=this.javaData.trno;
		var htmls="<tbody>",desc=this.javaData.desc,feedback=this.javaData.feedback,reply=this.javaData.reply,canreplay=this.javaData.canreply;
		for(var i=start;i<end;i++){
			var tr = data[i];
			if(i%2==0)
				htmls+="<tr class='even' id='"+trno[i]+"'><td><img src='/pdt/s/"+tr[0]+"'></td>";
			else
				htmls+="<tr class='odd' id='"+trno[i]+"'><td><img src='/pdt/s/"+tr[0]+"'></td>";
			for(var t=1;t<tr.length;t++){
				if(t==desc){
					var imgdesc=tr[t];
					htmls+="<td onclick=view009c.writeFeedback(this,event) class='execlick'><ul>";
					for(var j=0;j<imgdesc.length;j++){
						htmls+="<li>"+imgdesc[j]+"</li><br/>";
					}
					htmls+="</ul></td>";
				}else if(t==feedback){
					htmls+="<td id='feedback'><ul>";
					var opinions=tr[t];
					for(var m=0;m<opinions.length;m++){
						if(m>2&&m%3!=2){
							htmls+="<li class='feedbackmsg execlick' onclick=view009c.writeFeedback(this,event)><p class='feedbackcontent'>"+opinions[m][0]+"&nbsp;"+opinions[m][1]+"</p><p class='feedbackcontent opcontent'>"+opinions[m][2]+"</p></li>";
						}else{
							if(m%3==2&&m<3){
								htmls+="<li class='feedbackmsg specialright specialtop execlick' onclick=view009c.writeFeedback(this,event)><p class='feedbackcontent'>"+opinions[m][0]+"&nbsp;"+opinions[m][1]+"</p><p class='feedbackcontent opcontent'>"+opinions[m][2]+"</p></li>";
							}else if(m<3&&m%3!=2){
								htmls+="<li class='feedbackmsg specialtop execlick' onclick=view009c.writeFeedback(this,event)><p class='feedbackcontent'>"+opinions[m][0]+"&nbsp;"+opinions[m][1]+"</p><p class='feedbackcontent opcontent'>"+opinions[m][2]+"</p></li>";
							}else{
								htmls+="<li class='feedbackmsg specialright execlick' onclick=view009c.writeFeedback(this,event)><p class='feedbackcontent'>"+opinions[m][0]+"&nbsp;"+opinions[m][1]+"</p><p class='feedbackcontent opcontent'>"+opinions[m][2]+"</p></li>";
							} 
							
						}
					}
					var length=opinions.length;
					if(length<4){
						if(length%3==1){
							htmls+="<li class='feedbackmsg specialli particularli'></li><li class='feedbackmsg specialli specialright particularli'></li>";
						}else if(length%3==2){
							htmls+="<li class='feedbackmsg specialli specialright particularli'></li>";
						}
					}else{
						if(length%3==1){
							htmls+="<li class='feedbackmsg specialli'></li><li class='feedbackmsg specialli specialright'></li>";
						}else if(length%3==2){
							htmls+="<li class='feedbackmsg specialli specialright'></li>";
						}
					}
					htmls+="</ul></td>";
				}else if(t==reply){
					if(canreplay=="Y"){
						htmls+="<td class='reply'><div class='replycontent' onclick=view009c.hfclick(this) style='height:"+this.height[i]+"px'>"+tr[t]+"</div></td>";
						jQuery("#kpi-filter").show();
						jQuery("#synchronize").show();
					}else{
						htmls+="<td class='reply'><div class='replycontent' style='height:"+this.height[i]+"px'>"+tr[t]+"</div></td>";
						jQuery("#synchronize").hide();
					}
				}else{
					htmls+="<td onclick=view009c.writeFeedback(this,event) class='execlick' style='text-align:right'>"+tr[t]+"</td>";
				}
			}
			htmls+="</tr>";
		}htmls+="</tbody>";
		return htmls;
	},
	hfclick : function(dom){
		var tr=jQuery(dom).parent().parent(),tds=tr.find("#feedback li");
		var height=tds.length*25;
		jQuery("#view009-tooltip").hide();
		jQuery(".execlick").removeAttr("onclick");
		if(jQuery("#view009-table div textarea").length == 0){
			var div = jQuery(dom),
			val = div.html(),
			textarea = jQuery("<textarea class='textareastyle'>"+val+"</textarea>");//pattern='[0-9]*',virtual keyborder.
			div.html(textarea);
			var top=height*0.08;
			textarea.css("margin-top",top+"px");
			jQuery(".textareastyle").focus().select().bind("blur",this._bindchangetext).bind('keydown', function(event){
				if (event.keyCode=="13") {/*回车*/
					view009c._controltd(jQuery(this),event);
				}
			}).bind("click",function(event){
				return;
			}).bind('dblclick', function(event){
				return;
			});
		}
	},
	_initWindow : function(){
		jQuery(".tooltip").hide();
	},
	switchPage : function(type){
		this._initWindow();
		var select = jQuery("#view009-current select"),
		val = parseInt(select.val());
		this.currentPage = val - 1;
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
	addScroll : function(){
		setTimeout(function () {view009c.myScroll = new iScroll('view009-table');}, 100);
	},
	clearScroll : function(){
		//document.addEventListener('load',setTimeout(function () {this.myScroll.refresh();}, 100), false);
		setTimeout(function () {view009c.myScroll.refresh();});
	},
	_switchPage : function(event){
		var select = jQuery("#view009-current select"),
		val = select.val();
		this.currentPage = val - 1;
		if(RegExp("^\\d+$").test(val)){
			val = parseInt(val);
			switch (val) {
			case 1:
				jQuery("#view009-prev").hide();
				jQuery("#view009-next").show();
				break;
			case this.pages:
				jQuery("#view009-prev").show();
				jQuery("#view009-next").hide();
				break;
			default:
				jQuery("#view009-prev").show();
				jQuery("#view009-next").show();
				break;
			}
			jQuery("#view009-table > table tbody").remove();
			var s = (val-1)*this.linecounts;
			jQuery("#view009-table > table").append(this._drawTr(s, (val == this.pages ? this.javaData.table.length : s + this.linecounts)));
		}
	},
	synchronize : function(){
		var temp,
		tojava = new Array(),
		iterator2 = this.modify,
		iterator = iterator2.keys();
		for ( var i = 0; i < iterator.length; i++) {
			temp = new Array();
			temp.push(iterator[i]);
			temp.push(iterator2[iterator[i]]);
			tojava.push(temp);
		}
		this.modify = new Hash();
		if(tojava.length != 0){
			var params={cmd: "SaveFairNotes",sessionkey: this.sessionkey,data: tojava};
			var trans={command:"com.agilecontrol.fair.FairCmd",params:params};
			portalClient.sendOneRequest(trans, function(response){
				alert(response.data[0].message);
				if(response.data[0].code == 0){
					window.location.replace("http://needreload.fair.app");
				}else{
					window.location.reload();
				}
			});
		}
	},
	writeFeedback : function(DOM,event){
		event.stopPropagation();
		var td = jQuery(DOM),
		offset = td.offset();
		jQuery("#view009-tooltip span").html(td.html()).parent().css({
			top : offset.top+3,
			left : offset.left,
			width: td.width(),
			height: td.height()
		}).show();
		event.stopPropagation();
	},
	_controltd : function(textarea,event){
		var div = textarea.parent(),val = textarea.val(),tr=div.parent().parent(),id=tr.attr("id");
		div.html(val);
		if(val!=""&&textarea.html()!=val){
			this.modify[id]=val;
			var lineidx = this.currentPage*this.linecounts+jQuery("#view009-table > table tbody tr").index(tr);
			this.javaData.table[lineidx][tr.children().index(div.parent())] = val;
		}
		jQuery(".execlick").attr("onclick","view009c.writeFeedback(this,event)");
	},
	_bindchangetext : function(event){
		view009c._controltd(jQuery(this),event);
	},
	cFilter : function(){
		window.location.replace("http://search.fair.app");
	},
	setFilter : function(DOM,relative){
		var input = jQuery(DOM).prev();
		input.attr("checked",input.attr("checked") == "checked"?false:"checked");
		this.refresh();
	},
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
		jQuery("#view009-loading").show();
		this._init();
		this.drawCharts();
	}
};
View009Control.main = function(){
	view009c=new View009Control();
};
jQuery(document).ready(View009Control.main);